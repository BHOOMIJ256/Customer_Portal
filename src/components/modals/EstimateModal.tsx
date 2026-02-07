import React, { useState } from 'react';
import { Opportunity, ProjectStage } from '../../types';
import toast from 'react-hot-toast';
import * as api from '../../services/api';

interface EstimateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  opportunity: Opportunity | null;
  userRole: 'admin' | 'client';
  onUpdate: () => void;
}

const EstimateModal: React.FC<EstimateModalProps> = ({
  isOpen,
  onClose,
  onApprove,
  opportunity,
  userRole,
  onUpdate
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    city: '',
    property_type: 'Residential',
    bhk: '2BHK',
    square_feat: '',
    wiring_done: 'No',
    possession_status: 'Ready to Move',
    service_required: 'Full Interior'
  });

  const [adminDocId, setAdminDocId] = useState('');

  if (!isOpen) return null;

  const isAdmin = userRole === 'admin';
  const phone = opportunity?.phone_number;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.submitEstimateDetails({ ...formData, phone_number: phone });
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
    setIsSubmitting(true);
    try {
      await api.uploadEstimate(phone!, adminDocId);
      toast.success('Estimate Uploaded');
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
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-[#2E2B38] border border-[#4A4A5A] rounded-[2.5rem] overflow-hidden">
        {isAdmin ? (
          <div className="p-8">
            <h2 className="text-2xl font-black text-[#F5F7FA] font-rubik mb-6">UPLOAD ESTIMATE</h2>
            <div className="space-y-4">
              <input
                className="w-full bg-[#24212b] border border-[#4A4A5A] rounded-2xl p-4 text-white"
                placeholder="Google Drive File ID"
                value={adminDocId}
                onChange={(e) => setAdminDocId(e.target.value)}
              />
              <button
                onClick={handleAdminUpload}
                disabled={isSubmitting}
                className="w-full bg-[#fafa33] text-[#24212b] py-4 rounded-2xl font-black"
              >
                {isSubmitting ? 'Uploading...' : 'Confirm Upload'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8">
            <h2 className="text-2xl font-black text-[#F5F7FA] font-rubik mb-6">REQUEST ESTIMATE</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <input
                required
                className="bg-[#24212b] border border-[#4A4A5A] rounded-xl p-3 text-white"
                placeholder="City"
                onChange={e => setFormData({ ...formData, city: e.target.value })}
              />
              <input
                required
                className="bg-[#24212b] border border-[#4A4A5A] rounded-xl p-3 text-white"
                placeholder="Square Feet"
                onChange={e => setFormData({ ...formData, square_feat: e.target.value })}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#fafa33] text-[#24212b] py-4 rounded-2xl font-black"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EstimateModal;