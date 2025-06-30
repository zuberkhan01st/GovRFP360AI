from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import fitz  # PyMuPDF
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set the full path to the default template
TEMPLATE_PATH = "./templates/default_rfp_template.pdf"
template_text = ""  # Will be filled on startup


def extract_text_from_pdf_bytes(file_bytes: bytes) -> str:
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    text = "\n".join(page.get_text() for page in doc)
    doc.close()
    return text


def compute_similarity(text1: str, text2: str) -> float:
    vectorizer = TfidfVectorizer()
    tfidf = vectorizer.fit_transform([text1, text2])
    similarity = cosine_similarity(tfidf[0:1], tfidf[1:2])
    return round(similarity[0][0] * 100, 2)  # Return as percentage


@app.on_event("startup")
def load_template_text():
    global template_text
    if os.path.exists(TEMPLATE_PATH):
        with open(TEMPLATE_PATH, "rb") as f:
            template_text = extract_text_from_pdf_bytes(f.read())
    else:
        raise FileNotFoundError(f"Template PDF not found at: {TEMPLATE_PATH}")


@app.post("/analyze")
async def analyze_similarity(rfp: UploadFile = File(...)):
    try:
        rfp_text = extract_text_from_pdf_bytes(await rfp.read())
        score = compute_similarity(rfp_text, template_text)
        return {
            "similarity_score": score,
            "message": "Similarity analysis with default template successful."
        }
    except Exception as e:
        return {"error": str(e)}
