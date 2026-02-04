
import React, { useState } from 'react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onPaymentSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment gateway delay
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={!isProcessing ? onClose : undefined}
      ></div>
      
      <div className="relative w-full max-w-md bg-[#2E2B38] border border-[#4A4A5A] rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 overflow-hidden">
        {isProcessing ? (
          <div className="p-12 text-center space-y-6">
            <div className="w-20 h-20 border-4 border-[#fafa33]/20 border-t-[#fafa33] rounded-full animate-spin mx-auto"></div>
            <div>
              <h3 className="text-xl font-bold text-[#F5F7FA] font-rubik">Processing Payment</h3>
              <p className="text-[#A0AEC0] text-sm mt-2">Connecting to secure gateway...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-[#F5F7FA] font-rubik">Payment Secure</h2>
                  <p className="text-[#A0AEC0] text-sm mt-1 tracking-tight">Booking Advance • Installment 1</p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-[#24212b] rounded-full text-[#A0AEC0] transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-[#24212b] p-6 rounded-3xl border border-[#4A4A5A] text-center">
                  <span className="text-[#A0AEC0] text-xs font-black uppercase tracking-[0.2em]">Amount to Pay</span>
                  <div className="text-4xl font-black text-[#fafa33] font-rubik mt-2">₹1,50,000</div>
                  <div className="text-[10px] text-slate-500 mt-2 uppercase font-bold tracking-widest">Inclusive of 18% GST</div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between px-2 text-sm">
                    <span className="text-[#A0AEC0]">Project ID</span>
                    <span className="text-[#F5F7FA] font-bold">HR-2024-SHARMA</span>
                  </div>
                  <div className="flex items-center justify-between px-2 text-sm">
                    <span className="text-[#A0AEC0]">Phase</span>
                    <span className="text-[#F5F7FA] font-bold">Execution Kickoff</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-[#24212b] border border-[#4A4A5A] rounded-2xl flex flex-col items-center opacity-50 cursor-not-allowed">
                    <div className="w-6 h-6 bg-slate-700 rounded-md mb-1"></div>
                    <span className="text-[8px] font-black text-[#A0AEC0] uppercase">UPI</span>
                  </div>
                  <div className="p-3 bg-[#24212b] border border-[#fafa33]/50 rounded-2xl flex flex-col items-center cursor-pointer ring-2 ring-[#fafa33]/10">
                    <div className="w-6 h-6 bg-[#fafa33]/20 rounded-md mb-1 flex items-center justify-center">
                       <div className="w-3 h-3 bg-[#fafa33] rounded-sm"></div>
                    </div>
                    <span className="text-[8px] font-black text-[#fafa33] uppercase">Cards</span>
                  </div>
                  <div className="p-3 bg-[#24212b] border border-[#4A4A5A] rounded-2xl flex flex-col items-center opacity-50 cursor-not-allowed">
                    <div className="w-6 h-6 bg-slate-700 rounded-md mb-1"></div>
                    <span className="text-[8px] font-black text-[#A0AEC0] uppercase">Net Bank</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-[#24212b]/50 border-t border-[#4A4A5A]">
              <button 
                onClick={handlePayment}
                className="w-full px-8 py-5 rounded-2xl bg-[#fafa33] text-[#24212b] font-black hover:bg-[#ffff4d] transition-all shadow-xl shadow-[#fafa33]/10 font-rubik flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure Pay Now
              </button>
              <div className="mt-4 flex items-center justify-center space-x-4 opacity-40">
                <div className="text-[8px] font-black text-[#A0AEC0] uppercase tracking-widest italic">PCI DSS Compliant</div>
                <div className="h-3 w-[1px] bg-[#4A4A5A]"></div>
                <div className="text-[8px] font-black text-[#A0AEC0] uppercase tracking-widest italic">256-bit SSL</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
