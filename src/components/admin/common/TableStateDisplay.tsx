
type TableStateDisplayProps = {
  loading: boolean;
  isEmpty: boolean;
  emptyMessage?: string;
};

const TableStateDisplay = ({ loading, isEmpty, emptyMessage = "No items found." }: TableStateDisplayProps) => {
  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (isEmpty) {
    return (
      <div className="text-center p-8 bg-gray-50 dark:bg-gray-900 rounded-md">
        <p className="text-gray-600 dark:text-gray-400">{emptyMessage}</p>
      </div>
    );
  }
  
  return null;
};

export default TableStateDisplay;
