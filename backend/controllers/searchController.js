// Controller for document search
const searchService = require('../services/searchService');

exports.searchDocuments = async (req, res) => {
  try {
    const { query, filters = {}, limit = 10 } = req.body;
    
    if (!query || query.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Search query is required' 
      });
    }

    // Call service to search documents
    const results = await searchService.search(query, filters, limit);
    
    res.json({ 
      success: true, 
      results,
      total: results.length,
      query,
      filters
    });
  } catch (error) {
    console.error('Search controller error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

exports.searchByIndustry = async (req, res) => {
  try {
    const { industry } = req.params;
    const { limit = 10 } = req.query;
    
    const results = await searchService.searchByIndustry(industry, parseInt(limit));
    
    res.json({ 
      success: true, 
      results,
      industry,
      total: results.length
    });
  } catch (error) {
    console.error('Industry search controller error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

exports.getSimilarDocuments = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { limit = 5 } = req.query;
    
    const results = await searchService.findSimilarDocuments(documentId, parseInt(limit));
    
    res.json({ 
      success: true, 
      results,
      sourceDocument: documentId,
      total: results.length
    });
  } catch (error) {
    console.error('Similar documents controller error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

exports.getDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    
    const document = await searchService.getDocumentById(documentId);
    
    if (!document) {
      return res.status(404).json({ 
        success: false, 
        error: 'Document not found' 
      });
    }
    
    res.json({ 
      success: true, 
      document
    });
  } catch (error) {
    console.error('Get document controller error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

exports.getSearchSuggestions = async (req, res) => {
  try {
    const { q } = req.query;
    const { limit = 5 } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.json({ 
        success: true, 
        suggestions: [] 
      });
    }
    
    const suggestions = await searchService.getSearchSuggestions(q, parseInt(limit));
    
    res.json({ 
      success: true, 
      suggestions
    });
  } catch (error) {
    console.error('Search suggestions controller error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

exports.getCollectionStats = async (req, res) => {
  try {
    const stats = await searchService.getCollectionStats();
    
    res.json({ 
      success: true, 
      stats
    });
  } catch (error) {
    console.error('Collection stats controller error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};
