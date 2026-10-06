import React from 'react';
import { RiskLevel } from '../types/analysis';

interface RiskScoreProps {
  score: number;
  riskLevel: RiskLevel;
}

export const RiskScore: React.FC<RiskScoreProps> = ({ score, riskLevel }) => {
  const getStyles = () => {
    switch (riskLevel) {
      case 'LOW':
        return {
          textColor: 'text-emerald-700',
          bgColor: 'bg-emerald-500',
          trackColor: 'bg-emerald-100',
          badgeBg: 'bg-emerald-50',
          badgeBorder: 'border-emerald-200',
          label: 'Low Risk',
        };
      case 'MEDIUM':
        return {
          textColor: 'text-amber-700',
          bgColor: 'bg-amber-500',
          trackColor: 'bg-amber-100',
          badgeBg: 'bg-amber-50',
          badgeBorder: 'border-amber-200',
          label: 'Medium Risk',
        };
      case 'HIGH':
      default:
        return {
          textColor: 'text-red-700',
          bgColor: 'bg-red-500',
          trackColor: 'bg-red-100',
          badgeBg: 'bg-red-50',
          badgeBorder: 'border-red-200',
          label: 'High Risk',
        };
    }
  };

  const style = getStyles();
  const clampedScore = Math.max(0, Math.min(100, score));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-700">Risk Score</span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${style.badgeBg} ${style.textColor} ${style.badgeBorder}`}>
            {style.label}
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${style.textColor}`}>
            {clampedScore}
          </span>
          <span className="text-sm font-medium text-slate-400">/ 100</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className={`w-full h-3 rounded-full overflow-hidden ${style.trackColor}`}>
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${style.bgColor}`}
          style={{ width: `${clampedScore}%` }}
        />
      </div>

      {/* Risk Range Indicators */}
      <div className="flex justify-between text-[11px] font-medium text-slate-400 px-0.5 pt-0.5">
        <span className="text-emerald-600 font-semibold">0-29 Low</span>
        <span className="text-amber-600 font-semibold">30-59 Medium</span>
        <span className="text-red-600 font-semibold">60-100 High</span>
      </div>
    </div>
  );
};
