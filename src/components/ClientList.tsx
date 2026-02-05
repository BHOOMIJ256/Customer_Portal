import { User } from '../types';

interface ClientListProps {
    clients: User[];
    onSelectClient: (client: User) => void;
    onAddLead?: () => void;
}

const ClientList: React.FC<ClientListProps> = ({ clients, onSelectClient, onAddLead }) => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between mb-2 px-1">
                <div className="flex items-center space-x-4">
                    <h3 className="text-xl font-black text-[#F5F7FA] font-rubik">Active Clients</h3>
                    <span className="text-xs font-bold text-[#A0AEC0] bg-[#2E2B38] px-3 py-1 rounded-full border border-[#4A4A5A]">
                        {clients.length} Active
                    </span>
                </div>
                {onAddLead && (
                    <button
                        onClick={onAddLead}
                        className="bg-[#2E2B38] border border-[#4A4A5A] text-[#F5F7FA] px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#393645] hover:border-[#fafa33]/50 transition-all active:scale-95 flex items-center group shadow-lg"
                    >
                        <svg className="w-4 h-4 mr-2 text-[#fafa33]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add New Lead
                    </button>
                )}
            </div>

            <div className="grid gap-4">
                {clients.length > 0 ? clients.map((client) => (
                    <div
                        key={client.phoneNumber}
                        className="bg-[#2E2B38] border border-[#4A4A5A] p-6 rounded-[2rem] flex flex-col sm:flex-row items-center justify-between group hover:border-[#fafa33]/30 transition-all shadow-lg"
                    >
                        <div className="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
                            <div className="w-12 h-12 rounded-2xl bg-[#782e87]/20 text-[#782e87] flex items-center justify-center mr-5 font-black text-lg">
                                {client.name.charAt(0)}
                            </div>
                            <div>
                                <h4 className="text-base font-bold text-[#F5F7FA] group-hover:text-[#fafa33] transition-colors">{client.name}</h4>
                                <div className="flex items-center text-[10px] text-[#A0AEC0] font-black uppercase tracking-wider mt-1 space-x-2">
                                    <span>{client.phoneNumber}</span>
                                    <span className="text-[#4A4A5A]">•</span>
                                    <span className="text-[#fafa33]">{client.currentStage || 'Lead Collected'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 w-full sm:w-auto justify-end">
                            <div className="text-right hidden sm:block mr-2">
                                <p className="text-[9px] font-black text-[#A0AEC0] uppercase tracking-widest">Last Update</p>
                                <p className="text-xs font-bold text-[#F5F7FA] mt-0.5">{client.lastUpdate || 'Just Now'}</p>
                            </div>

                            <button
                                onClick={() => onSelectClient(client)}
                                className="bg-[#fafa33] text-[#24212b] px-6 py-3 rounded-xl text-xs font-black hover:bg-[#ffff4d] transition-all active:scale-95 shadow-lg shadow-[#fafa33]/10"
                            >
                                View Dashboard
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="bg-[#2E2B38]/50 border border-[#4A4A5A] p-10 rounded-[2rem] text-center italic text-[#A0AEC0]">
                        No active clients found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientList;
