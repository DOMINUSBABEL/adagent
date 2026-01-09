
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
      
      <aside className="w-20 lg:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 transition-all duration-300">
        <div>
          <div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-800">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <i className="fas fa-cube text-white text-xl"></i>
            </div>
            <span className="ml-3 font-bold text-lg tracking-tight hidden lg:block bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              AdArchitect
            </span>
          </div>

          <nav className="mt-6 px-2 lg:px-4 space-y-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-center lg:justify-start px-4 py-3 rounded-xl transition-all duration-200 group ${
                  activeTab === item.id 
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <span className="ml-3 font-medium hidden lg:block">{(t as any)[item.id]}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
            <div className="flex items-center justify-center lg:justify-start gap-3 p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 border-2 border-slate-900"></div>
                <div className="hidden lg:block overflow-hidden">
                    <p className="text-sm font-semibold truncate">Admin User</p>
                    <p className="text-xs text-green-400 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        {t.systemOnline}
                    </p>
                </div>
            </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-20 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8 z-10">
          <div>
            <h1 className="text-xl font-bold text-white capitalize">{(t as any)[activeTab]}</h1>
            <p className="text-sm text-slate-400">{t.workspace}</p>
          </div>
          <div className="flex items-center gap-6">
             {/* Language Selector */}
             <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                <button 
                  onClick={() => setLang('es')}
                  className={`px-3 py-1 text-xs font-bold rounded ${lang === 'es' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400'}`}
                >
                  ES
                </button>
                <button 
                  onClick={() => setLang('en')}
                  className={`px-3 py-1 text-xs font-bold rounded ${lang === 'en' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400'}`}
                >
                  EN
                </button>
             </div>

             <div className="h-8 w-px bg-slate-700"></div>
             
             <button 
                onClick={() => setActiveTab('campaigns')}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
             >
                <i className="fas fa-plus"></i> {t.newCampaign}
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950">
          {activeTab === 'dashboard' && <TrendDashboard lang={lang} />}
          {activeTab === 'campaigns' && <CampaignBuilder lang={lang} />}
          {activeTab === 'live' && <div className="max-w-4xl mx-auto pt-12"><LiveAgent lang={lang} /></div>}
          {activeTab === 'data' && (
             <div className="flex flex-col items-center justify-center h-full text-slate-400 animate-fade-in">
                <i className="fas fa-database text-6xl mb-4 text-slate-600"></i>
                <h2 className="text-2xl font-bold text-white mb-2">{t.data}</h2>
                <p className="max-w-md text-center">Experimental Environment.</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
