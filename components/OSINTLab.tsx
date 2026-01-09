
import React, { useState } from 'react';
import { performDeepOSINT } from '../services/geminiService';
import { translations } from '../translations';

const OSINTLab: React.FC<{lang: 'es' | 'en'}> = ({ lang }) => {
  const t = translations[lang];
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const handleDeepSearch = async () => {
    if (!query) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const result = await performDeepOSINT(query);
      if (!result.sources.length && result.analysis.includes("unavailable")) {
         throw new Error("Target node returned low-confidence data or restricted access.");
      }
      setData(result);
    } catch (err: any) {
      setError(err.message || "Failed to synchronize with OSINT nodes. Please check connection or refine query.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-5 animate-fade-in min-h-0 overflow-hidden">
      
      {/* Search Bar Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl shrink-0">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 relative w-full">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-xs"></i>
            <input 
              type="text" 
              className={`w-full bg-slate-950 border rounded-xl py-3 pl-10 pr-4 text-xs text-slate-200 outline-none transition-all placeholder:text-slate-700 font-mono ${error ? 'border-rose-500/50' : 'border-slate-800 focus:border-indigo-500/50'}`}
              placeholder="Inject topic for deep verification..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleDeepSearch()}
            />
          </div>
          <button 
            onClick={handleDeepSearch}
            disabled={loading || !query}
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <i className="fas fa-sync fa-spin"></i> : <i className="fas fa-microscope"></i>}
            Deep Verification
          </button>
        </div>
      </div>

      {/* Main OSINT Viewport */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0 overflow-hidden">
        
        {/* Intelligence Report */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col shadow-2xl overflow-hidden min-h-0 relative">
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center shrink-0">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Synthetic Intelligence Report</h3>
            {data && <span className="text-[9px] font-mono text-emerald-500 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>SIGNALS_VERIFIED</span>}
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar">
            {error && (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
                <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 mb-4 border border-rose-500/20">
                  <i className="fas fa-exclamation-triangle text-xl"></i>
                </div>
                <h4 className="text-white font-bold mb-2">Extraction Failed</h4>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">{error}</p>
                <button 
                  onClick={handleDeepSearch}
                  className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                >
                  Attempt Sync Retry
                </button>
              </div>
            )}

            {!data && !loading && !error && (
              <div className="h-full flex flex-col items-center justify-center opacity-10 select-none grayscale">
                <i className="fas fa-project-diagram text-7xl mb-6"></i>
                <p className="text-[10px] font-black uppercase tracking-[0.5em]">Awaiting Signal Input</p>
              </div>
            )}
            
            {loading && (
              <div className="space-y-6 animate-pulse">
                <div className="h-3 w-3/4 bg-slate-800 rounded"></div>
                <div className="h-40 w-full bg-slate-800 rounded-2xl"></div>
                <div className="grid grid-cols-3 gap-4 pt-4">
                   <div className="h-16 bg-slate-800 rounded-xl"></div>
                   <div className="h-16 bg-slate-800 rounded-xl"></div>
                   <div className="h-16 bg-slate-800 rounded-xl"></div>
                </div>
              </div>
            )}
            
            {data && (
              <div className="space-y-8 animate-fade-in">
                <div className="prose prose-invert prose-sm max-w-none">
                  <div className="text-slate-300 leading-relaxed font-sans whitespace-pre-wrap text-sm">{data.analysis}</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.signals.map((s: any) => (
                    <div key={s.label} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-indigo-500/30 transition-all">
                      <p className="text-[8px] font-black text-slate-500 uppercase mb-2 tracking-widest">{s.label}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-white uppercase">{s.value}</span>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${s.trend === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                          <i className={`fas fa-arrow-${s.trend} text-[10px]`}></i>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sources Panel */}
        <div className="w-full lg:w-[320px] flex flex-col bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden shrink-0 min-h-0">
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center shrink-0">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grounding Nodes</h3>
            <i className="fas fa-link text-[10px] text-slate-700"></i>
          </div>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3">
            {data?.sources.map((s: any, i: number) => (
              <a 
                key={i} 
                href={s.uri} 
                target="_blank" 
                rel="noreferrer" 
                className="block bg-slate-950 border border-slate-800 p-3.5 rounded-xl hover:border-indigo-500/50 transition-all group active:scale-[0.98]"
              >
                <p className="text-[10px] font-bold text-slate-200 mb-1 group-hover:text-indigo-400 transition-colors line-clamp-2 leading-tight">{s.title}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[8px] text-slate-600 font-mono truncate flex-1">{s.uri}</span>
                  <i className="fas fa-external-link-alt text-[8px] text-slate-700 group-hover:text-slate-400"></i>
                </div>
              </a>
            ))}
            {!data && (
              <div className="flex flex-col items-center justify-center py-12 opacity-10">
                <i className="fas fa-link-slash text-4xl mb-3"></i>
                <p className="text-[8px] font-black uppercase tracking-widest">No Links Synced</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default OSINTLab;
