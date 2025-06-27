// Utility to build prompts for RFP/RFI generation

class PromptBuilder {
  constructor() {
    this.industryTemplates = {
      'Manufacturing': {
        keywords: ['production', 'assembly', 'quality control', 'automation', 'safety protocols'],
        regulations: ['ISO 9001', 'OSHA', 'ASME Standards'],
        disciplines: ['Mechanical Engineering', 'Electrical Engineering', 'Industrial Automation']
      },
      'Oil & Gas': {
        keywords: ['drilling', 'refining', 'pipeline', 'offshore', 'petrochemical'],
        regulations: ['API Standards', 'EPA Requirements', 'OSHA'],
        disciplines: ['Process Engineering', 'Piping & Pipeline', 'Instrumentation & Controls']
      },
      'Chemical Processing': {
        keywords: ['chemical reaction', 'distillation', 'synthesis', 'batch processing'],
        regulations: ['EPA Requirements', 'NFPA Codes', 'ISO 14001'],
        disciplines: ['Process Engineering', 'Environmental Engineering', 'Chemical Engineering']
      }
    };
  }

  buildRfpPrompt(userInput) {
    const {
      documentType = 'RFP',
      sector = 'Government',
      industry = '',
      projectName = '',
      projectDescription = '',
      projectType = '',
      location = '',
      budget = '',
      timeline = '',
      disciplines = [],
      requirements = [],
      evaluationCriteria = '',
      submissionGuidelines = '',
      contactInfo = '',
      regulatory = '',
      customClauses = '',
      compliance = []
    } = userInput;

    // Get industry-specific context
    const industryContext = this.getIndustryContext(industry);
    
    const prompt = `You are an expert in ${sector} sector procurement and ${industry} industry requirements. Generate a comprehensive, professional ${documentType} document.

PROJECT INFORMATION:
==================
Project Name: ${projectName || 'Industrial Project'}
Industry: ${industry}
Project Type: ${projectType}
Location: ${location || 'To be determined'}
Budget Range: ${budget || 'To be determined'}
Timeline: ${timeline || 'To be determined'}

PROJECT DESCRIPTION:
==================
${projectDescription || 'Detailed project description to be provided'}

TECHNICAL REQUIREMENTS:
=====================
Engineering Disciplines Required: ${disciplines.length > 0 ? disciplines.join(', ') : 'To be determined'}

Specific Requirements:
${requirements.length > 0 ? requirements.map((r, i) => `${i + 1}. ${r}`).join('\n') : '1. Detailed technical specifications to be defined\n2. Quality assurance requirements\n3. Safety and compliance standards'}

INDUSTRY-SPECIFIC CONTEXT:
=========================
${industryContext}

EVALUATION & SUBMISSION:
======================
Evaluation Criteria: ${evaluationCriteria || 'Technical capability, experience, cost-effectiveness, timeline'}
Submission Guidelines: ${submissionGuidelines || 'Standard procurement submission process'}
Regulatory/Compliance Requirements: ${regulatory || 'All applicable industry standards and regulations'}

CONTACT & ADDITIONAL INFORMATION:
===============================
Contact Information: ${contactInfo || 'Procurement department contact details'}
Custom Clauses: ${customClauses || 'Standard terms and conditions apply'}

GENERATION INSTRUCTIONS:
=======================
Please generate a complete, professional ${documentType} document that includes:

1. EXECUTIVE SUMMARY
2. PROJECT OVERVIEW AND BACKGROUND
3. SCOPE OF WORK (detailed technical requirements)
4. TECHNICAL SPECIFICATIONS
5. DELIVERABLES AND MILESTONES
6. QUALIFICATION REQUIREMENTS
7. EVALUATION CRITERIA AND PROCESS
8. SUBMISSION REQUIREMENTS AND DEADLINES
9. TERMS AND CONDITIONS
10. APPENDICES (if applicable)

Ensure the document:
- Follows ${sector} sector procurement best practices
- Incorporates ${industry} industry standards and terminology
- Is clear, comprehensive, and professional
- Includes appropriate compliance and regulatory requirements
- Uses proper formatting and structure
- Contains realistic timelines and requirements

Format the output in clean markdown with proper headers and sections.`;

    return prompt;
  }

  getIndustryContext(industry) {
    const template = this.industryTemplates[industry];
    
    if (!template) {
      return 'General industrial project requirements apply. Focus on safety, quality, and regulatory compliance.';
    }

    return `This is a ${industry} industry project. Key considerations include:

Key Industry Keywords: ${template.keywords.join(', ')}
Applicable Regulations: ${template.regulations.join(', ')}
Typical Engineering Disciplines: ${template.disciplines.join(', ')}

Please ensure the RFP incorporates industry-specific terminology, standards, and best practices relevant to ${industry}.`;
  }

  buildCompliancePrompt(userInput, existingRFP) {
    const { industry, sector, regulations = [] } = userInput;
    
    return `You are a compliance expert for ${industry} industry in the ${sector} sector.

Review the following RFP document for compliance issues and provide recommendations:

RFP DOCUMENT:
=============
${existingRFP}

COMPLIANCE REQUIREMENTS:
=======================
Industry: ${industry}
Sector: ${sector}
Specific Regulations: ${regulations.join(', ')}

Please analyze the document and provide:
1. Compliance gaps or issues identified
2. Missing regulatory requirements
3. Recommendations for improvement
4. Risk assessment
5. Suggested additional clauses or sections

Format your response as a structured compliance report.`;
  }

  buildRFIPrompt(userInput) {
    // Build RFI-specific prompt (Request for Information)
    const basePrompt = this.buildRfpPrompt({ ...userInput, documentType: 'RFI' });
    
    const rfiAddendum = `

RFI-SPECIFIC INSTRUCTIONS:
=========================
This is a Request for Information (RFI), not a Request for Proposal (RFP). Therefore:

1. Focus on gathering information rather than requesting formal proposals
2. Ask open-ended questions about capabilities, approaches, and solutions
3. Request vendor qualifications and experience
4. Seek preliminary cost estimates and timeline information
5. Include questions about innovative approaches or alternatives
6. Request information about potential challenges and risk mitigation
7. Ask for case studies or examples of similar projects

The tone should be exploratory and information-gathering rather than prescriptive.`;
    
    return basePrompt + rfiAddendum;
  }

  buildScopeOfWorkPrompt(userInput) {
    const {
      industry,
      projectType,
      disciplines = [],
      complexityLevel = 3,
      regulations = []
    } = userInput;

    return `Generate a detailed Scope of Work for a ${industry} ${projectType} project.

TECHNICAL PARAMETERS:
====================
Industry: ${industry}
Project Type: ${projectType}
Engineering Disciplines: ${disciplines.join(', ')}
Complexity Level: ${complexityLevel}/5 (1=basic, 5=highly complex)
Applicable Regulations: ${regulations.join(', ')}

SCOPE OF WORK REQUIREMENTS:
==========================
For each engineering discipline, provide:
1. Specific technical tasks and deliverables
2. Design standards and specifications
3. Quality assurance requirements
4. Documentation and reporting requirements
5. Interface coordination requirements

Include:
- Detailed task descriptions (2-3 sentences each)
- Specific technical standards and codes
- Material specifications where applicable
- Testing and validation requirements
- Cross-disciplinary coordination tasks

Ensure all tasks are realistic, measurable, and industry-appropriate.`;
  }
}

module.exports = new PromptBuilder();
