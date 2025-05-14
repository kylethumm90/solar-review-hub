
import { ReviewQuestion } from '@/types';

type QuestionRatings = Record<string, { rating: number, question: ReviewQuestion }>;

export const calculateWeightedAverage = (
  questionRatings: QuestionRatings
): number => {
  if (Object.keys(questionRatings).length === 0) return 0;

  let totalWeightedRating = 0;
  let totalWeight = 0;

  Object.values(questionRatings).forEach(({ rating, question }) => {
    totalWeightedRating += rating * question.weight;
    totalWeight += question.weight;
  });

  return totalWeight > 0 ? totalWeightedRating / totalWeight : 0;
};
