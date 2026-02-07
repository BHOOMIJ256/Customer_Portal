import React from "react";

interface AddLeadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (name: string, phone: string) => Promise<void>; // Add this line
}

const AddLeadModal: React.FC<AddLeadModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [name, setName] = React.useState('');
    const [phone, setPhone] = React.useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onAdd(name, phone);
        setName('');
        setPhone('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#2E2B38] border border-[#4A4A5A] w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl">
                <h2 className="text-2xl font-black text-[#F5F7FA] mb-6 uppercase tracking-tight font-rubik">Add New Lead</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Client Name"
                        className="w-full bg-[#24212b] border border-[#4A4A5A] rounded-2xl p-4 text-white outline-none focus:border-[#fafa33]"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="tel"
                        placeholder="Phone Number"
                        className="w-full bg-[#24212b] border border-[#4A4A5A] rounded-2xl p-4 text-white outline-none focus:border-[#fafa33]"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-4 rounded-2xl text-[#A0AEC0] font-bold hover:bg-white/5 transition-all"
                        >
                            CANCEL
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-4 rounded-2xl bg-[#fafa33] text-[#24212b] font-black uppercase shadow-lg shadow-[#fafa33]/10 hover:scale-105 active:scale-95 transition-all"
                        >
                            SAVE LEAD
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddLeadModal;