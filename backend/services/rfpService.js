// Service for RFP/RFI text generation using AI and RAG
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const searchService = require('./searchService');
const promptBuilder = require('../utils/promptBuilder');
const gemini = require('./llmGeminiService');
const groq = require('./llmGroqService');

class RFPService {
  constructor() {
    this.pythonScriptPath = path.join(__dirname, '../../../RFP_generation_langchain_agent_RAG');
  }

  // Main RFP generation function
  async generateRFPText(userInput) {
    try {
      console.log('🚀 Starting RFP generation with user input:', userInput);
      
      // Step 1: Find relevant documents using RAG
      const relevantDocs = await this.findRelevantDocuments(userInput);
      
      // Step 2: Build enhanced prompt with RAG context
      const enhancedPrompt = await this.buildEnhancedPrompt(userInput, relevantDocs);
      
      // Step 3: Generate RFP using LLM with RAG context
      const generatedRFP = await this.generateWithLLM(enhancedPrompt);
      
      // Step 4: Post-process and format the output
      const formattedRFP = await this.formatRFPOutput(generatedRFP, userInput);
      
      console.log('✅ RFP generation completed successfully');
      
      return {
        rfpText: formattedRFP,
        relevantDocuments: relevantDocs.map(doc => ({
          title: doc.title,
          fileName: doc.fileName,
          relevanceScore: doc.relevanceScore
        })),
        metadata: {
          industry: userInput.industry,
          projectType: userInput.projectType,
          generatedAt: new Date().toISOString(),
          wordCount: formattedRFP.split(' ').length
        }
      };
    } catch (error) {
      console.error('❌ RFP generation failed:', error);
      throw new Error(`RFP generation failed: ${error.message}`);
    }
  }

  // Find relevant documents using vector search
  async findRelevantDocuments(userInput) {
    try {
      // Create search query from user input
      const searchTerms = [];
      
      if (userInput.projectDescription) {
        searchTerms.push(userInput.projectDescription);
      }
      
      if (userInput.industry) {
        searchTerms.push(userInput.industry);
      }
      
      if (userInput.projectType) {
        searchTerms.push(userInput.projectType);
      }
      
      if (userInput.disciplines && userInput.disciplines.length > 0) {
        searchTerms.push(...userInput.disciplines);
      }
      
      const searchQuery = searchTerms.join(' ');
      
      // Search for relevant documents
      const filters = {};
      if (userInput.industry) {
        filters.industry = userInput.industry;
      }
      
      const relevantDocs = await searchService.search(searchQuery, filters, 5);
      
      console.log(`📚 Found ${relevantDocs.length} relevant documents for RAG context`);
      return relevantDocs;
    } catch (error) {
      console.error('❌ Error finding relevant documents:', error);
      return []; // Return empty array if search fails
    }
  }

  // Build enhanced prompt with RAG context
  async buildEnhancedPrompt(userInput, relevantDocs) {
    try {
      // Base prompt from existing prompt builder
      const basePrompt = promptBuilder.buildRfpPrompt(userInput);
      
      // Add RAG context
      let ragContext = '';
      if (relevantDocs.length > 0) {
        ragContext = '\n\n--- REFERENCE DOCUMENTS FOR CONTEXT ---\n';
        relevantDocs.forEach((doc, index) => {
          ragContext += `\nDocument ${index + 1}: ${doc.title}\n`;
          ragContext += `Industry: ${doc.industry} | Project Type: ${doc.projectType}\n`;
          ragContext += `Content Preview: ${doc.snippet}\n`;
          ragContext += `---\n`;
        });
        ragContext += '\nPlease use these reference documents to inform your RFP generation, incorporating relevant patterns, structures, and requirements while adapting them to the specific project needs.\n';
      }
      
      const enhancedPrompt = basePrompt + ragContext;
      
      return enhancedPrompt;
    } catch (error) {
      console.error('❌ Error building enhanced prompt:', error);
      return promptBuilder.buildRfpPrompt(userInput); // Fallback to base prompt
    }
  }

  // Generate RFP using LLM (Gemini or Groq)
  async generateWithLLM(prompt) {
    try {
      // Use Gemini by default, can switch to Groq if needed
      const provider = process.env.LLM_PROVIDER || 'gemini';
      
      let rfpText;
      if (provider === 'groq') {
        rfpText = await groq.generateText(prompt);
      } else {
        rfpText = await gemini.generateText(prompt);
      }
      
      return rfpText;
    } catch (error) {
      console.error('❌ LLM generation error:', error);
      throw error;
    }
  }

  // Format and structure the RFP output
  async formatRFPOutput(rawRFP, userInput) {
    try {
      // Add standard RFP sections if missing
      let formattedRFP = rawRFP;
      
      // Ensure proper RFP structure
      if (!formattedRFP.includes('PROJECT OVERVIEW')) {
        const projectOverview = `\n\nPROJECT OVERVIEW\n================\n`;
        const overview = `Industry: ${userInput.industry || 'Not specified'}\n`;
        const projType = `Project Type: ${userInput.projectType || 'Not specified'}\n`;
        const location = `Location: ${userInput.location || 'To be determined'}\n`;
        const budget = `Budget Range: ${userInput.budget || 'To be determined'}\n`;
        
        formattedRFP = projectOverview + overview + projType + location + budget + '\n' + formattedRFP;
      }
      
      // Add footer with generation info
      const footer = `\n\n---\nGenerated by GovRFP360AI on ${new Date().toLocaleDateString()}\nDocument ID: RFP-${Date.now()}\n`;
      formattedRFP += footer;
      
      return formattedRFP;
    } catch (error) {
      console.error('❌ Error formatting RFP output:', error);
      return rawRFP; // Return raw output if formatting fails
    }
  }

  // Generate RFP using Python script (alternative method)
  async generateRFPWithPython(userInput) {
    return new Promise((resolve, reject) => {
      try {
        const pythonProcess = spawn('python', [
          path.join(this.pythonScriptPath, 'app2.py'),
          JSON.stringify(userInput)
        ], {
          cwd: this.pythonScriptPath
        });

        let output = '';
        let error = '';

        pythonProcess.stdout.on('data', (data) => {
          output += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
          error += data.toString();
        });

        pythonProcess.on('close', (code) => {
          if (code === 0) {
            try {
              const result = JSON.parse(output);
              resolve(result);
            } catch (parseError) {
              resolve({ rfpText: output });
            }
          } else {
            reject(new Error(`Python script failed with code ${code}: ${error}`));
          }
        });

        pythonProcess.on('error', (err) => {
          reject(new Error(`Failed to start Python process: ${err.message}`));
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // Generate RFP based on existing document template
  async generateFromTemplate(templateDocumentId, userInput) {
    try {
      // Get the template document
      const templateDoc = await searchService.getDocumentById(templateDocumentId);
      
      if (!templateDoc) {
        throw new Error('Template document not found');
      }
      
      // Use template content to guide generation
      const templatePrompt = `
        Use the following document as a template structure for generating a new RFP:
        
        TEMPLATE DOCUMENT:
        Title: ${templateDoc.title}
        Industry: ${templateDoc.industry}
        Project Type: ${templateDoc.projectType}
        Content: ${templateDoc.content.substring(0, 2000)}...
        
        USER REQUIREMENTS:
        ${JSON.stringify(userInput, null, 2)}
        
        Please generate a new RFP following the structure and style of the template but adapted for the user's specific requirements.
      `;
      
      const generatedRFP = await this.generateWithLLM(templatePrompt);
      
      return {
        rfpText: generatedRFP,
        templateUsed: {
          title: templateDoc.title,
          fileName: templateDoc.fileName
        },
        metadata: {
          generatedAt: new Date().toISOString(),
          basedOnTemplate: true
        }
      };
    } catch (error) {
      console.error('❌ Template-based generation failed:', error);
      throw error;
    }
  }

  // Get RFP generation suggestions based on user input
  async getRFPSuggestions(userInput) {
    try {
      const suggestions = {
        industries: [],
        projectTypes: [],
        disciplines: [],
        regulations: []
      };
      
      // Get suggestions based on similar documents
      if (userInput.industry) {
        const industryDocs = await searchService.searchByIndustry(userInput.industry, 10);
        
        // Extract unique project types
        const projectTypes = [...new Set(industryDocs.map(doc => doc.projectType).filter(Boolean))];
        suggestions.projectTypes = projectTypes;
        
        // Extract unique disciplines
        const disciplines = [...new Set(industryDocs.flatMap(doc => doc.disciplines || []))];
        suggestions.disciplines = disciplines;
        
        // Extract unique regulations
        const regulations = [...new Set(industryDocs.flatMap(doc => doc.regulations || []))];
        suggestions.regulations = regulations;
      }
      
      // Get industry suggestions from collection stats
      const stats = await searchService.getCollectionStats();
      suggestions.industries = stats.industries.map(industry => industry.name);
      
      return suggestions;
    } catch (error) {
      console.error('❌ Error getting RFP suggestions:', error);
      return {
        industries: [],
        projectTypes: [],
        disciplines: [],
        regulations: []
      };
    }
  }
}

module.exports = new RFPService();
