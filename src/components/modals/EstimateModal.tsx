import React from 'react';
import { Opportunity, User, ProjectStage } from '../../types';
import toast from 'react-hot-toast';
import { mockStore } from '../../services/mockStore';

interface EstimateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  opportunity: Opportunity | null;
  userRole: 'admin' | 'client' | 'architect';
  onUpdate: () => void;
  myDocuments?: any[];
  currentStage?: ProjectStage;
}

const EstimateModal: React.FC<EstimateModalProps> = ({ isOpen, onClose, onApprove, opportunity, userRole, onUpdate, myDocuments, currentStage }) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showRevisionInput, setShowRevisionInput] = React.useState(false);
  const [showViewers, setShowViewers] = React.useState(false);
  const [revisionText, setRevisionText] = React.useState('');
  const [selectedVersion, setSelectedVersion] = React.useState<'v1' | 'v2' | 'Latest'>('Latest');
  const [viewersInput, setViewersInput] = React.useState('');

  const [formData, setFormData] = React.useState({
    city: '',
    property_type: 'Apartment',
    bhk: '2 BHK',
    square_feat: '',
    layout_url: '',
    wiring_done: 'No',
    possession_status: 'Already Possessed',
    service_required: ''
  });

  const estimateVersionsData = {
    'v1': {
      items: [
        { desc: 'Initial Interior Design', amount: 50000 },
        { desc: 'Basic Flooring', amount: 80000 }
      ],
      viewers: ['9876543210'],
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf?v1'
    },
    'v2': {
      items: [
        { desc: 'Refined Interior Design', amount: 65000 },
        { desc: 'Premium Flooring & Civil', amount: 110000 },
        { desc: 'Specialized Lighting', amount: 45000 }
      ],
      viewers: ['9876543210', '9123456789'],
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf?v2'
    },
    'Latest': {
      items: [
        { desc: 'Interior Design & 3D Renders', amount: 75000 },
        { desc: 'Flooring & Civil Work', amount: 125000 },
        { desc: 'Electrical & Plumbing Fixes', amount: 90000 },
        { desc: 'Custom Furniture & Cabinetry', amount: 160000 }
      ],
      viewers: ['9876543210', '9123456789', 'Architect-1'],
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf?latest'
    }
  };

  const [versions, setVersions] = React.useState(estimateVersionsData);

  if (!isOpen) return null;

  const currentStatus = currentStage || (mockStore.getClientState(opportunity?.phone_number || '').status as any) || opportunity?.status;
  const isLeadCollected = currentStatus === ProjectStage.LEAD_COLLECTED || !opportunity;
  const isAdmin = userRole === 'admin';

  const handleSubmitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    const phone = opportunity?.phone_number || 'DEMO_USER';

    setIsSubmitting(true);
    setTimeout(() => {
      if (opportunity?.phone_number) {
        mockStore.submitDetails(phone, formData);
      }
      toast.success('Details submitted successfully!');
      setIsSubmitting(false);
      onClose();
      if (onUpdate) onUpdate();
    }, 500);
  };

  const handleSuggestChanges = () => {
    if (!revisionText.trim()) {
      toast.error("Please enter specific changes needed.");
      return;
    }
    mockStore.requestChanges(opportunity?.phone_number || '', revisionText);
    toast.success('Revision request sent.');
    setShowRevisionInput(false);
    onClose();
  };

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
    toast.success('Viewer added successfully!');
  };

  const handleRemoveViewer = (indexToRemove: number) => {
    setVersions(prev => ({
      ...prev,
      [selectedVersion]: {
        ...prev[selectedVersion],
        viewers: prev[selectedVersion].viewers.filter((_, idx) => idx !== indexToRemove)
      }
    }));
    toast.success('Viewer removed.');
  };

  const currentVersionData = versions[selectedVersion];
  const totalEstimate = currentVersionData.items.reduce((acc, item) => acc + item.amount, 0);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-lg bg-[#2E2B38] border border-[#4A4A5A] rounded-[2rem] shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 overflow-hidden flex flex-col">
        {isLeadCollected && !isAdmin ? (
          /* Lead Form logic for "Fill Details" - Compacted for no-scroll */
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#F5F7FA] font-rubik">Project Initiation</h2>
              <button onClick={onClose} className="p-1.5 hover:bg-[#24212b] rounded-full text-[#A0AEC0] transition-colors"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <form onSubmit={handleSubmitDetails} className="space-y-3">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-black text-[#A0AEC0] uppercase tracking-widest ml-1">City</label>
                    <input required className="w-full bg-[#24212b] border border-[#4A4A5A] rounded-lg px-3 py-2 text-sm text-[#F5F7FA] focus:border-[#fafa33] outline-none" value={formData.city} onChange={e => setFormData(p => ({ ...p, city: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-[#A0AEC0] uppercase tracking-widest ml-1">Property Type</label>
                    <select className="w-full bg-[#24212b] border border-[#4A4A5A] rounded-lg px-3 py-2 text-sm text-[#F5F7FA] focus:border-[#fafa33] outline-none" value={formData.property_type} onChange={e => setFormData(p => ({ ...p, property_type: e.target.value }))}>
                      <option>Apartment</option>
                      <option>Villa</option>
                      <option>Independent House</option>
                      <option>Commercial</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-black text-[#A0AEC0] uppercase tracking-widest ml-1">BHK</label>
                    <select className="w-full bg-[#24212b] border border-[#4A4A5A] rounded-lg px-3 py-2 text-sm text-[#F5F7FA] focus:border-[#fafa33] outline-none" value={formData.bhk} onChange={e => setFormData(p => ({ ...p, bhk: e.target.value }))}>
                      <option>1 BHK</option>
                      <option>2 BHK</option>
                      <option>3 BHK</option>
                      <option>4+ BHK</option>
                      <option>Commercial</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-[#A0AEC0] uppercase tracking-widest ml-1">Square Feet</label>
                    <input required type="number" className="w-full bg-[#24212b] border border-[#4A4A5A] rounded-lg px-3 py-2 text-sm text-[#F5F7FA] focus:border-[#fafa33] outline-none" value={formData.square_feat} onChange={e => setFormData(p => ({ ...p, square_feat: e.target.value }))} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-black text-[#A0AEC0] uppercase tracking-widest ml-1">Electrical Wiring</label>
                    <select className="w-full bg-[#24212b] border border-[#4A4A5A] rounded-lg px-3 py-2 text-sm text-[#F5F7FA] focus:border-[#fafa33] outline-none" value={formData.wiring_done} onChange={e => setFormData(p => ({ ...p, wiring_done: e.target.value }))}>
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-[#A0AEC0] uppercase tracking-widest ml-1">Possession Status</label>
                    <select className="w-full bg-[#24212b] border border-[#4A4A5A] rounded-lg px-3 py-2 text-sm text-[#F5F7FA] focus:border-[#fafa33] outline-none" value={formData.possession_status} onChange={e => setFormData(p => ({ ...p, possession_status: e.target.value }))}>
                      <option>Already Possessed</option>
                      <option>In Progress</option>
                      <option>Yet to Receive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-black text-[#A0AEC0] uppercase tracking-widest ml-1">Layout URL</label>
                  <input className="w-full bg-[#24212b] border border-[#4A4A5A] rounded-lg px-3 py-2 text-sm text-[#F5F7FA] focus:border-[#fafa33] outline-none" placeholder="Paste layout / floor plan link (optional)" value={formData.layout_url} onChange={e => setFormData(p => ({ ...p, layout_url: e.target.value }))} />
                </div>

                <div>
                  <label className="text-[9px] font-black text-[#A0AEC0] uppercase tracking-widest ml-1">Services Required</label>
                  <textarea className="w-full bg-[#24212b] border border-[#4A4A5A] rounded-lg px-3 py-2 text-sm text-[#F5F7FA] focus:border-[#fafa33] outline-none min-h-[60px] resize-none" placeholder="Briefly describe the services you are looking for" value={formData.service_required} onChange={e => setFormData(p => ({ ...p, service_required: e.target.value }))} />
                </div>
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-[#fafa33] text-[#24212b] py-3.5 rounded-xl text-sm font-black hover:bg-[#ffff4d] transition-all disabled:opacity-50 mt-2">{isSubmitting ? 'Processing...' : 'Submit Details'}</button>
            </form>
          </div>
        ) : (
          /* REVIEW ESTIMATE MODE - Optimized for No-Scroll */
          <div className="p-6 md:p-8 flex flex-col h-full max-h-screen">
            <div className="flex justify-between items-start mb-1.5">
              <div className="flex flex-col">
                <div className="flex items-center space-x-3 mb-1.5">
                  <h2 className="text-xl md:text-2xl font-bold text-[#F5F7FA] font-rubik">Project Estimate</h2>
                  <span className="bg-[#fafa33]/20 text-[#fafa33] border border-[#fafa33]/30 text-xs font-black px-2 py-0.5 rounded uppercase tracking-widest">Submitted</span>
                </div>
                {/* Version Selector */}
                <div className="flex space-x-1.5">
                  {(['v1', 'v2', 'Latest'] as const).map(v => (
                    <button
                      key={v}
                      onClick={() => setSelectedVersion(v)}
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full transition-all border ${selectedVersion === v
                        ? 'bg-[#fafa33] text-[#24212b] border-[#fafa33]'
                        : 'bg-[#24212b] text-[#A0AEC0] border-[#4A4A5A] hover:border-[#fafa33]/50'
                        }`}
                    >
                      {v.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={onClose} className="text-[#A0AEC0] hover:text-white transition-colors p-1"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <p className="text-[#A0AEC0] text-xs mb-4">Requested: 2023-10-10 • Submitted: 2023-10-12</p>

            {/* Compact Collapsible Estimate Viewer */}
            <div className="bg-[#24212b]/50 border border-[#4A4A5A] rounded-xl p-3 mb-3 relative overflow-hidden transition-all duration-300">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-black text-[#A0AEC0] uppercase tracking-widest">Estimate Viewers</span>
                  <span className="bg-[#4A4A5A] text-[#F5F7FA] text-xs px-1.5 py-0.5 rounded-full font-bold">{currentVersionData.viewers.length}</span>
                </div>
                <button
                  onClick={() => setShowViewers(!showViewers)}
                  className="text-[#fafa33] text-xs font-black hover:underline uppercase tracking-tighter transition-all"
                >
                  {showViewers ? 'CLOSE' : 'MANAGE VIEWERS'}
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
                      placeholder="Add Phone / Name"
                      value={viewersInput}
                      onChange={e => setViewersInput(e.target.value)}
                    />
                    <button
                      onClick={handleAddViewer}
                      className="bg-[#2E2B38] border border-[#4A4A5A] text-[#fafa33] px-2 py-1 rounded-lg text-[10px] font-black hover:bg-[#3A3A4A] transition-all"
                    >
                      ADD
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-[#24212b] border border-[#4A4A5A] rounded-2xl p-4 md:p-5 mb-4 shadow-inner flex-shrink-0">
              <div className="flex justify-between text-xs font-black text-[#A0AEC0] uppercase tracking-widest mb-3 border-b border-[#4A4A5A] pb-1.5">
                <span>Description</span>
                <span>Amount</span>
              </div>
              <div className="space-y-2">
                {currentVersionData.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm font-bold text-[#F5F7FA]">
                    <span className="opacity-90 leading-snug">{item.desc}</span>
                    <span className="text-[#fafa33] text-sm">₹{item.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-[#4A4A5A] flex justify-between items-center">
                <span className="text-base font-bold text-[#F5F7FA]">Total Estimate</span>
                <span className="text-2xl font-black text-[#fafa33] font-rubik">₹{totalEstimate.toLocaleString()}</span>
              </div>
            </div>

            {/* Combined Compact Action Row */}
            <div className="flex justify-between items-center mb-6 px-1">
              <button
                onClick={() => window.open(currentVersionData.pdfUrl, '_blank')}
                className="text-[#fafa33] hover:text-[#ffff4d] text-[10px] font-black transition-all flex items-center"
              >
                <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                VIEW DETAILED PDF
              </button>
              <button className="text-[#A0AEC0] hover:text-white text-[10px] font-bold transition-all flex items-center">
                <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                DOWNLOAD PDF
              </button>
            </div>

            {showRevisionInput ? (
              <div className="space-y-3 animate-in slide-in-from-bottom-2 duration-300">
                <textarea
                  className="w-full bg-[#24212b] border border-[#4A4A5A] rounded-xl px-3 py-2 text-xs text-[#F5F7FA] focus:border-[#fafa33] outline-none min-h-[60px] resize-none"
                  placeholder="Describe specific changes needed..."
                  value={revisionText}
                  onChange={e => setRevisionText(e.target.value)}
                />
                <div className="flex gap-2.5">
                  <button onClick={() => setShowRevisionInput(false)} className="flex-1 py-2.5 bg-[#2E2B38] text-[#A0AEC0] rounded-xl font-bold text-[10px] hover:text-white transition-all">Cancel</button>
                  <button onClick={handleSuggestChanges} className="flex-1 py-2.5 bg-[#fafa33] text-[#24212b] rounded-xl font-black text-[10px] hover:bg-[#ffff4d] transition-all">Submit Revision</button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3 mt-auto">
                <button
                  onClick={() => setShowRevisionInput(true)}
                  className="flex-1 py-3.5 rounded-xl border border-[#4A4A5A] text-[#A0AEC0] text-xs font-bold hover:text-white transition-all bg-[#24212b]/30"
                >
                  Request Revisions
                </button>
                <button
                  onClick={onApprove}
                  className="flex-1 py-3.5 rounded-xl bg-[#fafa33] text-[#24212b] text-xs font-black hover:bg-[#ffff4d] shadow-lg shadow-[#fafa33]/10 transition-all active:scale-95"
                >
                  Confirm & Book
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EstimateModal;
