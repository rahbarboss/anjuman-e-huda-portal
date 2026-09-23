import React from 'react';
import { ANJUMAN_OFFICIAL_LOGO } from '../constants/branding';

interface AnjumanLogoProps {
  className?: string;
  size?: number | string;
  alt?: string;
}

export const AnjumanLogo: React.FC<AnjumanLogoProps> = ({
  className = 'w-10 h-10',
  size,
  alt = "ANJUMAN-E-HUDA Official Logo",
}) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`} style={style}>
      <img
        src={ANJUMAN_OFFICIAL_LOGO}
        alt={alt}
        className="w-full h-full object-contain filter drop-shadow-sm select-none"
        referrerPolicy="no-referrer"
        loading="eager"
      />
    </div>
  );
};
