import React, { useState } from 'react';
import { SegmentType, ConsultationSession } from '../types';
import toast from 'react-hot-toast';
import * as api from '../services/api';
import EstimateModal from './modals/EstimateModal';
import DesignModal from './modals/DesignModal';
import PaymentModal from './modals/PaymentModal';

interface SegmentContentProps {
  type: SegmentType;
  recents?: any[];
  userRole?: string;
  onRefresh?: () => void;
  portalData?: any;
}

const SegmentContent: React.FC<SegmentContentProps> = ({ type, recents = [], userRole, onRefresh, portalData }) => {
  const [isEstimateModalOpen, setEstimateModalOpen] = useState(false);
  const [isDesignModalOpen, setDesignModalOpen] = useState(false);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);

  const handleAction = (action: string) => {
    if (action.includes('Estimate')) {
      setEstimateModalOpen(true);
    } else if (action.includes('Design')) {
      setDesignModalOpen(true);
    } else if (action.includes('Pay') || action.includes('Booking')) {
      setPaymentModalOpen(true);
    } else {
      toast.success(`${action} coming soon`);
    }
  };

  const renderRecents = () => {
    // Inside SegmentContent.tsx - renderRecents function
    const renderRecents = () => {
      if (!recents || recents.length === 0) {
        return (
          <div className="py-20 text-center text-[#A0AEC0] bg-[#2E2B38] rounded-[2.5rem] border border-[#4A4A5A]">
            No recent activity found.
          </div>
        );
      }

      return (
        <div className="flex flex-col gap-4 w-full"> {/* Changed grid to flex-col w-full */}
          {recents.map((item, index) => (
            <div
              key={index}
              className="w-full bg-[#2E2B38] border border-[#4A4A5A] p-6 rounded-[2rem] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:border-[#fafa33]/50"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[#fafa33] text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-[#fafa33]/10 rounded-md">
                    {item.status}
                  </span>
                </div>
                <h3 className="text-[#F5F7FA] text-xl font-black font-rubik uppercase mb-1">
                  {item.subject}
                </h3>
                <p className="text-[#A0AEC0] text-sm font-medium leading-relaxed max-w-3xl">
                  {item.description}
                </p>
              </div>

              <button
                onClick={() => handleAction(item.action)}
                className="w-full md:w-auto bg-[#fafa33] text-[#24212b] px-8 py-4 rounded-2xl text-xs font-black uppercase hover:scale-105 transition-all active:scale-95 whitespace-nowrap"
              >
                {item.action}
              </button>
            </div>
          ))}
        </div>
      );
    };

    if (!recents || recents.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 bg-[#2E2B38] rounded-[2.5rem] border border-[#4A4A5A] border-dashed">
          <p className="text-[#A0AEC0] font-medium">No recent activities found.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recents.map((item, idx) => (
          <div key={idx} className="bg-[#2E2B38] border border-[#4A4A5A] p-6 rounded-[2.5rem] hover:border-[#fafa33]/50 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <span className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest ${item.status === 'pending' ? 'bg-orange-500/10 text-orange-500' :
                item.status === 'approved' || item.status === 'verified' ? 'bg-green-500/10 text-green-500' :
                  'bg-[#fafa33]/10 text-[#fafa33]'
                }`}>
                {item.status}
              </span>
            </div>
            <h3 className="text-xl font-bold text-[#F5F7FA] mb-2 font-rubik group-hover:text-[#fafa33] transition-colors">{item.subject}</h3>
            <p className="text-[#A0AEC0] text-sm mb-6 leading-relaxed line-clamp-2">{item.description}</p>
            <button
              onClick={() => handleAction(item.action)}
              className="w-full py-3 rounded-xl bg-[#24212b] text-[#F5F7FA] text-xs font-bold hover:bg-[#fafa33] hover:text-[#24212b] transition-all"
            >
              {item.action}
            </button>
          </div>
        ))}
      </div>
    );
  };

  const renderGenericDocuments = (docs: any[], emptyMsg: string) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {docs.length > 0 ? docs.map((doc, i) => (
        <div key={i} className="flex items-center justify-between p-4 bg-[#2E2B38] border border-[#4A4A5A] rounded-2xl">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-[#24212b] rounded-xl text-[#fafa33]">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <div>
              <p className="text-sm font-bold text-[#F5F7FA]">{doc.name || doc.subject || 'Document'}</p>
              <p className="text-[10px] text-[#A0AEC0] uppercase tracking-tighter">{doc.date || 'Project File'}</p>
            </div>
          </div>
          <a href={doc.url} target="_blank" rel="noreferrer" className="p-2 text-[#A0AEC0] hover:text-[#fafa33] transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          </a>
        </div>
      )) : (
        <div className="col-span-full py-12 text-center text-[#A0AEC0] bg-[#2E2B38] rounded-3xl border border-[#4A4A5A] border-dashed">{emptyMsg}</div>
      )}
    </div>
  );

  return (
    <>
      {(() => {
        switch (type) {
          case 'Recents': return renderRecents();
          case 'My Documents': return renderGenericDocuments(portalData?.myDocuments || [], 'No personal documents found.');
          case 'Other Documents': return renderGenericDocuments(portalData?.documents || [], 'No other documents shared.');
          default: return <div className="py-20 text-center text-[#A0AEC0] bg-[#2E2B38] rounded-[2.5rem] border border-[#4A4A5A]">{type} content is being integrated...</div>;
        }
      })()}

      <EstimateModal
        isOpen={isEstimateModalOpen}
        onClose={() => setEstimateModalOpen(false)}
        onApprove={async () => {
          await api.updateEstimateStatus(portalData?.user?.phoneNumber, 'approved');
          setEstimateModalOpen(false);
          if (onRefresh) onRefresh();
        }}
        opportunity={portalData?.opportunities?.[0] || null}
        userRole={(userRole as any) || 'client'}
        onUpdate={() => {
          if (onRefresh) onRefresh();
        }}
      />

      <DesignModal
        isOpen={isDesignModalOpen}
        onClose={() => setDesignModalOpen(false)}
        onApprove={() => {
          setDesignModalOpen(false);
          if (onRefresh) onRefresh();
        }}
        onRequestRevisions={() => {
          setDesignModalOpen(false);
          if (onRefresh) onRefresh();
        }}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onPaymentSuccess={() => {
          setPaymentModalOpen(false);
          if (onRefresh) onRefresh();
        }}
      />
    </>
  );
};

export default SegmentContent;