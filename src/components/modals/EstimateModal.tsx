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

import { submitEstimateDetails, adminUploadEstimate, updateStage } from '../../services/api';

const EstimateModal: React.FC<EstimateModalProps> = ({ isOpen, onClose, onApprove, opportunity, userRole, onUpdate, myDocuments, currentStage }) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showRevisionInput, setShowRevisionInput] = React.useState(false);
  const [revisionText, setRevisionText] = React.useState('');

  const [formData, setFormData] = React.useState({
    city: '',
    property_type: 'Residential',
    bhk: '2BHK',
    square_feat: '',
    layout_url: '',
    wiring_done: 'No',
    possession_status: 'Ready to Move',
    service_required: 'Full Interior'
  });

  const [adminDoc, setAdminDoc] = React.useState({
    subject: 'Project Estimate',
    url: '',
    description: 'Detailed interior design estimate'
  });

  if (!isOpen) return null;

  const currentStatus = currentStage || (mockStore.getClientState(opportunity?.phone_number || '').status as any) || opportunity?.status;
  const isLeadCollected = currentStatus === ProjectStage.LEAD_COLLECTED || !opportunity;
  const isEstimateReady = currentStatus === 'Estimate ready' || currentStatus === ProjectStage.ESTIMATE_PROVIDED;
  const isAdmin = userRole === 'admin';


  const handleSubmitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    const phone = opportunity?.phone_number || 'DEMO';

    setIsSubmitting(true);
    try {
      await submitEstimateDetails({
        phone_number: phone,
        ...formData
      });
      toast.success('Details submitted successfully!');
      if (onUpdate) onUpdate();
      onClose();
    } catch (err) {
      toast.error('Failed to submit details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!opportunity?.phone_number) return;
    setIsSubmitting(true);
    try {
      await adminUploadEstimate(opportunity.phone_number, {
        ...adminDoc
      });
      toast.success('Estimate uploaded successfully!');
      if (onUpdate) onUpdate();
      onClose();
    } catch (err) {
      toast.error('Failed to upload estimate.');
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleSuggestChanges = () => {
    if (!revisionText.trim()) {
      toast.error("Please enter specific changes needed.");
      return;
    }
    mockStore.requestChanges(opportunity?.phone_number || '', revisionText);
    toast.success('Revision request sent.');
    onClose();
  };

  // Find document from MyDocuments if available
  const versionedDocs = myDocuments || [];
  const latestDoc = versionedDocs[versionedDocs.length - 1];
  const estimateUrl = latestDoc?.url || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

  // Mock Estimate Data
  const estimateItems = [
    { desc: 'Interior Design & 3D Renders', amount: 75000 },
    { desc: 'Flooring & Civil Work', amount: 125000 },
    { desc: 'Electrical & Plumbing Fixes', amount: 90000 },
    { desc: 'Custom Furniture & Cabinetry', amount: 160000 }
  ];

  const totalEstimate = estimateItems.reduce((acc, item) => acc + item.amount, 0);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-lg bg-[#2E2B38] border border-[#4A4A5A] rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 overflow-hidden">
        {isLeadCollected && !isAdmin ? (
          /* Reuse existing Lead Form logic for "Fill Details" if needed, or simplified */
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#F5F7FA] font-rubik">Project Initiation</h2>
              <button onClick={onClose} className="p-2 hover:bg-[#24212b] rounded-full text-[#A0AEC0] transition-colors"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <form onSubmit={handleSubmitDetails} className="space-y-4">
              {/* ... (Keep existing form fields for Lead Collection abbreviated for now or keep same) ... */}
              {/* For brevity, I am keeping the form fields basically same but wrapping them cleanly */}
              <div className="space-y-4">
                <div><label className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-widest ml-1">City</label><input required className="w-full bg-[#24212b] border border-[#4A4A5A] rounded-xl px-4 py-3 text-sm text-[#F5F7FA] focus:border-[#fafa33] outline-none" value={formData.city} onChange={e => setFormData(p => ({ ...p, city: e.target.value }))} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-widest ml-1">BHK</label><select className="w-full bg-[#24212b] border border-[#4A4A5A] rounded-xl px-4 py-3 text-sm text-[#F5F7FA] focus:border-[#fafa33] outline-none" value={formData.bhk} onChange={e => setFormData(p => ({ ...p, bhk: e.target.value }))} ><option>2BHK</option><option>3BHK</option></select></div>
                  <div><label className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-widest ml-1">Sq Ft</label><input required type="number" className="w-full bg-[#24212b] border border-[#4A4A5A] rounded-xl px-4 py-3 text-sm text-[#F5F7FA] focus:border-[#fafa33] outline-none" value={formData.square_feat} onChange={e => setFormData(p => ({ ...p, square_feat: e.target.value }))} /></div>
                </div>
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-[#fafa33] text-[#24212b] py-4 rounded-xl text-sm font-black hover:bg-[#ffff4d] transition-all disabled:opacity-50 mt-4">{isSubmitting ? 'Processing...' : 'Submit Details'}</button>
            </form>
          </div>
        ) : (
          /* REVIEW ESTIMATE MODE (Matches Screenshot) */
          <div className="p-8">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-3">
                <h2 className="text-2xl font-bold text-[#F5F7FA] font-rubik">Project Estimate</h2>
                <span className="bg-[#fafa33]/20 text-[#fafa33] border border-[#fafa33]/30 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Submitted</span>
              </div>
              <button onClick={onClose} className="text-[#A0AEC0] hover:text-white"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <p className="text-[#A0AEC0] text-xs mb-8">Requested: 2023-10-10 • Submitted: 2023-10-12</p>

            <div className="bg-[#24212b] border border-[#4A4A5A] rounded-3xl p-6 mb-6">
              <div className="flex justify-between text-[10px] font-black text-[#A0AEC0] uppercase tracking-widest mb-4 border-b border-[#4A4A5A] pb-2">
                <span>Description</span>
                <span>Amount</span>
              </div>
              <div className="space-y-4">
                {estimateItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm font-bold text-[#F5F7FA]">
                    <span>{item.desc}</span>
                    <span>₹{item.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-[#4A4A5A] flex justify-between items-center">
                <span className="text-base font-bold text-[#F5F7FA]">Total Estimate</span>
                <span className="text-2xl font-black text-[#fafa33] font-rubik">₹{totalEstimate.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-center mb-8">
              <button className="flex items-center text-[#A0AEC0] hover:text-[#fafa33] text-sm font-bold transition-colors group">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Download Submitted PDF
              </button>
            </div>

            <div className="flex gap-4">
              <button onClick={onClose} className="flex-1 py-4 rounded-2xl border border-[#4A4A5A] text-[#A0AEC0] font-bold hover:text-white hover:border-[#A0AEC0] transition-all bg-transparent">
                Later
              </button>
              <button onClick={onApprove} className="flex-1 py-4 rounded-2xl bg-[#fafa33] text-[#24212b] font-black hover:bg-[#ffff4d] shadow-lg shadow-[#fafa33]/10 transition-all">
                Confirm & Book
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EstimateModal;
