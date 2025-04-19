from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from transformers import T5Tokenizer, T5ForConditionalGeneration
import nltk
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

#from services.pdf_parser import parse_pdf
#services.simplifier import simplify_text
#services.flashcard_generator import generate_flashcards



# Initialize Flask app
app = Flask(__name__)
CORS(app)

tokenizer = AutoTokenizer.from_pretrained("google/flan-t5-small")
model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-small")
nltk.download('punkt_tab')
from nltk.tokenize import sent_tokenize

@app.route("/process-pdf", methods=["POST"])
def process_pdf():
    pass

def simplify_text():
    pass 

def highlight_text():
    pass