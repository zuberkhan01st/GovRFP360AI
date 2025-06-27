const express = require('express');
const router = express.Router();
const rfpController = require('../controllers/rfpController');

// Generate RFP text based on structured user input
router.post('/generate', rfpController.generateRFP);

// Generate RFI text based on structured user input
router.post('/generate-rfi', rfpController.generateRFI);

// Generate RFP from existing template document
router.post('/generate-from-template/:templateDocumentId', rfpController.generateFromTemplate);

// Get suggestions for RFP generation
router.post('/suggestions', rfpController.getRFPSuggestions);

module.exports = router;
