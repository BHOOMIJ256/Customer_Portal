import React, { useState } from 'react';
import { Client, ProjectStage } from '../types';

interface ClientListProps {
    onSelectClient: (client: Client) => void;
}

// Mock Data for Admin View
const mockClients: Client[] = [
    {
        id: '1',
        name: 'Abhishek Sharma',
        phoneNumber: '9876543210',
        currentStage: ProjectStage.ESTIMATE_PROVIDED,
        lastUpdate: 'Oct 12, 2023',
        location: 'Bandra, Mumbai',
        actionNeeded: 'Update Estimate Status'
    },
    {
        id: '2',
        name: 'Rehan Mehta',
        phoneNumber: '9123456780',
        currentStage: ProjectStage.SITE_VISIT,
        lastUpdate: 'Oct 10, 2023',
        location: 'Worli, Mumbai',
        actionNeeded: 'Upload Site Report'
    },
    {
        id: '3',
        name: 'Sarah Jenkins',
        phoneNumber: '9988776655',
        currentStage: ProjectStage.LEAD_COLLECTED,
        lastUpdate: 'Oct 14, 2023',
        location: 'Juhu, Mumbai',
        actionNeeded: 'Provide Initial Estimate'
    }
];

const ClientList: React.FC<ClientListProps> = ({ onSelectClient }) => {
    const [clients] = useState<Client[]>(mockClients);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between mb-2 px-1">
                <h3 className="text-xl font-black text-[#F5F7FA] font-rubik">Active Clients</h3>
                <span className="text-xs font-bold text-[#A0AEC0] bg-[#2E2B38] px-3 py-1 rounded-full border border-[#4A4A5A]">
                    {clients.length} Active
                </span>
            </div>

            <div className="grid gap-4">
                {clients.map((client) => (
                    <div
                        key={client.id}
                        className="bg-[#2E2B38] border border-[#4A4A5A] p-6 rounded-[2rem] flex flex-col sm:flex-row items-center justify-between group hover:border-[#fafa33]/30 transition-all shadow-lg"
                    >
                        <div className="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
                            <div className="w-12 h-12 rounded-2xl bg-[#782e87]/20 text-[#782e87] flex items-center justify-center mr-5 font-black text-lg">
                                {client.name.charAt(0)}
                            </div>
                            <div>
                                <h4 className="text-base font-bold text-[#F5F7FA] group-hover:text-[#fafa33] transition-colors">{client.name}</h4>
                                <div className="flex items-center text-[10px] text-[#A0AEC0] font-black uppercase tracking-wider mt-1 space-x-2">
                                    <span>{client.location}</span>
                                    <span className="text-[#4A4A5A]">•</span>
                                    <span className="text-[#fafa33]">{client.currentStage}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 w-full sm:w-auto justify-end">
                            <div className="text-right hidden sm:block mr-2">
                                <p className="text-[9px] font-black text-[#A0AEC0] uppercase tracking-widest">Last Update</p>
                                <p className="text-xs font-bold text-[#F5F7FA] mt-0.5">{client.lastUpdate}</p>
                            </div>

                            <button
                                onClick={() => onSelectClient(client)}
                                className="bg-[#fafa33] text-[#24212b] px-6 py-3 rounded-xl text-xs font-black hover:bg-[#ffff4d] transition-all active:scale-95 shadow-lg shadow-[#fafa33]/10"
                            >
                                View Dashboard
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClientList;
