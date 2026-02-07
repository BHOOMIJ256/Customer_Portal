import React, { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { usePortalData } from './hooks/usePortalData';
import { Toaster } from 'react-hot-toast';

const App = () => {
  const [phone, setPhone] = useState<string | null>(localStorage.getItem('userPhone'));
  const { portalData, loading } = usePortalData(phone);

  const handleLogin = (p: string) => {
    localStorage.setItem('userPhone', p);
    setPhone(p);
  };

  const handleLogout = () => {
    localStorage.clear();
    setPhone(null);
  };

  if (!phone) return <><Toaster /><Login onLogin={handleLogin} /></>;

  if (loading || !portalData) {
    return (
      <div className="min-h-screen bg-[#24212b] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#fafa33]"></div>
          <p className="text-[#fafa33] font-bold">Connecting to Hrita...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <Dashboard user={portalData.user} onLogout={handleLogout} />
    </>
  );
};

export default App;