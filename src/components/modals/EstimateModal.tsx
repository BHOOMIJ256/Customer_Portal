
import { Opportunity } from '../../types';

interface EstimateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  opportunity: Opportunity | null;
}

const EstimateModal: React.FC<EstimateModalProps> = ({ isOpen, onClose, onApprove, opportunity }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-[#2E2B38] border border-[#4A4A5A] rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[#F5F7FA] font-rubik">Project Estimate</h2>
              <p className="text-[#A0AEC0] text-sm mt-1">Ref: {opportunity?.id || '#HR-PENDING'} • {opportunity?.date_prepared || 'In Review'}</p>
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
            <div className="bg-[#24212b] p-6 rounded-3xl border border-[#4A4A5A]">
              <div className="flex justify-between items-center mb-4 border-b border-[#4A4A5A] pb-4">
                <span className="text-[#A0AEC0] font-bold text-xs uppercase tracking-widest">Description</span>
                <span className="text-[#A0AEC0] font-bold text-xs uppercase tracking-widest">Amount</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#F5F7FA]">Interior Design & 3D Renders</span>
                  <span className="text-[#F5F7FA] font-bold">₹75,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#F5F7FA]">Flooring & Civil Work</span>
                  <span className="text-[#F5F7FA] font-bold">₹1,25,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#F5F7FA]">Electrical & Plumbing Fixes</span>
                  <span className="text-[#F5F7FA] font-bold">₹90,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#F5F7FA]">Custom Furniture & Cabinetry</span>
                  <span className="text-[#F5F7FA] font-bold">₹1,60,000</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-[#4A4A5A] flex justify-between items-center">
                <span className="text-[#F5F7FA] font-bold">Total Estimate</span>
                <span className="text-[#fafa33] text-2xl font-black font-rubik">₹{(opportunity?.booking_amount || 450000).toLocaleString()}</span>
              </div>
            </div>

            <div className="text-center px-4">
              <a
                href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-[#A0AEC0] hover:text-[#fafa33] text-sm font-bold transition-colors group"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                View the PDF
                <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
              </a>
            </div>
          </div>
        </div>

        <div className="p-8 bg-[#24212b]/50 border-t border-[#4A4A5A] flex flex-col sm:flex-row gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-8 py-4 rounded-2xl bg-[#2E2B38] border border-[#4A4A5A] text-[#F5F7FA] font-bold hover:bg-[#393645] transition-all font-rubik"
          >
            Later
          </button>
          <button
            onClick={onApprove}
            className="flex-1 px-8 py-4 rounded-2xl bg-[#fafa33] text-[#24212b] font-black hover:bg-[#ffff4d] transition-all shadow-lg shadow-[#fafa33]/10 font-rubik"
          >
            Approve & Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default EstimateModal;
