// Desktop.jsx

import React, { useState } from 'react';
import mindquill1 from "./images/mindquill-1.png";
import rectangle1 from "./images/rectangle-1.svg";
import "./style.css";
import { db } from "./firebase";
import { doc, updateDoc, arrayUnion, increment, getDoc } from "firebase/firestore";

export const Desktop = ({ user, setUserProgress }) => {
  const [summarizedText, setSummarizedText] = useState("");
  const [highlightedWords, setHighlightedText] = useState("");
  const [activeSection, setActiveSection] = useState('text');
  const [quizData, setQuizData] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [solvedQuestions, setSolvedQuestions] = useState({});
  const [uploadedFileName, setUploadedFileName] = useState("");

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("pdf_file", file);
    setUploadedFileName(file.name);

    try {
      const res = await fetch(process.env.REACT_APP_API_URL + '/process-pdf', {
        method: "POST",
        mode: 'cors',
        body: formData,
      });

      const result = await res.json();
      const cleanString = result.multiple_choice.replace(/^```json\n/, '').replace(/`/g, '');

      setSummarizedText(result.simplified_text);
      setHighlightedText(result.highlighted_text);
      const parsedQuiz = JSON.parse(cleanString);
      if (parsedQuiz && Array.isArray(parsedQuiz)) {
        setQuizData(parsedQuiz);
        setCurrentQuestionIndex(0);
        setUserAnswers({});
        setSolvedQuestions({});
        setSubmitted(false);
      } else {
        console.error("Invalid quiz data format:", parsedQuiz);
      }

      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.exists() ? userSnap.data() : {};

        await updateDoc(userRef, {
          documents_processed: increment(1),
          minutes_saved: increment(12),
          recent_activity: arrayUnion(`Summarized \"${file.name}\"`)
        });

        setUserProgress({
          ...userData,
          documents_processed: (userData.documents_processed || 0) + 1,
          minutes_saved: (userData.minutes_saved || 0) + 12,
          recent_activity: [...(userData.recent_activity || []), `Summarized \"${file.name}\"`]
        });
      }
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const getHighlightedText = (text, keywords) => {
    if (!text || !keywords || keywords.length === 0) return text;
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

  const handleToggle = (section) => setActiveSection(section);
  const handleResetUpload = () => {
    document.getElementById('file-upload-input').value = '';
    setUploadedFileName("");
  };

  const handleAnswer = async (option, quizItem) => {
    const isCorrect = option === quizItem.answer;
    const updatedAnswers = { ...userAnswers, [currentQuestionIndex]: option };
    setUserAnswers(updatedAnswers);
    if (solvedQuestions[currentQuestionIndex]) return;

    const updatedSolved = { ...solvedQuestions, [currentQuestionIndex]: true };
    setSolvedQuestions(updatedSolved);

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    const data = userSnap.data();

    const totalCorrect = (data.total_correct || 0) + (isCorrect ? 1 : 0);
    const totalAnswered = (data.total_answered || 0) + 1;
    const quizAccuracy = ((totalCorrect / totalAnswered) * 100).toFixed(0) + "%";

    await updateDoc(userRef, {
      total_correct: totalCorrect,
      total_answered: totalAnswered,
      quiz_accuracy: quizAccuracy,
      recent_activity: arrayUnion(`Completed quiz: \"${quizItem.question.slice(0, 30)}...\"`)
    });

    setUserProgress({
      ...data,
      total_correct: totalCorrect,
      total_answered: totalAnswered,
      quiz_accuracy: quizAccuracy,
      recent_activity: [...(data.recent_activity || []), `Completed quiz: \"${quizItem.question.slice(0, 30)}...\"`]
    });
  };

  return (
    <div className="desktop">
      <div className="div">
        <div className="overlap-group">
          <img className="img" alt="Rectangle" src={rectangle1} />
          <p className="text-wrapper">Upload a PDF file to begin your learning!</p>
          <img className="mindquill" alt="Mindquill" src={mindquill1} />
        </div>

        <div className="rectangle-3 center-aligned">
          <input id="file-upload-input" type="file" accept="application/pdf" onChange={handleFileUpload} className="file-upload-input" />
          {uploadedFileName && (
            <div className="uploaded-file-info">
              <p>Current file: {uploadedFileName}</p>
              <button className="reset-upload-btn" onClick={handleResetUpload}>Upload another PDF</button>
            </div>
          )}
        </div>

        <div className="content-container">
          <div className="toggle-container">
            <div className={`toggle-option ${activeSection === 'text' ? 'active' : ''}`} onClick={() => handleToggle('text')}>
              <div className={`ellipse text-icon ${activeSection === 'text' ? 'active' : ''}`} />
              <div className="text-wrapper-3">Text</div>
            </div>
            <div className={`toggle-option ${activeSection === 'quiz' ? 'active' : ''}`} onClick={() => handleToggle('quiz')}>
              <div className={`ellipse quiz-icon ${activeSection === 'quiz' ? 'active' : ''}`} />
              <div className="text-wrapper-3">Quiz</div>
            </div>
          </div>

          <div className="content-display">
            {activeSection === 'text' && summarizedText && (
              <div className="summarized-text-container">
                <h2>Summarized Text</h2>
                <p className="highlighted-text">{getHighlightedText(summarizedText, highlightedWords)}</p>
              </div>
            )}

            {activeSection === 'quiz' && quizData.length > 0 && (
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
                        return (
                          <div key={idx} className="quiz-option">
                            <input
                              type="radio"
                              id={`q-${currentQuestionIndex}-option-${idx}`}
                              name={`q-${currentQuestionIndex}`}
                              value={option}
                              onChange={() => handleAnswer(option, quizItem)}
                              checked={isSelected}
                              disabled={isSolved}
                            />
                            <label
                              htmlFor={`q-${currentQuestionIndex}-option-${idx}`}
                              className={
                                isSolved
                                  ? isCorrect
                                    ? "correct-answer"
                                    : isSelected
                                    ? "incorrect-answer"
                                    : ""
                                  : ""
                              }
                            >
                              {option}
                            </label>
                          </div>
                        );
                      })}
                      {isSolved && selectedAnswer === quizItem.answer ? (
                        <div className="success-message">✅ Correct! You got it!</div>
                      ) : isSolved ? (
                        <div className="error-message">❌ Incorrect. The correct answer is highlighted.</div>
                      ) : null}
                    </div>
                  );
                })()}

                <div className="quiz-navigation">
                  <button onClick={() => setCurrentQuestionIndex(prev => Math.max(prev - 1, 0))} disabled={currentQuestionIndex === 0} className="quiz-nav-button">← Previous</button>
                  <span className="question-counter">Question {currentQuestionIndex + 1} of {quizData.length}</span>
                  <button onClick={() => setCurrentQuestionIndex(prev => Math.min(prev + 1, quizData.length - 1))} disabled={currentQuestionIndex === quizData.length - 1} className="quiz-nav-button">Next →</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
