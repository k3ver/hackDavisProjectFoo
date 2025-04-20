import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { Desktop } from "./Desktop";
import './NavigationToolbar.css'; // Import the new CSS file

// About Page Component
const AboutPage = () => {
  return (
    <div className="page-container">
      <h1>About MindQuill</h1>
      <p>MindQuill is an innovative learning platform that helps you understand complex content through summarization and interactive quizzes.</p>
      <p>Upload your PDF documents and get instant summaries and knowledge checks to enhance your learning experience.</p>
    </div>
  );
};

// Progress Page Component
const ProgressPage = () => {
  return (
    <div className="page-container">
      <h1>Your Learning Progress</h1>
      <div className="progress-stats">
        <div className="stat-card">
          <h3>Documents Processed</h3>
          <p className="stat-number">12</p>
        </div>
        <div className="stat-card">
          <h3>Quiz Accuracy</h3>
          <p className="stat-number">78%</p>
        </div>
        <div className="stat-card">
          <h3>Hours Saved</h3>
          <p className="stat-number">8.5</p>
        </div>
      </div>
      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <ul>
          <li>Completed quiz on "Machine Learning Basics" - 92% accuracy</li>
          <li>Summarized "Introduction to React" - 1.2 pages</li>
          <li>Started learning "Data Structures and Algorithms"</li>
        </ul>
      </div>
    </div>
  );
};

// Sign Up Form Component
const SignUpPage = () => {
  const [formData, setFormData] = React.useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    alert('Account created successfully!');
  };

  return (
    <div className="page-container">
      <h1>Create Your Account</h1>
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="8"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" className="signup-button">Create Account</button>
      </form>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <nav className="navigation-toolbar">
          <div className="logo-container">
            <Link to="/" className="logo-link">MindQuill</Link>
          </div>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/signup" className="nav-link">Sign Up</Link>
            <Link to="/progress" className="nav-link">Progress</Link>
          </div>
        </nav>

        <div className="content-area">
          <Routes>
            <Route path="/" element={<Desktop />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/progress" element={<ProgressPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;