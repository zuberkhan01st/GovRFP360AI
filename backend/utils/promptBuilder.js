// Utility to build prompts for RFP/RFI generation

exports.buildRfpPrompt = (userInput) => {
  const {
    documentType = 'RFP',
    sector = 'Government',
    projectName = '',
    projectDetails = '',
    requirements = [],
    evaluationCriteria = '',
    submissionGuidelines = '',
    contactInfo = '',
    regulatory = '',
    customClauses = ''
  } = userInput;

  return `You are an expert in Indian public and private sector procurement.\n\nGenerate a ${documentType} for the following project, following Indian government tender norms (GeM, CPPP, CVC) and best practices.\n\nProject Name: ${projectName}\nSector: ${sector}\nProject Details: ${projectDetails}\n\nRequirements:\n${requirements.map((r,i)=>`${i+1}. ${r}`).join('\n')}\n\nEvaluation Criteria: ${evaluationCriteria}\nSubmission Guidelines: ${submissionGuidelines}\nRegulatory/Compliance: ${regulatory}\nCustom Clauses: ${customClauses}\nContact Information: ${contactInfo}\n\nInclude all standard sections (Introduction, Scope, Eligibility, Evaluation, Submission, Contact, etc.) and ensure compliance with Indian tender rules. Format as markdown.`;
};
