import React, { useState } from 'react';

interface SymbolLogoProps {
  symbol: string;
  logoUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SymbolLogo: React.FC<SymbolLogoProps> = ({
  symbol,
  logoUrl,
  size = 'md',
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: 'w-5 h-5 text-[10px]',
    md: 'w-7 h-7 text-xs',
    lg: 'w-10 h-10 text-sm font-semibold',
  };

  const getFallbackColor = (sym: string) => {
    const charCode = sym.charCodeAt(0) || 65;
    const colors = [
      'bg-blue-600 text-white',
      'bg-emerald-600 text-white',
      'bg-indigo-600 text-white',
      'bg-amber-600 text-white',
      'bg-purple-600 text-white',
      'bg-rose-600 text-white',
      'bg-cyan-600 text-white',
    ];
    return colors[charCode % colors.length];
  };

  if (!logoUrl || hasError) {
    const letters = symbol.replace(/[^A-Z0-9]/gi, '').slice(0, 2).toUpperCase() || 'TV';
    return (
      <div
        className={`rounded-full flex items-center justify-center font-bold select-none shrink-0 ${sizeClasses[size]} ${getFallbackColor(symbol)} ${className}`}
      >
        {letters}
      </div>
    );
  }

  return (
    <div className={`rounded-full overflow-hidden shrink-0 bg-neutral-800/40 flex items-center justify-center border border-white/5 ${sizeClasses[size]} ${className}`}>
      <img
        src={logoUrl}
        alt={`${symbol} logo`}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className="w-full h-full object-contain p-0.5"
      />
    </div>
  );
};
