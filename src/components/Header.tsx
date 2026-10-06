import React from 'react';
import { ShieldCheck, History as HistoryIcon, Home, Phone } from 'lucide-react';

interface HeaderProps {
  activeTab: 'home' | 'history';
  onTabChange: (tab: 'home' | 'history') => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, historyCount }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => onTabChange('home')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-900 tracking-tight">SafeCheck AI</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                MVP
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Check before you trust.</p>
          </div>
        </div>

        {/* Navigation & Contact */}
        <div className="flex items-center gap-2 sm:gap-3">
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onTabChange('home')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'home'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={() => onTabChange('history')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all relative ${
                activeTab === 'history'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <HistoryIcon className="w-4 h-4" />
              <span>History</span>
              {historyCount > 0 && (
                <span className={`text-xs px-1.5 py-0.2 rounded-full font-semibold ${
                  activeTab === 'history' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {historyCount}
                </span>
              )}
            </button>
          </nav>

          {/* Contact Button */}
          <a
            href="tel:7067623865"
            title="Call 7067623865"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>7067623865</span>
          </a>
        </div>
      </div>
    </header>
  );
};
