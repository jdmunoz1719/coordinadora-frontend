import { memo } from 'react';
import { RefreshCw } from 'lucide-react';

interface FloatingRefreshButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export const FloatingRefreshButton = memo(function FloatingRefreshButton({
  onClick,
  disabled = false,
  isLoading = false,
}: FloatingRefreshButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="fixed bottom-8 right-8 flex items-center justify-center w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 text-white shadow-lg hover:shadow-xl transition-all duration-200"
      title="Actualizar datos"
    >
      <RefreshCw
        size={20}
        className={isLoading ? 'animate-spin' : ''}
      />
    </button>
  );
});
