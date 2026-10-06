export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface AnalysisResult {
  id: string;
  message: string;
  sanitizedMessage?: string;
  riskLevel: RiskLevel;
  riskScore: number;
  category: string;
  summary: string;
  warningSigns: string[];
  recommendedActions: string[];
  hasSensitiveData?: boolean;
  isDemo?: boolean;
  timestamp: string;
}

export interface AnalysisRequest {
  message: string;
}

export interface AnalysisResponse {
  riskLevel: RiskLevel;
  riskScore: number;
  category: string;
  summary: string;
  warningSigns: string[];
  recommendedActions: string[];
  hasSensitiveData?: boolean;
  isDemo?: boolean;
}
