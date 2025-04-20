import React from 'react';
import { useNavigate } from 'react-router-dom';
import mindquill1 from "../images/mindquill-1.png";
import rectangle1 from "../images/rectangle-1.svg";
import "../style.css";

export const About = () => {
  const navigate = useNavigate();

  return (
    <div className="desktop">
      <div className="div">
        <div className="overlap-group">
          <img className="img" alt="Rectangle" src={rectangle1} />
          <p className="text-wrapper">
            About MindQuill
          </p>
          <img className="mindquill" alt="Mindquill" src={mindquill1} />
          
          {/* Navigation Toolbar */}
          <div className="frame navigation-toolbar">
            <button 
              className="nav-button text-wrapper-2" 
              onClick={() => navigate('/')}
            >
              Home
            </button>
            <button 
              className="nav-button text-wrapper-2 active" 
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

        {/* About page content */}
        <div className="about-content">
          <h2>About MindQuill</h2>
          <p>
            aboutUsFoo....
            Kevin Beckett Omkar
          </p>
          <p>
            With MindQuill, you can:
          </p>
          <ul>
            <li>Turn conventional PDFs dyslexia-friendly</li>
            <li>Upload and process PDF documents</li>
            <li>Get simplified summaries of complex texts</li>
            <li>Test your knowledge with generated quizzes</li>
            <li>Track your progress over time</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
