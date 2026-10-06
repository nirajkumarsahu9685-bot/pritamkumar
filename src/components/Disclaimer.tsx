import React from 'react';
import { ShieldAlert, Lock, Phone, MessageCircle, Mail } from 'lucide-react';

export const Disclaimer: React.FC = () => {
  return (
    <footer className="mt-8 space-y-4">
      {/* Contact & Support Card */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <Phone className="w-4 h-4 text-blue-600" />
            <span>Need Help or Have Questions?</span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Reach out via call, WhatsApp, or email for queries and reporting.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full lg:w-auto">
          <a
            href="tel:7067623865"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call 7067623865</span>
          </a>

          <a
            href="https://wa.me/917067623865"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold text-xs transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp</span>
          </a>

          <a
            href="mailto:pritamkumarsahu7067@gmail.com"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-semibold text-xs transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-slate-600" />
            <span>pritamkumarsahu7067@gmail.com</span>
          </a>
        </div>
      </div>

      {/* Safety Notice Box */}
      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 text-slate-600 text-xs sm:text-sm leading-relaxed space-y-2">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <ShieldAlert className="w-4 h-4 text-blue-600" />
          <span>Important Safety & Advisory Notice</span>
        </div>
        <p>
          Risk assessments are estimates and should not be treated as proof that a message is safe or fraudulent. SafeCheck AI evaluates syntactic indicators, linguistic urgency, advance-fee tactics, and credential-harvesting patterns, but cyber threats evolve continuously.
        </p>
        <p className="text-slate-500 text-xs">
          Never share OTPs, passwords, UPI PINs, CVVs, or bank logins over messages or phone calls. Always verify suspicious communications directly through officially established customer care channels.
        </p>
      </div>

      {/* Privacy Guarantee & Contact Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 px-2 py-1">
        <div className="flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-slate-400" />
          <span>Client-side local history storage. No credentials collected.</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <a href="tel:7067623865" className="hover:text-blue-600 transition-colors font-medium">
            +91 7067623865
          </a>
          <span>•</span>
          <a href="mailto:pritamkumarsahu7067@gmail.com" className="hover:text-blue-600 transition-colors font-medium">
            pritamkumarsahu7067@gmail.com
          </a>
          <span>•</span>
          <span>SafeCheck AI</span>
        </div>
      </div>
    </footer>
  );
};
