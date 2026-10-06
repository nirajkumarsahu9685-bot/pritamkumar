import React from 'react';
import { ShieldAlert, Loader2 } from 'lucide-react';

export const LoadingState: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 shadow-sm text-center">
      <div className="inline-flex items-center justify-center relative mb-5">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
          <ShieldAlert className="w-8 h-8 animate-pulse text-blue-600" />
        </div>
        <div className="absolute -inset-1.5 rounded-3xl border-2 border-blue-400/40 border-t-transparent animate-spin" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">Analyzing message...</h3>
      <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
        Evaluating risk signals, urgency cues, financial demands, and credential harvesting patterns.
      </p>
      
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        <span>Running AI scam detection checks</span>
      </div>
    </div>
  );
};
