// Utility to create a Weaviate client for semantic search
const weaviate = require('weaviate-client');
require('dotenv').config();

const client = weaviate.client({
  scheme: 'https',
  host: process.env.VECTOR_DB_ENVIRONMENT, // e.g. <instance-id>.weaviate.network
  apiKey: process.env.VECTOR_DB_API_KEY
});

module.exports = client;
