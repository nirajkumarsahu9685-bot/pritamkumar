import React, { useState } from 'react';
import { AnalysisResult } from '../types/analysis';
import { RiskScore } from './RiskScore';
import { WarningSigns } from './WarningSigns';
import { RecommendedActions } from './RecommendedActions';
import { RefreshCw, BookmarkCheck, ShieldCheck, AlertCircle, Sparkles, Share2, Check } from 'lucide-react';

interface RiskResultProps {
  result: AnalysisResult;
  onReset: () => void;
  onSave?: (result: AnalysisResult) => void;
}

export const RiskResult: React.FC<RiskResultProps> = ({ result, onReset, onSave }) => {
  const [isSaved, setIsSaved] = useState(true); // Auto-saved initially in the flow
  const [copied, setCopied] = useState(false);

  const getRiskHeader = () => {
    switch (result.riskLevel) {
      case 'LOW':
        return {
          icon: '🟢',
          title: 'LOW RISK',
          color: 'text-emerald-800',
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
        };
      case 'MEDIUM':
        return {
          icon: '🟡',
          title: 'MEDIUM RISK',
          color: 'text-amber-800',
          bg: 'bg-amber-50',
          border: 'border-amber-200',
        };
      case 'HIGH':
      default:
        return {
          icon: '🔴',
          title: 'HIGH RISK',
          color: 'text-red-800',
          bg: 'bg-red-50',
          border: 'border-red-200',
        };
    }
  };

  const headerStyle = getRiskHeader();

  const handleSaveClick = () => {
    if (onSave) {
      onSave(result);
    }
    setIsSaved(true);
  };

  const handleShare = async () => {
    const icon = result.riskLevel === 'HIGH' ? '🔴' : result.riskLevel === 'MEDIUM' ? '🟡' : '🟢';
    const signs = result.warningSigns.length > 0
      ? `\n\n⚠️ Warning Signs:\n${result.warningSigns.map((s) => `• ${s}`).join('\n')}`
      : '';
    const actions = result.recommendedActions.length > 0
      ? `\n\n✓ Recommended Actions:\n${result.recommendedActions.map((a) => `• ${a}`).join('\n')}`
      : '';

    const textToShare = `🛡️ SafeCheck AI Analysis
${icon} ${result.riskLevel} RISK (${result.riskScore}/100)
Category: ${result.category}

Summary:
${result.summary}${signs}${actions}

Check before you trust with SafeCheck AI.`;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToShare);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = textToShare;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy analysis summary:', err);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
      {/* Top Bar / Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Analysis Result
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xl" role="img" aria-label="Risk icon">
              {headerStyle.icon}
            </span>
            <span className={`text-xl sm:text-2xl font-black tracking-tight ${headerStyle.color}`}>
              {headerStyle.title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {result.isDemo && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Demo Analysis</span>
            </div>
          )}

          {/* Quick Share Pill */}
          <button
            type="button"
            onClick={handleShare}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
              copied
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? 'Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Sensitive Information Alert */}
      {result.hasSensitiveData && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-bold text-red-950 mb-0.5">Sensitive Information Detected</p>
            <p className="leading-relaxed">
              ⚠️ This message may contain sensitive information. Never share OTPs, passwords, UPI PINs or banking credentials with anyone.
            </p>
          </div>
        </div>
      )}

      {/* Risk Score Progress */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/80">
        <RiskScore score={result.riskScore} riskLevel={result.riskLevel} />
      </div>

      {/* Category & Summary */}
      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
          Category
        </div>
        <div className="inline-block px-3 py-1.5 rounded-lg bg-slate-900 text-white text-sm font-semibold">
          {result.category}
        </div>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed pt-1 font-normal">
          {result.summary}
        </p>
      </div>

      {/* Analyzed Message Snippet Preview */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
        <div className="font-semibold text-slate-700 mb-1">Evaluated Message:</div>
        <p className="italic line-clamp-3 leading-relaxed text-slate-600">
          "{result.sanitizedMessage || result.message}"
        </p>
      </div>

      {/* Warning Signs */}
      <WarningSigns warningSigns={result.warningSigns} />

      {/* Recommended Actions */}
      <RecommendedActions actions={result.recommendedActions} />

      {/* Safety Notice Note */}
      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60 text-xs text-slate-500 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
        <span>
          Risk assessments are estimates and should not be treated as proof that a message is safe or fraudulent.
        </span>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 active:scale-[0.99] transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Check Another</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm border transition-all ${
            copied
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 active:scale-[0.99]'
          }`}
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-blue-600" />}
          <span>{copied ? 'Copied to Clipboard!' : 'Share Results'}</span>
        </button>

        <button
          type="button"
          onClick={handleSaveClick}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
            isSaved
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-slate-900 text-white hover:bg-slate-800'
          }`}
        >
          <BookmarkCheck className="w-4 h-4" />
          <span>{isSaved ? 'Saved to History ✓' : 'Save Result'}</span>
        </button>
      </div>
    </div>
  );
};
