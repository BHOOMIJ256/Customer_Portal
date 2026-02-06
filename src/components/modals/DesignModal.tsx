
import React, { useState } from 'react';

interface DesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  onRequestRevisions: (specs: string) => void;
}

const DesignModal: React.FC<DesignModalProps> = ({ isOpen, onClose, onApprove, onRequestRevisions }) => {
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [revisionSpecs, setRevisionSpecs] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-4xl bg-[#2E2B38] border border-[#4A4A5A] rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 overflow-hidden text-[#F5F7FA]">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-black text-[#F5F7FA] font-rubik uppercase tracking-tight">COMPLETE DESIGN REVIEW</h2>
              <p className="text-[#A0AEC0] text-sm mt-1">Project: Sharma Residence • Concept 3.0</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-[#24212b] rounded-full text-[#A0AEC0] transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-video bg-[#24212b] rounded-2xl overflow-hidden border border-[#4A4A5A] relative group">
                <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800" alt="Main View" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="aspect-video bg-[#24212b] rounded-2xl overflow-hidden border border-[#4A4A5A]">
                <img src="https://images.unsplash.com/photo-1616486341351-702524479580?auto=format&fit=crop&q=80&w=800" alt="Top View" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <div className="bg-[#24212b] rounded-3xl p-6 border border-[#4A4A5A] mb-8">
            <h3 className="text-xs font-black text-[#A0AEC0] uppercase tracking-widest mb-4">Design Specifications</h3>
            <ul className="space-y-2 text-sm text-[#F5F7FA]">
              <li className="flex items-center"><span className="w-1.5 h-1.5 bg-[#fafa33] rounded-full mr-3"></span>Contemporary Minimalist Theme</li>
              <li className="flex items-center"><span className="w-1.5 h-1.5 bg-[#A0AEC0] rounded-full mr-3"></span>Italian Marble Flooring (Grigio Carnico)</li>
              <li className="flex items-center"><span className="w-1.5 h-1.5 bg-[#A0AEC0] rounded-full mr-3"></span>Custom Walnut Veneer Paneling</li>
              <li className="flex items-center"><span className="w-1.5 h-1.5 bg-[#A0AEC0] rounded-full mr-3"></span>Smart Ambient Lighting Integration</li>
            </ul>
          </div>

          <div className="flex justify-center mb-8">
            <button className="flex items-center text-[#A0AEC0] hover:text-[#fafa33] text-sm font-bold transition-colors group">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              View High Resolution Renders
            </button>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-[#4A4A5A]/50">
            <button onClick={() => setShowRevisionForm(true)} className="flex-1 py-4 rounded-2xl border border-[#4A4A5A] text-[#F5F7FA] font-bold hover:bg-[#393645] transition-all bg-[#2E2B38]">
              Request Revisions
            </button>
            <button onClick={onApprove} className="flex-1 py-4 rounded-2xl bg-[#fafa33] text-[#24212b] font-black hover:bg-[#ffff4d] shadow-lg shadow-[#fafa33]/10 transition-all">
              Approve Design
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignModal;