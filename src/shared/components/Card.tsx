import { memo } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

const PADDING = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' } as const;
const VARIANT = {
  default: 'bg-white border border-slate-200/80 shadow-card',
  elevated: 'bg-white shadow-card-md',
} as const;

export const Card = memo(function Card({
  children, variant = 'default', padding = 'md', hoverable = false, className = '', ...props
}: CardProps) {
  return (
    <div
      className={`rounded-2xl transition-all duration-200 ${VARIANT[variant]} ${PADDING[padding]} ${hoverable ? 'hover:shadow-card-lg hover:-translate-y-0.5' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});
