import React from 'react';

function QuizQuestion({ question, index, register }) {
  const questionId = `question-${index}`;
  
  return (
    <div className="mb-8 p-4 bg-gray-50 rounded">
      <h3 className="text-lg font-medium mb-3">
        {index + 1}. {question.question}
      </h3>
      
      <div className="space-y-2">
        {question.options.map((option, optionIndex) => (
          <div key={optionIndex} className="flex items-center">
            <input
              type="radio"
              id={`${questionId}-${optionIndex}`}
              value={option}
              {...register(questionId, { required: "Please select an answer" })}
              className="mr-2"
            />
            <label htmlFor={`${questionId}-${optionIndex}`}>{option}</label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuizQuestion;