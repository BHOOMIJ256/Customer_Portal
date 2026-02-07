import React, { useState } from 'react';
import { SegmentType, PortalData, RecentAction } from '../types';
import { hritaApi } from '../services/api';
import toast from 'react-hot-toast';
import EstimateModal from './modals/EstimateModal';

interface SegmentContentProps {
  type: SegmentType;
  recents: RecentAction[];
  portalData?: PortalData;
  userRole: 'admin' | 'client' | 'architect';
  onRefresh: () => Promise<void>;
}

const SegmentContent: React.FC<SegmentContentProps> = ({
  type,
  recents,
  portalData,
  userRole,
  onRefresh
}) => {
  const isAdmin = userRole === 'admin';
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAction = async (item: RecentAction) => {
    const actionKey = `${item.subject}-${item.status}`;

    if (item.action === "Create Estimate" || item.action === "Upload") {
      setIsModalOpen(true);
      return;
    }

    setLoadingKey(actionKey);
    try {
      if (item.action?.includes("View")) {
        const docId = item.subject.includes('Design')
          ? portalData?.designs?.[0]?.document_id
          : portalData?.estimates?.[0]?.document_id;
        if (docId) window.open(`https://drive.google.com{docId}/view`, '_blank');
        else toast.error('Document ID not found');
      } else if (item.action === "Pay") {
        const type = item.subject.includes('Booking') ? 'booking' : 'shipping';
        await hritaApi.payCharges(portalData?.user.phoneNumber || '', 5000, type);
        toast.success('Payment Verification Pending');
      }
      onRefresh();
    } catch (error) {
      toast.error('Action failed');
    } finally {
      setLoadingKey(null);
    }
  };

  if (type !== 'Recents') return null;

  return (
    <>
      <div className="grid gap-6">
        {recents.length === 0 && !isAdmin && (
          <div className="bg-[#2E2B38] border border-[#fafa33]/20 p-12 rounded-[3rem] text-center">
            <h3 className="text-[#F5F7FA] font-black text-2xl mb-4 italic uppercase">No Projects Yet</h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#fafa33] text-[#24212b] px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform"
            >
              Create Estimate Request
            </button>
          </div>
        )}

        {recents.map((item, idx) => (
          <div key={idx} className="bg-[#2E2B38] border border-[#4A4A5A] p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-[#F5F7FA] font-black text-xl italic uppercase tracking-tighter">{item.subject}</h3>
                <span className="px-3 py-1 bg-[#fafa33]/10 text-[#fafa33] text-[10px] font-black uppercase rounded-full border border-[#fafa33]/20">
                  {item.status}
                </span>
              </div>
              <p className="text-[#A0AEC0] text-sm">{item.description}</p>
            </div>
            {item.action && (
              <button
                onClick={() => handleAction(item)}
                disabled={loadingKey === `${item.subject}-${item.status}`}
                className="w-full md:w-auto px-10 py-4 bg-[#fafa33] text-[#24212b] rounded-2xl text-xs font-black uppercase tracking-widest active:scale-95 transition-all"
              >
                {loadingKey === `${item.subject}-${item.status}` ? '...' : item.action}
              </button>
            )}
          </div>
        ))}
      </div>

      <EstimateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        opportunity={portalData?.opportunity || null}
        userRole={userRole}
        onUpdate={onRefresh}
        phone={portalData?.user.phoneNumber}
        estimateId={portalData?.estimates?.[0]?.id}
      />
    </>
  );
};

export default SegmentContent;
