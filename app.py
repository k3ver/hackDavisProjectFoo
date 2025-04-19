from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import fitz # pdf reader
from transformers import T5Tokenizer, T5ForConditionalGeneration
import nltk
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from keybert import KeyBERT
import json
import google.generativeai as genai
import re
import base64
import tempfile


#from services.pdf_parser import parse_pdf
#services.simplifier import simplify_text
#services.flashcard_generator import generate_flashcards


# Initialize Flask app
app = Flask(__name__)
CORS(app)

GEMINI_API_KEY = "AIzaSyDL0deo5LkDstEUevrH8SK5cwWZsgobpZg"

if not GEMINI_API_KEY:
    print("Warning: GEMINI_API_KEY not found in environment variables")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel('gemini-pro')


tokenizer = AutoTokenizer.from_pretrained("google/flan-t5-small")
model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-small")
nltk.download('punkt_tab')
from nltk.tokenize import sent_tokenize
kw_model = KeyBERT('all-MiniLM-L6-v2')

@app.route("/process-pdf", methods=["POST"])
def process_pdf():
    pass

def simplify_text():
    pass 

def highlight_text(text):
    pass

def generate_quiz():
    pass


if __name__ == '__main__':
    app.run(debug=True)