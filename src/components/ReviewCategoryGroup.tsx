
import { ReviewQuestion } from '@/types';
import ReviewQuestionItem from './ReviewQuestionItem';

interface ReviewCategoryGroupProps {
  title: string;
  questions: ReviewQuestion[];
  onQuestionChange: (questionId: string, rating: number) => void;
}

const ReviewCategoryGroup = ({ title, questions, onQuestionChange }: ReviewCategoryGroupProps) => {
  // Group questions by category
  const questionsByCategory = questions.reduce((acc, question) => {
    if (!acc[question.category]) {
      acc[question.category] = [];
    }
    acc[question.category].push(question);
    return acc;
  }, {} as Record<string, ReviewQuestion[]>);

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      
      {Object.entries(questionsByCategory).map(([category, categoryQuestions]) => (
        <div key={category} className="mb-4">
          <h3 className="text-lg font-semibold mb-3">{category}</h3>
          {categoryQuestions.map(question => (
            <ReviewQuestionItem 
              key={question.id} 
              question={question} 
              onChange={onQuestionChange} 
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default ReviewCategoryGroup;
