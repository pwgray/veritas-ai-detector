import React, { useState } from 'react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [processing, setProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePay = async () => {
    setProcessing(true);
    // Simulate Stripe API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setProcessing(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Subscribe to Pro</h3>
            <span className="bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full text-sm font-semibold">$19/mo</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6">
            <div className="flex justify-between items-center text-sm text-slate-400 mb-2">
              <span>Veritas Pro Plan</span>
              <span className="text-white">$19.00</span>
            </div>
            <div className="flex justify-between items-center text-sm text-slate-400 border-t border-slate-800 pt-2 mt-2">
              <span className="font-medium text-white">Total due today</span>
              <span className="font-bold text-white text-lg">$19.00</span>
            </div>
          </div>

          {/* Mock Stripe Element */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Card Information</label>
              <div className="bg-white rounded-lg p-3 flex items-center gap-3 border border-slate-300">
                <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <input type="text" placeholder="4242 4242 4242 4242" className="bg-transparent border-none focus:outline-none w-full text-slate-900 placeholder-slate-400 font-mono" />
                <div className="flex gap-2">
                   <input type="text" placeholder="MM/YY" className="w-16 bg-transparent border-none focus:outline-none text-slate-900 placeholder-slate-400 font-mono" />
                   <input type="text" placeholder="CVC" className="w-12 bg-transparent border-none focus:outline-none text-slate-900 placeholder-slate-400 font-mono" />
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
              Payments are secure and encrypted.
            </p>
          </div>

          <button
            onClick={handlePay}
            disabled={processing}
            className="w-full bg-[#635BFF] hover:bg-[#5851df] text-white font-semibold py-3 rounded-lg transition-all shadow-lg flex justify-center items-center gap-2"
          >
            {processing ? (
              <>
                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Pay $19.00'
            )}
          </button>
          
          <p className="text-center text-[10px] text-slate-500 mt-4">
            By confirming your subscription, you allow Veritas AI to charge your card for this payment and future payments in accordance with our terms.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
