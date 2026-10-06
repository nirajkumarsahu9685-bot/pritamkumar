import { AnalysisResponse } from '../types/analysis';
import { analyzeMessageLocally, detectSensitiveInformation } from '../utils/demoAnalyzer';

export async function analyzeMessageApi(message: string, forceDemo = false): Promise<AnalysisResponse> {
  const trimmed = message.trim();
  if (!trimmed) {
    throw new Error('Please enter a message to analyze.');
  }

  if (trimmed.length > 5000) {
    throw new Error('Message exceeds the maximum limit of 5,000 characters.');
  }

  if (forceDemo) {
    // Artificial small delay for realistic UX in demo mode
    await new Promise((resolve) => setTimeout(resolve, 600));
    return analyzeMessageLocally(trimmed);
  }

  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: trimmed }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.error || `Server responded with status ${response.status}`;
      console.warn('API call returned error status, falling back to local demo analysis:', errorMessage);
      const fallback = analyzeMessageLocally(trimmed);
      return fallback;
    }

    const data: AnalysisResponse = await response.json();
    
    // Validate schema
    if (!data || !data.riskLevel || typeof data.riskScore !== 'number') {
      console.warn('Invalid response structure from API, falling back to local demo analysis');
      return analyzeMessageLocally(trimmed);
    }

    // Double check sensitive data detection on client side as well
    if (detectSensitiveInformation(trimmed)) {
      data.hasSensitiveData = true;
    }

    return data;
  } catch (networkError) {
    console.warn('Network error or server unavailable, using local demo analysis:', networkError);
    // Graceful fallback to local demo analyzer
    await new Promise((resolve) => setTimeout(resolve, 400));
    return analyzeMessageLocally(trimmed);
  }
}
