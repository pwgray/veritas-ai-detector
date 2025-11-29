import React, { useState, useEffect } from 'react';
import { AnalysisResult, User } from './types';
import { analyzeText } from './services/geminiService';
import { authService } from './services/authService';
import InputSection from './components/InputSection';
import AnalysisView from './components/AnalysisView';
import LandingPage from './components/LandingPage';
import AuthModal from './components/AuthModal';
import PaymentModal from './components/PaymentModal';

const App: React.FC = () => {
  // Auth & Routing State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // App State
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limitError, setLimitError] = useState<boolean>(false);

  // Check session on load
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (u: User) => {
    setUser(u);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setResult(null);
  };

  const handleAnalyze = async (text: string) => {
    if (!user) return;

    // Check Limits
    const canProceed = authService.checkLimit(user);
    if (!canProceed) {
      setLimitError(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await analyzeText(text);
      setResult(data);
      // Increment Usage
      authService.incrementUsage(user.id);
      // Refresh user state to get new usage count
      const updatedUser = authService.getCurrentUser();
      if (updatedUser) setUser(updatedUser);
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

  const handleUpgradeSuccess = async () => {
    if (user) {
      const updatedUser = await authService.upgradeToPro(user.id);
      setUser(updatedUser);
      setIsPaymentModalOpen(false);
      setLimitError(false);
    }
  };

  // If not logged in, show Landing Page
  if (!user) {
    return (
      <>
        <LandingPage 
          onLogin={() => openAuth('login')} 
          onSignup={() => openAuth('signup')} 
        />
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
          initialMode={authMode}
          onSuccess={handleAuthSuccess}
        />
      </>
    );
  }

  // Main App View
  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-100 selection:bg-primary-500/30 font-sans">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>

      {/* App Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-30">
         <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-slate-200 tracking-tight">Veritas AI</span>
              <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">v2.5</span>
           </div>
           <div className="flex items-center gap-6">
              <div className="hidden md:flex flex-col items-end mr-2">
                 <span className="text-sm font-medium text-white">{user.name}</span>
                 <span className={`text-xs px-1.5 rounded ${user.plan === 'pro' ? 'bg-primary-500/20 text-primary-400' : 'bg-slate-800 text-slate-400'}`}>
                   {user.plan === 'pro' ? 'PRO PLAN' : `${3 - user.dailyUsage} credits left`}
                 </span>
              </div>
              <button onClick={handleLogout} className="text-sm text-slate-500 hover:text-slate-300">
                Sign Out
              </button>
           </div>
         </div>
      </header>

      <main className="relative z-10 px-4 py-12 max-w-7xl mx-auto min-h-[calc(100vh-64px)]">
        
        {/* Upgrade Prompt Modal (Limit Reached) */}
        {limitError && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
             <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
               <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-500">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
               </div>
               <h3 className="text-2xl font-bold text-white mb-2">Daily Limit Reached</h3>
               <p className="text-slate-400 mb-8">
                 You have used your 3 free credits for today. Upgrade to Pro for unlimited analysis and deeper reporting.
               </p>
               <div className="flex gap-4 justify-center">
                 <button onClick={() => setLimitError(false)} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">
                   Cancel
                 </button>
                 <button 
                   onClick={() => { setLimitError(false); setIsPaymentModalOpen(true); }}
                   className="px-6 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-semibold shadow-lg shadow-primary-500/20"
                 >
                   Upgrade Now
                 </button>
               </div>
             </div>
           </div>
        )}

        {/* Header Text */}
        {!result && (
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
              AI Detection Protocol
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Advanced forensic analysis of reference integrity and evidence consistency.
            </p>
            {user.plan === 'free' && (
               <div className="mt-4 inline-block">
                 <button 
                   onClick={() => setIsPaymentModalOpen(true)}
                   className="text-xs font-semibold text-primary-400 hover:text-primary-300 underline underline-offset-4"
                 >
                   Upgrade to Unlimited Analysis &rarr;
                 </button>
               </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="max-w-3xl mx-auto mb-8 bg-red-500/10 border border-red-500/30 p-4 rounded-xl flex items-center gap-4 text-red-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{error}</p>
          </div>
        )}

        {/* Main Content */}
        {isLoading ? (
           <div className="max-w-3xl mx-auto bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-12 text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
               <div className="w-full h-1 bg-primary-500/50 shadow-[0_0_20px_rgba(14,165,233,0.5)] animate-scan"></div>
             </div>
             <div className="flex justify-center mb-6">
               <div className="w-20 h-20 border-4 border-slate-800 border-t-primary-500 rounded-full animate-spin"></div>
             </div>
             <h3 className="text-xl font-semibold text-white mb-2">Processing Document</h3>
             <p className="text-slate-400">Verifying reference integrity and cross-checking evidence...</p>
           </div>
        ) : !result ? (
          <InputSection onAnalyze={handleAnalyze} isLoading={isLoading} />
        ) : (
          <AnalysisView result={result} onReset={handleReset} />
        )}
      </main>

      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={handleUpgradeSuccess}
      />
    </div>
  );
};

export default App;
