import React, { useState } from 'react';
import SampleReportModal from './SampleReportModal';

interface LandingPageProps {
  onLogin: () => void;
  onSignup: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onSignup }) => {
  const [isSampleOpen, setIsSampleOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <SampleReportModal isOpen={isSampleOpen} onClose={() => setIsSampleOpen(false)} />

      {/* Header */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">V</span>
             </div>
             <span className="text-xl font-bold text-white tracking-tight">Veritas AI</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onLogin} className="text-slate-300 hover:text-white font-medium text-sm transition-colors">
              Sign In
            </button>
            <button onClick={onSignup} className="px-5 py-2 bg-white text-slate-900 hover:bg-slate-200 rounded-full font-semibold text-sm transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary-500/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
            <span className="text-xs font-medium text-slate-300 uppercase tracking-wide">Now supporting PhD Dissertations</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight leading-tight">
            The Standard in <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">Academic AI Detection</span>
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Detect AI-generated content with the world's most advanced linguistic forensic engine. 
            Designed for researchers, universities, and professional editors.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={onSignup} className="w-full sm:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-semibold text-lg transition-all shadow-lg shadow-primary-500/25">
              Start Analyzing for Free
            </button>
            <button 
              onClick={() => setIsSampleOpen(true)}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 rounded-xl font-semibold text-lg transition-all"
            >
              View Sample Report
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-900/30 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-primary-500/50 transition-colors">
              <div className="w-12 h-12 bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-400 mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Reference Integrity</h3>
              <p className="text-slate-400">We cross-reference every citation against real-world databases to detect hallucinated sources common in AI writing.</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-primary-500/50 transition-colors">
              <div className="w-12 h-12 bg-accent-900/30 rounded-lg flex items-center justify-center text-accent-400 mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Stylometric Analysis</h3>
              <p className="text-slate-400">Analyzes sentence burstiness and perplexity to distinguish human nuance from algorithmic predictability.</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-primary-500/50 transition-colors">
              <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center text-green-400 mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Evidence Verification</h3>
              <p className="text-slate-400">Ensures that the specific data points in the results section actually support the broad claims made in the abstract.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology & Responsibility Section */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-6">Assisted Professional Analysis</h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-primary-400 mb-2">Accelerate Your Review Process</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Veritas is engineered to act as a force multiplier for academic reviewers. By automating the detection of "red flags"—such as hallucinated citations, repetitive sentence structures, or unsupported claims—we allow you to focus your attention on the sections that require deep human expertise.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-primary-400 mb-2">Identify Anomalies, Not Absolutes</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Our scoring system provides a probability assessment based on linguistic patterns. It is designed to highlight areas of concern (high perplexity, mismatched evidence) that warrant further investigation, rather than serving as a judge or jury.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 w-full">
              <div className="bg-yellow-900/10 border border-yellow-500/20 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                  <svg className="w-32 h-32 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                </div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-yellow-500 mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    Important Methodology Notice
                  </h3>
                  <ul className="space-y-4 text-slate-300 text-sm leading-relaxed list-disc pl-5 marker:text-yellow-500/50">
                    <li>
                      <strong className="text-white">Not a Definitive Decision:</strong> The AI Probability Score is an indicator of linguistic patterns, not definitive proof of authorship.
                    </li>
                    <li>
                      <strong className="text-white">Potential for Errors:</strong> As an AI-powered tool itself, Veritas can make mistakes, including false positives or false negatives.
                    </li>
                    <li>
                      <strong className="text-white">User Responsibility:</strong> It is always the responsibility of the user to validate the findings. You must verify citations and read the content to confirm if the "red flags" are valid in context.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-slate-400">Choose the plan that fits your research needs.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 flex flex-col">
              <div className="mb-4">
                <span className="text-lg font-medium text-slate-300">Starter</span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">$0</span>
                  <span className="text-slate-500">/forever</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-slate-300">
                  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  3 Analysis Credits per Day
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Basic PDF & Text Support
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Standard Detection Engine
                </li>
              </ul>
              <button onClick={onSignup} className="w-full py-3 rounded-xl border border-slate-700 text-white font-semibold hover:bg-slate-800 transition-colors">
                Sign Up Free
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-b from-primary-900/20 to-slate-900 rounded-3xl p-8 border border-primary-500/30 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">POPULAR</div>
              <div className="mb-4">
                <span className="text-lg font-medium text-primary-400">Professional</span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">$19</span>
                  <span className="text-slate-500">/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-white">
                  <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Unlimited Analysis
                </li>
                <li className="flex items-center gap-3 text-white">
                  <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Deep Reference Verification
                </li>
                <li className="flex items-center gap-3 text-white">
                  <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Full Document Upload Support
                </li>
                <li className="flex items-center gap-3 text-white">
                  <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Priority Processing
                </li>
              </ul>
              <button onClick={onSignup} className="w-full py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-500 transition-colors shadow-lg shadow-primary-500/20">
                Get Unlimited Access
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-900 text-center text-slate-500 text-sm mt-auto">
        <p>&copy; {new Date().getFullYear()} Veritas AI Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;