
import { SegmentType, PortalData } from '../types';

interface SegmentContentProps {
  type: SegmentType;
  data: PortalData | null;
}

const SegmentContent: React.FC<SegmentContentProps> = ({ type, data }) => {
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
            {data?.payments && data.payments.length > 0 ? data.payments.map((p, idx) => (
              <tr key={idx} className="hover:bg-[#24212b]/30 transition-colors">
                <td className="px-6 py-5 font-bold text-[#F5F7FA]">{p.description}</td>
                <td className="px-6 py-5 text-[#A0AEC0]">{p.date}</td>
                <td className="px-6 py-5 font-bold text-[#F5F7FA]">₹{p.amount.toLocaleString()}</td>
                <td className="px-6 py-5">
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${p.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[#fafa33]/10 text-[#fafa33]'
                    }`}>{p.status}</span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-[#A0AEC0] italic">No payment history found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderConsultation = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-[#2E2B38] border border-[#4A4A5A] p-8 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-[#fafa33]/10 text-[#fafa33] flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#F5F7FA] font-rubik">Request Changes</h3>
          </div>
          <p className="text-[#A0AEC0] text-sm leading-relaxed max-w-xl">
            Need to update the design, change materials, or modify the scope? Submit a formal request here.
          </p>
        </div>
        <button
          onClick={() => alert("feature coming soon")}
          className="bg-[#fafa33] text-[#24212b] px-8 py-4 rounded-xl text-sm font-black hover:bg-[#ffff4d] transition-all active:scale-95 shadow-xl shadow-[#fafa33]/10 flex items-center whitespace-nowrap"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Modification
        </button>
      </div>

      <div className="px-2">
        <h4 className="text-[11px] font-black text-[#A0AEC0] uppercase tracking-widest mb-4">Past Consultations</h4>
        <div className="space-y-3">
          {data?.consultations && data.consultations.length > 0 ? data.consultations.map((c, idx) => (
            <div key={idx} className="bg-[#2E2B38]/50 border border-[#4A4A5A] rounded-[2rem] p-6 flex justify-between items-center">
              <div>
                <p className="text-[#F5F7FA] font-bold">{c.subject}</p>
                <p className="text-[10px] text-[#A0AEC0] uppercase tracking-widest mt-1">{c.date} @ {c.time} • {c.consultant}</p>
              </div>
              <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${c.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[#fafa33]/10 text-[#fafa33]'
                }`}>{c.status}</span>
            </div>
          )) : (
            <div className="bg-[#2E2B38]/50 border border-[#4A4A5A] rounded-[2rem] p-8 text-center">
              <p className="text-[#A0AEC0] text-sm italic">No past modification requests found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {data?.documents && data.documents.length > 0 ? data.documents.map((doc, idx) => (
        <a key={idx} href={doc.url} target="_blank" rel="noreferrer" className="bg-[#2E2B38] border border-[#4A4A5A] p-5 rounded-[2rem] flex items-center group hover:border-[#fafa33]/30 transition-all cursor-pointer">
          <div className="w-12 h-12 rounded-2xl bg-[#24212b] flex items-center justify-center mr-4 text-[#782e87] group-hover:text-[#fafa33] transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-[#F5F7FA] group-hover:text-[#fafa33] transition-colors">{doc.subject}</h4>
            <div className="flex items-center text-[10px] text-[#A0AEC0] font-black uppercase tracking-wider mt-1">
              <span>{doc.description}</span>
            </div>
          </div>
          <button className="text-[#A0AEC0] hover:text-[#fafa33]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </a>
      )) : (
        <div className="col-span-full bg-[#2E2B38]/50 border border-[#4A4A5A] rounded-[2rem] p-8 text-center">
          <p className="text-[#A0AEC0] text-sm italic">No shared documents found.</p>
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
