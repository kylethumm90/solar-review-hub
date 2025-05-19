
import React from 'react';

interface CompanyLogoProps {
  logoUrl?: string | null;
  companyName: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const CompanyLogo: React.FC<CompanyLogoProps> = ({ 
  logoUrl, 
  companyName, 
  className = "",
  size = "md"
}) => {
  // Size mapping
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-24 h-24",
    lg: "w-32 h-32"
  };

  const sizeClass = sizeClasses[size];
  
  return (
    <div className={className}>
      {logoUrl ? (
        <img 
          src={logoUrl} 
          alt={`${companyName} logo`}
          className={`${sizeClass} object-contain border rounded-md`}
        />
      ) : (
        <div className={`${sizeClass} bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-md`}>
          <span className="text-3xl text-gray-400">{companyName.charAt(0)}</span>
        </div>
      )}
    </div>
  );
};

export default CompanyLogo;
