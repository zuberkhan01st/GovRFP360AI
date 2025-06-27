const express = require('express');
const router = express.Router();
const rfpController = require('../controllers/rfpController');

// Generate RFP/RFI text based on structured user input
router.post('/generate', rfpController.generateRFP);

module.exports = router;
