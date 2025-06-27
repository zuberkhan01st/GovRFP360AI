// Service for Google Gemini LLM integration
const { GoogleGenerativeAI } = require('@google/generative-ai');
const promptBuilder = require('../utils/promptBuilder');
require('dotenv').config();

class GeminiService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('⚠️  GEMINI_API_KEY not found in environment variables');
      this.genAI = null;
    } else {
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }
    
    this.generationConfig = {
      temperature: 0.3,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 8192,
    };
  }

  async generateText(prompt) {
    try {
      if (!this.genAI) {
        throw new Error('Gemini API not configured. Please set GEMINI_API_KEY in your .env file');
      }

      console.log('🤖 Generating text with Gemini...');
      console.log('📝 Prompt length:', prompt.length, 'characters');
      
      // Use Gemini 1.5 Flash for faster responses
      const model = this.genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: this.generationConfig
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('✅ Gemini generation completed');
      console.log('📊 Response length:', text.length, 'characters');
      return text;
    } catch (error) {
      console.error('❌ Gemini API error:', error);
      
      // Provide a fallback response using prompt builder
      if (error.message.includes('API_KEY_INVALID') || error.message.includes('not configured')) {
        return this.generateFallbackResponse(prompt);
      }
      
      throw new Error(`Gemini generation failed: ${error.message}`);
    }
  }

  // Generate RFP using proper prompt builder
  async generateRFP(userInput) {
    try {
      console.log('🚀 Generating RFP with user input:', userInput);
      
      // Use the prompt builder to create a comprehensive prompt
      const structuredPrompt = promptBuilder.buildRfpPrompt(userInput);
      
      console.log('📝 STRUCTURED PROMPT CREATED:');
      console.log('=====================================');
      console.log(structuredPrompt.substring(0, 500) + '...');
      console.log('=====================================');
      
      // Send the structured prompt to Gemini
      const rfpContent = await this.generateText(structuredPrompt);
      
      return {
        success: true,
        rfpText: rfpContent,
        metadata: {
          projectName: userInput.projectName,
          industry: userInput.industry,
          projectType: userInput.projectType,
          generatedAt: new Date().toISOString(),
          aiProvider: 'gemini',
          promptLength: structuredPrompt.length,
          responseLength: rfpContent.length
        }
      };
    } catch (error) {
      console.error('❌ RFP generation error:', error);
      
      // Return fallback response
      return {
        success: true,
        rfpText: this.generateFallbackResponse(JSON.stringify(userInput)),
        metadata: {
          projectName: userInput.projectName,
          industry: userInput.industry,
          projectType: userInput.projectType,
          generatedAt: new Date().toISOString(),
          aiProvider: 'gemini-fallback',
          error: error.message
        }
      };
    }
  }

  async generateTextWithSystemPrompt(systemPrompt, userPrompt) {
    try {
      const combinedPrompt = `System: ${systemPrompt}\n\nUser: ${userPrompt}`;
      return await this.generateText(combinedPrompt);
    } catch (error) {
      console.error('❌ Gemini system prompt generation error:', error);
      throw error;
    }
  }

  generateFallbackResponse(prompt) {
    console.log('🔄 Using fallback response for Gemini');
    
    // Extract key information from prompt to create a basic RFP structure
    const isRFI = prompt.toLowerCase().includes('rfi') || prompt.toLowerCase().includes('request for information');
    const documentType = isRFI ? 'Request for Information (RFI)' : 'Request for Proposal (RFP)';
    
    return `# ${documentType}

## PROJECT OVERVIEW
This document serves as a ${documentType} for the proposed project as outlined in the requirements.

## EXECUTIVE SUMMARY
We are seeking qualified vendors to provide comprehensive solutions for our project requirements. This ${documentType} outlines the scope of work, technical specifications, and evaluation criteria.

## SCOPE OF WORK
### Technical Requirements
- Detailed technical specifications as per industry standards
- Compliance with all applicable regulations and safety standards
- Quality assurance and testing protocols
- Documentation and reporting requirements

### Deliverables
- Complete technical solution design
- Implementation timeline and milestones
- Project management and coordination
- Training and support services

## QUALIFICATION REQUIREMENTS
- Demonstrated experience in similar projects
- Technical expertise and certifications
- Financial stability and bonding capacity
- Safety record and compliance history

## EVALUATION CRITERIA
- Technical approach and methodology (40%)
- Experience and qualifications (25%)
- Cost and value proposition (25%)
- Timeline and project management (10%)

## SUBMISSION REQUIREMENTS
- Technical proposal with detailed approach
- Cost proposal with breakdown
- Company qualifications and references
- Project timeline and milestones

## CONTACT INFORMATION
For questions regarding this ${documentType}, please contact the procurement department.

---
*This is a template response. Please configure your GEMINI_API_KEY for enhanced AI-powered RFP generation.*`;
  }

  // Test the connection to Gemini API
  async testConnection() {
    try {
      const testResponse = await this.generateText('Test connection');
      console.log('✅ Gemini API connection successful');
      return true;
    } catch (error) {
      console.error('❌ Gemini API connection failed:', error.message);
      return false;
    }
  }
}

module.exports = new GeminiService();
