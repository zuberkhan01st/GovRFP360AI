// Controller for compliance validation
const complianceService = require('../services/complianceService');

exports.validateDocument = async (req, res) => {
  try {
    const { documentText, documentType, sector, requirements } = req.body;
    // Call service to validate document
    const result = await complianceService.validate(documentText, documentType, sector, requirements);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
