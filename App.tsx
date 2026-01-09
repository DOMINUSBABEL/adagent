
import React, { useState } from 'react';
import { NAV_ITEMS } from './constants';
import CampaignBuilder from './components/CampaignBuilder';
import TrendDashboard from './components/TrendDashboard';
import LiveAgent from './components/LiveAgent';
import OSINTLab from './components/OSINTLab';
import { translations } from './translations';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const t = translations[lang];

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30 overflow-hidden">
      {/* Sidebar - Fixed width, high density */}
      <aside className="w-20 lg:w-60 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 z-20 shadow-2xl transition-all duration-500">
        <div>
          <div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-800/50">
            <div className="w-9 h-9 bg-gradient-to-tr from-emerald-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <i className="fas fa-shield-halved text-white text-lg"></i>
            </div>
            <div className="ml-3 hidden lg:block overflow-hidden">
              <span className="font-black text-xs tracking-[0.2em] block text-white uppercase truncate">AdArchitect</span>
              <span className="text-[7px] font-bold text-slate-500 tracking-[0.4em] uppercase truncate">Talleyrand Core</span>
            </div>
          </div>
          <nav className="mt-6 px-3 lg:px-4 space-y-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-center lg:justify-start px-3 py-3 rounded-xl transition-all duration-300 group ${
                  activeTab === item.id 
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-lg' 
                    : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-300 border border-transparent'
                }`}
              >
                <svg className={`w-5 h-5 transition-transform ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <span className={`ml-3 text-[10px] font-black hidden lg:block tracking-widest uppercase truncate`}>{(t as any)[item.id]}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-slate-800/50">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950/50 border border-slate-800/50">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-[9px] font-black text-white shrink-0">T</div>
            <div className="hidden lg:block overflow-hidden">
              <p className="text-[8px] font-black uppercase text-slate-400 truncate tracking-tighter">Consultora Talleyrand</p>
              <p className="text-[7px] text-emerald-500 font-bold uppercase flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                {t.systemOnline}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area - Responsive Container */}
      <main className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden bg-[radial-gradient(circle_at_50%_0%,_rgba(30,58,138,0.08),_transparent)]">
        <header className="h-20 bg-slate-950/40 backdrop-blur-xl border-b border-slate-800/50 flex items-center justify-between px-6 lg:px-10 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-sm lg:text-lg font-black text-white uppercase tracking-[0.2em]">{(t as any)[activeTab]}</h1>
            <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>
            <span className="hidden sm:block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Environment: Gemini-3-Pro-Cognitive</span>
          </div>
          <div className="flex items-center gap-4 lg:gap-8">
             <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800 shadow-inner">
                <button 
                  onClick={() => setLang('es')} 
                  className={`px-3 py-1 text-[8px] font-black rounded-md transition-all ${lang === 'es' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  ESP
                </button>
                <button 
                  onClick={() => setLang('en')} 
                  className={`px-3 py-1 text-[8px] font-black rounded-md transition-all ${lang === 'en' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  ENG
                </button>
             </div>
             {activeTab === 'campaigns' && (
               <button 
                  onClick={() => window.location.reload()}
                  className="bg-white hover:bg-slate-100 text-black px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
               >
                  <i className="fas fa-rotate mr-2"></i> Reset
               </button>
             )}
          </div>
        </header>

        {/* Dynamic Content Viewport */}
        <div className="flex-1 p-4 lg:p-8 overflow-hidden">
          <div className="h-full max-w-[1600px] mx-auto flex flex-col">
            {activeTab === 'dashboard' && <div className="flex-1 overflow-y-auto custom-scrollbar"><TrendDashboard lang={lang} /></div>}
            {activeTab === 'campaigns' && <CampaignBuilder lang={lang} />}
            {activeTab === 'live' && <div className="max-w-4xl mx-auto w-full pt-10 overflow-y-auto custom-scrollbar"><LiveAgent lang={lang} /></div>}
            {activeTab === 'data' && <OSINTLab lang={lang} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
