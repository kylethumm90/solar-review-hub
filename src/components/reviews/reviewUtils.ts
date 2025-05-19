
// Format vendor type for display
export const formatVendorType = (type: string): string => {
  return type.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

// Get the badge color based on grade
export const getBadgeColorForGrade = (grade: string): string => {
  if (grade.startsWith('A')) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
  if (grade.startsWith('B')) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
  if (grade.startsWith('C')) return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
  return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
};

// Truncate review text
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
