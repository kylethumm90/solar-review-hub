
export function calculateAverageRating(reviews: any[]): number {
  if (!reviews || reviews.length === 0) {
    return 0;
  }

  const totalScore = reviews.reduce((sum, review) => {
    // Check if the review has review_answers
    if (review.review_answers && review.review_answers.length > 0) {
      // Calculate weighted average
      let totalWeight = 0;
      let weightedSum = 0;
      
      review.review_answers.forEach((answer: any) => {
        const weight = answer.review_questions?.weight || 1;
        weightedSum += answer.rating * weight;
        totalWeight += weight;
      });
      
      return sum + (totalWeight > 0 ? weightedSum / totalWeight : (review.average_score || 0));
    } else {
      // Fall back to old calculation method if no review_answers
      const communication = review.rating_communication || 0;
      const installQuality = review.rating_install_quality || 0;
      const paymentReliability = review.rating_payment_reliability || 0;
      const timeliness = review.rating_timeliness || 0;
      const postInstallSupport = review.rating_post_install_support || 0;

      return sum + (communication + installQuality + paymentReliability + timeliness + postInstallSupport) / 5;
    }
  }, 0);

  return totalScore / reviews.length;
}

export function getReviewAvgScore(review: any): number {
  // Check if the review has review_answers
  if (review.review_answers && review.review_answers.length > 0) {
    // Calculate weighted average
    let totalWeight = 0;
    let weightedSum = 0;
    
    review.review_answers.forEach((answer: any) => {
      const weight = answer.review_questions?.weight || 1;
      weightedSum += answer.rating * weight;
      totalWeight += weight;
    });
    
    return totalWeight > 0 ? weightedSum / totalWeight : (review.average_score || 0);
  }

  // Fall back to old calculation method
  const communication = review.rating_communication || 0;
  const installQuality = review.rating_install_quality || 0;
  const paymentReliability = review.rating_payment_reliability || 0;
  const timeliness = review.rating_timeliness || 0;
  const postInstallSupport = review.rating_post_install_support || 0;
  
  return (communication + installQuality + paymentReliability + timeliness + postInstallSupport) / 5;
}

export function scoreToGrade(score: number | null | undefined): string {
  if (score === null || score === undefined || isNaN(score)) {
    return 'NR'; // Not Rated
  } else if (score >= 4.5) {
    return 'A+';
  } else if (score >= 4) {
    return 'A';
  } else if (score >= 3.5) {
    return 'B+';
  } else if (score >= 3) {
    return 'B';
  } else if (score >= 2.5) {
    return 'C+';
  } else if (score >= 2) {
    return 'C';
  } else if (score >= 1.5) {
    return 'D+';
  } else if (score >= 1) {
    return 'D';
  } else {
    return 'F';
  }
}

export function calculateWeightedAverage(questionRatings: Record<string, { rating: number; question: any }>): number {
  if (!questionRatings || Object.keys(questionRatings).length === 0) {
    return 0;
  }
  
  let totalWeight = 0;
  let weightedSum = 0;
  
  Object.values(questionRatings).forEach(({ rating, question }) => {
    const weight = question.weight || 1; // Default weight is 1 if not specified
    weightedSum += rating * weight;
    totalWeight += weight;
  });
  
  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}
