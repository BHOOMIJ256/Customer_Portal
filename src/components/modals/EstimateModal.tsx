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
}

const EstimateModal: React.FC<EstimateModalProps> = ({ isOpen, onClose, onApprove, opportunity, userRole, onUpdate, myDocuments }) => {
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

  const currentStatus = (mockStore.getClientState(opportunity?.phone_number || '').status as any) || opportunity?.status;
  const isLeadCollected = currentStatus === ProjectStage.LEAD_COLLECTED || !opportunity;
  const isEstimateReady = currentStatus === 'Estimate ready' || currentStatus === ProjectStage.ESTIMATE_PROVIDED;
  const isAdmin = userRole === 'admin';

  const handleSubmitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!opportunity?.phone_number) {
      toast.error("User identification missing");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      mockStore.submitDetails(opportunity.phone_number, formData);
      toast.success('Details submitted successfully!');
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  const handleAdminUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!opportunity?.phone_number) return;
    setIsSubmitting(true);
    setTimeout(() => {
      mockStore.addDocument(opportunity.phone_number, adminDoc.url);
      toast.success('Estimate uploaded successfully!');
      setIsSubmitting(false);
      onClose();
    }, 500);
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
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#F5F7FA] font-rubik">
                {isLeadCollected ? (isAdmin ? 'Upload Estimate' : 'Fill Project Details') : 'Project Estimate'}
              </h2>
              {!isLeadCollected && (
                <p className="text-[#A0AEC0] text-sm mt-1">Ref: {opportunity?.id || '#HR-PENDING'} • {opportunity?.date_prepared || 'In Review'}</p>
              )}
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

          {isLeadCollected ? (
            isAdmin ? (
              <form onSubmit={handleAdminUpload} className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-widest ml-1">Document URL</label>
                    <input
                      type="url"
                      required
                      placeholder="https://drive.google.com/..."
                      className="w-full bg-[#24212b] border border-[#4A4A5A] rounded-xl px-4 py-3 text-sm text-[#F5F7FA] focus:border-[#fafa33] outline-none transition-all"
                      value={adminDoc.url}
                      onChange={e => setAdminDoc(prev => ({ ...prev, url: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-widest ml-1">Description</label>
                    <textarea
                      placeholder="Enter estimate summary..."
                      className="w-full bg-[#24212b] border border-[#4A4A5A] rounded-xl px-4 py-3 text-sm text-[#F5F7FA] focus:border-[#fafa33] outline-none transition-all h-24"
                      value={adminDoc.description}
                      onChange={e => setAdminDoc(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#fafa33] text-[#24212b] py-4 rounded-xl text-sm font-black hover:bg-[#ffff4d] transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Uploading...' : 'Publish Estimate'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmitDetails} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-widest ml-1">City</label>
                    <input
                      required
                      className="w-full bg-[#24212b] border border-[#4A4A5A] rounded-xl px-4 py-3 text-sm text-[#F5F7FA] focus:border-[#fafa33] outline-none transition-all"
                      value={formData.city}
                      onChange={e => setFormData(p => ({ ...p, city: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-widest ml-1">Square Feet</label>
                    <input
                      required
                      type="number"
                      className="w-full bg-[#24212b] border border-[#4A4A5A] rounded-xl px-4 py-3 text-sm text-[#F5F7FA] focus:border-[#fafa33] outline-none transition-all"
                      value={formData.square_feat}
                      onChange={e => setFormData(p => ({ ...p, square_feat: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-widest ml-1">BHK</label>
                    <select
                      className="w-full bg-[#24212b] border border-[#4A4A5A] rounded-xl px-4 py-3 text-sm text-[#F5F7FA] focus:border-[#fafa33] outline-none transition-all"
                      value={formData.bhk}
                      onChange={e => setFormData(p => ({ ...p, bhk: e.target.value }))}
                    >
                      <option>1BHK</option>
                      <option>2BHK</option>
                      <option>3BHK</option>
                      <option>4BHK+</option>
                      <option>Villa</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-widest ml-1">Layout URL (Optional)</label>
                  <input
                    type="url"
                    className="w-full bg-[#24212b] border border-[#4A4A5A] rounded-xl px-4 py-3 text-sm text-[#F5F7FA] focus:border-[#fafa33] outline-none transition-all"
                    value={formData.layout_url}
                    placeholder="Link to floor plan"
                    onChange={e => setFormData(p => ({ ...p, layout_url: e.target.value }))}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#fafa33] text-[#24212b] py-4 rounded-xl text-sm font-black hover:bg-[#ffff4d] transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing...' : 'Submit Details'}
                </button>
              </form>
            )
          ) : (
            <div className="space-y-6">
              {versionedDocs.length > 1 && (
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-widest">Versions:</span>
                  <div className="flex space-x-1">
                    {versionedDocs.map((v, i) => (
                      <span key={i} className="px-2 py-0.5 bg-[#2E2B38] border border-[#4A4A5A] text-[#F5F7FA] text-[9px] font-bold rounded-md">V{i + 1}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-[#24212b] p-6 rounded-3xl border border-[#4A4A5A]">
                <div className="flex justify-between items-center mb-4 border-b border-[#4A4A5A] pb-4">
                  <span className="text-[#A0AEC0] font-bold text-xs uppercase tracking-widest">Pricing Overview</span>
                  <span className="text-[#A0AEC0] font-bold text-xs uppercase tracking-widest">Estimate</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#F5F7FA]">Civil & Structural</span>
                    <span className="text-[#F5F7FA] font-bold">Included</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#F5F7FA]">Interior & Furniture</span>
                    <span className="text-[#F5F7FA] font-bold">Included</span>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-[#4A4A5A] flex justify-between items-center">
                  <span className="text-[#F5F7FA] font-bold">Booking Amount</span>
                  <span className="text-[#fafa33] text-2xl font-black font-rubik">₹{(opportunity?.booking_amount || 0).toLocaleString()}</span>
                </div>
              </div>

              {showRevisionInput ? (
                <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                  <textarea
                    placeholder="Describe the changes you want..."
                    className="w-full bg-[#24212b] border border-[#4A4A5A] rounded-xl px-4 py-3 text-sm text-[#F5F7FA] focus:border-[#fafa33] outline-none transition-all h-24"
                    value={revisionText}
                    onChange={e => setRevisionText(e.target.value)}
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowRevisionInput(false)}
                      className="flex-1 px-4 py-3 rounded-xl bg-[#2E2B38] border border-[#4A4A5A] text-[#F5F7FA] text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSuggestChanges}
                      className="flex-1 px-4 py-3 rounded-xl bg-[#782e87] text-white text-xs font-bold shadow-lg"
                    >
                      Submit Feedback
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-center px-4">
                    <a
                      href={estimateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-[#A0AEC0] hover:text-[#fafa33] text-sm font-bold transition-colors group"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      View Detailed PDF
                      <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                    </a>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    {userRole !== 'admin' && (
                      <button
                        onClick={() => setShowRevisionInput(true)}
                        className="flex-1 px-8 py-4 rounded-2xl bg-[#2E2B38] border border-[#4A4A5A] text-[#F5F7FA] font-bold hover:bg-[#393645] transition-all font-rubik"
                      >
                        Suggest Changes
                      </button>
                    )}
                    <button
                      onClick={onApprove}
                      className="flex-1 px-8 py-4 rounded-2xl bg-[#fafa33] text-[#24212b] font-black hover:bg-[#ffff4d] transition-all shadow-lg shadow-[#fafa33]/10 font-rubik"
                    >
                      Approve & Proceed
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EstimateModal;
