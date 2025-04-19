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
import math
from dotenv import load_dotenv
import requests



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

"""
tokenizer = AutoTokenizer.from_pretrained("google/flan-t5-small")
model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-small")
nltk.download('punkt_tab')
from nltk.tokenize import sent_tokenize
"""

kw_model = KeyBERT('all-MiniLM-L6-v2')

from dotenv import load_dotenv

BECKETT_API_KEY = os.getenv('GEMINI_API_KEY')
beckett_url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

def simplify_text(text):
    headers = {
        'Content-Type': 'application/json'
    }

    data = {
        "contents": [{
            "parts": [{
                "text": f"Extract the most important words or phrases from the paragraph below. Return them as comma-separated values with no extra spaces. Keep multi-word phrases together:\n\n{text}"

            }]
        }]
    }

    # Send the POST request
    response = requests.post(f'{beckett_url}?key={BECKETT_API_KEY}', headers=headers, json=data)
    # Check the response
    if response.status_code == 200:
        result = response.json()
        simplified_paragraph = result['candidates'][0]['content']['parts'][0]['text']

        return(simplified_paragraph)  # This will print the response from the Gemini API
    else:
        return(f"Error: {response.status_code}, {response.text}")

def highlight_text(text):
    headers = {
        'Content-Type': 'application/json'
    }
    data = {
        "contents": [{
            "parts": [{"text": f"Find the most important words in this paragraph and return them as comma separated values, no spaces in between:\n\n{text}"}]
        }]
    }

    # Send the POST request
    response = requests.post(f'{beckett_url}?key={BECKETT_API_KEY}', headers=headers, json=data)
    # Check the response
    if response.status_code == 200:
        result = response.json()
        important_words = result['candidates'][0]['content']['parts'][0]['text']

        return(important_words)  # This will print the response from the Gemini API
    else:
        return(f"Error: {response.status_code}, {response.text}")

def generate_quiz(text):
    pass


@app.route("/process-pdf", methods=["POST"])
def process_pdf():
    file = request.files["pdf_file"]
    doc = fitz.open(stream=file.read(), filetype="pdf")

    text = ""
    for page in doc:
        text += page.get_text()

    text_simplified = simplify_text(text)
    highlighted_text = highlight_text(text_simplified)
    quizzes = generate_quiz(text_simplified)


if __name__ == '__main__':
    app.run(debug=True)