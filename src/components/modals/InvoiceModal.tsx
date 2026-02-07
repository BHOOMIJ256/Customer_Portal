import React from 'react';
import { Invoice } from '../../types';

interface InvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    invoice: Invoice | null;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, invoice }) => {
    if (!isOpen || !invoice) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Background with Blur */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            ></div>

            {/* Modal Container */}
            <div className="relative w-full max-w-md bg-[#2E2B38] border border-[#4A4A5A] rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 overflow-hidden flex flex-col">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-black text-[#F5F7FA] font-rubik tracking-tight uppercase">{invoice.id}</h2>
                            <p className="text-[#A0AEC0] text-xs mt-1">Issued on {invoice.date}</p>
                        </div>
                        <div className="bg-[#fafa33]/10 border border-[#fafa33]/20 px-4 py-2 rounded-2xl">
                            <span className="text-lg font-black text-[#fafa33] font-rubik">₹{invoice.amount.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="bg-[#24212b] rounded-3xl p-6 border border-[#4A4A5A]/50 mb-6">
                        <h3 className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-widest mb-3">Description</h3>
                        <p className="text-sm font-bold text-[#F5F7FA] mb-1">{invoice.description}</p>
                        <p className="text-xs text-[#A0AEC0] leading-relaxed">
                            Design and execution services for the specified project phase.
                        </p>
                    </div>

                    {/* Info & Status */}
                    <div className="flex items-center justify-between px-2 mb-8">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-[#6A6A7A] uppercase tracking-widest leading-none mb-1">Billing Contact</span>
                            <span className="text-xs font-bold text-[#A0AEC0]">{invoice.phone_number}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">PAID</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => window.open('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '_blank')}
                                className="py-3.5 rounded-xl bg-[#393645] text-[#F5F7FA] text-xs font-bold hover:bg-[#4A4A5A] transition-all flex items-center justify-center group"
                            >
                                <svg className="w-4 h-4 mr-2 text-[#A0AEC0] group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                View PDF
                            </button>
                            <button
                                className="py-3.5 rounded-xl bg-[#393645] text-[#F5F7FA] text-xs font-bold hover:bg-[#4A4A5A] transition-all flex items-center justify-center group"
                            >
                                <svg className="w-4 h-4 mr-2 text-[#A0AEC0] group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                Download
                            </button>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-full py-3.5 rounded-xl border border-[#4A4A5A] text-[#A0AEC0] text-xs font-bold hover:text-white hover:border-[#F5F7FA] transition-all mt-1"
                        >
                            Close Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceModal;
