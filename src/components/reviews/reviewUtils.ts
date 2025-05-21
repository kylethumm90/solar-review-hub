export const formatVendorType = (type: string): string => {
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
};

export const getBadgeColorForGrade = (grade: string): string => {
  if (grade === 'NR') {
    return "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"; // Neutral color for Not Rated
  } else if (grade.startsWith('A')) {
    return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
  } else if (grade.startsWith('B')) {
    return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
  } else if (grade.startsWith('C')) {
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
  } else if (grade.startsWith('D')) {
    return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
  } else {
    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
  }
};
