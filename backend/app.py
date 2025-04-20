from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import base64
import tempfile
import re
import requests
from dotenv import load_dotenv

# Firebase Admin SDK
import firebase_admin
from firebase_admin import credentials, auth, initialize_app

# Load environment variables
load_dotenv()

# environment variables or whatever claude said
ALLOWED_ORIGINS = os.environ.get('ALLOWED_ORIGINS', 'http://localhost:3000,https://mindquill.vercel.app/').split(',')

# Initialize Flask app
app = Flask(__name__)

# Apply CORS to all routes with a simpler configuration
CORS(app, resources={r"/*": {"origins": "*"}})

# Add CORS headers to all responses manually
@app.after_request
def add_cors_headers(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
    return response

# Add explicit OPTIONS handler
@app.route('/process-pdf', methods=['OPTIONS'])
def options_process_pdf():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "POST,OPTIONS")
    return response

# Firebase setup from env var
firebase_json = os.environ.get("FIREBASE_CREDENTIALS_JSON")
cred_dict = json.loads(firebase_json)
cred = credentials.Certificate(cred_dict)
initialize_app(cred)

# Gemini API Keys
OMKAR_GEMINI_API_KEY = os.getenv('OMKAR_KEY')
BECKETT_API_KEY = os.getenv('GEMINI_API_KEY')
beckett_url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

# Utils
def simplify_text(text):
    headers = {'Content-Type': 'application/json'}
    data = {
        "contents": [{
            "parts": [{
                "text": f"Rewrite the following paragraph in terms readable for people with dyslexia, keeping the length similar:\n\n{text}"
            }]
        }]
    }
    response = requests.post(f'{beckett_url}?key={BECKETT_API_KEY}', headers=headers, json=data)
    if response.status_code == 200:
        return response.json()['candidates'][0]['content']['parts'][0]['text']
    return f"Error: {response.status_code}, {response.text}"



def highlight_text(text):
    headers = {'Content-Type': 'application/json'}
    data = {
        "contents": [{
            "parts": [{
                "text": f"Find the most important words in this paragraph and return them as comma separated values, no spaces in between:\n\n{text}"
            }]
        }]
    }
    response = requests.post(f'{beckett_url}?key={BECKETT_API_KEY}', headers=headers, json=data)
    if response.status_code == 200:
        text = response.json()['candidates'][0]['content']['parts'][0]['text']
        return text.split(",")
    return f"Error: {response.status_code}, {response.text}"

def generate_multiple_choice(text):
    headers = {'Content-Type': 'application/json'}
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
        return response.json()['candidates'][0]['content']['parts'][0]['text']
    return f"Error: {response.status_code}, {response.text}"

def generate_flashcard(summary_data):
    if not OMKAR_GEMINI_API_KEY:
        return []

    try:
        from google.generativeai import GenerativeModel, configure
        configure(api_key=OMKAR_GEMINI_API_KEY)
        gemini_model = GenerativeModel(model_name="models/gemini-1.5-pro")

        key_points = summary_data.get("key_points", [])
        highlight_terms = summary_data.get("highlight_terms", [])
        summary = summary_data.get("summary", "")

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

        response = gemini_model.generate_content(prompt)
        text_response = response.text

        json_match = re.search(r'```json\s*(.*?)\s*```', text_response, re.DOTALL)
        if json_match:
            json_str = json_match.group(1)
        else:
            json_match = re.search(r'\[.*\]', text_response, re.DOTALL)
            json_str = json_match.group(0) if json_match else text_response

        return json.loads(json_str)
    except Exception as e:
        print(f"Error generating or parsing flashcards: {str(e)}")
        return []

# Routes
@app.route("/process-pdf", methods=["POST"])
def process_pdf():
    import fitz  # Lazy import
    print("Received PDF upload request...")
    file = request.files["pdf_file"]

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        file.save(tmp.name)
        doc = fitz.open(tmp.name)

    text = ""
    for page in doc:
        text += page.get_text()

    text_simplified = simplify_text(text)
    highlighted_text = highlight_text(text_simplified)
    multiple_choice = generate_multiple_choice(text_simplified)
    # flashcards = generate_flashcard(text_simplified)

    response_data = {
        "simplified_text": text_simplified,
        "highlighted_text": highlighted_text,
        "multiple_choice": multiple_choice
    }
    return jsonify(response_data)

@app.route("/verify-token", methods=["POST"])
def verify_token():
    try:
        token = request.headers.get('Authorization').split("Bearer ")[1]
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token['uid']
        return jsonify({"status": "success", "uid": uid})
    except Exception as e:
        print(f"Token verification error: {e}")
        return jsonify({"status": "error", "message": "Invalid token"}), 401

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5001))
    app.run(host='0.0.0.0', port=port, debug=False) 

