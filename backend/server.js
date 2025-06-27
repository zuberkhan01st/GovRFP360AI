require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Global error handlers to prevent crashes
process.on('uncaughtException', (error) => {
  console.error('🚨 Uncaught Exception:', error.message);
  if (error.message.includes('Weaviate')) {
    console.warn('⚠️  Weaviate error ignored to prevent server crash');
  } else {
    console.error('💥 Server may be unstable, consider restarting');
  }
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
  if (reason && reason.message && reason.message.includes('Weaviate')) {
    console.warn('⚠️  Weaviate promise rejection ignored to prevent server crash');
  }
});

const rfpRoutes = require('./routes/rfpRoutes');
const complianceRoutes = require('./routes/complianceRoutes');
const searchRoutes = require('./routes/searchRoutes');
const ingestionRoutes = require('./routes/ingestionRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/rfp', rfpRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/ingestion', ingestionRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'GovRFP360AI Backend is running',
    version: '1.0.0',
    endpoints: {
      rfp: '/api/rfp',
      search: '/api/search',
      compliance: '/api/compliance',
      ingestion: '/api/ingestion'
    },
    status: 'healthy'
  });
});

// API status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

const PORT = process.env.PORT || 5000;

// Initialize server
const server = app.listen(PORT, async () => {
  console.log('🚀 GovRFP360AI Backend Server Starting...');
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/status`);
  
  // Initialize Weaviate connection on startup
  try {
    const { initializeWeaviate } = require('./utils/weaviateClient');
    console.log('🔍 Attempting to initialize Weaviate connection...');
    
    // Set a timeout for Weaviate initialization to prevent hanging
    const weaviateInit = new Promise(async (resolve, reject) => {
      try {
        const result = await initializeWeaviate();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
    
    const timeout = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Weaviate initialization timeout')), 15000);
    });
    
    await Promise.race([weaviateInit, timeout]);
    console.log('✅ Weaviate connection initialized successfully');
  } catch (error) {
    console.warn('⚠️  Weaviate initialization failed:', error.message);
    console.warn('💡 Server will continue with limited functionality (no vector search)');
    console.warn('💡 To enable Weaviate:');
    console.warn('   - Check your WEAVIATE_URL and WEAVIATE_API_KEY in .env');
    console.warn('   - Ensure your Weaviate cluster supports API key authentication');
    console.warn('   - Verify your cluster is accessible from this network');
  }
  
  console.log('🎉 Server startup complete!');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});
