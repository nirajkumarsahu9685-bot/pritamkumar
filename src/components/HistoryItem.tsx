import React from 'react';
import { AnalysisResult } from '../types/analysis';
import { formatDateTime } from '../utils/storage';
import { Trash2, ChevronRight, Sparkles } from 'lucide-react';

interface HistoryItemProps {
  item: AnalysisResult;
  onSelect: (item: AnalysisResult) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ item, onSelect, onDelete }) => {
  const getBadge = () => {
    switch (item.riskLevel) {
      case 'LOW':
        return {
          icon: '🟢',
          label: 'LOW RISK',
          color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        };
      case 'MEDIUM':
        return {
          icon: '🟡',
          label: 'MEDIUM RISK',
          color: 'text-amber-700 bg-amber-50 border-amber-200',
        };
      case 'HIGH':
      default:
        return {
          icon: '🔴',
          label: 'HIGH RISK',
          color: 'text-red-700 bg-red-50 border-red-200',
        };
    }
  };

  const badge = getBadge();
  const formattedTime = formatDateTime(item.timestamp);

  return (
    <div
      onClick={() => onSelect(item)}
      className="group relative bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm p-4 sm:p-5 cursor-pointer transition-all active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-3">
        {/* Risk Badge & Category */}
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.color}`}>
            <span role="img" aria-label="Risk marker">{badge.icon}</span>
            <span>{badge.label}</span>
          </span>

          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
            {item.category}
          </span>

          {item.isDemo && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded">
              <Sparkles className="w-2.5 h-2.5" />
              Demo
            </span>
          )}
        </div>

        {/* Score & Delete button */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-base font-extrabold text-slate-800">
              {item.riskScore}
            </span>
            <span className="text-xs font-medium text-slate-400">/100</span>
          </div>

          <button
            type="button"
            title="Delete from history"
            onClick={(e) => onDelete(item.id, e)}
            className="p-1.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Summary */}
      <p className="text-sm text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
        {item.summary}
      </p>

      {/* Timestamp & Open prompt */}
      <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-2.5 border-t border-slate-100">
        <span>{formattedTime}</span>
        <span className="inline-flex items-center gap-1 text-slate-500 group-hover:text-blue-600 font-medium transition-colors">
          <span>View result</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
