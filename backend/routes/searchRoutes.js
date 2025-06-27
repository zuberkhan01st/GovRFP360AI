const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// Search existing documents
router.post('/', searchController.searchDocuments);

module.exports = router;
