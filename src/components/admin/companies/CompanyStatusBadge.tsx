
import { Badge } from "@/components/ui/badge";

type StatusBadgeProps = {
  status: string;
};

export const getStatusBadge = (status: string) => {
  switch(status) {
    case 'certified':
      return <Badge className="bg-green-500 text-white">Certified</Badge>;
    case 'verified':
      return <Badge className="bg-blue-500 text-white">Verified</Badge>;
    default:
      return <Badge className="bg-gray-300 text-gray-700">Unclaimed</Badge>;
  }
};

const CompanyStatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return getStatusBadge(status);
};

export default CompanyStatusBadge;
