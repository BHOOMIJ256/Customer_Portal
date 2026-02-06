
import React, { useState } from 'react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onPaymentSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('cards');

  if (!isOpen) return null;

  const handlePayment = () => {
    setIsProcessing(true);
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
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-black text-[#F5F7FA] font-rubik">Payment Secure</h2>
                  <p className="text-[#A0AEC0] text-sm mt-1">Booking Advance • Installment 1</p>
                </div>
                <button onClick={onClose} className="text-[#A0AEC0] hover:text-white"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>

              <div className="bg-[#24212b] border-2 border-[#4A4A5A]/50 rounded-[2rem] p-8 text-center mb-6">
                <span className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-widest">Amount to Pay</span>
                <h1 className="text-4xl font-black text-[#fafa33] font-rubik mt-2 mb-1">₹1,50,000</h1>
                <span className="text-[10px] font-bold text-[#5A5A6A] uppercase tracking-wider">Inclusive of 18% GST</span>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm py-2 border-b border-[#4A4A5A]/30">
                  <span className="text-[#A0AEC0]">Project ID</span>
                  <span className="text-[#F5F7FA] font-bold">HR-2024-SHARMA</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b border-[#4A4A5A]/30">
                  <span className="text-[#A0AEC0]">Phase</span>
                  <span className="text-[#F5F7FA] font-bold">Execution Kickoff</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                {['UPI', 'Cards', 'Net Bank'].map((method) => {
                  const id = method.toLowerCase();
                  const isSelected = selectedMethod === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setSelectedMethod(id)}
                      className={`p-4 rounded-2xl flex flex-col items-center transition-all ${isSelected ? 'bg-[#fafa33]/10 border border-[#fafa33] text-[#fafa33]' : 'bg-[#24212b] border border-[#4A4A5A] text-[#A0AEC0] opacity-60 hover:opacity-100'
                        }`}
                    >
                      <div className={`w-3 h-3 rounded-full mb-2 ${isSelected ? 'bg-[#fafa33]' : 'bg-[#4A4A5A]'}`}></div>
                      <span className="text-[10px] font-black uppercase tracking-widest">{method}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="p-8 bg-[#24212b]/50 border-t border-[#4A4A5A]">
              <button onClick={handlePayment} className="w-full py-5 rounded-2xl bg-[#fafa33] text-[#24212b] font-black hover:bg-[#ffff4d] flex items-center justify-center transition-all shadow-lg shadow-[#fafa33]/10">
                <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                Secure Pay Now
              </button>
              <div className="flex justify-center space-x-6 mt-4 opacity-30">
                <span className="text-[9px] text-[#F5F7FA] font-black uppercase tracking-widest">PCI DSS Compliant</span>
                <span className="text-[9px] text-[#F5F7FA] font-black uppercase tracking-widest">256-Bit SSL</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
