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
      temperature: 0.4,
      topP: 0.9,
      topK: 40,
      maxOutputTokens: 10000,
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
      
      // Enhance the prompt for more comprehensive output
      const enhancedPrompt = `${structuredPrompt}

IMPORTANT INSTRUCTIONS FOR COMPREHENSIVE RFP GENERATION:

1. Generate a COMPLETE, PROFESSIONAL RFP document with ALL sections fully detailed
2. The response should be 3000-5000 words minimum for a comprehensive government RFP
3. Include specific technical requirements relevant to ${userInput.industry} industry
4. Add detailed evaluation criteria with specific scoring methodologies
5. Include comprehensive compliance and regulatory requirements
6. Provide detailed project phases with specific deliverables and timelines
7. Add extensive contractor qualification requirements
8. Include risk management and mitigation strategies
9. Provide detailed cost structures and payment terms
10. Add comprehensive appendices and reference materials

Generate a complete, professional-grade RFP that would be suitable for actual government procurement. Make it detailed, thorough, and industry-specific for ${userInput.industry} ${userInput.projectType} projects.

Focus on creating VALUE and COMPREHENSIVENESS rather than brevity.`;
      
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
    
    return `# ${documentType}: ${projectName}

## EXECUTIVE SUMMARY

The Government/Agency is seeking qualified contractors to provide comprehensive ${projectType.toLowerCase()} services for the ${projectName}. This ${documentType} outlines the project requirements, scope of work, technical specifications, and submission guidelines for this ${industry} industry initiative.

**Project Overview:**
- **Project Name:** ${projectName}
- **Industry:** ${industry}
- **Project Type:** ${projectType}
- **Estimated Budget:** ${budget}
- **Project Timeline:** ${timeline}

## PROJECT BACKGROUND AND OBJECTIVES

${description}

This project represents a critical initiative requiring specialized expertise in ${industry.toLowerCase()} operations and ${projectType.toLowerCase()} methodologies. The successful contractor will demonstrate proven experience, technical competence, and unwavering commitment to quality delivery within the specified timeframe and budget parameters.

### Primary Objectives
1. **Technical Excellence:** Deliver innovative solutions meeting all specified technical requirements
2. **Quality Assurance:** Ensure all deliverables exceed industry standards and regulatory compliance
3. **Project Management:** Provide comprehensive coordination with stakeholder engagement
4. **Knowledge Transfer:** Deliver complete documentation and training for sustainable operations

## DETAILED SCOPE OF WORK

### Phase 1: Planning and Design (20% of timeline)
- **Requirements Analysis:** Comprehensive review of all technical and functional requirements
- **System Design:** Detailed architectural design and technical specifications
- **Stakeholder Engagement:** Regular consultation with key project stakeholders
- **Risk Assessment:** Identification and mitigation strategies for project risks

### Phase 2: Implementation and Development (60% of timeline)
- **Core Development:** Implementation of primary system components and functionality
- **Integration Services:** Seamless integration with existing systems and infrastructure
- **Quality Control:** Continuous testing and validation throughout development
- **Progress Reporting:** Regular status updates and milestone confirmations

### Phase 3: Testing and Deployment (15% of timeline)
- **System Testing:** Comprehensive testing including unit, integration, and user acceptance testing
- **Performance Validation:** Verification of all performance criteria and benchmarks
- **Deployment Planning:** Structured rollout with minimal operational disruption
- **Go-Live Support:** Dedicated support during initial operational period

### Phase 4: Documentation and Handover (5% of timeline)
- **Technical Documentation:** Complete system documentation and operational manuals
- **User Training:** Comprehensive training programs for end users and administrators
- **Knowledge Transfer:** Transfer of all technical knowledge and maintenance procedures
- **Warranty Support:** Initial warranty period with dedicated support services

## TECHNICAL REQUIREMENTS AND SPECIFICATIONS

### Core Technical Requirements
- **Industry Standards Compliance:** Full adherence to all applicable ${industry} industry standards and best practices
- **Regulatory Compliance:** Compliance with all federal, state, and local regulations
- **Security Standards:** Implementation of robust security measures and data protection protocols
- **Performance Criteria:** Meeting or exceeding all specified performance benchmarks
- **Scalability Requirements:** Solution must accommodate future growth and expansion needs

### Infrastructure and Integration
- **System Integration:** Seamless integration with existing IT infrastructure and legacy systems
- **Data Migration:** Secure and accurate migration of existing data with zero data loss
- **Network Requirements:** Optimal utilization of existing network infrastructure
- **Backup and Recovery:** Comprehensive backup and disaster recovery capabilities
- **Monitoring and Maintenance:** Integrated monitoring tools for proactive maintenance

### Quality Assurance Standards
- **Testing Protocols:** Comprehensive testing methodologies including automated and manual testing
- **Documentation Standards:** Complete technical and user documentation following industry standards
- **Code Quality:** Adherence to coding standards and best practices for maintainability
- **Performance Monitoring:** Continuous performance monitoring and optimization
- **Security Auditing:** Regular security assessments and vulnerability testing

## CONTRACTOR QUALIFICATIONS AND REQUIREMENTS

### Mandatory Qualifications
- **Experience Requirements:** Minimum 7 years of demonstrated experience in ${industry.toLowerCase()} projects
- **Project Portfolio:** Proven track record of successful ${projectType.toLowerCase()} implementations
- **Technical Certifications:** Current and relevant professional certifications in required technologies
- **Financial Stability:** Demonstrated financial capacity and bonding capability for project size
- **Insurance Coverage:** Comprehensive general liability and professional indemnity insurance

### Preferred Qualifications
- **Government Experience:** Previous experience with government or public sector projects
- **Industry Recognition:** Professional recognition or awards for excellence in ${industry.toLowerCase()} solutions
- **Local Presence:** Established local presence with dedicated project support capabilities
- **Sustainability Practices:** Commitment to environmental sustainability and responsible business practices
- **Innovation Track Record:** History of innovative solutions and cutting-edge technology implementation

### Key Personnel Requirements
- **Project Manager:** PMP certified with minimum 5 years of ${industry.toLowerCase()} project management experience
- **Technical Lead:** Senior technical expert with deep knowledge of ${industry.toLowerCase()} systems and standards
- **Quality Assurance Manager:** Experienced QA professional with proven testing methodologies
- **Support Team:** Dedicated support team with 24/7 availability during critical project phases

## EVALUATION CRITERIA AND SELECTION PROCESS

### Technical Evaluation (40% weighting)
- **Solution Architecture:** Innovation, feasibility, and technical soundness of proposed solution
- **Implementation Methodology:** Proven methodologies and project management approaches
- **Risk Management:** Comprehensive risk identification and mitigation strategies
- **Technology Stack:** Appropriateness and sustainability of proposed technology solutions

### Experience and Qualifications (30% weighting)
- **Relevant Experience:** Direct experience with similar ${industry.toLowerCase()} projects and scope
- **Reference Projects:** Quality and relevance of provided reference projects and client testimonials
- **Team Qualifications:** Expertise and experience of proposed project team members
- **Past Performance:** Historical performance on similar projects including schedule and budget adherence

### Cost and Value Proposition (20% weighting)
- **Total Project Cost:** Competitiveness and reasonableness of total project pricing
- **Cost Breakdown:** Transparency and detail in cost structure and pricing methodology
- **Value-Added Services:** Additional services and benefits provided at no extra cost
- **Long-term Value:** Consideration of total cost of ownership and long-term value proposition

### Timeline and Project Management (10% weighting)
- **Project Schedule:** Realistic and achievable project timeline with clear milestones
- **Resource Allocation:** Appropriate allocation of resources throughout project lifecycle
- **Communication Plan:** Effective communication and reporting protocols
- **Change Management:** Flexibility and responsiveness to project changes and requirements

## SUBMISSION REQUIREMENTS AND GUIDELINES

### Required Proposal Components
1. **Executive Summary:** Concise overview of proposed solution and key differentiators
2. **Technical Proposal:** Detailed technical approach, architecture, and implementation plan
3. **Project Management Plan:** Comprehensive project plan with timeline, resources, and milestones
4. **Cost Proposal:** Detailed pricing with breakdown by phase, resource, and deliverable
5. **Company Qualifications:** Corporate profile, certifications, insurance, and financial information
6. **Team Profiles:** Detailed resumes and qualifications of all key project personnel
7. **Reference Projects:** Minimum of 3 relevant project references with contact information
8. **Compliance Matrix:** Detailed response to all RFP requirements and specifications

### Submission Format and Requirements
- **Format:** Electronic submission required in PDF format with searchable text
- **Page Limits:** Technical proposal limited to 50 pages (excluding appendices and resumes)
- **Language:** All documentation must be submitted in English
- **Currency:** All pricing must be in US Dollars (USD)
- **Validity Period:** Proposals must remain valid for 120 days from submission deadline

### Submission Deadline and Process
- **Submission Deadline:** [To be specified - typically 30-45 days from RFP release]
- **Submission Method:** Electronic submission via designated procurement portal
- **Late Submissions:** Late submissions will not be accepted under any circumstances
- **Proposal Modifications:** Modifications after deadline will not be permitted

## CONTRACT TERMS AND CONDITIONS

### General Contract Provisions
- **Contract Type:** Fixed-price contract with performance-based milestones
- **Contract Duration:** ${timeline} from contract execution to final acceptance
- **Payment Terms:** Net 30 days upon completion and acceptance of each milestone
- **Performance Guarantees:** Performance bonds and guarantees as specified in contract terms
- **Intellectual Property:** Clear definition of intellectual property ownership and licensing

### Performance and Delivery Requirements
- **Service Level Agreements:** Specific SLAs for all system components and support services
- **Penalty Clauses:** Financial penalties for delays or performance shortfalls
- **Acceptance Criteria:** Clear criteria for milestone acceptance and final system acceptance
- **Warranty Period:** Minimum 12-month warranty period with comprehensive support
- **Maintenance Requirements:** Ongoing maintenance and support requirements and costs

### Legal and Regulatory Compliance
- **Governing Law:** Contract governed by [State/Federal] law and regulations
- **Dispute Resolution:** Structured dispute resolution process including mediation and arbitration
- **Insurance Requirements:** Minimum insurance coverage requirements for duration of contract
- **Security Clearances:** Any required security clearances for personnel and data access
- **Compliance Auditing:** Right to audit contractor compliance with contract terms and requirements

## PROCUREMENT SCHEDULE AND KEY DATES

| **Milestone** | **Date** | **Description** |
|---------------|----------|-----------------|
| RFP Release | [Date] | Official release of Request for Proposal |
| Pre-Proposal Conference | [Date] | Optional information session for potential bidders |
| Questions Deadline | [Date] | Deadline for submission of clarifying questions |
| Proposal Submission Deadline | [Date] | Final deadline for proposal submission |
| Proposal Evaluation Period | [Date Range] | Internal evaluation and scoring of all proposals |
| Finalist Presentations | [Date] | Presentations by selected finalists (if required) |
| Contract Award Notification | [Date] | Official notification of contract award |
| Contract Execution | [Date] | Final contract signing and project initiation |

## CONTACT INFORMATION AND COMMUNICATIONS

### Primary Procurement Contact
**[Name], Procurement Officer**
Government Procurement Department
Address: [Address]
Email: procurement@government.gov
Phone: (555) 123-4567
Fax: (555) 123-4568

### Technical Inquiries
**[Name], Technical Review Committee Chair**
Technical Evaluation Department
Email: technical@government.gov
Phone: (555) 123-4569

### Administrative Questions
**[Name], Contract Administrator**
Contract Administration Office
Email: contracts@government.gov
Phone: (555) 123-4570

### Communication Protocol
- All official communications must be in writing via email
- Responses to inquiries will be provided to all registered bidders
- No verbal commitments or clarifications will be considered binding
- All communications must reference the RFP number and project title

---

## APPENDICES

### Appendix A: Technical Specifications
[Detailed technical specifications and requirements]

### Appendix B: Regulatory Requirements
[Applicable regulations, codes, and compliance requirements]

### Appendix C: Existing System Documentation
[Current system documentation and integration requirements]

### Appendix D: Sample Contract Terms
[Standard contract terms and conditions template]

---

**IMPORTANT DISCLAIMER:** This ${documentType} represents our commitment to transparent and competitive procurement. All information provided is accurate to the best of our knowledge. Potential contractors are encouraged to conduct their own due diligence and analysis.

**Generated Information:**
- Document Type: ${documentType}
- Project: ${projectName}
- Industry: ${industry}
- Generated: ${new Date().toISOString()}
- Version: Enhanced Template with Comprehensive Specifications

*This is an enhanced template response generated due to API configuration limitations. For fully customized AI-powered RFP generation with industry-specific content and intelligent document analysis, please ensure your GEMINI_API_KEY is properly configured and active.*`;
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
