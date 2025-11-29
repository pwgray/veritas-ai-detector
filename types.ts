export interface AnalysisResult {
  aiProbability: number;
  verdict: 'Likely AI-Generated' | 'Mixed Signals' | 'Likely Human-Written';
  summary: string;
  keyFactors: AnalysisFactor[];
}

export interface AnalysisFactor {
  factor: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  type: 'positive' | 'negative' | 'neutral'; // positive means supports human, negative means supports AI
}

export interface AnalysisHistoryItem {
  id: string;
  timestamp: number;
  preview: string;
  result: AnalysisResult;
}

export enum TabOption {
  TEXT = 'TEXT',
  FILE = 'FILE'
}

export type PlanType = 'free' | 'pro';

export interface User {
  id: string;
  email: string;
  name: string;
  plan: PlanType;
  dailyUsage: number;
  lastUsageDate: string; // ISO date string YYYY-MM-DD
}
