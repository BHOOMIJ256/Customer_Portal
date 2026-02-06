
import React, { useState } from 'react';
import { SegmentType } from '../types';

interface SearchBarProps {
  onNavigate: (segment: SegmentType) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onNavigate }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);

    // Quick local heuristic for instant navigation
    const lowerQuery = query.toLowerCase();
    const quickNavMap: Record<string, SegmentType> = {
      'payment': 'Payments',
      'payments': 'Payments',
      'invoice': 'Invoices',
      'invoices': 'Invoices',
      'bill': 'Invoices',
      'doc': 'My Documents',
      'docs': 'My Documents',
      'document': 'My Documents',
      'documents': 'My Documents',
      'ticket': 'Tickets',
      'tickets': 'Tickets',
      'consulting': 'Consultation',
      'consultation': 'Consultation',
      'home': 'Recents',
      'recent': 'Recents'
    };

    if (quickNavMap[lowerQuery]) {
      onNavigate(quickNavMap[lowerQuery]);
      setQuery('');
      setResults(null);
      setLoading(false);
      return;
    }

    // Call Gemini for more complex or specific searches
    // const data = await searchSiteConten

    // // Auto-navigate if it's a direct segment match
    // if (data.intent === 'navigate' && data.targetSegment) {
    //   onNavigate(data.targetSegment as SegmentType);
    //   // We keep results visible so user can see what happened, or clear them
    //   // setQuery(''); 
    // }

    setLoading(false);
  };

  const handleResultClick = (targetSegment?: string) => {
    if (targetSegment) {
      onNavigate(targetSegment as SegmentType);
    }
    setResults(null);
    setQuery('');
  };

  return (
    <div className="relative group w-full space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-7 flex items-center pointer-events-none">
          {loading ? (
            <div className="h-5 w-5 border-2 border-[#fafa33]/20 border-t-[#fafa33] rounded-full animate-spin"></div>
          ) : (
            <svg className="h-5 w-5 text-[#A0AEC0] group-focus-within:text-[#fafa33] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
        <input
          type="text"
          placeholder="Search for 'Proposal', 'Last Payment', or just say 'Go to Invoices'..."
          className="block w-full pl-16 pr-36 py-5 bg-[#2E2B38] border border-[#4A4A5A] rounded-2xl text-[#F5F7FA] placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#fafa33]/10 focus:border-[#4A4A5A] shadow-xl shadow-black/10 transition-all text-lg font-medium"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <div className="absolute inset-y-0 right-2.5 flex items-center">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-[#fafa33] text-[#24212b] px-8 py-3 rounded-xl text-sm font-black hover:bg-[#ffff4d] transition-all active:scale-95 shadow-xl shadow-[#fafa33]/10 font-rubik flex items-center"
          >
            {loading ? 'Thinking...' : 'GO'}
          </button>
        </div>
      </div>

      {results?.suggestions?.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-4 z-[60] bg-[#2E2B38] border border-[#4A4A5A] rounded-[2rem] p-6 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 max-h-[400px] overflow-y-auto scrollbar-hide">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#fafa33] rounded-full animate-pulse"></div>
              <h4 className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-[0.2em] font-rubik">Found {results.suggestions.length} Results</h4>
            </div>
            <button onClick={() => setResults(null)} className="text-[10px] text-[#A0AEC0] hover:text-[#fafa33] uppercase font-black tracking-widest transition-colors">Dismiss</button>
          </div>

          <div className="grid gap-3">
            {results.suggestions.map((res: any, idx: number) => (
              <div
                key={idx}
                onClick={() => handleResultClick(results.targetSegment)}
                className="flex items-center p-5 bg-[#24212b] border border-[#4A4A5A] rounded-2xl hover:border-[#fafa33]/40 hover:bg-[#2e2b38] transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#782e87]/10 text-[#782e87] flex items-center justify-center mr-4 group-hover:bg-[#fafa33]/10 group-hover:text-[#fafa33] transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <span className="text-[#F5F7FA] text-base font-bold font-rubik block group-hover:text-[#fafa33] transition-colors">{res.title}</span>
                  <span className="text-[#A0AEC0] text-xs font-medium">{res.description}</span>
                </div>
                <div className="flex items-center text-[#fafa33] text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-[#fafa33]/10 rounded-lg group-hover:bg-[#fafa33] group-hover:text-[#24212b] transition-all">
                  {res.action}
                  <svg className="ml-2 w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {results.targetSegment && (
            <div className="mt-6 pt-4 border-t border-[#4A4A5A] text-center">
              <p className="text-[10px] text-[#A0AEC0] font-black uppercase tracking-widest">
                Search resulted in <span className="text-[#fafa33]">{results.targetSegment}</span> view
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
