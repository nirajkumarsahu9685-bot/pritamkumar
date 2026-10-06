import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MessageInput } from './components/MessageInput';
import { LoadingState } from './components/LoadingState';
import { RiskResult } from './components/RiskResult';
import { HistoryList } from './components/HistoryList';
import { Disclaimer } from './components/Disclaimer';
import { AnalysisResult } from './types/analysis';
import { analyzeMessageApi } from './services/api';
import { getHistory, saveToHistory, deleteHistoryItem, clearAllHistory } from './utils/storage';
import { AlertCircle, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'history'>('home');
  const [inputMessage, setInputMessage] = useState<string>('');
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [forceDemoMode, setForceDemoMode] = useState<boolean>(false);

  // Load history from localStorage on initial render
  useEffect(() => {
    const loadedHistory = getHistory();
    setHistory(loadedHistory);
  }, []);

  const handleAnalyze = async () => {
    if (!inputMessage.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await analyzeMessageApi(inputMessage, forceDemoMode);

      // Save to localStorage history immediately
      const savedEntry = saveToHistory({
        message: inputMessage,
        riskLevel: response.riskLevel,
        riskScore: response.riskScore,
        category: response.category,
        summary: response.summary,
        warningSigns: response.warningSigns,
        recommendedActions: response.recommendedActions,
        hasSensitiveData: response.hasSensitiveData,
        isDemo: response.isDemo,
      });

      // Update state
      setCurrentResult(savedEntry);
      setHistory(getHistory());
      setActiveTab('home');
    } catch (err: unknown) {
      console.error('Analysis error:', err);
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearInput = () => {
    setInputMessage('');
    setErrorMessage(null);
  };

  const handleResetAnalysis = () => {
    setCurrentResult(null);
    setInputMessage('');
    setErrorMessage(null);
  };

  const handleSelectHistoryItem = (item: AnalysisResult) => {
    setCurrentResult(item);
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = deleteHistoryItem(id);
    setHistory(updated);
    if (currentResult?.id === id) {
      // If currently viewing deleted item, keep viewing without crash or reset
    }
  };

  const handleClearAllHistory = () => {
    clearAllHistory();
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Header */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setErrorMessage(null);
        }}
        historyCount={history.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Demo Mode Toggle Helper Bar */}
        <div className="flex items-center justify-between mb-4 px-1 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium">Protection Engine Active</span>
          </div>

          <button
            type="button"
            onClick={() => setForceDemoMode((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
              forceDemoMode
                ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                : 'text-slate-500 hover:text-slate-800 bg-white border border-slate-200'
            }`}
          >
            <Sparkles className="w-3 h-3 text-indigo-500" />
            <span>{forceDemoMode ? 'Demo Mode (Mock Analysis)' : 'Switch to Demo Mode'}</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start justify-between gap-3 animate-fadeIn">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-500 hover:text-red-700 font-bold text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tab Views */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            {isLoading ? (
              <LoadingState />
            ) : currentResult ? (
              <RiskResult
                result={currentResult}
                onReset={handleResetAnalysis}
                onSave={(item) => {
                  saveToHistory(item);
                  setHistory(getHistory());
                }}
              />
            ) : (
              <MessageInput
                message={inputMessage}
                onChange={(val) => {
                  setInputMessage(val);
                  if (errorMessage) setErrorMessage(null);
                }}
                onAnalyze={handleAnalyze}
                onClear={handleClearInput}
                isLoading={isLoading}
              />
            )}

            {/* Quick history preview when on home view and has history */}
            {!isLoading && !currentResult && history.length > 0 && (
              <div className="pt-4">
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="text-sm font-bold text-slate-700 tracking-tight">
                    Recent Checks
                  </h3>
                  <button
                    onClick={() => setActiveTab('history')}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    View all ({history.length})
                  </button>
                </div>
                <div className="space-y-2.5">
                  {history.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectHistoryItem(item)}
                      className="bg-white rounded-xl border border-slate-200 p-3.5 hover:border-slate-300 hover:shadow-xs cursor-pointer flex items-center justify-between gap-3 text-xs transition-all"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-bold shrink-0">
                          {item.riskLevel === 'HIGH' ? '🔴' : item.riskLevel === 'MEDIUM' ? '🟡' : '🟢'}
                        </span>
                        <span className="font-semibold text-slate-800 shrink-0">
                          {item.category}
                        </span>
                        <span className="text-slate-400 truncate">
                          "{item.sanitizedMessage || item.message}"
                        </span>
                      </div>
                      <span className="font-extrabold text-slate-700 shrink-0">
                        {item.riskScore}/100
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <HistoryList
            history={history}
            onSelect={handleSelectHistoryItem}
            onDelete={handleDeleteHistoryItem}
            onClearAll={handleClearAllHistory}
          />
        )}

        {/* Safety Disclaimer */}
        <Disclaimer />
      </main>
    </div>
  );
}
