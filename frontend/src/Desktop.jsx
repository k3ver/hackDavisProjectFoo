import React, { useState } from 'react';
import mindquill1 from "./images/mindquill-1.png";
import rectangle1 from "./images/rectangle-1.svg";
import "./style.css";

export const Desktop = () => {
  // State to store summarized text
  const [summarizedText, setSummarizedText] = useState("");
  const [highlightedWords, setHighlightedText] = useState("");
  const [activeSection, setActiveSection] = useState('text'); // 'quiz' or 'text'
  const [quizData, setQuizData] = useState([]);

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
      console.log("Type of multiple_choice:", typeof result.multiple_choice);
      console.log("Value of multiple_choice:", result.multiple_choice);
      const cleanString = result.multiple_choice.replace(/^```json\n/, '').replace(/`/g, '');

      // Set summarized text from response
      setSummarizedText(result.simplified_text);
      setHighlightedText(result.highlighted_text);
      setQuizData(JSON.parse(cleanString));
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const getHighlightedText = (text, keywords) => {
    // Escape regex chars and make a regex pattern for whole words
    const escapedKeywords = keywords.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`\\b(${escapedKeywords.join('|')})\\b`, 'gi');
  
    const parts = text.split(regex);
  
    return parts.map((part, i) =>
      keywords.some(kw => kw.toLowerCase() === part.toLowerCase()) ? (
        <mark key={i}>{part}</mark>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };
  
  const handleToggle = (section) => {
    setActiveSection(section);
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

          <div className="frame">
            <div className="text-wrapper-2">About</div>
            <div className="text-wrapper-2">Progress</div>
          </div>

          <div className="div-wrapper">
            <div className="text-wrapper-2">Sign Up</div>
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

        {activeSection === 'text' && summarizedText && (
          <div className="summarized-text-container">
            <h2>Summarized Text</h2>
            <p className="highlighted-text">{getHighlightedText(summarizedText, highlightedWords)}</p>
          </div>
        )}

        {activeSection === 'quiz' && quizData.length > 0 && (
          <div className="quiz-container">
            {quizData.map((quizItem, index) => (
              <div key={index} className="quiz-question">
                <h3>{quizItem.question}</h3>
                {quizItem.options.map((option, idx) => (
                  <div key={idx}>
                    <input
                      type="radio"
                      id={`question-${index}-option-${idx}`}
                      name={`question-${index}`}
                      value={option}
                    />
                    <label htmlFor={`question-${index}-option-${idx}`}>{option}</label>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        <div className="frame-2">
          {/* Ellipse button for Quiz */}
          <div
            className={`ellipse ${activeSection === 'quiz' ? 'active' : ''}`}
            onClick={() => handleToggle('quiz')}
          />
          <div className="text-wrapper-3">Quiz</div>
        </div>

        <div className="frame-3">
          {/* Ellipse button for Text */}
          <div
            className={`ellipse ${activeSection === 'text' ? 'active' : ''}`}
            onClick={() => handleToggle('text')}
          />
          <div className="text-wrapper-3">Text</div>
        </div>
      </div>
    </div>
  );
};