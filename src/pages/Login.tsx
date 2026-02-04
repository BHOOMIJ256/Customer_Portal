
import React, { useState } from 'react';
import Logo from '../components/Logo';

interface LoginProps {
  onLogin: (phone: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) {
      onLogin(phone);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#24212b]">
      <div className="w-full max-w-md space-y-8 bg-[#2E2B38] p-10 rounded-[2.5rem] shadow-2xl shadow-black/40 border border-[#4A4A5A] animate-in zoom-in-95 duration-700">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Logo className="h-10" />
          </div>
          <h2 className="text-2xl font-bold text-[#F5F7FA] tracking-tight font-rubik">Welcome Home</h2>
          <p className="mt-2 text-sm text-[#A0AEC0] font-medium">Enter your registered mobile number to login</p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="phone" className="block text-xs font-bold text-[#A0AEC0] uppercase tracking-widest mb-2 ml-1">Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              className="relative block w-full rounded-2xl border-0 py-4 px-5 text-[#F5F7FA] ring-1 ring-inset ring-[#4A4A5A] placeholder:text-slate-500 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-[#fafa33] sm:text-sm bg-[#24212b] transition-all"
              placeholder="+91 00000 00000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="group relative flex w-full justify-center rounded-2xl bg-[#782e87] py-4 px-4 text-sm font-bold text-white hover:bg-[#8e3ba0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#782e87] transition-all shadow-lg active:scale-[0.98]"
          >
            Access Dashboard
          </button>
        </form>

        <div className="text-center text-[11px] text-[#A0AEC0] font-black uppercase tracking-widest mt-4">
          Architecture • Interior • Landscape
        </div>
      </div>
    </div>
  );
};

export default Login;
