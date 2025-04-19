import { useCallback } from 'react';
import * as pdfjs from 'pdfjs-dist';

// Make sure pdf.js is properly configured
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function usePDFProcessor() {
  /**
   * Extracts text content from a PDF file
   * Organizes by page and paragraphs
   */
  const extractTextFromPDF = useCallback(async (file) => {
    try {
      // Load the PDF file
      const fileArrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: fileArrayBuffer }).promise;
      const numPages = pdf.numPages;
      
      // Process each page
      const allPages = [];
      
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        // Get text items
        const textItems = textContent.items.map(item => item.str.trim());
        
        // Process into paragraphs (simplified approach)
        const paragraphs = [];
        let currentParagraph = '';
        
        for (const text of textItems) {
          if (!text) {
            if (currentParagraph) {
              paragraphs.push(currentParagraph);
              currentParagraph = '';
            }
            continue;
          }
          
          if (currentParagraph && !currentParagraph.endsWith(' ')) {
            currentParagraph += ' ';
          }
          
          currentParagraph += text;
          
          // Check for paragraph breaks (simple heuristic)
          if (text.endsWith('.') || text.endsWith('!') || text.endsWith('?')) {
            if (currentParagraph.length > 0) {
              paragraphs.push(currentParagraph);
              currentParagraph = '';
            }
          }
        }
        
        // Add any remaining paragraph
        if (currentParagraph) {
          paragraphs.push(currentParagraph);
        }
        
        // Filter empty paragraphs and store
        allPages.push(paragraphs.filter(p => p.trim().length > 0));
      }
      
      return allPages;
    } catch (error) {
      console.error("Error processing PDF:", error);
      return [];
    }
  }, []);

  return { extractTextFromPDF };
}

export default usePDFProcessor;