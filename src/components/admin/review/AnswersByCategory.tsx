
import React from 'react';
import CategoryAnswerGroup from './CategoryAnswerGroup';

type Answer = {
  id: string;
  rating: number;
  notes: string | null;
  question: {
    category: string;
    question: string;
  };
};

type AnswersByCategoryProps = {
  answers: Answer[];
};

const AnswersByCategory = ({ answers }: AnswersByCategoryProps) => {
  // Group answers by category
  const groupedAnswers = answers?.reduce((groups, answer) => {
    const category = answer.question?.category || 'Uncategorized';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(answer);
    return groups;
  }, {} as Record<string, Answer[]>) || {};

  return (
    <div>
      <h3 className="text-md font-medium mb-3">Question Responses</h3>
      
      {Object.entries(groupedAnswers).map(([category, categoryAnswers]) => (
        <CategoryAnswerGroup 
          key={category} 
          category={category} 
          answers={categoryAnswers}
        />
      ))}
    </div>
  );
};

export default AnswersByCategory;
