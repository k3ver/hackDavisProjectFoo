// file upload component for user

import React, { useState } from 'react';
import { FiUploadCloud } from 'react-icons/fi';

function PDFUploader({ onFileChange }) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    if (!file) return false;
    
    // Check if it's a PDF
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return false;
    }
    
    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit');
      return false;
    }
    
    setError(null);
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        onFileChange(file);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        onFileChange(file);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div 
        className={`border-2 border-dashed rounded-lg p-12 w-full max-w-lg text-center cursor-pointer
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="pdf-upload"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />
        <label htmlFor="pdf-upload" className="cursor-pointer">
          <FiUploadCloud className="mx-auto text-5xl text-gray-400 mb-4" />
          <p className="text-lg mb-2">Drag and drop your PDF here</p>
          <p className="text-sm text-gray-500 mb-4">or click to browse</p>
          <button className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700">
            Upload PDF
          </button>
        </label>
      </div>
      
      {error && (
        <div className="mt-4 text-red-600">
          {error}
        </div>
      )}
      
      <div className="mt-8 text-center max-w-lg">
        <h2 className="text-xl font-bold mb-2">How it works:</h2>
        <ol className="text-left list-decimal list-inside space-y-2">
          <li>Upload any PDF document</li>
          <li>We'll convert it to a dyslexia-friendly format</li>
          <li>Customize your reading experience with font, spacing, and color options</li>
          <li>When you're done reading, take a quick comprehension quiz</li>
        </ol>
      </div>
    </div>
  );
}

export default PDFUploader;