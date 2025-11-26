import React from 'react';
import { AnalysisResult } from '../types';
import ScoreGauge from './ScoreGauge';

interface AnalysisViewProps {
  result: AnalysisResult;
  onReset: () => void;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ result, onReset }) => {
  return (
    <div className="w-full max-w-4xl mx-auto animate-fadeIn">
      
      {/* Header Result */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Score Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-50"></div>
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Detection Score
          </h2>
          <ScoreGauge score={result.aiProbability} />
          <div className="text-center mt-2">
            <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium border ${
              result.verdict === 'Likely AI-Generated' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
              result.verdict === 'Mixed Signals' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' :
              'bg-green-500/10 text-green-400 border-green-500/30'
            }`}>
              {result.verdict}
            </span>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-500 to-transparent opacity-50"></div>
          <div>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Executive Summary
            </h2>
            <p className="text-slate-300 leading-relaxed text-sm md:text-base">
              {result.summary}
            </p>
          </div>
          <button 
            onClick={onReset}
            className="mt-6 self-start px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-colors border border-slate-700"
          >
            Analyze New Document
          </button>
        </div>
      </div>

      {/* Factors List */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-slate-200 mb-4 px-1">Evidence & Observations</h3>
        {result.keyFactors.map((factor, index) => (
          <div 
            key={index} 
            className="bg-slate-900/50 border border-slate-800/60 p-5 rounded-xl flex flex-col sm:flex-row gap-4 hover:bg-slate-900 transition-colors"
          >
            <div className="flex-shrink-0 pt-1">
              {factor.type === 'negative' ? (
                 <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                   </svg>
                 </div>
              ) : factor.type === 'neutral' ? (
                <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                 </div>
              ) : (
                <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                 </div>
              )}
            </div>
            <div className="flex-grow">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-white font-medium">{factor.factor}</h4>
                <span className={`text-xs px-2 py-0.5 rounded border uppercase tracking-wider ${
                  factor.impact === 'High' ? 'border-primary-500/30 text-primary-400' :
                  factor.impact === 'Medium' ? 'border-slate-600 text-slate-400' :
                  'border-slate-700 text-slate-500'
                }`}>
                  {factor.impact} Impact
                </span>
              </div>
              <p className="text-slate-400 text-sm">{factor.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalysisView;