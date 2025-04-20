import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mindquill1 from "../images/mindquill-1.png";
import rectangle1 from "../images/rectangle-1.svg";
import "../style.css";

export const SignUp = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Here you would typically send the data to your API
      console.log('Form submitted:', formData);
      // You could redirect to a "success" page or show a success message
      alert('Account created successfully!');
    }
  };
  
  return (
    <div className="desktop">
      <div className="div">
        <div className="overlap-group">
          <img className="img" alt="Rectangle" src={rectangle1} />
          <p className="text-wrapper">
            Create Your Account:
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
              className="nav-button text-wrapper-2" 
              onClick={() => navigate('/progress')}
            >
              Progress
            </button>
          </div>
          <div className="div-wrapper">
            <button 
              className="nav-button text-wrapper-2 active" 
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Sign Up page content */}
        <div className="signup-content">
          <h2>Sign Up for MindQuill</h2>
          <p>Create your account to save your learning progress and access additional features.</p>
          
          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={errors.fullName ? 'error' : ''}
              />
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'error' : ''}
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
            
            <button type="submit" className="signup-button">Create Account</button>
          </form>
        </div>
      </div>
    </div>
  );
};
