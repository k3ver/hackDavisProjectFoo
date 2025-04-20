import React from 'react';
import { useNavigate } from 'react-router-dom';
import mindquill1 from "../images/mindquill-1.png";
import rectangle1 from "../images/rectangle-1.svg";
import "../style.css";

export const Progress = () => {
  const navigate = useNavigate();
  
// change this to API fetch for user data later 
// make values variables and delete example data
  const mockProgressData = {
    documentsProcessed: 12,
    quizzesTaken: 8,
    averageScore: 85,
    recentDocuments: [
      { title: "Machine Learning Basics", date: "2025-04-12", score: 92 },
      { title: "React Hooks Deep Dive", date: "2025-04-10", score: 88 },
      { title: "Neural Networks", date: "2025-04-05", score: 76 }
    ]
  };

  return (
    <div className="desktop">
      <div className="div">
        <div className="overlap-group">
          <img className="img" alt="Rectangle" src={rectangle1} />
          <p className="text-wrapper">
            Your Learning Progress
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
              className="nav-button text-wrapper-2" 
              onClick={() => navigate('/about')}
            >
              About
            </button>
            <button 
              className="nav-button text-wrapper-2 active" 
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

        {/* Progress page content */}
        <div className="progress-content">
          <h2>Your Learning Progress</h2>
          
          <div className="progress-stats">
            <div className="stat-card">
              <h3>Documents Processed</h3>
              <p className="stat-number">{mockProgressData.documentsProcessed}</p>
            </div>
            
            <div className="stat-card">
              <h3>Quizzes Completed</h3>
              <p className="stat-number">{mockProgressData.quizzesTaken}</p>
            </div>
            
            <div className="stat-card">
              <h3>Average Score</h3>
              <p className="stat-number">{mockProgressData.averageScore}%</p>
            </div>
          </div>
          
          <h3>Recent Documents</h3>
          <table className="recent-documents">
            <thead>
              <tr>
                <th>Document</th>
                <th>Date</th>
                <th>Quiz Score</th>
              </tr>
            </thead>
            <tbody>
              {mockProgressData.recentDocuments.map((doc, index) => (
                <tr key={index}>
                  <td>{doc.title}</td>
                  <td>{doc.date}</td>
                  <td>{doc.score}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
