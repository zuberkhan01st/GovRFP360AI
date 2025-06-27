# GovRFP360AI Backend

🚀 **AI-powered RFP/RFI generation and compliance system for government and private sector procurement.**

## 🌟 Features

- **AI-Powered RFP Generation**: Generate comprehensive RFPs using advanced LLMs (Gemini, OpenAI, Groq)
- **Vector Database Integration**: Semantic search and retrieval-augmented generation (RAG) with Weaviate
- **Document Ingestion**: Automated ingestion of existing RFP documents for reference
- **Industry-Specific Templates**: Specialized templates for Manufacturing, Oil & Gas, Chemical Processing
- **Compliance Checking**: Built-in compliance validation for industry standards
- **RESTful API**: Complete API for frontend integration

## 🏗️ Architecture

```
Backend Services:
├── 🤖 AI/LLM Services (Gemini, OpenAI, Groq)
├── 🗃️ Vector Database (Weaviate)
├── 📚 Document Processing (PDF, Word)
├── 🔍 Semantic Search & RAG
├── 📋 RFP/RFI Generation
└── ✅ Compliance Validation
```

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Weaviate Cloud account (free tier available)
- AI API keys (Gemini, OpenAI, or Groq)

### Installation

1. **Clone and install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your API keys
   # At minimum, you need:
   # - VECTOR_DB_API_KEY (Weaviate)
   # - VECTOR_DB_ENVIRONMENT (Weaviate cluster URL)
   # - GEMINI_API_KEY (Google AI Studio)
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Run setup (automated)**
   ```bash
   npm run setup
   ```

The setup script will:
- ✅ Initialize the Weaviate database
- 📚 Ingest sample RFP documents  
- 🧪 Test all system components
- 📊 Provide status report

## 🔧 Configuration

### Environment Variables

```bash
# Server
PORT=5000
NODE_ENV=development

# Weaviate Vector Database
VECTOR_DB_API_KEY=your_weaviate_api_key
VECTOR_DB_ENVIRONMENT=your_cluster_url.weaviate.network

# AI Services (choose one or more)
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key  
GROQ_API_KEY=your_groq_api_key
LLM_PROVIDER=gemini  # Default provider

# Optional
COHERE_API_KEY=your_cohere_key  # For embeddings
```

### Getting API Keys

1. **Weaviate** (Vector Database)
   - Go to [Weaviate Cloud](https://weaviate.io/developers/weaviate/quickstart)
   - Create free cluster
   - Get API key and cluster URL

2. **Google Gemini** (Recommended AI Provider)
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create API key (free tier available)

3. **Alternative AI Providers**
   - [OpenAI](https://platform.openai.com/api-keys)
   - [Groq](https://console.groq.com/keys) (Fast inference)

## 📡 API Endpoints

### RFP Generation
```bash
# Generate RFP
POST /api/rfp/generate
{
  "projectName": "Manufacturing Facility Upgrade",
  "industry": "Manufacturing", 
  "projectType": "Facility Upgrade",
  "projectDescription": "Modernize production line...",
  "disciplines": ["Mechanical Engineering", "Electrical"],
  "budget": "$1-5M",
  "timeline": "12 months"
}

# Generate RFI  
POST /api/rfp/generate-rfi
# (Same payload as RFP)

# Generate from template
POST /api/rfp/generate-from-template/:templateId
```

### Document Search
```bash
# Semantic search
POST /api/search
{
  "query": "facility upgrade manufacturing",
  "filters": { "industry": "Manufacturing" },
  "limit": 10
}

# Search by industry
GET /api/search/industry/Manufacturing

# Get similar documents
GET /api/search/similar/:documentId

# Get specific document
GET /api/search/document/:documentId
```

### System Management
```bash
# Initialize database
POST /api/ingestion/init

# Ingest all documents
POST /api/ingestion/ingest-all

# Check system status
GET /api/ingestion/status

# Health check
GET /api/status
```

## 📊 Sample Request/Response

### RFP Generation Request
```json
{
  "projectName": "Chemical Plant Modernization",
  "industry": "Chemical Processing", 
  "projectType": "Modernization",
  "projectDescription": "Upgrade chemical processing equipment to increase efficiency and meet new environmental standards",
  "location": "Houston, TX",
  "budget": "$5-10M",
  "timeline": "18 months",
  "disciplines": [
    "Process Engineering",
    "Environmental Engineering", 
    "Instrumentation & Controls"
  ],
  "requirements": [
    "Increase production capacity by 25%",
    "Meet EPA emission standards",
    "Implement advanced process control"
  ]
}
```

### RFP Generation Response
```json
{
  "success": true,
  "rfpText": "# Request for Proposal\n## Chemical Plant Modernization\n...",
  "relevantDocuments": [
    {
      "title": "Similar Chemical Processing RFP",
      "fileName": "rfp_006_chem_modernization.pdf",
      "relevanceScore": 0.89
    }
  ],
  "metadata": {
    "industry": "Chemical Processing",
    "projectType": "Modernization", 
    "generatedAt": "2025-06-27T07:30:00.000Z",
    "wordCount": 2847
  }
}
```

## 🔍 Document Collection

The system includes 25+ sample RFP documents across industries:

- **Manufacturing**: Facility upgrades, automation retrofits
- **Oil & Gas**: Plant expansions, drilling operations, refinery projects  
- **Chemical Processing**: Modernization, safety compliance, capacity enhancement

Documents are automatically processed and vectorized for semantic search and RAG.

## 🧪 Testing

```bash
# Test all endpoints
npm run setup

# Manual testing
curl -X POST http://localhost:5000/api/rfp/generate \
  -H "Content-Type: application/json" \
  -d '{"projectName":"Test Project","industry":"Manufacturing"}'
```

## 🛠️ Development

```bash
# Development with auto-reload
npm run dev

# Check logs for debugging
# Server logs include emoji indicators:
# 🚀 Startup events
# ✅ Success operations  
# ❌ Errors
# ⚠️ Warnings
# 🔍 Search operations
# 🤖 AI generation
```

## 📁 Project Structure

```
backend/
├── controllers/          # Request handlers
│   ├── rfpController.js     # RFP generation
│   ├── searchController.js  # Document search  
│   └── ingestionController.js
├── services/             # Business logic
│   ├── rfpService.js        # Main RFP service
│   ├── searchService.js     # Vector search
│   ├── llmGeminiService.js  # AI integration
│   └── documentIngestionService.js
├── routes/               # API routes
├── utils/                # Utilities
│   ├── weaviateClient.js    # Vector DB client
│   └── promptBuilder.js     # AI prompt generation
├── server.js             # Main server
├── setup.js              # Automated setup
└── .env.example          # Environment template
```

## 🚨 Troubleshooting

### Common Issues

1. **"Weaviate connection failed"**
   - Verify `VECTOR_DB_API_KEY` and `VECTOR_DB_ENVIRONMENT` in .env
   - Check Weaviate cluster status

2. **"Gemini API not configured"**  
   - Add `GEMINI_API_KEY` to .env file
   - Verify API key is valid

3. **"No documents found"**
   - Run `POST /api/ingestion/ingest-all` to load documents
   - Check that RFP documents exist in `../RFP_generation_langchain_agent_RAG/data/`

4. **"Document ingestion failed"**
   - Ensure PDF files are readable
   - Check file permissions in data directory

### Debug Mode
```bash
NODE_ENV=development npm start
# Enables detailed logging
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)  
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini for AI generation
- Weaviate for vector database
- LangChain community for RAG patterns
- Open source RFP document contributors

---

**🎯 Ready to generate professional RFPs with AI? Start with `npm run setup`!**

## Features
- Generate RFP/RFI text from structured user input (compliant with Indian tender norms)
- Validate uploaded documents for compliance (checklist-based, extendable to LLM)
- Semantic search of existing documents (vector DB integration planned)
- MVC structure, ready for Next.js frontend

## Setup
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and fill in required values
4. `npm run dev` (for development)

## API Routes
- `POST /api/rfp/generate` — Generate RFP/RFI text
- `POST /api/compliance/validate` — Validate document for compliance
- `POST /api/search` — Search documents

## To Do
- Integrate LLM for smarter generation/validation
- Connect to free vector DB (Pinecone/Weaviate Cloud)
- Add PDF generation (currently returns text)
- Add authentication, logging, etc.

---
References: GeM, CPPP, CVC, Indian tender portals
