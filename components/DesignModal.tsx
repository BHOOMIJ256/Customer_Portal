
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

  const handleRevisionSubmit = () => {
    onRequestRevisions(revisionSpecs);
    setShowRevisionForm(false);
    setRevisionSpecs('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      ></div>
      
      <div className="relative w-full max-w-2xl bg-[#2E2B38] border border-[#4A4A5A] rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#F5F7FA] font-rubik uppercase tracking-tight">Complete Design Review</h2>
              <p className="text-[#A0AEC0] text-sm mt-1">Project: Sharma Residence • Concept 3.0</p>
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
            {/* Design Preview Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-video bg-[#24212b] rounded-2xl border border-[#4A4A5A] flex items-center justify-center overflow-hidden relative group">
                <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800" alt="Living Room" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <span className="text-[10px] font-black text-white uppercase tracking-widest bg-black/60 px-3 py-1 rounded">Main View</span>
                </div>
              </div>
              <div className="aspect-video bg-[#24212b] rounded-2xl border border-[#4A4A5A] flex items-center justify-center overflow-hidden relative group">
                <img src="https://images.unsplash.com/photo-1616486341351-702524479580?auto=format&fit=crop&q=80&w=800" alt="Bedroom" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <span className="text-[10px] font-black text-white uppercase tracking-widest bg-black/60 px-3 py-1 rounded">Top View</span>
                </div>
              </div>
            </div>

            <div className="bg-[#24212b] p-6 rounded-3xl border border-[#4A4A5A]">
              <h3 className="text-[#F5F7FA] font-bold text-sm mb-2 font-rubik uppercase tracking-wider">Design Specifications</h3>
              <ul className="text-sm text-[#A0AEC0] space-y-2 list-disc list-inside">
                <li>Contemporary Minimalist Theme</li>
                <li>Italian Marble Flooring (Grigio Carnico)</li>
                <li>Custom Walnut Veneer Paneling</li>
                <li>Smart Ambient Lighting Integration</li>
              </ul>
            </div>

            <div className="text-center">
              <button className="inline-flex items-center text-[#A0AEC0] hover:text-[#fafa33] text-sm font-bold transition-colors group">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                View High Resolution Renders
                <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
              </button>
            </div>

            {showRevisionForm && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <label className="block text-xs font-black text-[#A0AEC0] uppercase tracking-widest mb-2 ml-1">Additional Specifications / Revisions</label>
                <textarea 
                  className="w-full bg-[#24212b] border border-[#4A4A5A] rounded-2xl p-4 text-[#F5F7FA] text-sm focus:ring-1 focus:ring-[#fafa33] outline-none min-h-[100px]"
                  placeholder="e.g. Change the wall color to charcoal grey..."
                  value={revisionSpecs}
                  onChange={(e) => setRevisionSpecs(e.target.value)}
                />
                <div className="flex justify-end mt-2">
                   <button 
                    onClick={handleRevisionSubmit}
                    className="bg-[#782e87] text-white px-6 py-2 rounded-xl text-xs font-bold hover:bg-[#8e3ba0]"
                   >
                     Submit Revision
                   </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-8 bg-[#24212b]/50 border-t border-[#4A4A5A] flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => setShowRevisionForm(!showRevisionForm)}
            className="flex-1 px-8 py-4 rounded-2xl bg-[#2E2B38] border border-[#4A4A5A] text-[#F5F7FA] font-bold hover:bg-[#393645] transition-all font-rubik"
          >
            {showRevisionForm ? "Cancel Revision" : "Request Revisions"}
          </button>
          {!showRevisionForm && (
            <button 
              onClick={onApprove}
              className="flex-1 px-8 py-4 rounded-2xl bg-[#fafa33] text-[#24212b] font-black hover:bg-[#ffff4d] transition-all shadow-lg shadow-[#fafa33]/10 font-rubik"
            >
              Approve Design
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesignModal;