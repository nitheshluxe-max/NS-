import React from 'react';

interface AppProfileLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
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
    xl: 'w-24 h-24',
    '2xl': 'w-32 h-32'
  };

  const dim = sizeMap[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none overflow-hidden rounded-md border border-[#3b6594]/30 shadow-xs ${dim} ${className}`}
      title="NS Properties 4 • Official Luxury Real Estate Logo"
    >
      {showGlow && (
        <div className="absolute inset-0 rounded-md bg-[#3b6594]/25 blur-sm transform scale-105 pointer-events-none" />
      )}
      <img
        src="/ns-properties-logo.png"
        alt="NS Properties 4 Official Logo"
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        loading="eager"
      />
    </div>
  );
};
