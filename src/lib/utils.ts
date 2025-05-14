
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculate average star rating from review ratings
 */
export function calculateAverageRating(reviews: any[]) {
  if (!reviews || reviews.length === 0) {
    return 0;
  }

  const totalRating = reviews.reduce((sum, review) => {
    const categoryRatings = [
      review.rating_communication,
      review.rating_install_quality,
      review.rating_payment_reliability,
      review.rating_timeliness,
      review.rating_post_install_support,
    ].filter(Boolean);

    const avgRating = categoryRatings.length > 0 ? 
      categoryRatings.reduce((a, b) => a + b, 0) / categoryRatings.length : 
      0;

    return sum + avgRating;
  }, 0);

  return totalRating / reviews.length;
}

/**
 * Convert rating number to letter grade
 */
export function ratingToGrade(rating: number): string {
  if (rating >= 4.7) return 'A+';
  if (rating >= 4.3) return 'A';
  if (rating >= 4.0) return 'A-';
  if (rating >= 3.7) return 'B+';
  if (rating >= 3.3) return 'B';
  if (rating >= 3.0) return 'B-';
  if (rating >= 2.7) return 'C+';
  if (rating >= 2.3) return 'C';
  if (rating >= 2.0) return 'C-';
  if (rating >= 1.7) return 'D+';
  if (rating >= 1.3) return 'D';
  if (rating >= 1.0) return 'D-';
  return 'F';
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
