import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface DesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  onRequestRevisions: (specs: string) => void;
}

const DesignModal: React.FC<DesignModalProps> = ({ isOpen, onClose, onApprove, onRequestRevisions }) => {
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [revisionSpecs, setRevisionSpecs] = useState('');
  const [selectedVersion, setSelectedVersion] = useState<'V1' | 'V2'>('V2');
  const [showViewers, setShowViewers] = useState(false);
  const [viewersInput, setViewersInput] = useState('');

  const initialVersionsData = {
    'V1': {
      specs: [
        "Modern Minimalist Layout",
        "Light Wood Accents",
        "Recessed Lighting",
        "Open Concept Kitchen"
      ],
      viewers: ["9876543210"],
      pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf?design_v1"
    },
    'V2': {
      specs: [
        "Industrial Chic Theme",
        "Exposed Brick Wall",
        "Pendant Lighting Fixtures",
        "Polished Concrete Flooring"
      ],
      viewers: ["9876543210", "Designer-A"],
      pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf?design_v2"
    }
  };

  const [versions, setVersions] = useState(initialVersionsData);

  if (!isOpen) return null;

  const currentVersionData = versions[selectedVersion];

  const handleAddViewer = () => {
    if (!viewersInput.trim()) return;
    setVersions(prev => ({
      ...prev,
      [selectedVersion]: {
        ...prev[selectedVersion],
        viewers: [...prev[selectedVersion].viewers, viewersInput.trim()]
      }
    }));
    setViewersInput('');
    toast.success('Viewer added.');
  };

  const handleRemoveViewer = (idxToRemove: number) => {
    setVersions(prev => ({
      ...prev,
      [selectedVersion]: {
        ...prev[selectedVersion],
        viewers: prev[selectedVersion].viewers.filter((_, idx) => idx !== idxToRemove)
      }
    }));
    toast.success('Viewer removed.');
  };

  const handleRevisionSubmit = () => {
    if (!revisionSpecs.trim()) {
      toast.error("Please enter specific feedback.");
      return;
    }
    onRequestRevisions(revisionSpecs);
    toast.success('Revision request sent.');
    setShowRevisionForm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-lg bg-[#2E2B38] border border-[#4A4A5A] rounded-[2rem] shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 overflow-hidden text-[#F5F7FA] flex flex-col">
        <div className="p-6 md:p-8 flex flex-col h-full max-h-screen">
          <div className="flex justify-between items-start mb-1.5">
            <div className="flex flex-col">
              <div className="flex items-center space-x-3 mb-1.5">
                <h2 className="text-xl md:text-2xl font-bold text-[#F5F7FA] font-rubik">Design Review</h2>
                <span className="bg-[#fafa33]/20 text-[#fafa33] border border-[#fafa33]/30 text-xs font-black px-2 py-0.5 rounded uppercase tracking-widest">Active</span>
              </div>
              <div className="flex space-x-1.5">
                {(['V1', 'V2'] as const).map(v => (
                  <button
                    key={v}
                    onClick={() => setSelectedVersion(v)}
                    className={`text-[10px] font-black px-3 py-0.5 rounded-full transition-all border ${selectedVersion === v
                      ? 'bg-[#fafa33] text-[#24212b] border-[#fafa33]'
                      : 'bg-[#24212b] text-[#A0AEC0] border-[#4A4A5A] hover:border-[#fafa33]/50'
                      }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-[#24212b] rounded-full text-[#A0AEC0] transition-colors"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
          <p className="text-[#A0AEC0] text-xs mb-4">Project: Sharma Residence • Concept Review</p>

          {/* Compact Collapsible Design Viewers */}
          <div className="bg-[#24212b]/50 border border-[#4A4A5A] rounded-xl p-3 mb-3 relative overflow-hidden transition-all duration-300">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black text-[#A0AEC0] uppercase tracking-widest">Design Viewers</span>
                <span className="bg-[#4A4A5A] text-[#F5F7FA] text-xs px-1.5 py-0.5 rounded-full font-bold">{currentVersionData.viewers.length}</span>
              </div>
              <button
                onClick={() => setShowViewers(!showViewers)}
                className="text-[#fafa33] text-xs font-black hover:underline uppercase tracking-tighter"
              >
                {showViewers ? 'CLOSE' : 'MANAGE'}
              </button>
            </div>

            {showViewers && (
              <div className="mt-3 animate-in slide-in-from-top-1 duration-200">
                <div className="flex flex-wrap gap-1 mb-2 max-h-[40px] overflow-y-auto custom-scrollbar">
                  {currentVersionData.viewers.map((viewer, idx) => (
                    <span key={idx} className="text-[10px] bg-[#2E2B38] text-[#F5F7FA] pr-1 pl-1.5 py-0.5 rounded border border-[#4A4A5A] flex items-center space-x-1">
                      <span>{viewer}</span>
                      <button onClick={() => handleRemoveViewer(idx)} className="hover:text-red-400 transition-colors">
                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-1.5">
                  <input
                    className="flex-1 bg-[#24212b] border border-[#4A4A5A] rounded-lg px-2 py-1 text-xs text-[#F5F7FA] outline-none focus:border-[#fafa33]"
                    placeholder="Add Name / Phone"
                    value={viewersInput}
                    onChange={e => setViewersInput(e.target.value)}
                  />
                  <button
                    onClick={handleAddViewer}
                    className="bg-[#2E2B38] border border-[#4A4A5A] text-[#fafa33] px-2 py-1 rounded-lg text-[10px] font-black hover:bg-[#3A3A4A]"
                  >
                    ADD
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-[#24212b] border border-[#4A4A5A] rounded-2xl p-5 mb-4 shadow-inner flex-shrink-0">
            <h3 className="text-xs font-black text-[#A0AEC0] uppercase tracking-widest mb-3 border-b border-[#4A4A5A] pb-1.5">Design Specifications</h3>
            <ul className="space-y-2 text-sm text-[#F5F7FA]">
              {currentVersionData.specs.map((spec, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-[#fafa33] rounded-full mr-3 mt-1.5 flex-shrink-0"></span>
                  <span className="opacity-90 leading-snug">{spec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-between items-center mb-6 px-1">
            <button
              onClick={() => window.open(currentVersionData.pdfUrl, '_blank')}
              className="text-[#fafa33] hover:text-[#ffff4d] text-[10px] font-black transition-all flex items-center"
            >
              <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              VIEW DESIGN PDF
            </button>
          </div>

          {showRevisionForm ? (
            <div className="space-y-3 animate-in slide-in-from-bottom-2 duration-300">
              <textarea
                className="w-full bg-[#24212b] border border-[#4A4A5A] rounded-xl px-3 py-2 text-xs text-[#F5F7FA] focus:border-[#fafa33] outline-none min-h-[60px] resize-none"
                placeholder="Describe design changes needed..."
                value={revisionSpecs}
                onChange={e => setRevisionSpecs(e.target.value)}
              />
              <div className="flex gap-2.5">
                <button onClick={() => setShowRevisionForm(false)} className="flex-1 py-2.5 bg-[#2E2B38] text-[#A0AEC0] rounded-xl font-bold text-[10px] hover:text-white transition-all">Cancel</button>
                <button onClick={handleRevisionSubmit} className="flex-1 py-2.5 bg-[#fafa33] text-[#24212b] rounded-xl font-black text-[10px] hover:bg-[#ffff4d] transition-all">Submit Feedback</button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3 mt-auto">
              <button
                onClick={() => setShowRevisionForm(true)}
                className="flex-1 py-3.5 rounded-xl border border-[#4A4A5A] text-[#A0AEC0] text-xs font-bold hover:text-white transition-all bg-[#24212b]/30"
              >
                Request Revisions
              </button>
              <button
                onClick={onApprove}
                className="flex-1 py-3.5 rounded-xl bg-[#fafa33] text-[#24212b] text-xs font-black hover:bg-[#ffff4d] shadow-lg shadow-[#fafa33]/10 transition-all active:scale-95"
              >
                Approve Design
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesignModal;
