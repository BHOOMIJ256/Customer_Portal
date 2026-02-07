
import React, { useState } from 'react';
import { SegmentType, ConsultationSession, ProjectStage } from '../types';
import consultationsData from '../data/consultations.json';
import toast from 'react-hot-toast';
import { updateStage } from '../services/api';
import EstimateModal from './modals/EstimateModal';
import DesignModal from './modals/DesignModal';
import PaymentModal from './modals/PaymentModal';

interface SegmentContentProps {
  type: SegmentType;
  recents?: any[];
  userRole?: string;
  onRefresh?: () => void;
  portalData?: any; // To pass other data like opportunities needed for modals
}

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<ConsultationSession>) => void;
  initialData?: ConsultationSession;
}

const ConsultationModal: React.FC<ConsultationModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    topic: initialData?.topic || '',
    date: initialData?.date || '',
    time: initialData?.time || '',
    duration: initialData?.duration || '30 mins',
    notes: initialData?.notes || ''
  });

  // Update form data when initialData changes
  React.useEffect(() => {
    if (initialData) {
      setFormData({
        topic: initialData.topic,
        date: initialData.date,
        time: initialData.time,
        duration: initialData.duration,
        notes: initialData.notes || ''
      });
    } else {
      setFormData({
        topic: '',
        date: '',
        time: '',
        duration: '30 mins',
        notes: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1E1B24] border border-[#4A4A5A] w-full max-w-lg rounded-[2rem] shadow-2xl p-8 relative animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-6 right-6 text-[#A0AEC0] hover:text-white">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-[#F5F7FA] font-rubik mb-1">Schedule Consultation</h2>
        <p className="text-sm text-[#A0AEC0] mb-8">Fill in the details to request a new session.</p>

        <div className="space-y-5">
          <div>
            <label className="block text-[11px] font-black text-[#A0AEC0] uppercase tracking-widest mb-2">Topic / Agenda</label>
            <input
              type="text"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              className="w-full bg-[#2E2B38] border border-[#4A4A5A] rounded-xl px-4 py-3 text-[#F5F7FA] focus:outline-none focus:border-[#fafa33] transition-colors"
              placeholder="e.g., Kitchen Material Finalization"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black text-[#A0AEC0] uppercase tracking-widest mb-2">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-[#2E2B38] border border-[#4A4A5A] rounded-xl px-4 py-3 text-[#F5F7FA] focus:outline-none focus:border-[#fafa33]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-black text-[#A0AEC0] uppercase tracking-widest mb-2">Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full bg-[#2E2B38] border border-[#4A4A5A] rounded-xl px-4 py-3 text-[#F5F7FA] focus:outline-none focus:border-[#fafa33]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-black text-[#A0AEC0] uppercase tracking-widest mb-2">Duration</label>
            <select
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full bg-[#2E2B38] border border-[#4A4A5A] rounded-xl px-4 py-3 text-[#F5F7FA] focus:outline-none focus:border-[#fafa33]"
            >
              <option>30 mins</option>
              <option>45 mins</option>
              <option>1 hour</option>
              <option>1.5 hours</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-black text-[#A0AEC0] uppercase tracking-widest mb-2">Additional Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-[#2E2B38] border border-[#4A4A5A] rounded-xl px-4 py-3 text-[#F5F7FA] focus:outline-none focus:border-[#fafa33] min-h-[100px]"
              placeholder="Any specific questions or points to discuss?"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button onClick={onClose} className="px-6 py-3 rounded-xl text-sm font-bold text-[#A0AEC0] hover:text-white transition-colors">
            Cancel
          </button>
          <button
            onClick={() => onSubmit(formData)}
            className="bg-[#fafa33] text-[#24212b] px-8 py-3 rounded-xl text-sm font-black hover:bg-[#ffff4d] shadow-lg shadow-[#fafa33]/20 active:scale-95 transition-all"
          >
            Confirm Schedule
          </button>
        </div>
      </div>
    </div>
  );
};


const SegmentContent: React.FC<SegmentContentProps> = ({ type, recents = [], userRole = 'client', onRefresh, portalData }) => {
  const data = (consultationsData as any);

  const [sessions, setSessions] = useState<ConsultationSession[]>(consultationsData as unknown as ConsultationSession[]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<ConsultationSession | undefined>(undefined);

  // Modal States for Workflow
  const [isEstimateModalOpen, setEstimateModalOpen] = useState(false);
  const [isDesignModalOpen, setDesignModalOpen] = useState(false);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);


  // Separate upcoming and past
  const upcomingSessions = sessions.filter(s => s.status === 'Scheduled' || s.status === 'Pending');
  const pastSessions = sessions.filter(s => s.status === 'Completed');

  const handleOpenSchedule = () => {
    setEditingSession(undefined);
    setIsModalOpen(true);
  };

  const handleOpenReschedule = (session: ConsultationSession) => {
    setEditingSession(session);
    setIsModalOpen(true);
  };

  const handleSessionSubmit = (data: Partial<ConsultationSession>) => {
    if (editingSession) {
      // Update existing
      const updatedSessions = sessions.map(s =>
        s.id === editingSession.id
          ? { ...s, ...data }
          : s
      );
      setSessions(updatedSessions as ConsultationSession[]);
    } else {
      // Create new
      const newSession: ConsultationSession = {
        id: `CS-${Date.now()}`,
        phone_number: "9876543210",
        subject: data.topic || 'New Consultation', // Required by interface
        description: data.notes || '', // Required by interface
        topic: data.topic || 'New Consultation',
        date: data.date || new Date().toISOString().split('T')[0],
        time: data.time || '10:00',
        duration: data.duration || '30 mins',
        status: 'Scheduled',
        consultant: 'Unassigned', // Required by interface
        type: 'In-Person',
        notes: data.notes,
        requested_by: 'client'
      };
      setSessions([newSession, ...sessions]);
    }
    setIsModalOpen(false);
  };

  const renderPayments = () => {
    const DUMMY_PAYMENTS = [
      {
        phone_number: "9876543210",
        invoice_id: "INV-2024-001",
        description: "Booking Advance",
        amount: 150000,
        status: "Payment received",
        date: "2024-01-15"
      },
      {
        phone_number: "9876543210",
        invoice_id: "INV-2024-005",
        description: "Design Phase Payment",
        amount: 75000,
        status: "Payment received",
        date: "2024-02-01"
      },
      {
        phone_number: "9876543210",
        invoice_id: "INV-2024-012",
        description: "Final Project Settlement",
        amount: 225000,
        status: "Payment received",
        date: "2024-02-15"
      }
    ];

    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="bg-[#2E2B38] border border-[#4A4A5A] rounded-[2rem] overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-widest bg-[#24212b]/50 border-b border-[#4A4A5A]">
              <tr>
                <th className="px-6 py-4">Invoice ID</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#4A4A5A]">
              {DUMMY_PAYMENTS.map((p, idx) => (
                <tr key={idx} className="hover:bg-[#24212b]/30 transition-colors">
                  <td className="px-6 py-5 font-bold text-[#fafa33]/90 text-[11px] font-rubik tracking-wider">{p.invoice_id}</td>
                  <td className="px-6 py-5 font-bold text-[#F5F7FA]">{p.description}</td>
                  <td className="px-6 py-5 text-[#A0AEC0]">{p.date}</td>
                  <td className="px-6 py-5 font-bold text-[#F5F7FA]">₹{p.amount.toLocaleString()}</td>
                  <td className="px-6 py-5">
                    <span className="text-[10px] font-black uppercase px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderConsultation = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header Action */}
      {/* Header Action */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-black text-[#F5F7FA] font-rubik">Consultation</h3>
          <p className="text-sm text-[#A0AEC0] mt-1">Manage all your consultation related to this project.</p>
        </div>
        <button
          onClick={handleOpenSchedule}
          className="bg-[#fafa33] text-[#24212b] px-6 py-3 rounded-xl text-xs font-black hover:bg-[#ffff4d] transition-all active:scale-95 shadow-lg shadow-[#fafa33]/10 flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Schedule New
        </button>
      </div>

      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSessionSubmit}
        initialData={editingSession}
      />

      {/* Workflow Modals rendered globally */}



      {/* Upcoming Sessions */}
      <div className="space-y-4">
        <h4 className="text-[11px] font-black text-[#A0AEC0] uppercase tracking-widest pl-1">Upcoming</h4>
        {upcomingSessions.length === 0 ? (
          <div className="bg-[#2E2B38]/50 border border-[#4A4A5A] rounded-[2rem] p-8 text-center border-dashed">
            <p className="text-[#A0AEC0] text-sm italic">No upcoming sessions scheduled.</p>
          </div>
        ) : (
          upcomingSessions.map(session => (
            <div key={session.id} className="bg-[#2E2B38] border border-[#4A4A5A] p-6 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 hover:border-[#fafa33]/30 transition-all group">
              <div className="flex items-center space-x-5">
                <div className="flex flex-col items-center bg-[#24212b] px-4 py-3 rounded-2xl border border-[#4A4A5A] min-w-[80px]">
                  <span className="text-[10px] text-[#A0AEC0] font-black uppercase tracking-widest">{session.date.split('-')[1] || 'OCT'}</span>
                  <span className="text-2xl font-bold text-[#F5F7FA]">{session.date.split('-')[2] || '20'}</span>
                  <span className="text-[10px] text-[#fafa33] font-bold">{session.time}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#F5F7FA]">{session.topic}</h3>
                  {session.notes && (
                    <p className="text-sm text-[#A0AEC0] mt-1 line-clamp-1 border-t border-[#4A4A5A]/30 pt-2 mt-2">
                      <span className="text-[#fafa33]/70 text-[10px] uppercase font-bold mr-2">Note:</span>
                      {session.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3 w-full md:w-auto">
                <button
                  onClick={() => handleOpenReschedule(session)}
                  className="flex-1 md:flex-none bg-[#24212b] text-[#A0AEC0] border border-[#4A4A5A] px-5 py-3 rounded-xl text-xs font-bold hover:text-white hover:border-[#A0AEC0] transition-all"
                >
                  Reschedule
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Past Sessions */}
      <div className="space-y-4 pt-4">
        <h4 className="text-[11px] font-black text-[#A0AEC0] uppercase tracking-widest pl-1">Past History</h4>
        {pastSessions.length === 0 ? (
          <div className="bg-[#2E2B38]/50 border border-[#4A4A5A] rounded-[2rem] p-6 text-center">
            <p className="text-[#A0AEC0] text-sm italic">No past sessions found.</p>
          </div>
        ) : (
          pastSessions.map(session => (
            <div key={session.id} className="bg-[#2E2B38]/60 border border-[#4A4A5A] p-5 rounded-[2rem] flex items-center justify-between opacity-75 hover:opacity-100 transition-opacity">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-[#4A4A5A]/20 flex items-center justify-center text-[#A0AEC0]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#F5F7FA] decoration-slice">{session.topic}</h4>
                  <p className="text-[11px] text-[#A0AEC0]">{session.date} • {session.duration}</p>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase text-[#A0AEC0] bg-[#4A4A5A]/20 px-3 py-1 rounded-full">Completed</span>
            </div>
          ))
        )}
      </div>
    </div>
  );

  /* -------------------------------------------------------------------------
   * DOCUMENTS TAB IMPLEMENTATION
   * ----------------------------------------------------------------------- */

  // Mock Data for Documents
  const mockMyDocuments: any[] = [
    {
      subject: 'My Identity Proof',
      description: 'Aadhar Card / PAN Card copy submitted for verification.',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    },
    {
      subject: 'Property Layout',
      description: 'Original floor plan provided by builder.',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    }
  ];

  const mockOtherDocuments: any[] = [
    {
      subject: 'Material Catalog 2024',
      description: 'Latest collection of laminates and veneers.',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    },
    {
      subject: 'Service Agreement',
      description: 'Signed copy of the design service agreement.',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    },
    {
      subject: 'Warranty Card',
      description: 'Standard warranty terms for modular furniture.',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    }
  ];

  const renderGenericDocuments = (docs: any[], emptyMsg: string) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {docs && docs.length > 0 ? docs.map((doc, idx) => (
        <div
          key={idx}
          onClick={(e) => {
            e.stopPropagation();
            window.open(doc.url, '_blank', 'noopener,noreferrer');
          }}
          className="bg-[#1E1B24] border border-[#3A3A4A] p-6 rounded-[2rem] flex items-center gap-5 group hover:border-[#fafa33]/40 hover:bg-[#24212b] transition-all cursor-pointer relative overflow-hidden"
        >
          {/* Icon Container */}
          <div className="w-14 h-14 rounded-2xl bg-[#2E2B38] flex items-center justify-center text-[#fafa33] shadow-lg shadow-black/20 group-hover:scale-110 transition-transform">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-base font-bold text-[#F5F7FA] mb-1 truncate group-hover:text-[#fafa33] transition-colors font-rubik">
              {doc.subject}
            </h4>
            <p className="text-xs text-[#A0AEC0] font-medium leading-relaxed line-clamp-2">
              {doc.description}
            </p>
          </div>

          {/* Arrow Icon */}
          <div className="text-[#4A4A5A] group-hover:text-[#fafa33] group-hover:translate-x-1 transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      )) : (
        <div className="col-span-full bg-[#2E2B38]/50 border border-[#4A4A5A] rounded-[2rem] p-10 text-center border-dashed">
          <p className="text-[#A0AEC0] text-sm italic">{emptyMsg}</p>
        </div>
      )}
    </div>
  );

  const renderInvoices = () => (
    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {data?.invoices && data.invoices.length > 0 ? data.invoices.map((inv, idx) => (
        <div key={idx} className="bg-[#2E2B38] border border-[#4A4A5A] p-6 rounded-[2rem] flex flex-col sm:flex-row sm:items-center justify-between group hover:bg-[#2E2B38]/60 transition-all">
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="w-10 h-10 rounded-xl bg-[#782e87]/20 text-[#782e87] flex items-center justify-center mr-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#F5F7FA]">{inv.id}</h4>
              <p className="text-[11px] text-[#A0AEC0] font-medium">{inv.description}</p>
            </div>
          </div>
          <div className="flex items-center justify-between sm:justify-end sm:space-x-12">
            <div className="text-right">
              <p className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-widest">Date</p>
              <p className="text-sm font-bold text-[#F5F7FA]">{inv.date}</p>
            </div>
            <div className="text-right min-w-[100px]">
              <p className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-widest">Total</p>
              <p className="text-sm font-bold text-[#fafa33]">₹{inv.amount.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )) : (
        <div className="bg-[#2E2B38]/50 border border-[#4A4A5A] rounded-[2rem] p-8 text-center">
          <p className="text-[#A0AEC0] text-sm italic">No invoices issued yet.</p>
        </div>
      )}
    </div>
  );

  const renderTickets = () => (
    <div className="bg-[#2E2B38] border border-[#4A4A5A] p-8 rounded-[2rem] text-center animate-in fade-in duration-500">
      <div className="w-16 h-16 bg-[#24212b] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#A0AEC0]">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-[#F5F7FA]">No Open Tickets</h3>
      <p className="text-sm text-[#A0AEC0] mt-1">Need assistance? Raise a new ticket for our team.</p>
      <button className="mt-6 bg-[#782e87] text-white px-8 py-3 rounded-2xl text-xs font-bold hover:bg-[#8e3ba0] transition-all">New Support Ticket</button>
    </div>
  );

  /* -------------------------------------------------------------------------
   * RECENTS TAB IMPLEMENTATION
   * ----------------------------------------------------------------------- */

  // Helper to check if a stage is active or completed (unlocked)
  const isStageUnlocked = (currentStage: string, targetStage: string) => {
    const stages = Object.values(ProjectStage);
    const currentIndex = stages.indexOf(currentStage as ProjectStage);
    const targetIndex = stages.indexOf(targetStage as ProjectStage);
    return currentIndex >= targetIndex;
  };

  const isStageCompleted = (currentStage: string, targetStage: string) => {
    const stages = Object.values(ProjectStage);
    const currentIndex = stages.indexOf(currentStage as ProjectStage);
    const targetIndex = stages.indexOf(targetStage as ProjectStage);
    return currentIndex > targetIndex;
  };

  const handleRecentsAction = (card: any) => {
    switch (card.type) {
      case 'estimate_request':
      case 'estimate_view':
      case 'estimate_review':
      case 'admin_estimate_upload':
      case 'admin_estimate_view':
        setEstimateModalOpen(true);
        break;
      case 'design_review':
      case 'design_view':
      case 'admin_design_upload':
      case 'admin_design_view':
        setDesignModalOpen(true);
        break;
      case 'booking_pay':
      case 'booking_verify':
      case 'admin_verify_payment':
        setPaymentModalOpen(true);
        break;
      default:
        toast('Feature coming soon: ' + card.action);
    }
  };

  const renderRecents = () => {
    if (!recents || recents.length === 0) {
      return (
        <div className="bg-[#2E2B38]/50 border border-[#4A4A5A] rounded-[2rem] p-8 text-center animate-in fade-in">
          <p className="text-[#A0AEC0] text-sm italic">No active cards found.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
        {recents.map((card, idx) => {
          // Determine styling based on status
          const isCompleted = card.status === 'approved' || card.status === 'paid' || card.status === 'verified';

          return (
            <div key={card.id || idx} className="bg-[#1E1B24] border border-[#3A3A4A] p-6 rounded-[2rem] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group hover:border-[#fafa33]/20 transition-all">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#F5F7FA] font-rubik mb-2">{card.subject}</h3>
                <p className="text-sm text-[#A0AEC0] leading-relaxed max-w-xl">{card.description}</p>

                {/* Status Badge mobile */}
                <div className="md:hidden mt-3">
                  <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg tracking-wider ${isCompleted ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-[#fafa33]/10 text-[#fafa33] border border-[#fafa33]/20'
                    }`}>
                    {card.status}
                  </span>
                </div>
              </div>

              <div className="hidden md:flex flex-col items-end space-y-4 min-w-[140px]">
                <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg tracking-wider ${isCompleted ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-[#fafa33]/10 text-[#fafa33] border border-[#fafa33]/20'
                  }`}>
                  {card.status}
                </span>

                <button
                  onClick={() => handleRecentsAction(card)}
                  className="flex items-center space-x-2 bg-[#782e87] hover:bg-[#9d3cb0] text-white px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-lg shadow-[#782e87]/20 active:scale-95"
                >
                  <span>{card.action || 'View'}</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderModals = () => {
    const phone = portalData?.user?.phoneNumber;

    return (
      <>
        <EstimateModal
          isOpen={isEstimateModalOpen}
          onClose={() => setEstimateModalOpen(false)}
          currentStage={ProjectStage.ESTIMATE_GENERATION} // Pass dynamic if available
          userRole={userRole as any}
          onApprove={async () => {
            if (phone) {
              await updateStage(phone, 'approved', 'estimate');
              toast.success('Estimate Approved');
            }
            setEstimateModalOpen(false);
            if (onRefresh) onRefresh();
          }}
          opportunity={portalData?.opportunities?.[0] || null} // Pass real opp
          onUpdate={() => {
            if (onRefresh) onRefresh();
          }}
        />
        <DesignModal
          isOpen={isDesignModalOpen}
          onClose={() => setDesignModalOpen(false)}
          onApprove={async () => {
            if (phone) {
              await updateStage(phone, 'approved', 'design');
              toast.success('Design Approved');
            }
            setDesignModalOpen(false);
            if (onRefresh) onRefresh();
          }}
          onRequestRevisions={async (specs) => {
            if (phone) {
              await updateStage(phone, 'changes requested', { type: 'design', revisions: specs });
              toast.success('Revisions Requested');
            }
            // Close handled by modal? Or should close here?
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


  return (
    <>
      {(() => {
        switch (type) {
          case 'Recents': return renderRecents(demoStage);
          case 'Consultation': return renderConsultation();
          case 'Payments': return renderPayments();
          case 'My Documents': return renderGenericDocuments(mockMyDocuments, 'No personal documents found.');
          case 'Other Documents': return renderGenericDocuments(mockOtherDocuments, 'No other documents shared.');
          case 'Invoices': return renderInvoices();
          case 'Tickets': return renderTickets();
          default: return null;
        }
      })()}
      {renderModals()}
    </>
  );
};

export default SegmentContent;


