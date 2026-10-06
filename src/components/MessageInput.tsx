import React, { useMemo } from 'react';
import { AnalyzeButton } from './AnalyzeButton';
import { detectSensitiveInformation } from '../utils/demoAnalyzer';
import { AlertCircle, Trash2, Sparkles } from 'lucide-react';

interface MessageInputProps {
  message: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  onClear: () => void;
  isLoading: boolean;
}

export const TEST_EXAMPLES = [
  {
    title: 'Lottery Prize',
    category: 'Lottery Scam',
    text: 'Congratulations! You have won ₹25,000. Pay ₹499 processing fee to claim your prize.',
  },
  {
    title: 'Bank KYC Freeze',
    category: 'KYC Scam',
    text: 'Your bank account will be blocked today. Verify your KYC immediately.',
  },
  {
    title: 'Work From Home Job',
    category: 'Job Scam',
    text: 'Congratulations! You have been selected for a work from home job earning ₹50,000 per month. Pay ₹999 registration fee.',
  },
  {
    title: 'Casual Chat',
    category: 'Normal Message',
    text: 'Hey, are we still meeting for lunch today?',
  },
];

export const MessageInput: React.FC<MessageInputProps> = ({
  message,
  onChange,
  onAnalyze,
  onClear,
  isLoading,
}) => {
  const maxLength = 5000;
  const charCount = message.length;
  const isOverLimit = charCount > maxLength;
  const isEmpty = message.trim().length === 0;

  // Realtime sensitive info check
  const hasSensitiveData = useMemo(() => {
    if (!message) return false;
    return detectSensitiveInformation(message);
  }, [message]);

  const handleSelectExample = (exampleText: string) => {
    onChange(exampleText);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
      {/* Title & Description */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Is this message a scam?
        </h2>
        <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
          Paste a suspicious SMS, WhatsApp message, email, job offer or investment message below.
        </p>
      </div>

      {/* Sensitive Info Alert Box */}
      {hasSensitiveData && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300/80 text-amber-900 text-sm flex items-start gap-2.5 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-snug">
            <span className="font-semibold">Sensitive Info Warning:</span> ⚠️ This message may contain sensitive information. Never share OTPs, passwords, UPI PINs or banking credentials.
          </p>
        </div>
      )}

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={message}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your suspicious message here..."
          rows={6}
          disabled={isLoading}
          className={`w-full p-4 rounded-xl border text-slate-800 placeholder:text-slate-400 font-sans text-sm sm:text-base leading-relaxed focus:outline-none focus:ring-2 transition-all resize-y min-h-[140px] max-h-[360px] ${
            isOverLimit
              ? 'border-red-400 focus:ring-red-200'
              : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
          }`}
        />

        {/* Character counter */}
        <div className="flex items-center justify-between text-xs mt-2 px-1">
          <span className="text-slate-400">
            {charCount === 0 ? 'Supports SMS, WhatsApp, Email, & Chat' : `${message.split(/\s+/).filter(Boolean).length} words`}
          </span>
          <span
            className={`font-mono font-medium ${
              isOverLimit ? 'text-red-600 font-bold' : charCount > 4000 ? 'text-amber-600' : 'text-slate-400'
            }`}
          >
            {charCount.toLocaleString()} / {maxLength.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Try Demo Examples */}
      <div className="pt-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>Quick Test Examples</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TEST_EXAMPLES.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectExample(item.text)}
              disabled={isLoading}
              className="text-left p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 active:scale-[0.98] transition-all group"
            >
              <div className="text-xs font-semibold text-slate-800 group-hover:text-blue-700 truncate">
                {item.title}
              </div>
              <div className="text-[11px] text-slate-400 truncate mt-0.5">
                {item.category}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={onClear}
          disabled={isEmpty || isLoading}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
            isEmpty || isLoading
              ? 'text-slate-300 cursor-not-allowed'
              : 'text-slate-600 hover:text-red-600 hover:bg-red-50'
          }`}
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear</span>
        </button>

        <div className="w-full sm:w-auto">
          <AnalyzeButton
            onClick={onAnalyze}
            disabled={isEmpty || isOverLimit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};
