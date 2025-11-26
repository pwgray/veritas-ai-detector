import React, { useState, useRef } from 'react';
import { TabOption } from '../types';

interface InputSectionProps {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
}

// Declare globals for the external libraries injected via CDN
declare global {
  interface Window {
    mammoth: any;
    pdfjsLib: any;
  }
}

const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isLoading }) => {
  const [activeTab, setActiveTab] = useState<TabOption>(TabOption.TEXT);
  const [textInput, setTextInput] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessingFile(true);
    setTextInput(''); // Clear previous text while processing

    try {
      let content = '';
      const fileType = file.type;
      
      // Determine how to read the file based on its type
      if (fileType === 'application/pdf') {
        if (!window.pdfjsLib) {
          throw new Error("PDF processing library not loaded.");
        }
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          fullText += pageText + '\n\n';
        }
        content = fullText;

      } else if (
        fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
        file.name.endsWith('.docx')
      ) {
        if (!window.mammoth) {
          throw new Error("Word document processing library not loaded.");
        }
        const arrayBuffer = await file.arrayBuffer();
        const result = await window.mammoth.extractRawText({ arrayBuffer });
        content = result.value;

      } else {
        // Fallback for plain text files
        content = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string || '');
          reader.onerror = reject;
          reader.readAsText(file);
        });
      }
      
      setTextInput(content);
    } catch (error) {
      console.error("Error reading file:", error);
      alert("Failed to process document. Please ensure it is a valid PDF, Word (.docx), or Text file.");
      setFileName(null);
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handleSubmit = () => {
    if (textInput.trim().length > 0) {
      onAnalyze(textInput);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      
      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab(TabOption.TEXT)}
          className={`flex-1 py-4 text-sm font-medium transition-all ${
            activeTab === TabOption.TEXT 
              ? 'bg-slate-800/50 text-white border-b-2 border-primary-500' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
          }`}
        >
          Direct Input
        </button>
        <button
          onClick={() => setActiveTab(TabOption.FILE)}
          className={`flex-1 py-4 text-sm font-medium transition-all ${
            activeTab === TabOption.FILE
              ? 'bg-slate-800/50 text-white border-b-2 border-primary-500' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
          }`}
        >
          Document Upload
        </button>
      </div>

      <div className="p-6">
        {activeTab === TabOption.TEXT ? (
          <textarea
            className="w-full h-64 bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all font-mono text-sm resize-none placeholder-slate-600"
            placeholder="Paste your text here to check for AI patterns..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            disabled={isLoading}
          />
        ) : (
          <div 
            className={`w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all group relative overflow-hidden ${
              fileName 
                ? 'border-primary-500/30 bg-slate-800/30' 
                : 'border-slate-700 cursor-pointer hover:border-primary-500/50 hover:bg-slate-800/20'
            }`}
            onClick={() => !isProcessingFile && fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".txt,.md,.json,.csv,.pdf,.docx"
              onChange={handleFileChange}
              disabled={isProcessingFile}
            />
            
            {isProcessingFile ? (
              <div className="flex flex-col items-center animate-pulse">
                <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-300 font-medium">Extracting text...</p>
              </div>
            ) : fileName ? (
              <div className="text-center z-10">
                <div className="w-16 h-16 bg-primary-900/20 rounded-full flex items-center justify-center mb-4 mx-auto text-primary-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-white font-medium mb-1 px-4 truncate max-w-[300px]">{fileName}</p>
                <div className="flex items-center justify-center gap-2">
                   <p className="text-xs text-green-400">Ready to analyze</p>
                   <button 
                     onClick={(e) => {
                       e.stopPropagation();
                       setFileName(null);
                       setTextInput('');
                       if (fileInputRef.current) fileInputRef.current.value = '';
                     }}
                     className="text-xs text-slate-500 hover:text-red-400 underline"
                   >
                     Remove
                   </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:bg-primary-500/20 transition-colors">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400 group-hover:text-primary-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                </div>
                <p className="text-slate-300 font-medium mb-1">Click to upload document</p>
                <p className="text-xs text-slate-500 mb-2">Supports PDF, Word (.docx), TXT, MD</p>
                <div className="inline-block px-3 py-1 bg-slate-800 rounded text-[10px] text-slate-400 border border-slate-700">
                  <span className="font-semibold text-primary-400">Google Docs:</span> Please File {'>'} Download as PDF or Word
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex justify-between items-center">
          <div className="text-xs text-slate-500">
            {textInput.length > 0 && `${textInput.length} characters`}
          </div>
          <button
            onClick={handleSubmit}
            disabled={isLoading || isProcessingFile || textInput.length < 50}
            className={`px-8 py-3 rounded-lg font-semibold text-white shadow-lg transition-all flex items-center gap-2 ${
              isLoading || isProcessingFile || textInput.length < 50
                ? 'bg-slate-700 cursor-not-allowed opacity-50'
                : 'bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 hover:shadow-primary-500/20'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                Analyze Content
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </div>
        {textInput.length > 0 && textInput.length < 50 && (
          <p className="text-red-400 text-xs mt-2 text-right">Minimum 50 characters required.</p>
        )}
      </div>
    </div>
  );
};

export default InputSection;