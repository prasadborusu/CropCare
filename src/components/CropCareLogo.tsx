import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  textColor?: string;
}

export const CropCareLogo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md',
  showTagline = false,
  textColor = 'text-slate-900'
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Minimal Icon: Green Leaf + Decision Checkmark */}
      <div className={`relative flex items-center justify-center shrink-0 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-md shadow-emerald-500/20 text-white ${iconSizes[size]}`}>
        <svg 
          viewBox="0 0 36 36" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-3/4 h-3/4"
        >
          {/* Stylized Leaf Silhouette */}
          <path 
            d="M8 28C8 17 17 9 28 9C28 20 20 28 8 28Z" 
            fill="currentColor" 
            fillOpacity="0.25"
          />
          <path 
            d="M8 28C14 21 21 15 28 9" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round"
          />
          {/* Bold Decision Checkmark */}
          <path 
            d="M14 20.5L19 25.5L27 15" 
            stroke="#ffffff" 
            strokeWidth="3.2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-bold tracking-tight font-['Outfit'] ${textSizes[size]} ${textColor}`}>
            Crop<span className="text-emerald-600">Care</span>
          </span>
          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
            SMART AGRI
          </span>
        </div>
        {showTagline && (
          <p className="text-xs font-medium text-slate-500 tracking-normal">
            Smarter Decisions. Healthier Crops.
          </p>
        )}
      </div>
    </div>
  );
};
