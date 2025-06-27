// Service for ingesting documents into Weaviate
const fs = require('fs').promises;
const path = require('path');
const pdfParse = require('pdf-parse');
const { client } = require('../utils/weaviateClient');

class DocumentIngestionService {
  constructor() {
    this.client = client;
    this.collectionName = 'RFPDocument';
  }

  // Ingest all documents from the RFP_generation_langchain_agent_RAG/data directory
  async ingestAllDocuments() {
    try {
      const dataPath = path.join(__dirname, '../../../RFP_generation_langchain_agent_RAG/data');
      console.log('📂 Starting document ingestion from:', dataPath);
      
      if (!this.client) {
        console.warn('⚠️  Weaviate client not available, skipping document ingestion');
        return { success: 0, failed: 0 };
      }
      
      const files = await fs.readdir(dataPath);
      const pdfFiles = files.filter(file => file.endsWith('.pdf'));
      const metadataFiles = files.filter(file => file.endsWith('_metadata.json'));
      
      console.log(`📄 Found ${pdfFiles.length} PDF files and ${metadataFiles.length} metadata files`);
      
      let successCount = 0;
      let errorCount = 0;
      
      for (const pdfFile of pdfFiles) {
        try {
          await this.ingestDocument(dataPath, pdfFile);
          successCount++;
          console.log(`✅ Successfully ingested: ${pdfFile}`);
        } catch (error) {
          errorCount++;
          console.error(`❌ Failed to ingest ${pdfFile}:`, error.message);
        }
      }
      
      console.log(`📊 Ingestion complete: ${successCount} successful, ${errorCount} failed`);
      return { success: successCount, failed: errorCount };
    } catch (error) {
      console.error('❌ Failed to ingest documents:', error);
      throw error;
    }
  }

  // Ingest a single document
  async ingestDocument(dataPath, fileName) {
    try {
      if (!this.client) {
        throw new Error('Weaviate client not available');
      }

      const pdfPath = path.join(dataPath, fileName);
      const metadataPath = path.join(dataPath, fileName.replace('.pdf', '_metadata.json'));
      
      // Read PDF content
      const pdfBuffer = await fs.readFile(pdfPath);
      const pdfData = await pdfParse(pdfBuffer);
      const content = pdfData.text;
      
      // Read metadata if available
      let metadata = {};
      try {
        const metadataContent = await fs.readFile(metadataPath, 'utf8');
        metadata = JSON.parse(metadataContent);
      } catch (error) {
        console.log(`⚠️  No metadata found for ${fileName}, extracting from filename`);
        metadata = this.extractMetadataFromFilename(fileName);
      }
      
      // Prepare document for Weaviate
      const documentObject = {
        title: metadata.title || fileName.replace('.pdf', ''),
        content: content,
        industry: metadata.industry || this.extractIndustryFromFilename(fileName),
        projectType: metadata.projectType || this.extractProjectTypeFromFilename(fileName),
        disciplines: metadata.disciplines || [],
        regulations: metadata.regulations || [],
        location: metadata.location || 'Unknown',
        budget: metadata.budget || 'TBD',
        timeline: metadata.timeline || 'TBD',
        documentType: metadata.documentType || 'RFP',
        fileName: fileName,
        createdAt: new Date().toISOString()
      };
      
      // Add to Weaviate using new API
      const collection = this.client.collections.get(this.collectionName);
      const result = await collection.data.insert(documentObject);
      
      return result;
    } catch (error) {
      console.error(`❌ Error ingesting document ${fileName}:`, error);
      throw error;
    }
  }

  // Extract metadata from filename pattern
  extractMetadataFromFilename(fileName) {
    // Pattern: rfp_001_chem_glenn_modernization.pdf
    const parts = fileName.replace('.pdf', '').split('_');
    
    if (parts.length >= 4) {
      const industry = this.mapIndustryCode(parts[2]);
      const location = parts[3];
      const projectType = parts.slice(4).join('_').replace(/_/g, ' ');
      
      return {
        title: `${industry} ${location} ${projectType}`.replace(/_/g, ' '),
        industry: industry,
        projectType: projectType,
        location: location
      };
    }
    
    return {
      title: fileName.replace('.pdf', ''),
      industry: 'Unknown',
      projectType: 'Unknown',
      location: 'Unknown'
    };
  }

  extractIndustryFromFilename(fileName) {
    if (fileName.includes('chem')) return 'Chemical Processing';
    if (fileName.includes('oil') || fileName.includes('drill') || fileName.includes('refine')) return 'Oil & Gas';
    if (fileName.includes('tech') || fileName.includes('forge')) return 'Manufacturing';
    if (fileName.includes('synth') || fileName.includes('react')) return 'Chemical Processing';
    return 'Unknown';
  }

  extractProjectTypeFromFilename(fileName) {
    if (fileName.includes('modernization')) return 'Modernization';
    if (fileName.includes('upgrade')) return 'Facility Upgrade';
    if (fileName.includes('expansion')) return 'Plant Expansion';
    if (fileName.includes('safety') || fileName.includes('compliance')) return 'Safety Compliance';
    if (fileName.includes('decommissioning')) return 'Decommissioning';
    if (fileName.includes('retrofit')) return 'Automation Retrofit';
    return 'Unknown';
  }

  mapIndustryCode(code) {
    const mapping = {
      'chem': 'Chemical Processing',
      'oil': 'Oil & Gas',
      'gas': 'Oil & Gas', 
      'drill': 'Oil & Gas',
      'refine': 'Oil & Gas',
      'tech': 'Manufacturing',
      'forge': 'Manufacturing',
      'synth': 'Chemical Processing',
      'react': 'Chemical Processing'
    };
    
    return mapping[code] || 'Unknown';
  }

  // Search documents in Weaviate
  async searchDocuments(query, limit = 10) {
    try {
      if (!this.client) {
        return [];
      }

      const collection = this.client.collections.get(this.collectionName);
      const result = await collection.query.nearText(query, {
        limit: limit,
        returnMetadata: ['certainty']
      });
      
      return result.objects || [];
    } catch (error) {
      console.error('❌ Error searching documents:', error);
      throw error;
    }
  }

  // Get document by specific criteria
  async getDocumentsByIndustry(industry, limit = 10) {
    try {
      if (!this.client) {
        return [];
      }

      const collection = this.client.collections.get(this.collectionName);
      const result = await collection.query.fetchObjects({
        where: {
          path: 'industry',
          operator: 'Equal',
          valueText: industry
        },
        limit: limit
      });
      
      return result.objects || [];
    } catch (error) {
      console.error('❌ Error getting documents by industry:', error);
      throw error;
    }
  }

  // Get all unique industries
  async getUniqueIndustries() {
    try {
      if (!this.client) {
        return [];
      }

      const collection = this.client.collections.get(this.collectionName);
      const result = await collection.aggregate.groupBy('industry');
      
      return result.groups || [];
    } catch (error) {
      console.error('❌ Error getting unique industries:', error);
      throw error;
    }
  }

  // Delete all documents (for re-ingestion)
  async clearAllDocuments() {
    try {
      if (!this.client) {
        throw new Error('Weaviate client not available');
      }

      const collection = this.client.collections.get(this.collectionName);
      
      // Get all objects first
      const allObjects = await collection.query.fetchObjects({
        limit: 1000 // Adjust as needed
      });
      
      // Delete each object
      for (const obj of allObjects.objects) {
        await collection.data.deleteById(obj.uuid);
      }
      
      console.log('🗑️  Cleared all documents from Weaviate');
      return { deleted: allObjects.objects.length };
    } catch (error) {
      console.error('❌ Error clearing documents:', error);
      throw error;
    }
  }
}

module.exports = new DocumentIngestionService();
