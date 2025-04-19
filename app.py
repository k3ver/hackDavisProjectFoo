from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from transformers import T5Tokenizer, T5ForConditionalGeneration

#from services.pdf_parser import parse_pdf
#services.simplifier import simplify_text
#services.flashcard_generator import generate_flashcards

# Initialize Flask app
app = Flask(__name__)
CORS(app)
