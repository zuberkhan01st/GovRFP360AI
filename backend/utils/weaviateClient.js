// Utility to create a Weaviate client for semantic search
const weaviate = require('weaviate-client');
require('dotenv').config();

let client = null;

// Initialize client only if credentials are available
function initializeClient() {
  try {
    // Check for standard Weaviate environment variables first
    const weaviateURL = process.env.WEAVIATE_URL || process.env.VECTOR_DB_ENVIRONMENT;
    const weaviateApiKey = process.env.WEAVIATE_API_KEY || process.env.VECTOR_DB_API_KEY;
    
    if (!weaviateURL || !weaviateApiKey) {
      console.warn('⚠️  WEAVIATE_URL and WEAVIATE_API_KEY not configured - running in fallback mode');
      return null;
    }

    // Extract just the host from the URL if it includes https://
    let host = weaviateURL;
    if (host.startsWith('https://')) {
      host = host.replace('https://', '');
    }
    if (host.startsWith('http://')) {
      host = host.replace('http://', '');
    }
    
    console.log(`🔗 Connecting to Weaviate cluster: ${host}`);
    
    // Wrap client creation in try-catch to handle immediate errors
    try {
      const weaviateClient = weaviate.connectToWeaviateCloud(
        host,
        {
          authCredentials: new weaviate.ApiKey(weaviateApiKey),
          additionalHeaders: {
            'X-Cohere-Api-Key': process.env.COHERE_API_KEY || '',
            'X-OpenAI-Api-Key': process.env.OPENAI_API_KEY || '',
          }
        }
      );
      
      console.log('🔗 Weaviate client configured successfully');
      return weaviateClient;
    } catch (clientError) {
      console.warn('⚠️  Weaviate client creation failed:', clientError.message);
      return null;
    }
  } catch (error) {
    console.warn('⚠️  Weaviate client initialization failed:', error.message);
    return null;
  }
}

// Test connection and create schema if needed
async function initializeWeaviate() {
  try {
    // Initialize client if not already done
    if (!client) {
      client = initializeClient();
    }
    
    if (!client) {
      console.warn('⚠️  Weaviate client not available - system will run with limited functionality');
      return null;
    }

    // Test the connection in a safer way with proper error handling
    console.log('🧪 Testing Weaviate connection...');
    
    // Use a timeout to prevent hanging and catch authentication errors
    const connectionTest = new Promise(async (resolve, reject) => {
      try {
        // Test with a simple collections list instead of liveChecker
        const collections = await client.collections.listAll();
        resolve(collections);
      } catch (error) {
        // Handle authentication and other errors gracefully
        if (error.message.includes('Unauthenticated') || error.message.includes('apikey auth is not configured')) {
          reject(new Error('Weaviate cluster does not support API key authentication. Please check your cluster configuration.'));
        } else {
          reject(error);
        }
      }
    });
    
    const timeout = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection timeout')), 10000);
    });
    
    await Promise.race([connectionTest, timeout]);
    
    console.log('✅ Connected to Weaviate successfully!');
    
    // Create schema for RFP documents if it doesn't exist
    await createRFPSchema();
    
    return client;
  } catch (error) {
    console.error('❌ Failed to connect to Weaviate:', error.message);
    console.error('💡 The system will continue with limited functionality (no vector search)');
    console.error('💡 To enable full functionality:');
    console.error('   1. Verify your Weaviate cluster supports API key authentication');
    console.error('   2. Check WEAVIATE_API_KEY and WEAVIATE_URL in your .env file');
    console.error('   3. Ensure your Weaviate cluster is running and accessible');
    console.error('   4. Consider using a different authentication method if available');
    
    // Set client to null to use fallback mode
    client = null;
    return null;
  }
}

// Create schema for RFP documents
async function createRFPSchema() {
  try {
    if (!client) {
      return;
    }

    // Check if collection already exists
    const collection = client.collections.get('RFPDocument');
    const exists = await collection.exists();
    
    if (exists) {
      console.log('📄 RFPDocument collection already exists');
      return;
    }

    // Create collection with the new API
    await client.collections.create({
      name: 'RFPDocument',
      description: 'RFP/RFI documents and their content',
      properties: [
        {
          name: 'title',
          dataType: weaviate.dataType.TEXT,
          description: 'The title of the RFP document'
        },
        {
          name: 'content',
          dataType: weaviate.dataType.TEXT,
          description: 'The main content of the RFP document'
        },
        {
          name: 'industry',
          dataType: weaviate.dataType.TEXT,
          description: 'Industry category'
        },
        {
          name: 'projectType',
          dataType: weaviate.dataType.TEXT,
          description: 'Type of project'
        },
        {
          name: 'disciplines',
          dataType: weaviate.dataType.TEXT_ARRAY,
          description: 'Engineering disciplines involved'
        },
        {
          name: 'regulations',
          dataType: weaviate.dataType.TEXT_ARRAY,
          description: 'Applicable regulations and standards'
        },
        {
          name: 'location',
          dataType: weaviate.dataType.TEXT,
          description: 'Project location'
        },
        {
          name: 'budget',
          dataType: weaviate.dataType.TEXT,
          description: 'Project budget information'
        },
        {
          name: 'timeline',
          dataType: weaviate.dataType.TEXT,
          description: 'Project timeline and milestones'
        },
        {
          name: 'documentType',
          dataType: weaviate.dataType.TEXT,
          description: 'Type of document (RFP, RFI, etc.)'
        },
        {
          name: 'fileName',
          dataType: weaviate.dataType.TEXT,
          description: 'Original file name'
        },
        {
          name: 'createdAt',
          dataType: weaviate.dataType.DATE,
          description: 'Document creation timestamp'
        }
      ],
      vectorizers: weaviate.vectorizer.text2VecCohere({
        model: 'embed-english-v2.0'
      })
    });

    console.log('✅ Created RFPDocument collection successfully!');
  } catch (error) {
    console.error('❌ Failed to create collection:', error.message);
    // Don't throw here, just log the error
  }
}

// Get client (may be null if not available)
function getClient() {
  return client;
}

module.exports = { 
  client: getClient(), 
  initializeWeaviate,
  getClient
};
