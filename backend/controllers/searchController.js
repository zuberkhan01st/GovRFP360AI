// Controller for document search
const searchService = require('../services/searchService');

exports.searchDocuments = async (req, res) => {
  try {
    const { query } = req.body;
    // Call service to search documents
    const results = await searchService.search(query);
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
