const express = require('express');
const router = express.Router();
const complianceController = require('../controllers/complianceController');

// Validate uploaded document for compliance
router.post('/validate', complianceController.validateDocument);

module.exports = router;
