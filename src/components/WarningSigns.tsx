import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface WarningSignsProps {
  warningSigns: string[];
}

export const WarningSigns: React.FC<WarningSignsProps> = ({ warningSigns }) => {
  if (!warningSigns || warningSigns.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-600" />
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800">
          Warning Signs
        </h4>
      </div>

      <ul className="space-y-2">
        {warningSigns.map((sign, index) => (
          <li
            key={index}
            className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 text-slate-800 text-sm leading-relaxed"
          >
            <span className="text-base select-none shrink-0" role="img" aria-label="warning">
              ⚠️
            </span>
            <span className="font-medium pt-0.5">{sign}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
