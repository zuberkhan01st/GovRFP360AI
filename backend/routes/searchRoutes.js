const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// Search existing documents
router.post('/', searchController.searchDocuments);

// Search by industry
router.get('/industry/:industry', searchController.searchByIndustry);

// Get similar documents
router.get('/similar/:documentId', searchController.getSimilarDocuments);

// Get specific document
router.get('/document/:documentId', searchController.getDocument);

// Get search suggestions
router.get('/suggestions', searchController.getSearchSuggestions);

// Get collection statistics
router.get('/stats', searchController.getCollectionStats);

module.exports = router;
