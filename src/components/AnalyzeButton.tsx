import React from 'react';
import { Search } from 'lucide-react';

interface AnalyzeButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export const AnalyzeButton: React.FC<AnalyzeButtonProps> = ({ onClick, disabled, isLoading }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 shadow-sm ${
        disabled || isLoading
          ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
          : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white shadow-blue-500/25 hover:shadow-md'
      }`}
    >
      <Search className="w-5 h-5 stroke-[2.2]" />
      <span>{isLoading ? 'Analyzing...' : 'Analyze Message'}</span>
    </button>
  );
};
