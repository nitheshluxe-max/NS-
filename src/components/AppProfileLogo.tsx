import React from 'react';

interface AppProfileLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showGlow?: boolean;
}

export const AppProfileLogo: React.FC<AppProfileLogoProps> = ({
  size = 'md',
  className = '',
  showGlow = false
}) => {
  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const dim = sizeMap[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${dim} ${className}`}
      title="NS Properties • 4 BHK Luxury Architectural Masterplan"
    >
      {showGlow && (
        <div className="absolute inset-0 rounded-xl bg-blue-600/30 blur-md transform scale-110 pointer-events-none" />
      )}
      <img
        src="/app-profile-4.svg"
        alt="NS Properties 4 BHK Estate Masterplan Logo"
        className="w-full h-full object-contain rounded-lg drop-shadow-md transition-transform duration-300 hover:scale-105"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};
