
import React from 'react';
import ReviewAnswer from './ReviewAnswer';

type Answer = {
  id: string;
  rating: number;
  notes: string | null;
  question: {
    category: string;
    question: string;
  };
};

type CategoryAnswerGroupProps = {
  category: string;
  answers: Answer[];
};

const CategoryAnswerGroup = ({ category, answers }: CategoryAnswerGroupProps) => {
  return (
    <div className="mb-4">
      <h4 className="text-sm font-medium text-primary mb-2">{category}</h4>
      
      <div className="space-y-3">
        {answers.map((answer) => (
          <ReviewAnswer 
            key={answer.id}
            question={answer.question?.question}
            rating={answer.rating}
            notes={answer.notes}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryAnswerGroup;
