
import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { User, ProjectStage } from './types';
import { Toaster } from 'react-hot-toast';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('hrita_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (phoneNumber: string) => {
    const isAdmin = phoneNumber === '1234567890';

    const user: User = {
      name: isAdmin ? "Hrita Admin" : "Loading...",
      phoneNumber: phoneNumber,
      role: isAdmin ? 'admin' : 'client'
    };
    setUser(user);
    localStorage.setItem('hrita_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('hrita_user');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#24212b]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fafa33]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen selection:bg-[#fafa33] selection:text-[#24212b]">
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
      <Toaster position="top-right" />
    </div>
  );
};

export default App;
