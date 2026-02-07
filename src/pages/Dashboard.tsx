import React, { useState, useEffect } from 'react';
import { User, SegmentType } from '../types';
import SegmentLinks from '../components/SegmentLinks';
import SegmentContent from '../components/SegmentContent';
import HritaLogo from '../components/Logo';
import ClientList from '../components/ClientList';
import AddLeadModal from '../components/modals/AddLeadModal';
import { usePortalData } from '../hooks/usePortalData';
import { hritaApi } from '../services/api';
import toast from 'react-hot-toast';

const Dashboard = ({ user, onLogout }: { user: User, onLogout: () => void }) => {
  if (!user || !user.phoneNumber) return null;

  const [selectedClient, setSelectedClient] = useState<User | null>(null);
  const [activeSegment, setActiveSegment] = useState<SegmentType>('Recents');
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);

  const targetPhone = selectedClient ? selectedClient.phoneNumber : user.phoneNumber;
  const { portalData, loading, refetch } = usePortalData(targetPhone);

  const isAdmin = user.role === 'admin';

  useEffect(() => {
    refetch();
  }, [selectedClient]);

  const handleAddLead = async (name: string, phone: string) => {
    try {
      await hritaApi.addLead(name, phone);
      setIsAddLeadOpen(false);
      toast.success('Lead Added Successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to add lead');
    }
  };

  const handleBackToClients = () => {
    setSelectedClient(null);
    setActiveSegment('Recents');
  };

  return (
    <div className="min-h-screen bg-[#24212b]">
      <nav className="border-b border-[#4A4A5A] p-4 flex justify-between items-center bg-[#2E2B38] sticky top-0 z-50">
        <HritaLogo className="h-8" />

        <div className="flex items-center gap-6">
          {isAdmin && selectedClient && (
            <button
              onClick={handleBackToClients}
              className="bg-[#fafa33] text-[#24212b] px-4 py-2 rounded-xl text-xs font-black uppercase transition-transform hover:scale-105"
            >
              ← Back to Client List
            </button>
          )}
          <div className="text-right">
            <p className="text-[#F5F7FA] text-xs font-bold">{user.name}</p>
            <p className="text-[#fafa33] text-[10px] font-black uppercase tracking-widest">{user.role}</p>
          </div>
          <button
            onClick={onLogout}
            className="text-[#A0AEC0] hover:text-red-400 text-xs font-black uppercase transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="w-full max-w-full px-4 md:px-10 py-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#fafa33]"></div>
          </div>
        ) : isAdmin && !selectedClient ? (
          <ClientList
            clients={portalData?.allClients || []}
            onAddLead={() => setIsAddLeadOpen(true)}
            onSelectClient={(client) => setSelectedClient(client)}
          />
        ) : (
          <div className="w-full animate-fadeIn">
            <div className="mb-6">
              {selectedClient && (
                <div className="bg-[#fafa33]/10 border border-[#fafa33]/20 p-6 rounded-[2rem] mb-6 w-full flex justify-between items-end">
                  <div>
                    <p className="text-[#fafa33] text-xs font-bold uppercase tracking-tighter">Managing Client:</p>
                    <p className="text-[#F5F7FA] text-2xl font-black">{selectedClient.name}</p>
                    <p className="text-[#A0AEC0] text-xs">{selectedClient.phoneNumber}</p>
                  </div>
                  <div className="text-right hidden md:block">
                    <p className="text-[#A0AEC0] text-[10px] uppercase font-bold">Client Data View</p>
                  </div>
                </div>
              )}
              <SegmentLinks activeSegment={activeSegment} onSegmentChange={setActiveSegment} />
            </div>

            <SegmentContent
              type={activeSegment}
              recents={portalData?.recents || []}
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
