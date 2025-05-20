
/**
 * Format a number with commas as thousand separators
 */
export const formatNumber = (num: number | undefined | null): string => {
  if (num === undefined || num === null) return '—';
  return new Intl.NumberFormat().format(num);
};

/**
 * Format a date string to a more readable format (e.g., "May 2025")
 */
export const formatMonthYear = (dateStr: string | undefined | null): string => {
  if (!dateStr) return '—';
  
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '—';
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric'
  });
};
