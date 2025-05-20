
// Convert a numerical score (0-5) to a letter grade (A+ to F)
export const scoreToGrade = (score: number): string => {
  if (score >= 4.8) return 'A+';
  if (score >= 4.5) return 'A';
  if (score >= 4.2) return 'A-';
  if (score >= 3.9) return 'B+';
  if (score >= 3.6) return 'B';
  if (score >= 3.3) return 'B-';
  if (score >= 3.0) return 'C+';
  if (score >= 2.7) return 'C';
  if (score >= 2.4) return 'C-';
  if (score >= 2.1) return 'D+';
  if (score >= 1.8) return 'D';
  if (score >= 1.5) return 'D-';
  return 'F';
};

// Get badge color based on grade
export const getBadgeColorForGrade = (grade: string): string => {
  switch (grade.charAt(0)) {
    case 'A':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'B':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'C':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'D':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'F':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};
