const express = require('express');
const router = express.Router();
const ingestionController = require('../controllers/ingestionController');

// Initialize Weaviate database
router.post('/init', ingestionController.initializeDatabase);

// Ingest all documents from the data directory
router.post('/ingest-all', ingestionController.ingestAllDocuments);

// Ingest a single document
router.post('/ingest/:fileName', ingestionController.ingestSingleDocument);

// Clear all documents from vector database
router.delete('/clear-all', ingestionController.clearAllDocuments);

// Get ingestion status
router.get('/status', ingestionController.getIngestionStatus);

module.exports = router;
