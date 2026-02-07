import React, { useState } from 'react';
import { Opportunity, User } from '../../types';
import toast from 'react-hot-toast';
import { hritaApi } from '../../services/api';

interface EstimateModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: Opportunity | null;
  userRole: 'admin' | 'client' | 'architect';
  onUpdate: () => void;
  phone?: string;
  estimateId?: string;
}

const EstimateModal: React.FC<EstimateModalProps> = ({
  isOpen,
  onClose,
  opportunity,
  userRole,
  onUpdate,
  phone,
  estimateId
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adminDocId, setAdminDocId] = useState('');
  const [formData, setFormData] = useState({
    city: '',
    property_type: 'Residential',
    bhk: '2BHK',
    square_feat: '',
    wiring_done: 'No',
    possession_status: 'Ready to Move',
    service_required: 'Full Home Automation'
  });

  if (!isOpen) return null;

  const isAdmin = userRole === 'admin';
  const targetPhone = phone || opportunity?.phone_number;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPhone) return toast.error('User reference missing');
    setIsSubmitting(true);
    try {
      await hritaApi.submitEstimate({
        ...formData,
        phone_number: targetPhone,
        square_feat: Number(formData.square_feat)
      });
      toast.success('Estimate Request Submitted');
      onUpdate();
      onClose();
    } catch (error) {
      toast.error('Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminUpload = async () => {
    if (!adminDocId) return toast.error('Enter Document ID');
    if (!estimateId) return toast.error('Estimate reference missing');
    setIsSubmitting(true);
    try {
      await hritaApi.uploadEstimate(estimateId, adminDocId);
      toast.success('Estimate Linked Successfully');
      onUpdate();
      onClose();
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose}></div>
      <div className="relative w-full max-w-lg bg-[#2E2B38] border border-[#4A4A5A] rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="p-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-black text-[#F5F7FA] tracking-tighter uppercase italic">
              {isAdmin ? 'Upload Estimate' : 'Request Estimate'}
            </h2>
            <button onClick={onClose} className="text-[#A0AEC0] hover:text-[#fafa33] transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {isAdmin ? (
            <div className="space-y-6">
              <div>
                <label className="text-[#A0AEC0] text-[10px] font-black uppercase mb-2 block ml-2">Drive File ID</label>
                <input
                  className="w-full bg-[#24212b] border border-[#4A4A5A] rounded-2xl p-5 text-white focus:border-[#fafa33] outline-none transition-all font-mono text-sm"
                  placeholder="Paste Google Drive File ID"
                  value={adminDocId}
                  onChange={(e) => setAdminDocId(e.target.value)}
                />
              </div>
              <button
                onClick={handleAdminUpload}
                disabled={isSubmitting}
                className="w-full bg-[#fafa33] text-[#24212b] py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:shadow-[0_0_20px_rgba(250,250,51,0.3)] transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Processing...' : 'Link Document'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[#A0AEC0] text-[10px] font-black uppercase ml-2">City</label>
                  <input
                    required
                    className="w-full bg-[#24212b] border border-[#4A4A5A] rounded-2xl p-4 text-white focus:border-[#fafa33] outline-none"
                    placeholder="e.g. Mumbai"
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[#A0AEC0] text-[10px] font-black uppercase ml-2">Area (Sq Ft)</label>
                  <input
                    required
                    type="number"
                    className="w-full bg-[#24212b] border border-[#4A4A5A] rounded-2xl p-4 text-white focus:border-[#fafa33] outline-none"
                    placeholder="1200"
                    onChange={e => setFormData({ ...formData, square_feat: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[#A0AEC0] text-[10px] font-black uppercase ml-2">Service Required</label>
                <select
                  className="w-full bg-[#24212b] border border-[#4A4A5A] rounded-2xl p-4 text-white focus:border-[#fafa33] outline-none"
                  onChange={e => setFormData({ ...formData, service_required: e.target.value })}
                >
                  <option>Full Home Automation</option>
                  <option>Security & Surveillance</option>
                  <option>Lighting Control</option>
                  <option>Smart Entertainment</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#fafa33] text-[#24212b] py-5 mt-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:shadow-[0_0_20px_rgba(250,250,51,0.3)] transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Transmitting...' : 'Submit Request'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EstimateModal;
