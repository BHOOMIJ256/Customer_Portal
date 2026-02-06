
import React, { useState } from 'react';
import { User, ProjectStage, SegmentType } from '../types';
import SegmentLinks from '../components/SegmentLinks';
import SegmentContent from '../components/SegmentContent';
import Timeline from '../components/Timeline';
import SearchBar from '../components/SearchBar';
import EstimateModal from '../components/modals/EstimateModal';
import DesignModal from '../components/modals/DesignModal';
import PaymentModal from '../components/modals/PaymentModal';
import HritaLogo from '../components/Logo';
import ClientList from '../components/ClientList';
import AddLeadModal from '../components/modals/AddLeadModal';
import { usePortalData } from '../hooks/usePortalData';
import { updateStage, addLead } from '../services/api';
import toast from 'react-hot-toast';
import { mockStore } from '../services/mockStore';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [currentUser, setCurrentUser] = useState<User>(user);
  const [selectedClient, setSelectedClient] = useState<User | null>(null);

  const { data, loading, error, refetch } = usePortalData(currentUser.phoneNumber);

  // Update name and role from DB if available
  React.useEffect(() => {
    if (data?.user) {
      setCurrentUser(prev => ({
        ...prev,
        name: data.user.name,
        role: data.user.role || prev.role,
        currentStage: data.user.currentStage || prev.currentStage,
        lastUpdate: data.user.lastUpdate || prev.lastUpdate
      }));
    }
  }, [data]);

  // Sync with mock store for UI updates
  const [, setTick] = useState(0);
  React.useEffect(() => {
    return mockStore.subscribe(() => setTick(t => t + 1));
  }, []);

  const getMockedUser = (u: User | null) => {
    if (!u) return u;
    const mockState = mockStore.getClientState(u.phoneNumber);
    return {
      ...u,
      currentStage: (mockState.status as any) || u.currentStage
    };
  };

  // Derived user to show: Admin sees themselves unless they select a client
  const baseDisplayedUser = currentUser.role === 'admin' && selectedClient ? { ...selectedClient, role: 'client' as const } : currentUser;
  const displayedUser = getMockedUser(baseDisplayedUser)!;
  const isImpersonating = currentUser.role === 'admin' && selectedClient;

  // Fetch client data if impersonating
  const { data: clientData, refetch: refetchClient } = usePortalData(isImpersonating ? selectedClient?.phoneNumber || null : null);

  const [activeSegment, setActiveSegment] = useState<SegmentType>('Recents');
  const [isEstimateOpen, setIsEstimateOpen] = useState(false);
  const [isDesignOpen, setIsDesignOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);

  const handleTimelineAction = (stage: ProjectStage) => {
    switch (stage) {
      case ProjectStage.LEAD_COLLECTED:
      case ProjectStage.ESTIMATE_PROVIDED:
        setIsEstimateOpen(true);
        break;
      case ProjectStage.DESIGN_PHASE:
        setIsDesignOpen(true);
        break;
      case ProjectStage.BOOKING_PAYMENT:
        setIsPaymentOpen(true);
        break;
      default:
        toast.success(`Stage: ${stage}.\nWorkflow detail coming soon.`);
    }
  };

  const handleApproveEstimate = async () => {
    setIsEstimateOpen(false);
    try {
      await updateStage(currentUser.phoneNumber, ProjectStage.DESIGN_PHASE);
      toast.success('Estimate Approved! Moving to Design Phase.');
      refetch();
    } catch (err) {
      toast.error('Failed to update stage. Please try again.');
    }
  };

  const handleApproveDesign = async () => {
    setIsDesignOpen(false);
    try {
      await updateStage(currentUser.phoneNumber, ProjectStage.BOOKING_PAYMENT);
      toast.success('Design Approved! Redirecting to Booking Payment.');
      refetch();
    } catch (err) {
      toast.error('Failed to update stage. Please try again.');
    }
  };

  const handlePaymentSuccess = async () => {
    setIsPaymentOpen(false);
    try {
      await updateStage(currentUser.phoneNumber, ProjectStage.PROJECT_STARTED);
      toast.success('Payment Successful! Project has officially started.');
      refetch();
    } catch (err) {
      toast.error('Failed to update stage. Please try again.');
    }
  };

  const handleRequestRevisions = async (specs: string) => {
    setIsDesignOpen(false);
    try {
      await updateStage(currentUser.phoneNumber, ProjectStage.DESIGN_PHASE, { revisions: specs });
      toast.success(`Revision request sent. Updated designs will appear here shortly.`);
      refetch();
    } catch (err) {
      toast.error('Failed to send revision request.');
    }
  };

  const handleAddLead = async (name: string, phone: string) => {
    try {
      await addLead(name, phone);
      setIsAddLeadOpen(false);
      toast.success('Lead added successfully!');

      // Delay refetch slightly to ensure Google Script index is updated
      setTimeout(() => {
        refetch();
      }, 1500);
    } catch (err) {
      toast.error('Failed to add lead. Please try again.');
    }
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#24212b]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fafa33] mb-4"></div>
          <p className="text-[#A0AEC0] text-sm font-medium animate-pulse">Syncing with Hrita Cloud...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#24212b] p-6">
        <div className="max-w-md w-full bg-[#2E2B38] border border-[#4A4A5A] p-10 rounded-[2.5rem] shadow-2xl text-center">
          <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#F5F7FA] font-rubik mb-2">Connection Error</h2>
          <p className="text-[#A0AEC0] text-sm mb-8 leading-relaxed">
            We're having trouble connecting to the Hrita database. This might be a temporary network issue or a backend maintenance window.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => refetch()}
              className="w-full bg-[#fafa33] text-[#24212b] py-4 rounded-2xl text-sm font-black hover:bg-[#ffff4d] transition-all active:scale-95"
            >
              Retry Connection
            </button>
            <button
              onClick={onLogout}
              className="w-full bg-[#24212b] text-[#A0AEC0] py-4 rounded-2xl text-sm font-bold hover:text-[#F5F7FA] transition-all"
            >
              Logout & Try Again
            </button>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 pt-8 border-t border-[#4A4A5A] text-left">
              <p className="text-[10px] font-black text-[#4A4A5A] uppercase tracking-widest mb-2">Debug Info</p>
              <div className="bg-[#24212b] p-3 rounded-xl overflow-x-auto">
                <code className="text-[10px] text-red-400/80 leading-tight block whitespace-pre-wrap">{error.message}</code>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#24212b] animate-in fade-in duration-700 font-lato pb-20">
      <nav className="bg-[#2E2B38] border-b border-[#4A4A5A] px-6 py-4 sticky top-0 z-50 backdrop-blur-md bg-[#2E2B38]/90">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => { setActiveSegment('Recents'); setSelectedClient(null); }}>
            <HritaLogo />
          </div>

          <div className="flex items-center space-x-5">
            {isImpersonating && (
              <button
                onClick={() => setSelectedClient(null)}
                className="bg-[#782e87] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#8e3ba0] transition-all flex items-center shadow-lg animate-in slide-in-from-top-2"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Admin View
              </button>
            )}

            <button className="text-[#A0AEC0] hover:text-[#fafa33] transition-colors relative p-1">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#fafa33] rounded-full border border-[#2E2B38]"></span>
            </button>
            <div className="flex items-center space-x-5 border-l border-[#4A4A5A] pl-5">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-[#F5F7FA] leading-tight font-rubik">{currentUser.name}</p>
                <p className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-widest mt-0.5">
                  {currentUser.role === 'admin' ? 'Hrita Admin' : (currentUser.role === 'architect' ? 'Architect' : 'Premium Client')}
                </p>
              </div>
              <button onClick={onLogout} className="text-[#A0AEC0] hover:text-[#fafa33] transition-colors p-1" title="Sign Out">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <header className="mb-10 animate-in slide-in-from-left-4 duration-1000">
          <h1 className="text-5xl font-extrabold text-[#F5F7FA] tracking-tight leading-tight font-rubik">
            {isImpersonating ? (
              <>Viewing <span className="text-[#fafa33]">{displayedUser.name}</span></>
            ) : (
              <>Hello, {currentUser.name.split(' ')[0]} <span className="text-[#fafa33]">.</span></>
            )}
          </h1>
          <p className="text-[#A0AEC0] mt-3 text-lg font-medium max-w-2xl leading-relaxed">
            {isImpersonating
              ? "You are currently viewing this client's dashboard as they see it."
              : "Welcome back to your personalized project dashboard. Everything looks on track."}
          </p>
        </header>

        {!isImpersonating && (
          <section className="mb-10">
            <SearchBar onNavigate={(seg) => setActiveSegment(seg)} />
          </section>
        )}

        {(currentUser.role !== 'admin' || isImpersonating) && (
          <section className="mb-14 px-1 border-b border-[#4A4A5A] pb-2">
            <SegmentLinks activeSegment={activeSegment} onSegmentChange={setActiveSegment} />
          </section>
        )}

        <section className="space-y-12">
          {activeSegment === 'Recents' ? (
            <div className="space-y-6">
              {currentUser.role === 'admin' && !selectedClient ? (
                <ClientList
                  clients={data?.allClients || []}
                  onAddLead={() => setIsAddLeadOpen(true)}
                  onSelectClient={(client) => {
                    const userClient: User = {
                      ...client,
                      role: 'client'
                    };
                    setSelectedClient(userClient);
                  }} />
              ) : (
                <div className="animate-in fade-in duration-300">
                  <SegmentContent type="Recents" />
                </div>
              )}
            </div>
          ) : (
            <div className="animate-in fade-in duration-300">
              {activeSegment !== 'Consultation' && (
                <div className="mb-8 px-1">
                  <h3 className="text-2xl font-black text-[#F5F7FA] font-rubik">{activeSegment}</h3>
                  <p className="text-sm text-[#A0AEC0] mt-1">Manage all your {activeSegment.toLowerCase()} related to this project.</p>
                </div>
              )}
              <SegmentContent type={activeSegment} />
            </div>
          )}
        </section>

        <footer className="mt-28 text-center border-t border-[#4A4A5A] pt-10">
          <div className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-[0.4em] mb-4 font-rubik">
            Hrita Solutions • Innovating Spaces
          </div>
          <div className="flex justify-center space-x-8 text-xs font-bold text-[#A0AEC0]">
            <a href="https://hrita.com" className="hover:text-[#fafa33] transition-colors">Official Website</a>
            <a href="#" className="hover:text-[#fafa33] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#fafa33] transition-colors">Support</a>
          </div>
        </footer>
      </main>

      <EstimateModal
        isOpen={isEstimateOpen}
        onClose={() => setIsEstimateOpen(false)}
        onApprove={handleApproveEstimate}
        opportunity={(isImpersonating ? clientData : data)?.opportunities?.[0] || null}
        userRole={currentUser.role}
        onUpdate={() => {
          refetch();
          if (isImpersonating) refetchClient();
        }}
        myDocuments={[
          ...((isImpersonating ? clientData : data)?.myDocuments || []),
          ...mockStore.getClientState(displayedUser.phoneNumber).documents
        ]}
      />
      <DesignModal isOpen={isDesignOpen} onClose={() => setIsDesignOpen(false)} onApprove={handleApproveDesign} onRequestRevisions={handleRequestRevisions} />
      <PaymentModal isOpen={isPaymentOpen} onClose={() => setIsPaymentOpen(false)} onPaymentSuccess={handlePaymentSuccess} />
      <AddLeadModal isOpen={isAddLeadOpen} onClose={() => setIsAddLeadOpen(false)} onSubmit={handleAddLead} />
    </div>
  );
};

export default Dashboard;
