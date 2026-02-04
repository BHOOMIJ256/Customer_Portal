
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "h-10" }) => {
  return (
    <img
      src="/logo.png"
      alt="Hrita Logo"
      className={`${className} w-auto object-contain cursor-pointer transition-opacity hover:opacity-90`}
    />
  );
};

export default Logo;
