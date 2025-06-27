// Controller for RFP/RFI generation
const rfpService = require('../services/rfpService');

exports.generateRFP = async (req, res) => {
  try {
    const userInput = req.body;
    
    // Validate required fields
    if (!userInput.projectDescription && !userInput.projectName) {
      return res.status(400).json({ 
        success: false, 
        error: 'Project name or description is required' 
      });
    }

    console.log('🚀 Generating RFP with input:', userInput);
    
    // Call service to generate RFP/RFI text with RAG enhancement
    const result = await rfpService.generateRFPText(userInput);
    
    res.json({ 
      success: true, 
      ...result
    });
  } catch (error) {
    console.error('RFP generation controller error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

exports.generateFromTemplate = async (req, res) => {
  try {
    const { templateDocumentId } = req.params;
    const userInput = req.body;
    
    if (!templateDocumentId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Template document ID is required' 
      });
    }

    console.log('📋 Generating RFP from template:', templateDocumentId);
    
    const result = await rfpService.generateFromTemplate(templateDocumentId, userInput);
    
    res.json({ 
      success: true, 
      ...result
    });
  } catch (error) {
    console.error('Template-based RFP generation error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

exports.getRFPSuggestions = async (req, res) => {
  try {
    const userInput = req.body;
    
    console.log('💡 Getting RFP suggestions for:', userInput);
    
    const suggestions = await rfpService.getRFPSuggestions(userInput);
    
    res.json({ 
      success: true, 
      suggestions
    });
  } catch (error) {
    console.error('RFP suggestions controller error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

exports.generateRFI = async (req, res) => {
  try {
    const userInput = { ...req.body, documentType: 'RFI' };
    
    if (!userInput.projectDescription && !userInput.projectName) {
      return res.status(400).json({ 
        success: false, 
        error: 'Project name or description is required for RFI' 
      });
    }

    console.log('📝 Generating RFI with input:', userInput);
    
    const result = await rfpService.generateRFPText(userInput);
    
    res.json({ 
      success: true, 
      ...result,
      documentType: 'RFI'
    });
  } catch (error) {
    console.error('RFI generation controller error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};
