
import { ReviewQuestion } from '@/types';

type QuestionRatings = Record<string, { rating: number, question: ReviewQuestion }>;

// Define weights for each category for EPCs
const EPC_CATEGORY_WEIGHTS: Record<string, number> = {
  'payment_reliability': 1.5,
  'installation_quality': 1.25,
  'timeliness': 1.25,
  'communication': 1.0,
  'post_install_support': 1.0,
  'customer_service': 1.0
};

export const calculateWeightedAverage = (
  questionRatings: QuestionRatings
): number => {
  if (Object.keys(questionRatings).length === 0) return 0;

  let totalWeightedRating = 0;
  let totalWeight = 0;

  Object.values(questionRatings).forEach(({ rating, question }) => {
    // Use the new weighting system if category matches, otherwise use question weight
    const categoryKey = question.category.toLowerCase().replace(/ /g, '_');
    const weight = EPC_CATEGORY_WEIGHTS[categoryKey] || question.weight;
    
    totalWeightedRating += rating * weight;
    totalWeight += weight;
  });

  return totalWeight > 0 ? totalWeightedRating / totalWeight : 0;
};

// Map numeric score to letter grade
export const scoreToGrade = (score: number): string => {
  if (score >= 4.7) return 'A+';
  if (score >= 4.3) return 'A';
  if (score >= 4.0) return 'A-';
  if (score >= 3.7) return 'B+';
  if (score >= 3.3) return 'B';
  if (score >= 3.0) return 'B-';
  if (score >= 2.7) return 'C+';
  if (score >= 2.3) return 'C';
  if (score >= 2.0) return 'C-';
  if (score >= 1.7) return 'D+';
  if (score >= 1.3) return 'D';
  if (score >= 1.0) return 'D-';
  return 'F';
};
