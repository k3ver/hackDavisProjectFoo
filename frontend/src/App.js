import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Desktop } from "./components/Desktop";
import { About } from "./components/About";
import { Progress } from "./components/Progress";
import { SignUp } from "./components/SignUp";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Desktop />} />
          <Route path="/about" element={<About />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
