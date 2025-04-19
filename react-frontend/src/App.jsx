import React, { useState } from 'react';
import PDFUploader from './components/PDFUploader';
import PDFViewer from './components/PDFViewer';
import DyslexiaControls from './components/DyslexiaControls';
import QuizGenerator from './components/Quiz/QuizGenerator';
import { ReaderProvider } from './contexts/ReaderContext';
import './styles/dyslexiaStyles.css';

function App() {
  const [pdfFile, setPdfFile] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  
  const handleFileChange = (file) => {
    setPdfFile(file);
    setShowQuiz(false);
  };

  return (
    <ReaderProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-blue-600 text-white p-4">
          <h1 className="text-2xl font-bold">Dyslexia-Friendly PDF Reader</h1>
        </header>
        
        <main className="container mx-auto p-4">
          {!pdfFile ? (
            <PDFUploader onFileChange={handleFileChange} />
          ) : !showQuiz ? (
            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:w-3/4">
                <PDFViewer file={pdfFile} />
                <button 
                  onClick={() => setShowQuiz(true)}
                  className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                >
                  Take Comprehension Quiz
                </button>
              </div>
              <div className="md:w-1/4">
                <DyslexiaControls />
              </div>
            </div>
          ) : (
            <div>
              <QuizGenerator pdfFile={pdfFile} />
              <button 
                onClick={() => setShowQuiz(false)}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Back to Reading
              </button>
            </div>
          )}
        </main>
        
        <footer className="bg-gray-100 p-4 text-center text-gray-600">
          Dyslexia-Friendly PDF Reader - Hackathon Project
        </footer>
      </div>
    </ReaderProvider>
  );
}

export default App;