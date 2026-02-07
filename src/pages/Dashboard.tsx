import React, { useState } from 'react';
import { User, SegmentType } from '../types';
import SegmentLinks from '../components/SegmentLinks';
import SegmentContent from '../components/SegmentContent';
import HritaLogo from '../components/Logo';
import ClientList from '../components/ClientList';
import AddLeadModal from '../components/modals/AddLeadModal';
import { usePortalData } from '../hooks/usePortalData';
import * as api from '../services/api';
import toast from 'react-hot-toast';

const Dashboard = ({ user, onLogout }: { user: User, onLogout: () => void }) => {
  // Safety check: if user is somehow undefined, return null to avoid crash
  if (!user || !user.phoneNumber) return null;

  const [selectedClient, setSelectedClient] = useState<User | null>(null);
  const [activeSegment, setActiveSegment] = useState<SegmentType>('Recents');
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);

  // Perspective logic: fetch data for selected client or the logged-in user
  const targetPhone = selectedClient ? selectedClient.phoneNumber : user.phoneNumber;
  const { portalData, loading, refetch } = usePortalData(targetPhone);

  const isAdmin = user.role === 'admin';

  const handleAddLead = async (name: string, phone: string) => {
    try {
      await api.addLead(name, phone);
      setIsAddLeadOpen(false);
      toast.success('Lead Added Successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to add lead');
    }
  };

  return (
    <div className="min-h-screen bg-[#24212b]">
      <nav className="border-b border-[#4A4A5A] p-4 flex justify-between items-center bg-[#2E2B38]">
        <HritaLogo className="h-8" />

        <div className="flex items-center gap-6">
          {isAdmin && selectedClient && (
            <button
              onClick={() => setSelectedClient(null)}
              className="bg-[#fafa33] text-[#24212b] px-4 py-2 rounded-xl text-xs font-black uppercase transition-transform hover:scale-105"
            >
              ← Back to Client List
            </button>
          )}
          <div className="text-right">
            <p className="text-[#F5F7FA] text-xs font-bold">{user.name}</p>
            <p className="text-[#fafa33] text-[10px] font-black uppercase tracking-widest">{user.role}</p>
          </div>
          <button onClick={onLogout} className="text-[#A0AEC0] hover:text-red-400 text-xs font-black uppercase">Logout</button>
        </div>
      </nav>

      <main className="w-full max-w-full px-4 md:px-10 py-6">
        {isAdmin && !selectedClient ? (
          <ClientList
            clients={portalData?.allClients || []}
            onAddLead={() => setIsAddLeadOpen(true)}
            onSelectClient={(client) => {
              setSelectedClient(client);
              setActiveSegment('Recents');
            }}
          />
        ) : (
          <div className="w-full">
            <div className="mb-6">
              {selectedClient && (
                <div className="bg-[#fafa33]/10 border border-[#fafa33]/20 p-6 rounded-[2rem] mb-6 w-full">
                  <p className="text-[#fafa33] text-xs font-bold uppercase">Managing Client:</p>
                  <p className="text-[#F5F7FA] text-2xl font-black">{selectedClient.name}</p>
                </div>
              )}
              <SegmentLinks activeSegment={activeSegment} onSegmentChange={setActiveSegment} />
            </div>

            <SegmentContent
              type={activeSegment}
              recents={portalData?.recents}
              portalData={portalData}
              userRole={user.role}
              onRefresh={refetch}
            />
          </div>
        )}
      </main>

      <AddLeadModal
        isOpen={isAddLeadOpen}
        onClose={() => setIsAddLeadOpen(false)}
        onAdd={handleAddLead}
      />
    </div>
  );
};

export default Dashboard;