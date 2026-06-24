import { memo } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
}

const VARIANTS = {
  primary:   'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500 shadow-sm disabled:bg-slate-300',
  secondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-slate-300 disabled:bg-slate-100',
  danger:    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-slate-300',
  ghost:     'bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-200 disabled:text-slate-400',
} as const;

const SIZES = { sm: 'px-3 py-1.5 text-xs gap-1.5', md: 'px-4 py-2 text-sm gap-2', lg: 'px-6 py-3 text-base gap-2' } as const;
const ICON_SIZE = { sm: 14, md: 16, lg: 18 } as const;

export const Button = memo(function Button({
  children, variant = 'primary', size = 'md', isLoading = false,
  fullWidth = false, disabled = false, icon, className = '', ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 size={ICON_SIZE[size]} className="animate-spin" /> : icon ?? null}
      {children}
    </button>
  );
});
