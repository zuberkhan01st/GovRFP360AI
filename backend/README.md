# GovRFP360AI Backend

Node.js Express backend for GovRFP360AI: AI-powered RFP/RFI generation, compliance validation, and document search for government and private sector tenders.

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
