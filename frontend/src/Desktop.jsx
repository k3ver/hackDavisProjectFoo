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
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [solvedQuestions, setSolvedQuestions] = useState({});
  const [uploadedFileName, setUploadedFileName] = useState("");

  // Handle file upload and fetch summarized text from backend
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("pdf_file", file);
    
    // Set the file name to display
    setUploadedFileName(file.name);
  
    try {
      const res = await fetch(process.env.REACT_APP_API_URL + '/process-pdf', {
        method: "POST",
        // Remove the Origin header - browsers set this automatically
        // Add mode: 'cors' to explicitly use CORS
        mode: 'cors',
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
      
      // Reset any previous quiz state
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setSolvedQuestions({});
      setSubmitted(false);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const getHighlightedText = (text, keywords) => {
    if (!text || !keywords || keywords.length === 0) return text;
    
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

  // Function to reset and upload a new PDF
  const handleResetUpload = () => {
    document.getElementById('file-upload-input').value = '';
    setUploadedFileName("");
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
        </div>

        {/* Centered upload area */}
        <div className="rectangle-3 center-aligned">
          <input
            id="file-upload-input"
            type="file"
            accept="application/pdf"
            onChange={handleFileUpload}
            className="file-upload-input"
          />
          {uploadedFileName && (
            <div className="uploaded-file-info">
              <p>Current file: {uploadedFileName}</p>
              <button className="reset-upload-btn" onClick={handleResetUpload}>Upload another PDF</button>
            </div>
          )}
        </div>

        {/* Content container for summary/quiz and toggle buttons */}
        <div className="content-container">
          {/* Toggle buttons in a fixed position */}
          <div className="toggle-container">
            <div 
              className={`toggle-option ${activeSection === 'text' ? 'active' : ''}`}
              onClick={() => handleToggle('text')}
            >
              <div className={`ellipse text-icon ${activeSection === 'text' ? 'active' : ''}`} />
              <div className="text-wrapper-3">Text</div>
            </div>

            <div 
              className={`toggle-option ${activeSection === 'quiz' ? 'active' : ''}`}
              onClick={() => handleToggle('quiz')}
            >
              <div className={`ellipse quiz-icon ${activeSection === 'quiz' ? 'active' : ''}`} />
              <div className="text-wrapper-3">Quiz</div>
            </div>
          </div>

          {/* Content area (either summary or quiz) */}
          <div className="content-display">
            {activeSection === 'text' && summarizedText ? (
              <div className="summarized-text-container">
                <h2>Summarized Text</h2>
                <p className="highlighted-text">{getHighlightedText(summarizedText, highlightedWords)}</p>
              </div>
            ) : null}

            {activeSection === 'quiz' && quizData.length > 0 ? (
              <div className="quiz-container">
                {(() => {
                  const quizItem = quizData[currentQuestionIndex];
                  const selectedAnswer = userAnswers[currentQuestionIndex];
                  const isSolved = solvedQuestions[currentQuestionIndex] || false;

                  return (
                    <div className="quiz-question">
                      <h3>{quizItem.question}</h3>
                      {quizItem.options.map((option, idx) => {
                        const isCorrect = option === quizItem.answer;
                        const isSelected = selectedAnswer === option;
                        const shouldHighlight = isSelected;

                        return (
                          <div key={idx}>
                            <input
                              type="radio"
                              id={`q-${currentQuestionIndex}-option-${idx}`}
                              name={`q-${currentQuestionIndex}`}
                              value={option}
                              onChange={() => {
                                if (isSolved) return;

                                setUserAnswers({
                                  ...userAnswers,
                                  [currentQuestionIndex]: option,
                                });

                                if (option === quizItem.answer) {
                                  setSolvedQuestions({
                                    ...solvedQuestions,
                                    [currentQuestionIndex]: true,
                                  });
                                }
                              }}
                              checked={isSelected}
                              disabled={isSolved}
                            />
                            <label
                              htmlFor={`q-${currentQuestionIndex}-option-${idx}`}
                              style={{
                                color:
                                  isSolved && isCorrect
                                    ? "green"
                                    : isSelected && !isCorrect
                                    ? "red"
                                    : "black",
                              }}
                            >
                              {option}
                            </label>
                          </div>
                        );
                      })}

                      {isSolved && (
                        <div style={{ marginTop: "10px", color: "green" }}>
                          ✅ Correct! You got it!
                        </div>
                      )}
                    </div>
                  );
                })()}

                <div className="quiz-navigation">
                  <button
                    onClick={() =>
                      setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))
                    }
                    disabled={currentQuestionIndex === 0}
                    className="quiz-nav-button"
                  >
                    ← Previous
                  </button>
                  <span className="question-counter">
                    Question {currentQuestionIndex + 1} of {quizData.length}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentQuestionIndex((prev) =>
                        Math.min(prev + 1, quizData.length - 1)
                      )
                    }
                    disabled={currentQuestionIndex === quizData.length - 1}
                    className="quiz-nav-button"
                  >
                    Next →
                  </button>
                </div>
              </div>
            ) : activeSection === 'quiz' && (
              <div className="no-content-message">
                Upload a PDF to generate quiz questions
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};