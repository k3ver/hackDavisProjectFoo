import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useReader } from '../../contexts/ReaderContext';
import useQuizGenerator from '../../hooks/useQuizGenerator';
import QuizQuestion from './QuizQuestion';

function QuizGenerator({ pdfFile }) {
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const { textContent } = useReader();
  const { generateQuestions } = useQuizGenerator();
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    const generateQuiz = async () => {
      try {
        setIsGenerating(true);
        
        // For hackathon purposes, let's create some sample questions
        // In a real implementation, we would use the OpenAI API here
        const questions = await generateQuestions(textContent);
        setQuizQuestions(questions);
      } catch (error) {
        console.error("Error generating quiz:", error);
      } finally {
        setIsGenerating(false);
      }
    };

    generateQuiz();
  }, [textContent, generateQuestions]);

  const onSubmit = (data) => {
    // Calculate score
    let correctAnswers = 0;
    
    quizQuestions.forEach((question, index) => {
      const questionId = `question-${index}`;
      if (data[questionId] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    setScore(correctAnswers);
    setShowResults(true);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Comprehension Quiz</h2>

      {isGenerating ? (
        <div className="text-center py-12">
          <div className="loader mx-auto"></div>
          <p className="mt-4">Generating your quiz questions...</p>
        </div>
      ) : showResults ? (
        <div className="text-center py-6">
          <h3 className="text-xl mb-4">Quiz Results</h3>
          <div className="text-3xl font-bold mb-6">
            You scored {score} out of {quizQuestions.length}
            ({Math.round((score / quizQuestions.length) * 100)}%)
          </div>
          
          <div className="mb-6">
            {score === quizQuestions.length ? (
              <p className="text-green-600">Perfect score! Excellent reading comprehension!</p>
            ) : score >= quizQuestions.length * 0.7 ? (
              <p className="text-green-600">Good job! You understood most of the key concepts.</p>
            ) : score >= quizQuestions.length * 0.5 ? (
              <p className="text-yellow-600">You got the basics. Consider reviewing the material again.</p>
            ) : (
              <p className="text-red-600">You might need to re-read the material to improve comprehension.</p>
            )}
          </div>
          
          <button
            onClick={() => setShowResults(false)}
            className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
          >
            Review Questions
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          {quizQuestions.map((question, index) => (
            <QuizQuestion 
              key={index}
              question={question}
              index={index}
              register={register}
            />
          ))}
          
          <div className="mt-8">
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700"
            >
              Submit Answers
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default QuizGenerator;