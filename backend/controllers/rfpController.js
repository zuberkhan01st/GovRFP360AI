// Controller for RFP/RFI generation
const rfpService = require('../services/rfpService');

exports.generateRFP = async (req, res) => {
  try {
    const userInput = req.body;
    // Call service to generate RFP/RFI text
    const rfpText = await rfpService.generateRFPText(userInput);
    res.json({ success: true, rfp: rfpText });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
