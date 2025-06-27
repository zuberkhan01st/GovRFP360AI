#!/usr/bin/env node
/**
 * GovRFP360AI Setup Script
 * This script helps set up the entire system including:
 * - Environment configuration
 * - Database initialization
 * - Document ingestion
 * - System testing
 */

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

class SetupManager {
  constructor() {
    this.baseUrl = 'http://localhost:5000';
    this.apiEndpoints = {
      status: '/api/status',
      initDb: '/api/ingestion/init',
      ingestAll: '/api/ingestion/ingest-all',
      ingestionStatus: '/api/ingestion/status',
      searchTest: '/api/search',
      rfpTest: '/api/rfp/generate'
    };
  }

  async run() {
    console.log('🚀 GovRFP360AI Setup Manager Starting...\n');
    
    try {
      // Step 1: Check environment configuration
      await this.checkEnvironmentConfig();
      
      // Step 2: Wait for server to be ready
      await this.waitForServer();
      
      // Step 3: Initialize database
      await this.initializeDatabase();
      
      // Step 4: Ingest documents
      await this.ingestDocuments();
      
      // Step 5: Test the system
      await this.testSystem();
      
      console.log('\n🎉 Setup completed successfully!');
      console.log('\n📖 Next steps:');
      console.log('1. Your GovRFP360AI backend is running at: http://localhost:5000');
      console.log('2. Test the API endpoints:');
      console.log('   - Health check: GET http://localhost:5000');
      console.log('   - Search: POST http://localhost:5000/api/search');
      console.log('   - Generate RFP: POST http://localhost:5000/api/rfp/generate');
      console.log('3. Update your .env file with actual API keys for full functionality');
      
    } catch (error) {
      console.error('❌ Setup failed:', error.message);
      process.exit(1);
    }
  }

  async checkEnvironmentConfig() {
    console.log('📋 Checking environment configuration...');
    
    const envPath = path.join(__dirname, '.env');
    
    try {
      const envContent = await fs.readFile(envPath, 'utf8');
      
      const requiredVars = ['VECTOR_DB_API_KEY', 'VECTOR_DB_ENVIRONMENT'];
      const missingVars = [];
      
      for (const varName of requiredVars) {
        if (!envContent.includes(`${varName}=`) || envContent.includes(`${varName}=your_`)) {
          missingVars.push(varName);
        }
      }
      
      if (missingVars.length > 0) {
        console.log('⚠️  Missing or incomplete environment variables:');
        missingVars.forEach(varName => console.log(`   - ${varName}`));
        console.log('\n💡 Please update your .env file with proper values');
        console.log('   The system will use fallback responses where possible\n');
      } else {
        console.log('✅ Environment configuration looks good');
      }
      
    } catch (error) {
      console.log('⚠️  .env file not found, using environment defaults');
    }
  }

  async waitForServer(maxAttempts = 30) {
    console.log('⏳ Waiting for server to be ready...');
    
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const response = await axios.get(`${this.baseUrl}${this.apiEndpoints.status}`, {
          timeout: 2000
        });
        
        if (response.status === 200) {
          console.log('✅ Server is ready');
          return;
        }
      } catch (error) {
        // Server not ready yet, wait and retry
        await this.sleep(2000);
        process.stdout.write('.');
      }
    }
    
    throw new Error('Server did not start within expected time');
  }

  async initializeDatabase() {
    console.log('🗃️  Initializing Weaviate database...');
    
    try {
      const response = await axios.post(`${this.baseUrl}${this.apiEndpoints.initDb}`, {}, {
        timeout: 30000
      });
      
      if (response.data.success) {
        console.log('✅ Database initialized successfully');
      } else {
        console.log('⚠️  Database initialization had issues:', response.data.error);
      }
    } catch (error) {
      console.log('⚠️  Database initialization failed:', error.message);
      console.log('   The system will continue with limited functionality');
    }
  }

  async ingestDocuments() {
    console.log('📚 Ingesting RFP documents...');
    
    try {
      // Check current status first
      const statusResponse = await axios.get(`${this.baseUrl}${this.apiEndpoints.ingestionStatus}`);
      
      if (statusResponse.data.stats.totalDocuments > 0) {
        console.log(`✅ Found ${statusResponse.data.stats.totalDocuments} documents already loaded`);
        return;
      }
      
      // Ingest documents
      const response = await axios.post(`${this.baseUrl}${this.apiEndpoints.ingestAll}`, {}, {
        timeout: 120000 // 2 minutes timeout for ingestion
      });
      
      if (response.data.success) {
        console.log(`✅ Successfully ingested ${response.data.stats.success} documents`);
        if (response.data.stats.failed > 0) {
          console.log(`⚠️  ${response.data.stats.failed} documents failed to ingest`);
        }
      } else {
        console.log('⚠️  Document ingestion failed:', response.data.error);
      }
    } catch (error) {
      console.log('⚠️  Document ingestion failed:', error.message);
      console.log('   You can try manual ingestion later via /api/ingestion/ingest-all');
    }
  }

  async testSystem() {
    console.log('🧪 Testing system functionality...');
    
    // Test 1: Search functionality
    try {
      const searchResponse = await axios.post(`${this.baseUrl}${this.apiEndpoints.searchTest}`, {
        query: 'facility upgrade'
      });
      
      if (searchResponse.data.success) {
        console.log(`✅ Search test passed - found ${searchResponse.data.results.length} results`);
      } else {
        console.log('⚠️  Search test failed');
      }
    } catch (error) {
      console.log('⚠️  Search test failed:', error.message);
    }
    
    // Test 2: RFP generation functionality
    try {
      const rfpResponse = await axios.post(`${this.baseUrl}${this.apiEndpoints.rfpTest}`, {
        projectName: 'Test Project',
        projectDescription: 'This is a test project for system validation',
        industry: 'Manufacturing',
        projectType: 'Facility Upgrade'
      });
      
      if (rfpResponse.data.success) {
        console.log('✅ RFP generation test passed');
      } else {
        console.log('⚠️  RFP generation test failed');
      }
    } catch (error) {
      console.log('⚠️  RFP generation test failed:', error.message);
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Run setup if this script is executed directly
if (require.main === module) {
  const setupManager = new SetupManager();
  setupManager.run();
}

module.exports = SetupManager;
