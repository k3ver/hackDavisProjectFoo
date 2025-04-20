import React, { useState } from 'react';
// import { Rectangle } from "./Rectangle";
import mindquill1 from "./images/mindquill-1.png";
import rectangle1 from "./images/rectangle-1.svg";
import "./style.css";

export const Desktop = () => {
  // State to store summarized text
  const [summarizedText, setSummarizedText] = useState("");

  // Handle file upload and fetch summarized text from backend
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("pdf_file", file);
  
    try {
      const res = await fetch("http://localhost:5000/process-pdf", {
        method: "POST",
        body: formData,
      });
  
      const result = await res.json();
      console.log("Server response:", result);
      
      // Set summarized text from response
      setSummarizedText(result.simplified_text);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div className="desktop">
      <div className="div">
        <div className="overlap-group">
          <img className="img" alt="Rectangle" src={rectangle1} />

          <p className="text-wrapper">
            Drag or drop pdf file below to begin your learning!
          </p>

          <img className="mindquill" alt="Mindquill" src={mindquill1} />

          <p className="text-wrapper">
            Drag or drop pdf file below to begin your learning!
          </p>

          <div className="frame">
            <div className="text-wrapper-2">About</div>

            <div className="text-wrapper-2">Progress</div>
          </div>

          <div className="div-wrapper">
            <div className="text-wrapper-2">Sign Up</div>
          </div>
        </div>

        <div className="rectangle-2" />

        <label className="rectangle-3 file-drop-zone">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />
          <span>Click or drop PDF here</span>
        </label>

        <div className="summarized-text-container">
          <h2>Summarized Text:</h2>
          <p>{summarizedText}</p>
        </div>

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

