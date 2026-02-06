
import React, { useState } from 'react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

type PaymentStep = 'summary' | 'upi' | 'neft';

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onPaymentSuccess }) => {
  const [step, setStep] = useState<PaymentStep>('summary');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reference, setReference] = useState('');

  if (!isOpen) return null;

  const handleBack = () => setStep('summary');

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate a brief submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      onPaymentSuccess();
      setStep('summary'); // Reset for next time
    }, 1500);
  };

  const renderSummary = () => (
    <div className="p-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-black text-[#F5F7FA] font-rubik">Payment Summary</h2>
          <p className="text-[#A0AEC0] text-sm mt-1">Booking Advance • Project HR-2024-SHARMA</p>
        </div>
        <button onClick={onClose} className="text-[#A0AEC0] hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="bg-[#24212b] border-2 border-[#4A4A5A]/50 rounded-[2rem] p-8 text-center mb-8">
        <span className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-widest">Payable Amount</span>
        <h1 className="text-4xl font-black text-[#fafa33] font-rubik mt-2 mb-1">₹1,50,000</h1>
        <span className="text-[10px] font-bold text-[#5A5A6A] uppercase tracking-wider">Inclusive of 18% GST</span>
      </div>

      <div className="space-y-4 mb-4">
        <button
          onClick={() => setStep('upi')}
          className="w-full p-6 rounded-2xl bg-[#24212b] border border-[#4A4A5A] hover:border-[#fafa33] hover:bg-[#fafa33]/5 transition-all text-left flex items-center group"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mr-4 group-hover:bg-[#fafa33]/10">
            <svg className="w-6 h-6 text-purple-400 group-hover:text-[#fafa33]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-[#F5F7FA]">UPI (QR / ID)</h3>
            <p className="text-xs text-[#A0AEC0]">Pay via GPay, PhonePe, Paytm</p>
          </div>
          <svg className="w-5 h-5 text-[#4A4A5A] group-hover:text-[#fafa33] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <button
          onClick={() => setStep('neft')}
          className="w-full p-6 rounded-2xl bg-[#24212b] border border-[#4A4A5A] hover:border-[#fafa33] hover:bg-[#fafa33]/5 transition-all text-left flex items-center group"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mr-4 group-hover:bg-[#fafa33]/10">
            <svg className="w-6 h-6 text-blue-400 group-hover:text-[#fafa33]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-[#F5F7FA]">NEFT / Bank Transfer</h3>
            <p className="text-xs text-[#A0AEC0]">Direct transfer to bank account</p>
          </div>
          <svg className="w-5 h-5 text-[#4A4A5A] group-hover:text-[#fafa33] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );

  const renderUPI = () => (
    <div className="p-8">
      <div className="flex items-center mb-6">
        <button onClick={handleBack} className="text-[#A0AEC0] hover:text-white mr-4 transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-2xl font-black text-[#F5F7FA] font-rubik">UPI Payment</h2>
      </div>

      <div className="flex flex-col items-center bg-[#24212b] rounded-3xl p-6 border border-[#4A4A5A]/30 mb-6">
        <div className="w-44 h-44 bg-white p-4 rounded-2xl mb-4 relative group shadow-2xl">
          <svg viewBox="0 0 100 100" className="w-full h-full text-[#24212b]">
            <rect x="10" y="10" width="20" height="20" fill="currentColor" />
            <rect x="70" y="10" width="20" height="20" fill="currentColor" />
            <rect x="10" y="70" width="20" height="20" fill="currentColor" />
            <rect x="15" y="15" width="10" height="10" fill="white" />
            <rect x="75" y="15" width="10" height="10" fill="white" />
            <rect x="15" y="75" width="10" height="10" fill="white" />
            
            <rect x="40" y="10" width="10" height="10" fill="currentColor" />
            <rect x="55" y="10" width="10" height="10" fill="currentColor" />
            <rect x="40" y="25" width="10" height="10" fill="currentColor" />
            <rect x="10" y="40" width="10" height="10" fill="currentColor" />
            <rect x="25" y="40" width="10" height="10" fill="currentColor" />
            <rect x="40" y="40" width="20" height="20" fill="currentColor" />
            <rect x="70" y="40" width="10" height="10" fill="currentColor" />
            <rect x="85" y="40" width="5" height="5" fill="currentColor" />
            <rect x="10" y="55" width="10" height="10" fill="currentColor" />
            <rect x="70" y="55" width="10" height="10" fill="currentColor" />
            <rect x="40" y="70" width="10" height="10" fill="currentColor" />
            <rect x="55" y="70" width="10" height="10" fill="currentColor" />
            <rect x="70" y="70" width="10" height="10" fill="currentColor" />
            <rect x="85" y="70" width="10" height="10" fill="currentColor" />
          </svg>
        </div>
        
        <div className="text-center">
          <p className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-widest mb-1">UPI ID</p>
          <div className="flex items-center space-x-3 bg-black/20 px-4 py-2 rounded-xl border border-[#4A4A5A]/50">
            <code className="text-[#fafa33] font-bold">hrita.solutions@icici</code>
            <button className="text-[#A0AEC0] hover:text-[#fafa33] transition-colors" onClick={() => navigator.clipboard.writeText('hrita.solutions@icici')}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2" /></svg>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-widest mb-2 block">Upload Payment Screenshot</label>
          <div className="relative group/upload">
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
            <div className="w-full py-5 border-2 border-dashed border-[#4A4A5A] rounded-2xl flex items-center justify-center space-x-3 text-[#A0AEC0] group-hover/upload:border-[#fafa33] group-hover/upload:text-white transition-all bg-[#24212b]/50">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              <span className="text-xs font-bold">Tap to upload proof</span>
            </div>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-widest mb-2 block">Reference ID (Optional)</label>
          <input 
            type="text" 
            placeholder="UTR or Txn ID" 
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            className="w-full bg-[#24212b] border border-[#4A4A5A] rounded-xl px-4 py-3 text-sm text-[#F5F7FA] focus:outline-none focus:border-[#fafa33] transition-all"
          />
        </div>

        <button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-5 rounded-2xl bg-[#fafa33] text-[#24212b] font-black hover:bg-[#ffff4d] flex items-center justify-center transition-all shadow-lg shadow-[#fafa33]/10 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-3 border-[#24212b]/20 border-t-[#24212b] rounded-full animate-spin"></div>
          ) : (
            <>
              <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
              Submit for Confirmation
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderNEFT = () => (
    <div className="p-8">
      <div className="flex items-center mb-6">
        <button onClick={handleBack} className="text-[#A0AEC0] hover:text-white mr-4 transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-2xl font-black text-[#F5F7FA] font-rubik">NEFT Transfer</h2>
      </div>

      <div className="bg-[#24212b] rounded-3xl p-6 border border-[#4A4A5A]/30 mb-6 space-y-4">
        <div className="grid grid-cols-2 gap-y-4">
          <div>
            <p className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-widest mb-1 text-opacity-60">Account Name</p>
            <p className="text-sm font-bold text-[#F5F7FA]">Hrita Solutions PVT LTD</p>
          </div>
          <div>
            <p className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-widest mb-1 text-opacity-60">Bank Name</p>
            <p className="text-sm font-bold text-[#F5F7FA]">ICICI Bank</p>
          </div>
          <div className="col-span-2 border-t border-[#4A4A5A]/20 pt-4">
            <p className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-widest mb-1 text-opacity-60">Account Number</p>
            <div className="flex items-center justify-between">
              <p className="text-xl font-black text-[#fafa33] tracking-widest">50100234988776</p>
              <button className="text-[#A0AEC0] hover:text-[#fafa33] transition-colors" onClick={() => navigator.clipboard.writeText('50100234988776')}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2" /></svg>
              </button>
            </div>
          </div>
          <div className="col-span-2 pt-2">
            <p className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-widest mb-1 text-opacity-60">IFSC Code</p>
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-[#F5F7FA]">ICIC0000104</p>
              <button className="text-[#A0AEC0] hover:text-[#fafa33] transition-colors" onClick={() => navigator.clipboard.writeText('ICIC0000104')}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-widest mb-1">Steps to Pay</p>
          <div className="flex items-start space-x-3">
            <span className="w-5 h-5 rounded-full bg-[#fafa33] text-[#24212b] text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg shadow-[#fafa33]/20">1</span>
            <p className="text-xs text-[#A0AEC0] font-medium">Add Hrita Solutions as beneficiary in your bank app</p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="w-5 h-5 rounded-full bg-[#fafa33] text-[#24212b] text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg shadow-[#fafa33]/20">2</span>
            <p className="text-xs text-[#A0AEC0] font-medium">Transfer <span className="text-[#F5F7FA] font-bold">₹1,50,000</span> and download receipt</p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="w-5 h-5 rounded-full bg-[#fafa33] text-[#24212b] text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg shadow-[#fafa33]/20">3</span>
            <p className="text-xs text-[#A0AEC0] font-medium">Upload the screenshot/PDF below to confirm</p>
          </div>
        </div>

        <div className="pt-2 space-y-4">
          <div className="relative group/upload">
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
            <div className="w-full py-5 border-2 border-dashed border-[#4A4A5A] rounded-2xl flex items-center justify-center space-x-3 text-[#A0AEC0] group-hover/upload:border-[#fafa33] group-hover/upload:text-white transition-all bg-[#24212b]/50">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              <span className="text-xs font-bold">Upload transfer receipt</span>
            </div>
          </div>

          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-5 rounded-2xl bg-[#fafa33] text-[#24212b] font-black hover:bg-[#ffff4d] flex items-center justify-center transition-all shadow-lg shadow-[#fafa33]/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-3 border-[#24212b]/20 border-t-[#24212b] rounded-full animate-spin"></div>
            ) : (
              <>
                <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                Confirm Submission
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={!isSubmitting ? onClose : undefined}
      ></div>

      <div className="relative w-full max-w-md bg-[#2E2B38] border border-[#4A4A5A] rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 flex flex-col max-h-[95vh] overflow-hidden">
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {step === 'summary' && renderSummary()}
          {step === 'upi' && renderUPI()}
          {step === 'neft' && renderNEFT()}
        </div>
        
        {/* Progress indicator for multi-step */}
        <div className="px-8 pb-4 flex justify-center space-x-2">
            <div className={`h-1 rounded-full transition-all duration-300 ${step === 'summary' ? 'w-8 bg-[#fafa33]' : 'w-2 bg-[#4A4A5A]'}`}></div>
            <div className={`h-1 rounded-full transition-all duration-300 ${step !== 'summary' ? 'w-8 bg-[#fafa33]' : 'w-2 bg-[#4A4A5A]'}`}></div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
