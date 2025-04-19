import React, { createContext, useState, useContext } from 'react';

const ReaderContext = createContext();

export function useReader() {
  return useContext(ReaderContext);
}

export function ReaderProvider({ children }) {
  // Reader settings with defaults optimized for dyslexia
  const [settings, setSettings] = useState({
    fontFamily: 'OpenDyslexic, sans-serif',
    fontSize: 18,
    letterSpacing: 0.5,
    lineHeight: 1.8,
    paragraphSpacing: 2,
    textColor: '#000000',
    backgroundColor: '#FFFAF0', // Slightly off-white
    readingSpeed: 1,
    highlightCurrentLine: true,
  });

  // Extracted text content from PDF
  const [textContent, setTextContent] = useState([]);
  
  // Current page and paragraph for reading
  const [currentPage, setCurrentPage] = useState(1);
  const [currentParagraph, setCurrentParagraph] = useState(0);

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const value = {
    settings,
    updateSettings,
    textContent,
    setTextContent,
    currentPage,
    setCurrentPage,
    currentParagraph,
    setCurrentParagraph,
  };

  return (
    <ReaderContext.Provider value={value}>
      {children}
    </ReaderContext.Provider>
  );
}