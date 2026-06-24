import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface FlatIconProps {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}

export const FlatIcon: React.FC<FlatIconProps> = ({ src, alt, size = 48, className = '' }) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <ImageOff size={size} className={`text-slate-300 ${className}`} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
      style={{ width: size, height: size, objectFit: 'contain' }}
    />
  );
};
