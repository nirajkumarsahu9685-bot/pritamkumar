import React, { useState } from 'react';
import { AnalysisResult } from '../types/analysis';
import { HistoryItem } from './HistoryItem';
import { History as HistoryIcon, Trash2, ShieldCheck, AlertTriangle } from 'lucide-react';

interface HistoryListProps {
  history: AnalysisResult[];
  onSelect: (item: AnalysisResult) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  history,
  onSelect,
  onDelete,
  onClearAll,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(id);
  };

  const handleConfirmClear = () => {
    onClearAll();
    setShowClearConfirm(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <HistoryIcon className="w-5 h-5 text-slate-700" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Analysis History
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review your previously evaluated messages.
          </p>
        </div>

        {history.length > 0 && !showClearConfirm && (
          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Confirmation Modal / Alert */}
      {showClearConfirm && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            <span className="text-sm font-semibold">
              Are you sure you want to clear all history?
            </span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setShowClearConfirm(false)}
              className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmClear}
              className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
            >
              Confirm Clear
            </button>
          </div>
        </div>
      )}

      {/* Items List */}
      {history.length === 0 ? (
        <div className="py-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <HistoryIcon className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">No analysis history yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Paste and analyze a suspicious SMS, email, or chat message to see its safety evaluation recorded here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <HistoryItem
              key={item.id}
              item={item}
              onSelect={onSelect}
              onDelete={handleDeleteItem}
            />
          ))}
        </div>
      )}

      {/* Privacy note */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
        <span>Your analysis history is stored locally in this browser.</span>
      </div>
    </div>
  );
};
