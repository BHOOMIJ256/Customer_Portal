
import React, { useState } from 'react';
import { SegmentType, ConsultationSession } from '../types';
import consultationsData from '../data/consultations.json';

interface SegmentContentProps {
  type: SegmentType;
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

  // Update form data when initialData changes (for reschedule)
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
      // Reset if no initial data (adding new)
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

const SegmentContent: React.FC<SegmentContentProps> = ({ type }) => {
  const [sessions, setSessions] = useState<ConsultationSession[]>(consultationsData as unknown as ConsultationSession[]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<ConsultationSession | undefined>(undefined);

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
        phone_no: "9876543210",
        topic: data.topic || 'New Consultation',
        date: data.date || new Date().toISOString().split('T')[0],
        time: data.time || '10:00',
        duration: data.duration || '30 mins',
        status: 'Scheduled',
        type: 'In-Person',
        notes: data.notes,
        requested_by: 'client'
      };
      setSessions([newSession, ...sessions]);
    }
    setIsModalOpen(false);
  };

  const renderPayments = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-[#2E2B38] border border-[#4A4A5A] rounded-[2rem] overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-widest bg-[#24212b]/50 border-b border-[#4A4A5A]">
            <tr>
              <th className="px-6 py-4">Transaction</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#4A4A5A]">
            <tr className="hover:bg-[#24212b]/30 transition-colors">
              <td className="px-6 py-5 font-bold text-[#F5F7FA]">Site Analysis Fee</td>
              <td className="px-6 py-5 text-[#A0AEC0]">Oct 12, 2023</td>
              <td className="px-6 py-5 font-bold text-[#F5F7FA]">₹5,000</td>
              <td className="px-6 py-5">
                <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase px-2 py-1 rounded-md">Paid</span>
              </td>
            </tr>
            <tr className="hover:bg-[#24212b]/30 transition-colors">
              <td className="px-6 py-5 font-bold text-[#F5F7FA]">Booking Advance</td>
              <td className="px-6 py-5 text-[#A0AEC0]">Pending Action</td>
              <td className="px-6 py-5 font-bold text-[#F5F7FA]">₹1,50,000</td>
              <td className="px-6 py-5">
                <span className="bg-[#fafa33]/10 text-[#fafa33] text-[10px] font-black uppercase px-2 py-1 rounded-md">Due</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

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

  const renderDocuments = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {[
        { name: 'Project Proposal', date: 'Oct 14, 2023', size: '2.4 MB' },
        { name: 'Initial Design Brief', date: 'Oct 15, 2023', size: '1.1 MB' },
        { name: 'Site Measurements', date: 'Oct 12, 2023', size: '4.8 MB' },
        { name: 'Material Specifications', date: 'Pending', size: '-' }
      ].map((doc, idx) => (
        <div key={idx} className="bg-[#2E2B38] border border-[#4A4A5A] p-5 rounded-[2rem] flex items-center group hover:border-[#fafa33]/30 transition-all cursor-pointer">
          <div className="w-12 h-12 rounded-2xl bg-[#24212b] flex items-center justify-center mr-4 text-[#782e87] group-hover:text-[#fafa33] transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-[#F5F7FA] group-hover:text-[#fafa33] transition-colors">{doc.name}</h4>
            <div className="flex items-center text-[10px] text-[#A0AEC0] font-black uppercase tracking-wider mt-1">
              <span>{doc.date}</span>
              <span className="mx-2 opacity-30">•</span>
              <span>{doc.size}</span>
            </div>
          </div>
          <button className="text-[#A0AEC0] hover:text-[#fafa33]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );

  const renderInvoices = () => (
    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {[
        { id: 'INV-2023-001', name: 'Analysis & Consultation', date: 'Oct 12, 2023', total: '₹5,000' },
        { id: 'INV-2023-082', name: 'Phase 1: Project Initiation', date: 'Generating...', total: '₹1,50,000' }
      ].map((inv, idx) => (
        <div key={idx} className="bg-[#2E2B38] border border-[#4A4A5A] p-6 rounded-[2rem] flex flex-col sm:flex-row sm:items-center justify-between group hover:bg-[#2E2B38]/60 transition-all">
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="w-10 h-10 rounded-xl bg-[#782e87]/20 text-[#782e87] flex items-center justify-center mr-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#F5F7FA]">{inv.id}</h4>
              <p className="text-[11px] text-[#A0AEC0] font-medium">{inv.name}</p>
            </div>
          </div>
          <div className="flex items-center justify-between sm:justify-end sm:space-x-12">
            <div className="text-right">
              <p className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-widest">Date</p>
              <p className="text-sm font-bold text-[#F5F7FA]">{inv.date}</p>
            </div>
            <div className="text-right min-w-[100px]">
              <p className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-widest">Total</p>
              <p className="text-sm font-bold text-[#fafa33]">{inv.total}</p>
            </div>
          </div>
        </div>
      ))}
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

  switch (type) {
    case 'Consultation': return renderConsultation();
    case 'Payments': return renderPayments();
    case 'My Documents': return renderDocuments();
    case 'Invoices': return renderInvoices();
    case 'Tickets': return renderTickets();
    default: return null;
  }
};

export default SegmentContent;
