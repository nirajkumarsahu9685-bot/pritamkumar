import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface RecommendedActionsProps {
  actions: string[];
}

export const RecommendedActions: React.FC<RecommendedActionsProps> = ({ actions }) => {
  if (!actions || actions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800">
          What should you do?
        </h4>
      </div>

      <ul className="space-y-2">
        {actions.map((action, index) => (
          <li
            key={index}
            className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/70 text-slate-800 text-sm leading-relaxed"
          >
            <span className="text-emerald-700 font-bold text-base select-none shrink-0 pt-0.5">
              ✓
            </span>
            <span className="font-medium pt-0.5">{action}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
