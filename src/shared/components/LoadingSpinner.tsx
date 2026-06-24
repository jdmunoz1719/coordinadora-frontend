import { memo } from 'react';
import { Loader2 } from 'lucide-react';
import { MESSAGES } from '@config/constants';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullPage?: boolean;
}

const SIZES = { sm: 18, md: 32, lg: 48 } as const;

export const LoadingSpinner = memo(function LoadingSpinner({
  size = 'md', message = MESSAGES.LOADING, fullPage = false,
}: LoadingSpinnerProps) {
  const content = (
    <div className="flex flex-col items-center gap-3">
      <Loader2 size={SIZES[size]} className="animate-spin text-brand-600" />
      {message && <p className="text-sm text-slate-500">{message}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return <div className="flex min-h-32 items-center justify-center py-8">{content}</div>;
});
