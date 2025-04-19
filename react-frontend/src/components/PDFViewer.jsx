// display pdf with dyslexia settings

import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useReader } from '../contexts/ReaderContext';
import TextToSpeech from './TextToSpeech';
import usePDFProcessor from '../hooks/usePDFProcessor';

// Set pdf.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function PDFViewer({ file }) {
  const [numPages, setNumPages] = useState(null);
  const { settings, currentPage, setCurrentPage, textContent, setTextContent } = useReader();
  const { extractTextFromPDF } = usePDFProcessor();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (file) {
      setIsLoading(true);
      extractTextFromPDF(file).then(content => {
        setTextContent(content);
        setIsLoading(false);
      });
    }
  }, [file, extractTextFromPDF, setTextContent]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < numPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Apply dyslexia-friendly styles
  const textStyle = {
    fontFamily: settings.fontFamily,
    fontSize: `${settings.fontSize}px`,
    letterSpacing: `${settings.letterSpacing}em`,
    lineHeight: settings.lineHeight,
    color: settings.textColor,
    backgroundColor: settings.backgroundColor,
    padding: '2rem',
    margin: '0 auto',
    maxWidth: '800px',
  };

  const paragraphStyle = {
    marginBottom: `${settings.paragraphSpacing}rem`,
  };

  return (
    <div className="reader-container">
      {/* Original PDF display (hidden but helps with page management) */}
      <div className="hidden">
        <Document 
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page pageNumber={currentPage} />
        </Document>
      </div>

      {/* Dyslexia-friendly content display */}
      <div className="dyslexia-content rounded shadow-lg" style={textStyle}>
        {isLoading ? (
          <div className="text-center py-12">
            <div className="loader mx-auto"></div>
            <p className="mt-4">Processing your PDF...</p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-6">Page {currentPage} of {numPages}</h2>
            
            {textContent[currentPage - 1]?.map((paragraph, idx) => (
              <p 
                key={idx} 
                style={paragraphStyle}
                className={settings.highlightCurrentLine ? 'paragraph' : ''}
              >
                {paragraph}
              </p>
            ))}
            
            <div className="flex justify-between mt-6">
              <button 
                onClick={() => handlePageChange('prev')}
                disabled={currentPage <= 1}
                className="bg-blue-500 text-white py-2 px-4 rounded disabled:bg-gray-300"
              >
                Previous Page
              </button>
              
              <TextToSpeech text={textContent[currentPage - 1]?.join(' ')} />
              
              <button 
                onClick={() => handlePageChange('next')}
                disabled={currentPage >= numPages}
                className="bg-blue-500 text-white py-2 px-4 rounded disabled:bg-gray-300"
              >
                Next Page
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PDFViewer;