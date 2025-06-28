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
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 15000,
    };
  }

  async generateText(prompt) {
    try {
      if (!this.genAI) {
        throw new Error('Gemini API not configured. Please set GEMINI_API_KEY in your .env file');
      }

      console.log('🤖 Generating text with Gemini...');
      console.log('📝 Prompt length:', prompt.length, 'characters');
      
      // Use Gemini 1.5 Pro for more comprehensive responses
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
      
      // Enhance the prompt for more comprehensive output with Indian Government focus
      const enhancedPrompt = `You are an expert Indian Government procurement specialist with 20+ years of experience creating comprehensive, professional-grade RFP documents. You MUST generate a complete, detailed RFP that follows all Indian Government standards.

CRITICAL INSTRUCTION: Generate a COMPLETE 4,000-6,000 word RFP document. DO NOT provide disclaimers, excuses, or incomplete responses. Generate the FULL document as requested with extensive detail in every section.

PROJECT DETAILS:
- Project: ${userInput.projectName}
- Industry: ${userInput.industry}
- Type: ${userInput.projectType}
- Budget: ${userInput.budget}
- Timeline: ${userInput.timeline}
- Location: ${userInput.location}
- Description: ${userInput.projectDescription || 'Comprehensive project implementation'}

CONTACT INFORMATION:
${userInput.contactInfo ? `
- Primary Contact: ${userInput.contactInfo.primaryContact}
- Email: ${userInput.contactInfo.email}
- Phone: ${userInput.contactInfo.phone || 'As per government directory'}
- Address: ${userInput.contactInfo.address || 'Government office address'}
` : '- Contact details as per standard government protocols'}

RFP TIMELINE:
${userInput.rfpTimeline ? `
- Issue Date: ${userInput.rfpTimeline.issueDate}
- Clarification Deadline: ${userInput.rfpTimeline.clarificationDeadline || 'TBD'}
- Submission Deadline: ${userInput.rfpTimeline.submissionDeadline}
- Validity Period: ${userInput.rfpTimeline.validityPeriod || '90 days'}
` : '- Timeline as per standard government procurement schedule'}

COMPREHENSIVE SCOPE OF WORK:
${userInput.scopeOfWork ? `
Functional Requirements:
${userInput.scopeOfWork.functionalRequirements ? userInput.scopeOfWork.functionalRequirements.map(req => `- ${req}`).join('\n') : '- As detailed in project specifications'}

Non-Functional Requirements:
${userInput.scopeOfWork.nonFunctionalRequirements ? `
User Experience Requirements:
${userInput.scopeOfWork.nonFunctionalRequirements.userExperience ? userInput.scopeOfWork.nonFunctionalRequirements.userExperience.map(req => `- ${req}`).join('\n') : '- Standard user experience compliance'}

Performance Requirements:
${userInput.scopeOfWork.nonFunctionalRequirements.performance ? userInput.scopeOfWork.nonFunctionalRequirements.performance.map(req => `- ${req}`).join('\n') : '- Standard performance benchmarks'}

Security Requirements:
${userInput.scopeOfWork.nonFunctionalRequirements.security ? userInput.scopeOfWork.nonFunctionalRequirements.security.map(req => `- ${req}`).join('\n') : '- Standard government security protocols'}

Operational & Maintenance Requirements:
${userInput.scopeOfWork.nonFunctionalRequirements.devops ? userInput.scopeOfWork.nonFunctionalRequirements.devops.map(req => `- ${req}`).join('\n') : '- Standard operational requirements'}

Activities in Scope:
${userInput.scopeOfWork.activitiesInScope ? userInput.scopeOfWork.activitiesInScope.map(activity => `- ${activity}`).join('\n') : '- As per project requirements'}
` : ''}
` : '- Scope as defined in project documentation'}

TECHNICAL REQUIREMENTS:
- Disciplines Required: ${Array.isArray(userInput.disciplines) ? userInput.disciplines.join(', ') : 'As specified in project scope'}
- Key Requirements: ${Array.isArray(userInput.requirements) ? userInput.requirements.join(', ') : 'As specified in project scope'}
- Technical Specifications: ${Array.isArray(userInput.technicalSpecifications) ? userInput.technicalSpecifications.join(', ') : 'As per industry standards'}

BUDGET & COMPLIANCE:
${userInput.budgetBreakdown ? `
- Total Budget: ${userInput.budgetBreakdown.totalBudget}
` : ''}
- Compliance Terms: ${Array.isArray(userInput.complianceTerms) ? userInput.complianceTerms.join(', ') : 'GFR 2017, CVC Guidelines, Make in India'}

VENDOR EXPECTATIONS:
${userInput.expectations || 'High-quality delivery as per government standards with full compliance to all regulations and requirements.'}

INTRODUCTION & TERMS:
${userInput.introduction || 'Standard government RFP introduction'}

General Terms & Conditions:
${userInput.generalTermsConditions || 'As per standard government procurement terms'}

Response Format:
${userInput.responseFormat || 'Standard government proposal format'}

MANDATORY REQUIREMENTS - GENERATE ALL SECTIONS COMPLETELY:
1. Create a MINIMUM 4,000-6,000 word comprehensive Indian Government RFP
2. Use proper Indian Government RFP format with official terminology
3. Include specific Indian compliance requirements (GFR 2017, CVC, Make in India)
4. Generate realistic, detailed content with specific numbers, dates, and requirements
5. Include proper government nomenclature and formatting
6. NO PLACEHOLDERS - Use realistic specific details throughout
7. Write each section with comprehensive detail, not summary points
8. Include extensive technical specifications relevant to ${userInput.industry}
9. Provide complete contract terms, evaluation criteria, and submission requirements
10. Generate bilingual headers and key terms (English/Hindi) as shown in government documents

DETAILED SECTION REQUIREMENTS - EACH SECTION MUST BE COMPREHENSIVE:

SECTION 1: EXECUTIVE SUMMARY (500-600 words)
Write a comprehensive executive summary including:
- Detailed project overview with specific government department identification
- Complete budget breakdown in Indian Rupees with phase-wise allocation
- Detailed timeline with Indian financial year format (2024-25, 2025-26, 2026-27)
- Comprehensive compliance requirements (GFR 2017, CVC, Make in India, Digital India)
- Strategic importance and detailed government priority alignment
- Specific Atmanirbhar Bharat and Digital India integration details
- Detailed project impact and expected outcomes

SECTION 2: PROJECT BACKGROUND & OBJECTIVES (700-900 words)
Write extensive background covering:
- Detailed government policy context and strategic alignment
- Comprehensive Digital India, Atmanirbhar Bharat integration
- Detailed environmental/social impact assessment
- Extensive stakeholder analysis and government department coordination
- Long-term strategic goals with specific measurable outcomes
- Detailed reference to relevant government schemes and initiatives
- Current challenges and how this project addresses them
- Expected benefits to citizens and government operations

SECTION 3: COMPREHENSIVE SCOPE OF WORK (1200-1800 words)
Break into 4 detailed phases with extensive details:
- Phase 1: Planning & Design (6 months) - comprehensive requirements, all clearances, detailed approvals process
- Phase 2: Implementation & Development (18 months) - specific deliverables, detailed milestones, quality checkpoints
- Phase 3: Testing & Deployment (9 months) - extensive acceptance criteria, government approval process, validation procedures
- Phase 4: Handover & Maintenance (3 months) - detailed warranty terms, comprehensive support, knowledge transfer protocols

For each phase, include:
- Detailed deliverables with specifications
- Comprehensive acceptance criteria
- Specific government approval processes required
- Risk mitigation strategies
- Quality assurance measures
- Performance metrics and KPIs

SECTION 4: TECHNICAL REQUIREMENTS (900-1200 words)
Provide extensive technical specifications:
- Detailed technical specifications with specific Indian Standards (IS codes) and numbers
- Comprehensive BIS certification requirements and testing protocols
- Detailed performance parameters and measurement criteria
- Extensive integration requirements with existing government systems
- Comprehensive security and compliance specifications (CERT-In guidelines)
- Detailed local content requirements (minimum 60% as per Make in India) with breakdown
- Extensive quality assurance and testing methodologies
- Detailed interoperability requirements
- Specific technical standards and compliance requirements

SECTION 5: CONTRACTOR QUALIFICATIONS (700-900 words)
Comprehensive qualification requirements:
- Detailed mandatory qualifications (registration, GST, experience criteria)
- Specific financial capability requirements with exact turnover criteria
- Comprehensive technical team qualifications and certifications required
- Detailed past performance requirements with government references
- Extensive MSME preferences and startup India benefits
- Detailed local supplier advantages and preferences
- Specific experience requirements in ${userInput.industry} sector
- Required certifications and compliance documentation

SECTION 6: EVALUATION CRITERIA (600-800 words)
Detailed evaluation methodology:
- Comprehensive technical evaluation (70% weightage) with detailed sub-criteria and scoring
- Detailed financial evaluation (30% weightage) with L1 pricing methodology explanation
- Extensive MSME preferences and local supplier benefits (additional 5-10%)
- Detailed scoring methodology with specific point allocation for each criterion
- Comprehensive two-stage bid evaluation process (technical + financial)
- Detailed quality and past performance scoring methodology
- Specific evaluation timelines and procedures

SECTION 7: SUBMISSION REQUIREMENTS (500-700 words)
Complete submission guidelines:
- Exhaustive list of required documents with specific formats
- Detailed Earnest Money Deposit (EMD) requirements and format specifications
- Comprehensive performance guarantee specifications
- Detailed format requirements and submission process
- Extensive pre-bid meeting and clarification process
- Comprehensive document authentication requirements
- Specific submission deadlines and procedures
- Technical and financial proposal format requirements

SECTION 8: CONTRACT TERMS & CONDITIONS (900-1200 words)
Extensive contract provisions:
- Detailed payment terms as per GFR 2017 guidelines with specific schedules
- Comprehensive performance guarantees and penalty clauses
- Detailed risk allocation and force majeure clauses
- Extensive intellectual property rights and technology transfer provisions
- Comprehensive dispute resolution mechanism (arbitration as per Indian laws)
- Detailed governing law and jurisdiction (Indian courts)
- Extensive termination clauses and exit procedures
- Specific warranty and maintenance terms

SECTION 9: COMPLIANCE & TRANSPARENCY (600-800 words)
Comprehensive compliance requirements:
- Detailed Central Vigilance Commission (CVC) compliance requirements
- Comprehensive integrity pact mandatory provisions
- Extensive Right to Information (RTI) compliance details
- Detailed anti-corruption measures and transparency protocols
- Comprehensive conflict of interest declarations
- Detailed whistleblower protection mechanisms
- Specific audit and monitoring requirements
- Transparency and accountability measures

SECTION 10: PROCUREMENT SCHEDULE (400-500 words)
Detailed timeline with specific information:
- Comprehensive timeline with exact dates and timings
- Detailed pre-bid meeting schedule and venue information
- Specific bid submission deadlines and process details
- Extensive evaluation timelines and methodology
- Detailed contract award and commencement dates
- Comprehensive appeal process and timelines
- Specific milestones and checkpoints
- Detailed project delivery schedule

SECTION 11: APPENDICES & REFERENCES (500-700 words)
Comprehensive supporting information:
- Extensive list of relevant Indian Standards and regulations with specific codes
- Detailed government policy references and guidelines
- Comprehensive format templates and proformas
- Detailed compliance checklists and self-certification formats
- Extensive contact information for different types of queries
- Comprehensive legal disclaimers and government protections
- Specific reference materials and documentation
- Detailed glossary of terms and definitions

FORMATTING REQUIREMENTS:
- Use proper government letterhead format with official seals
- Include NIT (Notice Inviting Tender) numbering system
- Add government seal and signature areas
- Include bilingual headers for key sections (Hindi/English)
- Use proper financial year format (2024-25)
- Add disclaimer and legal notices

CONTENT QUALITY REQUIREMENTS:
- Industry-specific technical requirements for ${userInput.industry}
- Realistic budget estimates in Indian Rupees (₹)
- Practical timelines considering Indian government processes
- Comprehensive risk mitigation strategies
- Detailed quality assurance and testing protocols
- Specific performance metrics and KPIs

INDIAN GOVERNMENT SPECIFIC ELEMENTS:
- Reference to specific ministries/departments
- Compliance with Digital India initiatives
- Make in India and Atmanirbhar Bharat provisions
- MSME development and local supplier preferences
- Environmental clearance and regulatory approvals
- GST implications and tax compliance
- Labor law compliance requirements
- Data localization and cybersecurity requirements

BILINGUAL CONTENT REQUIREMENTS:
- Key section headers in both Hindi and English
- Important terms and conditions in both languages
- Contact information in bilingual format
- Government seal descriptions in both languages

Generate a comprehensive, professional-grade Indian Government RFP that would be suitable for actual government procurement. Make it detailed, thorough, and industry-specific for ${userInput.industry} ${userInput.projectType} projects.

The response must be AT LEAST 4,000 words with proper sectioning, detailed requirements, comprehensive technical specifications, and all mandatory Indian government procurement elements. Focus on creating a complete, usable government document rather than a summary.

IMPORTANT: Ensure every section is fully detailed with specific requirements, procedures, and compliance measures. This should be a complete government procurement document that can be used as-is for actual tendering.`;
      
      console.log('📝 ENHANCED STRUCTURED PROMPT CREATED:');
      console.log('=====================================');
      console.log(enhancedPrompt.substring(0, 800) + '...');
      console.log('=====================================');
      
      // Send the enhanced structured prompt to Gemini
      const rfpContent = await this.generateText(enhancedPrompt);
      
      return {
        success: true,
        rfpText: rfpContent,
        metadata: {
          projectName: userInput.projectName,
          industry: userInput.industry,
          projectType: userInput.projectType,
          generatedAt: new Date().toISOString(),
          aiProvider: 'gemini',
          promptLength: enhancedPrompt.length,
          responseLength: rfpContent.length,
          wordCount: rfpContent.split(' ').length
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
    console.log('🔄 Using enhanced fallback response for Gemini');
    
    // Try to extract project info from the prompt or user input
    let projectName = 'Government Project';
    let industry = 'General';
    let projectType = 'Implementation';
    let budget = 'To be determined';
    let timeline = 'To be determined';
    let description = 'Detailed project description as specified in requirements';
    
    // Enhanced extraction from prompt
    const nameMatch = prompt.match(/Project Name: ([^\n]+)/);
    if (nameMatch) projectName = nameMatch[1];
    
    const industryMatch = prompt.match(/Industry: ([^\n]+)/);
    if (industryMatch) industry = industryMatch[1];
    
    const typeMatch = prompt.match(/Project Type: ([^\n]+)/);
    if (typeMatch) projectType = typeMatch[1];
    
    const budgetMatch = prompt.match(/Budget.*?: ([^\n]+)/);
    if (budgetMatch) budget = budgetMatch[1];
    
    const timelineMatch = prompt.match(/Timeline.*?: ([^\n]+)/);
    if (timelineMatch) timeline = timelineMatch[1];
    
    const descMatch = prompt.match(/PROJECT DESCRIPTION:\s*={10,}\s*([^=]+)/);
    if (descMatch) description = descMatch[1].trim();
    
    const isRFI = prompt.toLowerCase().includes('rfi') || prompt.toLowerCase().includes('request for information');
    const documentType = isRFI ? 'Request for Information (RFI)' : 'Request for Proposal (RFP)';
    
    return `# निविदा सूचना / NOTICE INVITING TENDER (NIT)
# ${documentType}: ${projectName}

**NIT No.:** GovRFP/${new Date().getFullYear()}-${(new Date().getFullYear() + 1).toString().slice(-2)}/${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}
**Date of Issue:** ${new Date().toLocaleDateString('en-IN')}
**Government of India | भारत सरकार**

---

## EXECUTIVE SUMMARY | कार्यकारी सारांश

The Government of India/State Government is seeking qualified contractors to provide comprehensive ${projectType.toLowerCase()} services for the ${projectName}. This ${documentType} outlines the project requirements, scope of work, technical specifications, and submission guidelines for this ${industry} industry initiative in accordance with Government Financial Rules (GFR) 2017 and Central Vigilance Commission guidelines.

**परियोजना अवलोकन / Project Overview:**
- **Project Name / परियोजना का नाम:** ${projectName}
- **Industry / उद्योग:** ${industry}
- **Project Type / परियोजना प्रकार:** ${projectType}
- **Estimated Budget / अनुमानित बजट:** ${budget}
- **Project Timeline / परियोजना समयसीमा:** ${timeline}
- **Financial Year / वित्तीय वर्ष:** ${new Date().getFullYear()}-${(new Date().getFullYear() + 1).toString().slice(-2)}

## COMPLIANCE WITH INDIAN GOVERNMENT REGULATIONS | भारत सरकार के नियमों का अनुपालन

This tender is issued in compliance with:
- **Government Financial Rules (GFR) 2017** - वित्तीय नियम 2017
- **Central Vigilance Commission (CVC) Guidelines** - केंद्रीय सतर्कता आयोग दिशानिर्देश
- **Make in India Policy** - मेक इन इंडिया नीति
- **Atmanirbhar Bharat Abhiyan** - आत्मनिर्भर भारत अभियान
- **Digital India Initiative** - डिजिटल इंडिया पहल
- **MSME Development Act, 2006** - सूक्ष्म, लघु और मध्यम उद्यम विकास अधिनियम

## PROJECT BACKGROUND AND OBJECTIVES | परियोजना पृष्ठभूमि और उद्देश्य

${description}

This project represents a critical initiative under the Government of India's infrastructure development program, requiring specialized expertise in ${industry.toLowerCase()} operations and ${projectType.toLowerCase()} methodologies. The successful contractor will demonstrate proven experience, technical competence, and unwavering commitment to quality delivery within the specified timeframe and budget parameters, while ensuring compliance with all Indian regulations and standards.

### Primary Objectives | मुख्य उद्देश्य
1. **Technical Excellence | तकनीकी उत्कृष्टता:** Deliver innovative solutions meeting all specified technical requirements and Indian Standards (IS)
2. **Quality Assurance | गुणवत्ता आश्वासन:** Ensure all deliverables exceed industry standards and regulatory compliance as per BIS standards
3. **Make in India Compliance | मेक इन इंडिया अनुपालन:** Promote local manufacturing and indigenous technology development
4. **Skill Development | कौशल विकास:** Provide training and knowledge transfer to Indian personnel

## DETAILED SCOPE OF WORK | कार्य का विस्तृत दायरा

### Phase 1: Planning and Design | चरण 1: योजना और डिजाइन (20% of timeline)
- **Requirements Analysis | आवश्यकता विश्लेषण:** Comprehensive review of all technical and functional requirements as per Indian standards
- **System Design | सिस्टम डिजाइन:** Detailed architectural design and technical specifications complying with IS codes
- **Stakeholder Engagement | हितधारक सहभागिता:** Regular consultation with government departments and agencies
- **Environmental Clearance | पर्यावरण मंजूरी:** Obtain necessary environmental and regulatory clearances

### Phase 2: Implementation and Development | चरण 2: कार्यान्वयन और विकास (60% of timeline)
- **Core Development | मुख्य विकास:** Implementation of primary system components with preference to Indian suppliers
- **Integration Services | एकीकरण सेवाएं:** Seamless integration with existing government systems and infrastructure
- **Quality Control | गुणवत्ता नियंत्रण:** Continuous testing and validation as per Indian testing standards
- **Progress Reporting | प्रगति रिपोर्टिंग:** Regular status updates to designated government authorities

### Phase 3: Testing and Deployment | चरण 3: परीक्षण और तैनाती (15% of timeline)
- **System Testing | सिस्टम परीक्षण:** Comprehensive testing including acceptance testing by government technical committee
- **Performance Validation | प्रदर्शन सत्यापन:** Verification as per performance criteria and government specifications
- **Deployment Planning | तैनाती योजना:** Structured rollout with minimal operational disruption
- **Go-Live Support | लाइव सपोर्ट:** Dedicated support during initial operational period

### Phase 4: Documentation and Handover | चरण 4: प्रलेखन और हस्तांतरण (5% of timeline)
- **Technical Documentation | तकनीकी प्रलेखन:** Complete documentation in English and Hindi as required
- **User Training | उपयोगकर्ता प्रशिक्षण:** Comprehensive training programs for government personnel
- **Knowledge Transfer | ज्ञान स्थानांतरण:** Transfer of all technical knowledge and maintenance procedures
- **Warranty Support | वारंटी सहायता:** Minimum 3-year warranty period with comprehensive support

## TECHNICAL REQUIREMENTS AND SPECIFICATIONS | तकनीकी आवश्यकताएं और विनिर्देश

### Core Technical Requirements | मुख्य तकनीकी आवश्यकताएं
- **Indian Standards Compliance | भारतीय मानक अनुपालन:** Full adherence to applicable Indian Standards (IS) and Bureau of Indian Standards (BIS)
- **Regulatory Compliance | नियामक अनुपालन:** Compliance with all Central and State government regulations
- **Security Standards | सुरक्षा मानक:** Implementation as per Indian Cyber Security guidelines and CERT-In recommendations
- **Local Content Requirements | स्थानीय सामग्री आवश्यकताएं:** Minimum 50% local content as per Make in India policy
- **Scalability Requirements | स्केलेबिलिटी आवश्यकताएं:** Solution must accommodate pan-India deployment capability

### Digital India Integration | डिजिटल इंडिया एकीकरण
- **API Integration | एपीआई एकीकरण:** Compatible with India Stack and government digital platforms
- **Data Localization | डेटा स्थानीयकरण:** All data storage within Indian territory as per data protection laws
- **Interoperability | अंतर-संचालनीयता:** Seamless integration with existing government IT infrastructure
- **Cloud Compliance | क्लाउड अनुपालन:** Adherence to MeitY cloud computing guidelines and empanelment requirements

## CONTRACTOR QUALIFICATIONS AND REQUIREMENTS | ठेकेदार योग्यता और आवश्यकताएं

### Mandatory Qualifications | अनिवार्य योग्यताएं
- **Company Registration | कंपनी पंजीकरण:** Valid registration under Companies Act, 2013 or relevant Indian laws
- **GST Registration | जीएसटी पंजीकरण:** Valid GST registration certificate
- **Experience Requirements | अनुभव आवश्यकताएं:** Minimum 7 years of demonstrated experience in ${industry.toLowerCase()} projects in India
- **Financial Capability | वित्तीय क्षमता:** Annual turnover of minimum ₹X crores in last 3 financial years
- **Technical Certifications | तकनीकी प्रमाणन:** Relevant certifications from recognized Indian/International bodies

### Preferred Qualifications | पसंदीदा योग्यताएं
- **Government Experience | सरकारी अनुभव:** Previous experience with Central/State government projects
- **MSME Registration | एमएसएमई पंजीकरण:** Valid MSME registration for applicable benefits
- **Quality Certifications | गुणवत्ता प्रमाणन:** ISO certifications relevant to project scope
- **Local Presence | स्थानीय उपस्थिति:** Established office and operations in India
- **Startup India Recognition | स्टार्टअप इंडिया मान्यता:** Recognition under Startup India initiative (if applicable)

### Financial Requirements | वित्तीय आवश्यकताएं
- **Earnest Money Deposit (EMD) | बयाना राशि:** ₹X lakhs (as per GFR guidelines)
- **Performance Guarantee | प्रदर्शन गारंटी:** 10% of contract value as bank guarantee
- **Income Tax Returns | आयकर रिटर्न:** Last 3 years' filed IT returns
- **Bank Statements | बैंक विवरण:** Last 6 months' bank statements
- **Credit Rating | क्रेडिट रेटिंग:** Minimum investment grade credit rating from recognized agency

## EVALUATION CRITERIA AND SELECTION PROCESS | मूल्यांकन मानदंड और चयन प्रक्रिया

### Technical Evaluation | तकनीकी मूल्यांकन (70% weighting)
- **Solution Architecture (25%) | समाधान वास्तुकला:** Innovation, feasibility, and technical soundness
- **Implementation Methodology (20%) | कार्यान्वयन पद्धति:** Proven methodologies and project management approaches
- **Local Content Compliance (15%) | स्थानीय सामग्री अनुपालन:** Make in India and Atmanirbhar Bharat compliance
- **Technical Team Qualifications (10%) | तकनीकी टीम योग्यता:** Expertise and experience of proposed team

### Financial Evaluation | वित्तीय मूल्यांकन (30% weighting)
- **L1 Price Evaluation | एल1 मूल्य मूल्यांकन:** Competitive pricing analysis
- **Total Cost of Ownership | स्वामित्व की कुल लागत:** Long-term cost considerations
- **Payment Terms | भुगतान शर्तें:** Compliance with government payment schedules
- **Value Engineering | मूल्य इंजीनियरिंग:** Cost optimization proposals

### Additional Evaluation Parameters | अतिरिक्त मूल्यांकन मापदंड
- **MSME Preference | एमएसएमई वरीयता:** Additional weightage as per government policy
- **Local Supplier Preference | स्थानीय आपूर्तिकर्ता वरीयता:** Benefits for local companies
- **Past Performance | पूर्व प्रदर्शन:** Track record with government projects
- **Social Impact | सामाजिक प्रभाव:** Contribution to skill development and employment generation

## SUBMISSION REQUIREMENTS AND GUIDELINES | प्रस्तुति आवश्यकताएं और दिशानिर्देश

### Required Documents | आवश्यक दस्तावेज
1. **Technical Proposal | तकनीकी प्रस्ताव:** Detailed technical approach and methodology
2. **Financial Proposal | वित्तीय प्रस्ताव:** Comprehensive pricing with GST implications
3. **Company Profile | कंपनी प्रोफाइल:** Registration certificates, GST certificate, PAN card
4. **Experience Certificates | अनुभव प्रमाण पत्र:** Work completion certificates from previous clients
5. **Financial Documents | वित्तीय दस्तावेज:** Audited balance sheets, IT returns, bank statements
6. **Compliance Certificates | अनुपालन प्रमाण पत्र:** Various statutory compliance certificates
7. **Earnest Money Deposit | बयाना राशि:** Valid EMD in prescribed format

### Submission Guidelines | प्रस्तुति दिशानिर्देश
- **Language | भाषा:** Documents in English (Hindi translations where required)
- **Format | प्रारूप:** Hard copies and digital submissions as specified
- **Validity | वैधता:** Proposals valid for 180 days from submission
- **Modifications | संशोधन:** No modifications allowed after submission deadline

## CONTRACT TERMS AND CONDITIONS | अनुबंध नियम और शर्तें

### General Contract Provisions | सामान्य अनुबंध प्रावधान
- **Contract Type | अनुबंध प्रकार:** Fixed-price contract with milestone-based payments
- **Governing Law | नियंत्रणकारी कानून:** Indian Contract Act, 1872 and applicable Indian laws
- **Jurisdiction | न्यायाधिकार:** Courts in [City Name], India
- **Arbitration | मध्यस्थता:** As per Arbitration and Conciliation Act, 2015
- **Force Majeure | बल प्रमुख:** As per Indian legal provisions

### Payment Terms | भुगतान शर्तें
- **Advance Payment | अग्रिम भुगतान:** Maximum 20% against bank guarantee
- **Milestone Payments | मील का पत्थर भुगतान:** Based on deliverable completion and acceptance
- **GST Compliance | जीएसटी अनुपालन:** All taxes as per prevailing Indian tax laws
- **TDS Deduction | टीडीएस कटौती:** As per Income Tax Act, 1961
- **Retention Money | प्रतिधारण राशि:** 10% retained till completion of defect liability period

### Performance Guarantees | प्रदर्शन गारंटी
- **Performance Bank Guarantee | प्रदर्शन बैंक गारंटी:** 10% of contract value
- **Defect Liability Period | दोष दायित्व अवधि:** 36 months from completion
- **Liquidated Damages | निर्धारित हर्जाना:** As per standard government rates
- **Penalty Clauses | दंड खंड:** For delays and non-performance

## INTEGRITY AND TRANSPARENCY MEASURES | अखंडता और पारदर्शिता के उपाय

### Central Vigilance Commission Compliance | केंद्रीय सतर्कता आयोग अनुपालन
- **Integrity Pact | अखंडता समझौता:** Mandatory signing of integrity pact
- **Conflict of Interest | हितों का टकराव:** Declaration of any conflict of interest
- **Transparency | पारदर्शिता:** Commitment to transparent business practices
- **Anti-Corruption | भ्रष्टाचार विरोधी:** Zero tolerance for corrupt practices

### Right to Information (RTI) Compliance | सूचना का अधिकार अनुपालन
- **Public Disclosure | सार्वजनिक प्रकटीकरण:** Contract details subject to RTI provisions
- **Document Preservation | दस्तावेज संरक्षण:** Mandatory record keeping as per RTI guidelines

## PROCUREMENT SCHEDULE | खरीद अनुसूची

| **Milestone | मील का पत्थर** | **Date | दिनांक** | **Description | विवरण** |
|------------|---------|--------------|
| NIT Publication | निविदा प्रकाशन | [Date] | Notice publication in newspapers and website |
| Pre-bid Meeting | पूर्व-बोली बैठक | [Date] | Clarification meeting with prospective bidders |
| Bid Submission Deadline | बोली प्रस्तुति समय सीमा | [Date] | Final deadline for bid submission |
| Technical Evaluation | तकनीकी मूल्यांकन | [Date Range] | Technical proposal evaluation |
| Financial Evaluation | वित्तीय मूल्यांकन | [Date Range] | Price bid opening and evaluation |
| Contract Award | अनुबंध पुरस्कार | [Date] | Letter of award issuance |
| Work Commencement | कार्य प्रारंभ | [Date] | Project implementation start |

## CONTACT INFORMATION | संपर्क जानकारी

### Tendering Authority | निविदा प्राधिकरण
**[Name], [Designation]**
**[Department/Ministry Name]**
**Government of India | भारत सरकार**
Address: [Complete Official Address]
Email: [official.email@gov.in]
Phone: [Official Contact Number]

### Technical Queries | तकनीकी प्रश्न
**[Name], Technical Officer**
Email: [technical.email@gov.in]
Phone: [Technical Contact Number]

### Commercial Queries | व्यावसायिक प्रश्न
**[Name], Accounts Officer**
Email: [accounts.email@gov.in]
Phone: [Accounts Contact Number]

---

## APPENDICES | परिशिष्ट

### Appendix A: Technical Specifications | परिशिष्ट ए: तकनीकी विनिर्देश
[Detailed technical specifications as per Indian Standards]

### Appendix B: Standard Contract Conditions | परिशिष्ट बी: मानक अनुबंध शर्तें
[General Financial Rules 2017 based contract conditions]

### Appendix C: Formats and Proformas | परिशिष्ट सी: प्रारूप और प्रोफार्मा
[Standard government formats for submissions]

### Appendix D: Compliance Checklist | परिशिष्ट डी: अनुपालन चेकलिस्ट
[Mandatory compliance requirements checklist]

---

**GOVERNMENT SEAL | सरकारी मुहर**

**IMPORTANT DISCLAIMER | महत्वपूर्ण अस्वीकरण:** This ${documentType} represents the Government of India's commitment to transparent and competitive procurement. All information provided is accurate to the best of our knowledge. Potential contractors are encouraged to conduct their own due diligence and analysis in accordance with Indian laws and regulations.

**Generated Information | उत्पन्न जानकारी:**
- Document Type | दस्तावेज़ प्रकार: ${documentType}
- Project | परियोजना: ${projectName}
- Industry | उद्योग: ${industry}
- Generated | उत्पन्न: ${new Date().toISOString()}
- Compliance | अनुपालन: GFR 2017, CVC Guidelines, Make in India Policy

**यह निविदा भारत सरकार की नीतियों और दिशानिर्देशों के अनुसार जारी की गई है।**
*This tender is issued in accordance with Government of India policies and guidelines.*

**जय हिन्द | Jai Hind**`;
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
