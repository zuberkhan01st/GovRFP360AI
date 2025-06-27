const { getClient } = require('../utils/weaviateClient');

// Service for document search using Weaviate vector database
class SearchService {
  constructor() {
    this.collectionName = 'RFPDocument';
  }

  getClient() {
    return getClient();
  }

  // Main search function that performs semantic search
  async search(query, filters = {}, limit = 10) {
    try {
      console.log(`🔍 Searching for: "${query}" with filters:`, filters);
      
      const client = this.getClient();
      if (!client) {
        console.log('📋 Using mock search results (Weaviate not available)');
        return this.getMockResults(query, filters, limit);
      }

      const collection = this.client.collections.get(this.collectionName);
      
      // Build search query
      let searchQuery = collection.query.nearText(query, {
        limit: limit,
        returnMetadata: ['certainty', 'distance']
      });

      // Apply filters if provided
      const whereConditions = [];
      
      if (filters.industry) {
        whereConditions.push({
          path: 'industry',
          operator: 'Equal',
          valueText: filters.industry
        });
      }

      if (filters.projectType) {
        whereConditions.push({
          path: 'projectType',
          operator: 'Equal',
          valueText: filters.projectType
        });
      }

      if (filters.documentType) {
        whereConditions.push({
          path: 'documentType',
          operator: 'Equal',
          valueText: filters.documentType
        });
      }

      if (whereConditions.length > 0) {
        searchQuery = searchQuery.where(whereConditions.length === 1 
          ? whereConditions[0] 
          : { operator: 'And', operands: whereConditions }
        );
      }

      const result = await searchQuery;
      const documents = result.objects || [];
      
      // Format results for frontend
      const formattedResults = documents.map(doc => ({
        id: doc.properties.fileName,
        title: doc.properties.title,
        snippet: this.createSnippet(doc.properties.content, query),
        industry: doc.properties.industry,
        projectType: doc.properties.projectType,
        location: doc.properties.location,
        budget: doc.properties.budget,
        timeline: doc.properties.timeline,
        disciplines: doc.properties.disciplines,
        regulations: doc.properties.regulations,
        documentType: doc.properties.documentType,
        fileName: doc.properties.fileName,
        relevanceScore: doc.metadata?.certainty || 0,
        fullContent: doc.properties.content
      }));

      console.log(`✅ Found ${formattedResults.length} relevant documents`);
      return formattedResults;
    } catch (error) {
      console.error('❌ Search error:', error);
      
      // Return mock results if Weaviate is not available
      if (error.message.includes('not available')) {
        return this.getMockResults(query, filters, limit);
      }
      
      throw new Error(`Search failed: ${error.message}`);
    }
  }

  // Create a snippet from content highlighting the query terms
  createSnippet(content, query, maxLength = 300) {
    if (!content) return 'No content available';
    
    const queryWords = query.toLowerCase().split(' ').filter(word => word.length > 2);
    let bestSnippet = content.substring(0, maxLength);
    
    // Try to find the best snippet containing query terms
    for (const word of queryWords) {
      const index = content.toLowerCase().indexOf(word);
      if (index !== -1) {
        const start = Math.max(0, index - 100);
        const end = Math.min(content.length, index + 200);
        bestSnippet = content.substring(start, end);
        break;
      }
    }
    
    // Add ellipsis if truncated
    if (bestSnippet.length === maxLength && content.length > maxLength) {
      bestSnippet += '...';
    }
    
    return bestSnippet.trim();
  }

  // Search by industry
  async searchByIndustry(industry, limit = 10) {
    try {
      const client = this.getClient();
      if (!client) {
        return this.getMockResults(`${industry} projects`, { industry }, limit);
      }

      const collection = client.collections.get(this.collectionName);
      
      const result = await collection.query.fetchObjects({
        where: {
          path: 'industry',
          operator: 'Equal',
          valueText: industry
        },
        limit: limit
      });

      return this.formatSearchResults(result.objects || []);
    } catch (error) {
      console.error('❌ Industry search error:', error);
      return this.getMockResults(`${industry} projects`, { industry }, limit);
    }
  }

  // Get similar documents based on another document
  async findSimilarDocuments(documentId, limit = 5) {
    try {
      // First get the document content
      const sourceDoc = await this.getDocumentById(documentId);
      if (!sourceDoc) {
        throw new Error('Source document not found');
      }

      // Search for similar documents using the source document's content
      const similarDocs = await this.search(
        sourceDoc.content.substring(0, 500), // Use first 500 chars as query
        { industry: sourceDoc.industry }, // Filter by same industry
        limit + 1 // Get one extra to exclude the source doc
      );

      // Remove the source document from results
      return similarDocs.filter(doc => doc.fileName !== documentId);
    } catch (error) {
      console.error('❌ Similar documents search error:', error);
      return this.getMockResults('similar documents', {}, limit);
    }
  }

  // Get a specific document by ID/filename
  async getDocumentById(documentId) {
    try {
      const client = this.getClient();
      if (!client) {
        return this.getMockDocument(documentId);
      }

      const collection = client.collections.get(this.collectionName);
      
      const result = await collection.query.fetchObjects({
        where: {
          path: 'fileName',
          operator: 'Equal',
          valueText: documentId
        },
        limit: 1
      });

      const documents = result.objects || [];
      return documents.length > 0 ? this.formatSingleDocument(documents[0]) : null;
    } catch (error) {
      console.error('❌ Get document error:', error);
      return this.getMockDocument(documentId);
    }
  }

  // Get search suggestions based on partial query
  async getSearchSuggestions(partialQuery, limit = 5) {
    try {
      // Search for documents and extract unique terms
      const results = await this.search(partialQuery, {}, limit);
      
      const suggestions = new Set();
      results.forEach(doc => {
        // Extract key terms from titles and project types
        if (doc.title) {
          doc.title.split(' ').forEach(word => {
            if (word.length > 3 && word.toLowerCase().includes(partialQuery.toLowerCase())) {
              suggestions.add(word);
            }
          });
        }
        
        if (doc.projectType) {
          suggestions.add(doc.projectType);
        }
        
        if (doc.industry) {
          suggestions.add(doc.industry);
        }
      });

      return Array.from(suggestions).slice(0, limit);
    } catch (error) {
      console.error('❌ Suggestions error:', error);
      return ['Manufacturing', 'Oil & Gas', 'Chemical Processing', 'Facility Upgrade', 'Modernization'];
    }
  }

  // Get analytics/stats about the document collection
  async getCollectionStats() {
    try {
      const client = this.getClient();
      if (!client) {
        return {
          totalDocuments: 25,
          industries: [
            { name: 'Manufacturing', count: 8 },
            { name: 'Oil & Gas', count: 10 },
            { name: 'Chemical Processing', count: 7 }
          ]
        };
      }

      const collection = this.client.collections.get(this.collectionName);
      
      // Get total count
      const totalResult = await collection.aggregate.overAll();
      const totalCount = totalResult.totalCount || 0;

      // Get industry breakdown
      const industryResult = await collection.aggregate.groupBy('industry');
      const industries = (industryResult.groups || []).map(group => ({
        name: group.groupedBy.value,
        count: group.totalCount
      }));

      return {
        totalDocuments: totalCount,
        industries: industries
      };
    } catch (error) {
      console.error('❌ Stats error:', error);
      return {
        totalDocuments: 0,
        industries: []
      };
    }
  }

  // Helper methods for formatting and mock data
  formatSearchResults(objects) {
    return objects.map(obj => this.formatSingleDocument(obj));
  }

  formatSingleDocument(obj) {
    return {
      title: obj.properties.title,
      content: obj.properties.content,
      industry: obj.properties.industry,
      projectType: obj.properties.projectType,
      disciplines: obj.properties.disciplines,
      regulations: obj.properties.regulations,
      location: obj.properties.location,
      budget: obj.properties.budget,
      timeline: obj.properties.timeline,
      documentType: obj.properties.documentType,
      fileName: obj.properties.fileName
    };
  }

  getMockResults(query, filters, limit) {
    console.log('🔄 Using mock search results (Weaviate not available)');
    
    const mockDocs = [
      {
        id: 'rfp_001_manufacturing_upgrade.pdf',
        title: 'Manufacturing Facility Upgrade RFP',
        snippet: 'This RFP seeks proposals for upgrading manufacturing equipment...',
        industry: 'Manufacturing',
        projectType: 'Facility Upgrade',
        location: 'Detroit, MI',
        budget: '$2-5M',
        timeline: '12 months',
        disciplines: ['Mechanical Engineering', 'Electrical Engineering'],
        regulations: ['OSHA', 'ISO 9001'],
        documentType: 'RFP',
        fileName: 'rfp_001_manufacturing_upgrade.pdf',
        relevanceScore: 0.85
      },
      {
        id: 'rfp_002_chemical_modernization.pdf',
        title: 'Chemical Plant Modernization',
        snippet: 'Modernization of chemical processing equipment to meet new standards...',
        industry: 'Chemical Processing',
        projectType: 'Modernization',
        location: 'Houston, TX',
        budget: '$5-10M',
        timeline: '18 months',
        disciplines: ['Process Engineering', 'Environmental Engineering'],
        regulations: ['EPA', 'NFPA'],
        documentType: 'RFP',
        fileName: 'rfp_002_chemical_modernization.pdf',
        relevanceScore: 0.78
      }
    ];

    // Filter mock results based on filters
    let filteredResults = mockDocs;
    if (filters.industry) {
      filteredResults = filteredResults.filter(doc => doc.industry === filters.industry);
    }
    if (filters.projectType) {
      filteredResults = filteredResults.filter(doc => doc.projectType === filters.projectType);
    }

    return filteredResults.slice(0, limit);
  }

  getMockDocument(documentId) {
    return {
      title: 'Sample RFP Document',
      content: 'This is a sample RFP document for testing purposes...',
      industry: 'Manufacturing',
      projectType: 'Facility Upgrade',
      disciplines: ['Mechanical Engineering'],
      regulations: ['OSHA'],
      location: 'Sample Location',
      budget: 'TBD',
      timeline: 'TBD',
      documentType: 'RFP',
      fileName: documentId
    };
  }
}

// Export singleton instance
module.exports = new SearchService();
