// main landing page and whatnot, includes toolbar with navigation 


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mindquill1 from "../images/mindquill-1.png";
import rectangle1 from "../images/rectangle-1.svg";
import "../style.css";

export const Desktop = () => {
  const navigate = useNavigate();
  // State to store summarized text
  const [summarizedText, setSummarizedText] = useState("");
  const [highlightedWords, setHighlightedText] = useState("");

  // Handle file upload and fetch summarized text from backend
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("pdf_file", file);
  
    try {
      const res = await fetch("http://localhost:5001/process-pdf", {
        method: "POST",
        headers: {
          'Origin': 'http://localhost:3000'
        },
        body: formData,
      });
  
      const result = await res.json();
      console.log("Server response:", result);
      
      // Set summarized text from response
      setSummarizedText(result.simplified_text);
      setHighlightedText(result.highlighted_text);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const getHighlightedText = (text, keywords) => {
    if (!keywords || keywords.length === 0) return text;
    
    // Escape regex chars and make a regex pattern for whole words
    const escapedKeywords = keywords.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`\\b(${escapedKeywords.join('|')})\\b`, 'gi');
  
    const parts = text.split(regex);
  
    return parts.map((part, i) =>
      keywords.some(kw => kw?.toLowerCase() === part.toLowerCase()) ? (
        <mark key={i}>{part}</mark>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };
  
  return (
    <div className="desktop">
      <div className="div">
        <div className="overlap-group">
          <img className="img" alt="Rectangle" src={rectangle1} />
          <p className="text-wrapper">
            Upload a PDF file to begin your learning!
          </p>
          <img className="mindquill" alt="Mindquill" src={mindquill1} />
          
          {/* Navigation Toolbar */}
          <div className="frame navigation-toolbar">
            <button 
              className="nav-button text-wrapper-2" 
              onClick={() => navigate('/about')}
            >
              About
            </button>
            <button 
              className="nav-button text-wrapper-2" 
              onClick={() => navigate('/progress')}
            >
              Progress
            </button>
          </div>
          <div className="div-wrapper">
            <button 
              className="nav-button text-wrapper-2" 
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </button>
          </div>
        </div>
        {/* Upload button only */}
        <div className="rectangle-3">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileUpload}
            className="file-upload-input"
          />
        </div>
        {summarizedText && (
          <div className="summarized-text-container">
            <h2>Summarized Text</h2>
            <p className="highlighted-text">{getHighlightedText(summarizedText, highlightedWords)}</p>
          </div>
        )}
        <div className="frame-2">
          <div className="ellipse" />
          <div className="text-wrapper-3">Quiz</div>
        </div>
        <div className="frame-3">
          <div className="ellipse" />
          <div className="text-wrapper-3">Text</div>
        </div>
      </div>
    </div>
  );
};
