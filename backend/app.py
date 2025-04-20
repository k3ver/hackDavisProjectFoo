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

OMKAR_GEMINI_API_KEY =os.getenv('OMKAR_KEY')
genai.configure(api_key=OMKAR_GEMINI_API_KEY)

if not OMKAR_GEMINI_API_KEY:
    print("Warning: GEMINI_API_KEY not found in environment variables")

if OMKAR_GEMINI_API_KEY:
    genai.configure(api_key=OMKAR_GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel(model_name="models/gemini-1.5-pro")

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

        important_words = important_words.split(",")
        return(important_words)  # This will print the response from the Gemini API
    else:
        return(f"Error: {response.status_code}, {response.text}")

def generate_multiple_choice(text):
    headers = {
        'Content-Type': 'application/json'
    }
    data = {
        "contents": [{
            "parts": [{
                "text": (
                    f"Generate a multiple choice quiz based on the following text. "
                    f"Each question should have 4 options and indicate the correct answer. "
                    f"Return the result as a JSON list with this format:\n\n"
                    f"[{{'question': '...', 'options': ['...', '...', '...', '...'], 'answer': '...'}}, ...]\n\n"
                    f"Text:\n{text}"
                )
            }]
        }]
    }

    response = requests.post(f'{beckett_url}?key={BECKETT_API_KEY}', headers=headers, json=data)

    if response.status_code == 200:
        result = response.json()
        quiz_json = result['candidates'][0]['content']['parts'][0]['text']
        return quiz_json
    else:
        return f"Error: {response.status_code}, {response.text}"

def generate_flashcard(summary_data):
    if not OMKAR_GEMINI_API_KEY:
        return []

    try:
        # Extract fields from summary_data safely
        key_points = summary_data.get("key_points", [])
        highlight_terms = summary_data.get("highlight_terms", [])
        summary = summary_data.get("summary", "")
    except Exception as e:
        print(f"Error parsing input summary data: {str(e)}")
        return []

    # Construct context and prompt
    context = f"""
    Summary of the text:
    {summary}

    Key points from the text:
    {' '.join(key_points)}

    Important terms:
    {', '.join(highlight_terms)}
    """

    prompt = f"""
    Based on this summary and key terms from a text, create 10 flashcards that would
    help someone with ADHD remember the most important information.

    For each flashcard, provide:
    1. Front: A term, concept, or question
    2. Back: The definition, explanation, or answer

    {context}

    Format your response as a JSON array with objects containing:
    - front: term or question
    - back: definition or answer
    """

    try:
        response = gemini_model.generate_content(prompt)
        text_response = response.text
    except Exception as e:
        print(f"Error generating flashcards: {str(e)}")
        return []

    # Attempt to extract JSON array from the response
    try:
        json_match = re.search(r'```json\s*(.*?)\s*```', text_response, re.DOTALL)
        if json_match:
            json_str = json_match.group(1)
        else:
            json_match = re.search(r'\[.*\]', text_response, re.DOTALL)
            json_str = json_match.group(0) if json_match else text_response

        flashcards_data = json.loads(json_str)
        return flashcards_data
    except Exception as e:
        print(f"Error parsing flashcards response as JSON: {str(e)}")
        return []


@app.route("/process-pdf", methods=["POST"])
def process_pdf():
    print("Received PDF upload request...")  
    file = request.files["pdf_file"]
    doc = fitz.open(stream=file.read(), filetype="pdf")

    text = ""
    for page in doc:
        text += page.get_text()

    text_simplified = simplify_text(text)
    highlighted_text = highlight_text(text_simplified)
    multiple_choice = generate_multiple_choice(text_simplified)
    flashcards = generate_flashcard(text_simplified)

    # Create a dictionary to structure the response data
    response_data = {
        "simplified_text": text_simplified,
        "highlighted_text": highlighted_text,
        "multiple_choice": multiple_choice,
        "flashcards": flashcards
    }
    
    # Return the response data as a JSON response
    return jsonify(response_data)

if __name__ == '__main__':
    app.run(port=5000, debug=True)