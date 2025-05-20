
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getReviewAvgScore, scoreToGrade } from "@/utils/reviewUtils";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculate average star rating from review ratings
 * @deprecated Use calculateAverageRating from reviewUtils.ts instead
 */
export function calculateAverageRating(reviews: any[]) {
  if (!reviews || reviews.length === 0) {
    return 0;
  }

  return reviews.reduce((sum, review) => sum + getReviewAvgScore(review), 0) / reviews.length;
}

/**
 * Convert rating number to letter grade
 * @deprecated Use scoreToGrade from reviewUtils.ts instead
 */
export function ratingToGrade(rating: number): string {
  return scoreToGrade(rating);
}

/**
 * Format date to readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  }).format(date);
}
