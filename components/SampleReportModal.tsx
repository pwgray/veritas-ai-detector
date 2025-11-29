import React from 'react';
import AnalysisView from './AnalysisView';
import { AnalysisResult } from '../types';

interface SampleReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_RESULT: AnalysisResult = {
  aiProbability: 94,
  verdict: 'Likely AI-Generated',
  summary: "This dissertation excerpt exhibits critical failures in Step 1 (Reference Integrity) and Step 3 (Evidence Verification). The text cites 'Harrison & Ford (2022)' regarding 'quantum neural networks', but this paper does not exist in IEEE or ACM databases. Furthermore, the Results section claims a '300% efficiency increase' but provides no experimental data, charts, or methodology to support this figure. The writing style is highly repetitive with low burstiness.",
  keyFactors: [
    {
      factor: "Reference Hallucination",
      description: "Citations 'Harrison & Ford (2022)' and 'Velazquez et al. (2021)' are non-existent or irrelevant to the claimed subject matter.",
      impact: "High",
      type: "negative"
    },
    {
      factor: "Unsupported Claims",
      description: "The Conclusion asserts results that are not present in the Data Analysis section. Claims of statistical significance (p < 0.05) lack corresponding T-test values.",
      impact: "High",
      type: "negative"
    },
    {
      factor: "Textual Patterns",
      description: "Uniform sentence length and repetitive transitional phrases ('Moreover', 'Consequently') suggest algorithmic generation rather than human flow.",
      impact: "Medium",
      type: "negative"
    }
  ]
};

const SampleReportModal: React.FC<SampleReportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl">
        
        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 text-xs font-bold bg-primary-500/20 text-primary-400 rounded border border-primary-500/30">SAMPLE REPORT</span>
            <span className="text-slate-400 text-sm">Analysis Preview</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 md:p-8">
           <AnalysisView result={SAMPLE_RESULT} onReset={onClose} />
        </div>
      </div>
    </div>
  );
};

export default SampleReportModal;