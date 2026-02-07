import React from 'react';
import { User } from '../types';

interface ClientListProps {
    clients: any[];
    onSelectClient: (client: User) => void;
    onAddLead?: () => void;
}

const ClientList: React.FC<ClientListProps> = ({ clients, onSelectClient, onAddLead }) => {
    return (
        <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between mb-2 px-1">
                <div className="flex items-center space-x-4">
                    <h3 className="text-xl font-black text-[#F5F7FA] font-rubik uppercase tracking-tight">Active Clients</h3>
                    <span className="text-xs font-bold text-[#fafa33] bg-[#fafa33]/10 px-3 py-1 rounded-full border border-[#fafa33]/20">
                        {clients.length} Registered
                    </span>
                </div>
                {onAddLead && (
                    <button
                        onClick={onAddLead}
                        className="bg-[#fafa33] text-[#24212b] px-5 py-2.5 rounded-xl text-xs font-black hover:scale-105 transition-all active:scale-95 shadow-lg"
                    >
                        + ADD NEW LEAD
                    </button>
                )}
            </div>

            <div className="flex flex-col gap-4 w-full">
                {clients.length > 0 ? clients.map((client, idx) => (
                    <div
                        key={idx}
                        className="w-full bg-[#2E2B38] border border-[#4A4A5A] p-6 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-4 transition-all hover:border-[#fafa33]/30"
                    >
                        <div className="flex items-center space-x-4 w-full">
                            <div className="h-14 w-14 min-w-[3.5rem] rounded-full bg-[#fafa33] flex items-center justify-center text-[#24212b] font-black text-xl shadow-inner">
                                {client.name ? client.name.charAt(0).toUpperCase() : '?'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-[#F5F7FA] font-black text-lg uppercase tracking-tight truncate">
                                    {client.name}
                                </h4>
                                <div className="flex items-center space-x-3 mt-1 text-[11px] font-bold uppercase tracking-wider">
                                    <span className="text-[#A0AEC0]">{client.phone_number}</span>
                                    <span className="text-[#4A4A5A]">|</span>
                                    <span className="text-[#fafa33]">{client.current_status || 'Lead'}</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => onSelectClient({
                                name: client.name,
                                phoneNumber: client.phone_number,
                                role: 'client'
                            } as User)}
                            className="w-full md:w-auto bg-[#24212b] border border-[#fafa33] text-[#fafa33] px-8 py-4 rounded-2xl text-xs font-black uppercase hover:bg-[#fafa33] hover:text-[#24212b] transition-all whitespace-nowrap active:scale-95 shadow-lg"
                        >
                            Manage Dashboard
                        </button>
                    </div>
                )) : (
                    <div className="w-full bg-[#2E2B38]/50 border border-[#4A4A5A] p-20 rounded-[2.5rem] text-center">
                        <p className="italic text-[#A0AEC0] font-medium">No clients found in the database.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientList;