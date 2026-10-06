import { AnalysisResult } from '../types/analysis';
import { sanitizeMessageForStorage } from './demoAnalyzer';

const STORAGE_KEY = 'safecheck_ai_history_v1';

export function getHistory(): AnalysisResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error('Failed to read SafeCheck history from localStorage:', err);
    return [];
  }
}

export function saveToHistory(result: Omit<AnalysisResult, 'id' | 'timestamp'> & { id?: string; timestamp?: string }): AnalysisResult {
  const existing = getHistory();
  
  // Sanitize the message stored to protect user credentials
  const sanitized = sanitizeMessageForStorage(result.message);

  const newEntry: AnalysisResult = {
    id: result.id || `sc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: result.timestamp || new Date().toISOString(),
    message: sanitized,
    sanitizedMessage: sanitized,
    riskLevel: result.riskLevel,
    riskScore: result.riskScore,
    category: result.category,
    summary: result.summary,
    warningSigns: result.warningSigns,
    recommendedActions: result.recommendedActions,
    hasSensitiveData: result.hasSensitiveData,
    isDemo: result.isDemo,
  };

  // Prevent duplicate consecutive entries with identical messages
  const filtered = existing.filter(item => item.id !== newEntry.id);
  const updated = [newEntry, ...filtered].slice(0, 50); // Keep last 50 entries
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save to history:', err);
  }

  return newEntry;
}

export function deleteHistoryItem(id: string): AnalysisResult[] {
  const current = getHistory();
  const updated = current.filter(item => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to update history after delete:', err);
  }
  return updated;
}

export function clearAllHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear history:', err);
  }
}

export function formatDateTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    
    // Check if today
    const isToday = 
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    // Check if yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = 
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (isToday) {
      return `Today, ${timeStr}`;
    }
    if (isYesterday) {
      return `Yesterday, ${timeStr}`;
    }
    return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${timeStr}`;
  } catch {
    return 'Recent';
  }
}
