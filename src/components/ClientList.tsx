import { User } from '../types';

interface ClientListProps {
    clients: User[];
    onSelectClient: (client: User) => void;
    onAddLead?: () => void;
}

const ClientList: React.FC<ClientListProps> = ({ clients, onSelectClient, onAddLead }) => {

    // Helper to get status colors
    const getStatusStyle = (stage?: string) => {
        switch (stage) {
            case 'Design Phase': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50';
            case 'Estimate Provided': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
            case 'Project Completed': return 'bg-green-500/20 text-green-400 border-green-500/50';
            default: return 'bg-[#782e87]/20 text-[#d6bcfa] border-[#782e87]/50';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between mb-2 px-1">
                <div className="flex items-center space-x-4">
                    <h3 className="text-xl font-black text-[#F5F7FA] font-rubik">Active Projects</h3>
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

            <div className="grid gap-6">
                {clients.length > 0 ? clients.map((client, idx) => {
                    // Mock data generation for demo purposes if fields are missing
                    const projectType = client.projectType || (idx % 2 === 0 ? "Residential Interior Design - 3BHK Apartment" : "Office Space Renovation");
                    const description = client.description || (idx % 2 === 0 ? "Complete interior design for luxury apartment. Includes living room, bedrooms, kitchen, and balcony." : "Modern office design for tech startup. Open floor plan with collaborative spaces.");
                    const amount = client.totalAmount || (idx % 2 === 0 ? "₹5,00,000" : "₹12,00,000");
                    const due = client.amountDue || (idx % 2 === 0 ? "₹3,50,000" : "₹6,00,000");
                    const viewers = client.viewers || (idx % 2 === 0 ? 3 : 2);
                    const status = client.currentStage || 'Lead Collected';
                    const statusStyle = getStatusStyle(status);

                    return (
                        <div
                            key={client.phoneNumber}
                            className="bg-[#2E2B38] border border-[#4A4A5A] p-6 lg:p-8 rounded-[1.5rem] flex flex-col gap-6 hover:border-[#fafa33]/20 transition-all shadow-xl group relative overflow-hidden"
                        >
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                <div className="space-y-2 max-w-2xl">
                                    <h4 className="text-xl font-bold text-[#F5F7FA] font-rubik group-hover:text-[#fafa33] transition-colors">
                                        {projectType}
                                    </h4>
                                    <p className="text-sm text-[#A0AEC0] leading-relaxed">
                                        {description}
                                    </p>
                                    {/* Client Name fallback */}
                                    <p className="text-xs font-bold text-[#782e87] pt-1">Client: {client.name}</p>
                                </div>
                                <span className={`px-4 py-2 rounded-lg text-xs font-bold border capitalize whitespace-nowrap ${statusStyle}`}>
                                    {status}
                                </span>
                            </div>

                            <div className="h-px bg-[#4A4A5A]/50 w-full" />

                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                                <div className="flex items-center gap-12">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider font-bold text-[#6c7079] mb-1">Amount</p>
                                        <p className="text-lg font-bold text-[#F5F7FA]">{amount}</p>
                                    </div>
                                    <div className="hidden sm:block w-px h-8 bg-[#4A4A5A]" />
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider font-bold text-[#6c7079] mb-1">Due</p>
                                        <p className="text-lg font-bold text-[#d6bcfa]">{due}</p>
                                    </div>
                                    <div className="hidden sm:block w-px h-8 bg-[#4A4A5A]" />
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider font-bold text-[#6c7079] mb-1">Viewers</p>
                                        <p className="text-lg font-bold text-[#F5F7FA]">{viewers}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => onSelectClient(client)}
                                    className="bg-[#782e87] text-white px-6 py-3 rounded-xl text-xs font-bold hover:bg-[#8e3ba0] transition-all active:scale-95 shadow-lg shadow-[#782e87]/20 flex items-center justify-center sm:w-auto w-full"
                                >
                                    View Details
                                    <svg className="w-3 h-3 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="bg-[#2E2B38]/50 border border-[#4A4A5A] p-12 rounded-[2rem] text-center">
                        <p className="text-[#A0AEC0] text-sm font-medium">No active projects found.</p>
                        <p className="text-[#6c7079] text-xs mt-2">Add a new lead to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientList;
