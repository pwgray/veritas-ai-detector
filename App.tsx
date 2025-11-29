import React, { useState } from 'react';
import { AnalysisResult } from './types';
import { analyzeText } from './services/geminiService';
import InputSection from './components/InputSection';
import AnalysisView from './components/AnalysisView';

const App: React.FC = () => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (text: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await analyzeText(text);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-100 selection:bg-primary-500/30">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>

      <header className="relative pt-12 pb-8 px-6 text-center z-10">
        <div className="inline-flex items-center justify-center p-2 mb-4 rounded-full bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-sm">
          <span className="relative flex h-3 w-3 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
          </span>
          <span className="text-xs font-semibold tracking-wider text-slate-300 uppercase">Veritas Engine V2.5</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
          AI Detection Protocol
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Advanced forensic analysis of reference integrity, evidence consistency, and linguistic stylometry for academic and professional content.
        </p>
      </header>

      <main className="relative z-10 px-4 pb-20 max-w-7xl mx-auto">
        {error && (
          <div className="max-w-3xl mx-auto mb-8 bg-red-500/10 border border-red-500/30 p-4 rounded-xl flex items-center gap-4 text-red-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{error}</p>
          </div>
        )}

        {isLoading ? (
           <div className="max-w-3xl mx-auto bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-12 text-center relative overflow-hidden">
             {/* Scanning Animation */}
             <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
               <div className="w-full h-1 bg-primary-500/50 shadow-[0_0_20px_rgba(14,165,233,0.5)] animate-scan"></div>
             </div>
             <div className="flex justify-center mb-6">
               <div className="w-20 h-20 border-4 border-slate-800 border-t-primary-500 rounded-full animate-spin"></div>
             </div>
             <h3 className="text-xl font-semibold text-white mb-2">Analyzing Dissertations</h3>
             <p className="text-slate-400">Verifying reference integrity and cross-checking evidence...</p>
           </div>
        ) : !result ? (
          <InputSection onAnalyze={handleAnalyze} isLoading={isLoading} />
        ) : (
          <AnalysisView result={result} onReset={handleReset} />
        )}
      </main>

      <footer className="relative z-10 py-8 text-center text-slate-600 text-sm border-t border-slate-900">
        <p>&copy; {new Date().getFullYear()} Veritas AI. Powered by Gemini 2.5 Flash.</p>
      </footer>
    </div>
  );
};

export default App;