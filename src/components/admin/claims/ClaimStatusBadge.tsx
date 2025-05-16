
type ClaimStatusBadgeProps = {
  status: string;
};

const ClaimStatusBadge = ({ status }: ClaimStatusBadgeProps) => {
  switch (status) {
    case "pending":
      return (
        <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
          Pending
        </span>
      );
    case "approved":
      return (
        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
          Approved
        </span>
      );
    case "rejected":
      return (
        <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
          Rejected
        </span>
      );
    default:
      return (
        <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
          Unknown
        </span>
      );
  }
};

export default ClaimStatusBadge;
