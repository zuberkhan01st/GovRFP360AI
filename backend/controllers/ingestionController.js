// Controller for document ingestion and management
const documentIngestionService = require('../services/documentIngestionService');
const { initializeWeaviate } = require('../utils/weaviateClient');

exports.ingestAllDocuments = async (req, res) => {
  try {
    console.log('📂 Starting bulk document ingestion...');
    
    // Initialize Weaviate connection first
    await initializeWeaviate();
    
    const result = await documentIngestionService.ingestAllDocuments();
    
    res.json({ 
      success: true, 
      message: 'Document ingestion completed',
      stats: result
    });
  } catch (error) {
    console.error('Document ingestion controller error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

exports.ingestSingleDocument = async (req, res) => {
  try {
    const { fileName } = req.params;
    const { dataPath } = req.body;
    
    if (!fileName) {
      return res.status(400).json({ 
        success: false, 
        error: 'File name is required' 
      });
    }

    console.log('📄 Ingesting single document:', fileName);
    
    const defaultDataPath = require('path').join(__dirname, '../../../RFP_generation_langchain_agent_RAG/data');
    const result = await documentIngestionService.ingestDocument(dataPath || defaultDataPath, fileName);
    
    res.json({ 
      success: true, 
      message: `Successfully ingested ${fileName}`,
      documentId: result.id
    });
  } catch (error) {
    console.error('Single document ingestion error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

exports.clearAllDocuments = async (req, res) => {
  try {
    console.log('🗑️ Clearing all documents from vector database...');
    
    const result = await documentIngestionService.clearAllDocuments();
    
    res.json({ 
      success: true, 
      message: 'All documents cleared from vector database',
      result
    });
  } catch (error) {
    console.error('Clear documents controller error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

exports.getIngestionStatus = async (req, res) => {
  try {
    // Get current collection stats to show ingestion status
    const searchService = require('../services/searchService');
    const stats = await searchService.getCollectionStats();
    
    res.json({ 
      success: true, 
      stats,
      status: stats.totalDocuments > 0 ? 'Documents loaded' : 'No documents found'
    });
  } catch (error) {
    console.error('Ingestion status controller error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

exports.initializeDatabase = async (req, res) => {
  try {
    console.log('🚀 Initializing Weaviate database...');
    
    await initializeWeaviate();
    
    res.json({ 
      success: true, 
      message: 'Weaviate database initialized successfully'
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};
