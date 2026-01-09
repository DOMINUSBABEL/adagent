
import React, { useState } from 'react';
import { NAV_ITEMS } from './constants';
import CampaignBuilder from './components/CampaignBuilder';
import TrendDashboard from './components/TrendDashboard';
import LiveAgent from './components/LiveAgent';
import { translations } from './translations';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const t = translations[lang];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30">
      
      {/* Sidebar with Talleyrand Branding */}
      <aside className="w-20 lg:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 transition-all duration-300 z-20 shadow-2xl">
        <div>
          <div className="h-24 flex items-center justify-center lg:justify-start lg:px-8 border-b border-slate-800/50">
            <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 rotate-3 group-hover:rotate-0 transition-transform">
              <i className="fas fa-shield-halved text-white text-xl"></i>
            </div>
            <div className="ml-4 hidden lg:block">
              <span className="font-black text-sm tracking-[0.2em] block text-white uppercase">AdArchitect</span>
              <span className="text-[8px] font-bold text-slate-500 tracking-[0.4em] uppercase">Talleyrand Core</span>
            </div>
          </div>

          <nav className="mt-8 px-3 lg:px-6 space-y-3">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-center lg:justify-start px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                  activeTab === item.id 
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-lg' 
                    : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-300'
                }`}
              >
                <svg className={`w-5 h-5 transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <span className={`ml-4 text-xs font-bold hidden lg:block tracking-wide uppercase ${activeTab === item.id ? 'opacity-100' : 'opacity-60'}`}>{(t as any)[item.id]}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6 border-t border-slate-800/50">
            <div className="flex items-center justify-center lg:justify-start gap-4 p-3 rounded-2xl bg-slate-950/50 border border-slate-800 transition-all cursor-pointer hover:border-slate-600">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-black text-white shadow-lg">
                  TM
                </div>
                <div className="hidden lg:block overflow-hidden">
                    <p className="text-[10px] font-black uppercase tracking-tighter truncate text-slate-300">Consultora Talleyrand</p>
                    <p className="text-[9px] text-emerald-400 flex items-center gap-1.5 font-bold uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        {t.systemOnline}
                    </p>
                </div>
            </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-24 bg-slate-950/20 backdrop-blur-xl border-b border-slate-800/50 flex items-center justify-between px-10 z-10">
          <div>
            <h1 className="text-xl font-black text-white uppercase tracking-[0.2em]">{(t as any)[activeTab]}</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Environment: Gemini 3 High-Dimensional Engine</p>
          </div>
          <div className="flex items-center gap-8">
             <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 shadow-inner">
                <button 
                  onClick={() => setLang('es')}
                  className={`px-4 py-1.5 text-[9px] font-black rounded-lg transition-all ${lang === 'es' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  ESP
                </button>
                <button 
                  onClick={() => setLang('en')}
                  className={`px-4 py-1.5 text-[9px] font-black rounded-lg transition-all ${lang === 'en' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  ENG
                </button>
             </div>

             <div className="h-10 w-px bg-slate-800/50"></div>
             
             <button 
                onClick={() => setActiveTab('campaigns')}
                className="bg-white hover:bg-slate-200 text-black px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-white/5 transition-all flex items-center gap-2"
             >
                <i className="fas fa-plus"></i> {t.newCampaign}
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 bg-[radial-gradient(circle_at_20%_20%,_rgba(30,58,138,0.1),_transparent),radial-gradient(circle_at_80%_80%,_rgba(76,29,149,0.1),_transparent)]">
          <div className="max-w-[1600px] mx-auto h-full">
            {activeTab === 'dashboard' && <TrendDashboard lang={lang} />}
            {activeTab === 'campaigns' && <CampaignBuilder lang={lang} />}
            {activeTab === 'live' && <div className="max-w-4xl mx-auto pt-12 animate-slide-up"><LiveAgent lang={lang} /></div>}
            {activeTab === 'data' && (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 animate-fade-in">
                  <div className="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center mb-8 border border-slate-800 shadow-2xl">
                    <i className="fas fa-database text-4xl text-indigo-500/50"></i>
                  </div>
                  <h2 className="text-xl font-black text-white uppercase tracking-[0.5em] mb-4">{t.data}</h2>
                  <p className="max-w-md text-center text-[11px] font-bold uppercase tracking-widest text-slate-600">Restricted Access. OSINT Intelligence Lab currently under maintenance for TALLEYRAND upgrade.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
