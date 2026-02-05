import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface AddLeadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string, phone: string) => void;
}

const AddLeadModal: React.FC<AddLeadModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !phone) {
            toast.error('Please fill in all fields');
            return;
        }
        setIsSubmitting(true);
        try {
            await onSubmit(name, phone);
            setName('');
            setPhone('');
        } catch (error) {
            // Error handling is handled in parent
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-[#2E2B38] border border-[#4A4A5A] rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 overflow-hidden">
                <div className="p-8">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-[#F5F7FA] font-rubik">Add New Lead</h2>
                            <p className="text-[#A0AEC0] text-sm mt-1">Enter the details of the new client or lead.</p>
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

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-widest ml-1">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                className="w-full bg-[#24212b] border border-[#4A4A5A] rounded-2xl px-5 py-4 text-[#F5F7FA] placeholder-[#4A4A5A] focus:border-[#fafa33] focus:outline-none transition-colors"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-widest ml-1">Phone Number</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+91 98765 43210"
                                className="w-full bg-[#24212b] border border-[#4A4A5A] rounded-2xl px-5 py-4 text-[#F5F7FA] placeholder-[#4A4A5A] focus:border-[#fafa33] focus:outline-none transition-colors"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="pt-4 flex flex-col sm:flex-row gap-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-8 py-4 rounded-2xl bg-[#2E2B38] border border-[#4A4A5A] text-[#F5F7FA] font-bold hover:bg-[#393645] transition-all font-rubik"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-8 py-4 rounded-2xl bg-[#fafa33] text-[#24212b] font-black hover:bg-[#ffff4d] transition-all shadow-lg shadow-[#fafa33]/10 font-rubik flex items-center justify-center"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-[#24212b]/20 border-t-[#24212b] rounded-full animate-spin"></div>
                                ) : (
                                    'Add Lead'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddLeadModal;
