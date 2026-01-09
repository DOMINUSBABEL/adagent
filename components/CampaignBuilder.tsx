
import React, { useState } from 'react';
import { ModelType, Platform, GeneratedContent, AdObjective, ConsumerSentiment } from '../types';
import { generateAdvancedAd, orchestrateParameters, fetchLiveSignalData, analyzeSocialContext } from '../services/geminiService';
import { translations } from '../translations';

const OBJECTIVES: AdObjective[] = ['Conversion', 'Awareness', 'Fear of Missing Out', 'Educational', 'Political Persuasion', 'Crisis Mgmt'];
const SENTIMENTS: ConsumerSentiment[] = ['Anxious', 'Optimistic', 'Skeptical', 'Apathetic', 'Urgent'];

const CampaignBuilder: React.FC<{lang: 'es' | 'en'}> = ({ lang }) => {
  const t = translations[lang];
  const [loading, setLoading] = useState(false);
  const [orchestrating, setOrchestrating] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [analyzingSocial, setAnalyzingSocial] = useState(false);
  const [masterBrief, setMasterBrief] = useState('');
  const [socialUrl, setSocialUrl] = useState('');
  
  // States for Parameters
  const [platform, setPlatform] = useState<Platform>(Platform.META);
  const [objective, setObjective] = useState<AdObjective>('Conversion');
  const [sentiment, setSentiment] = useState<ConsumerSentiment>('Optimistic');
  const [signal, setSignal] = useState('Polymarket: Crypto Sentiment');
  const [segment, setSegment] = useState('Global Audience');
  const [results, setResults] = useState<GeneratedContent[]>([]);
  const [verifiedSources, setVerifiedSources] = useState<{title: string, uri: string}[]>([]);

  const handleSocialAnalysis = async () => {
    if (!socialUrl) return;
    setAnalyzingSocial(true);
    try {
      const data = await analyzeSocialContext(socialUrl);
      setSentiment(data.suggestedTone);
      if (data.suggestedSegment) setSegment(data.suggestedSegment);
      setMasterBrief(prev => prev + (prev ? "\n\n" : "") + "SOCIAL INTELLIGENCE (" + socialUrl + "):\n" + data.insights);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzingSocial(false);
    }
  };

  const handleScanLiveSignal = async () => {
    if (!signal) return;
    setScanning(true);
    try {
      const data = await fetchLiveSignalData(signal);
      setVerifiedSources(data.sources);
      setMasterBrief(prev => prev + (prev ? "\n\n" : "") + "LIVE DATA GROUNDING: " + data.signal);
    } catch (e) {
      console.error(e);
    } finally {
      setScanning(false);
    }
  };

  const handleAIOrchestration = async () => {
    if (!masterBrief) return;
    setOrchestrating(true);
    try {
      const suggested = await orchestrateParameters(masterBrief);
      if (suggested.objective) setObjective(suggested.objective as AdObjective);
      if (suggested.sentiment) setSentiment(suggested.sentiment as ConsumerSentiment);
      if (suggested.segment) setSegment(suggested.segment);
      if (suggested.externalSignal) setSignal(suggested.externalSignal);
    } finally {
      setOrchestrating(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const { content, reasoning } = await generateAdvancedAd(
        platform,
        { objective, sentiment, segment, externalSignal: signal },
        masterBrief,
        ModelType.PRO,
        lang
      );
      setResults([{
        id: Math.random().toString(36).substr(2, 9),
        platform,
        strategy: { objective, sentiment, segment, externalSignal: signal },
        content,
        reasoning,
        hashtags: ['#AI', '#Context'],
        timestamp: new Date()
      }, ...results]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-full pb-10">
      <div className="xl:col-span-5 space-y-6">
        
        {/* Social Ingestion Layer */}
        <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(168,85,247,0.1)]">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <i className="fas fa-share-alt text-purple-400"></i>
            {lang === 'es' ? 'Ingestión de Referencia Social' : 'Social Reference Ingestion'}
          </h3>
          <div className="flex gap-2">
            <input 
              type="text" 
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-sm focus:border-purple-500 outline-none"
              placeholder="URL (X, LinkedIn, Post...)"
              value={socialUrl}
              onChange={(e) => setSocialUrl(e.target.value)}
            />
            <button 
              onClick={handleSocialAnalysis}
              disabled={analyzingSocial || !socialUrl}
              className="px-4 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-xl hover:bg-purple-600/30 transition-all"
            >
              {analyzingSocial ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-bolt"></i>}
            </button>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 italic">
            {lang === 'es' ? '* Analiza el tono y la audiencia del link para ajustar la campaña.' : '* Analyzes tone and audience from the link to adjust the campaign.'}
          </p>
        </div>

        {/* AI Briefing Area */}
        <div className="bg-slate-900 border border-blue-500/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <span className="p-1.5 bg-blue-500 rounded-md text-white text-xs">AI</span>
            {lang === 'es' ? 'Brief Maestro de Campaña' : 'Master Campaign Brief'}
          </h3>
          <textarea 
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white text-sm h-32 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none"
            placeholder={lang === 'es' ? "Describe tu campaña o usa los analizadores de arriba..." : "Describe your campaign or use the analyzers above..."}
            value={masterBrief}
            onChange={(e) => setMasterBrief(e.target.value)}
          />
          <button 
            onClick={handleAIOrchestration}
            disabled={orchestrating || !masterBrief}
            className="mt-3 w-full py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
          >
            {orchestrating ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-magic mr-2"></i>}
            {lang === 'es' ? 'Auto-Configurar Parámetros' : 'Auto-Configure Parameters'}
          </button>
        </div>

        {/* Live Signal Scanner */}
        <div className="bg-slate-900 border border-green-500/20 rounded-2xl p-6">
          <label className="text-xs font-bold text-green-500 uppercase mb-2 flex items-center gap-2">
            <i className="fas fa-satellite-dish animate-pulse"></i>
            {lang === 'es' ? 'Verificación de Señal en Vivo (Polymarket/OSINT)' : 'Live Signal Verification'}
          </label>
          <div className="flex gap-2 mb-4">
            <input 
              type="text" 
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-sm" 
              value={signal} 
              onChange={e => setSignal(e.target.value)} 
              placeholder="e.g. BTC Price, Elections Colombia..."
            />
            <button 
              onClick={handleScanLiveSignal}
              disabled={scanning}
              className="px-4 bg-green-600/20 text-green-400 border border-green-500/30 rounded-xl hover:bg-green-600/30 transition-all"
            >
              {scanning ? <i className="fas fa-sync fa-spin"></i> : <i className="fas fa-search"></i>}
            </button>
          </div>
          
          {verifiedSources.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{lang === 'es' ? 'Fuentes Verificadas:' : 'Verified Sources:'}</p>
              <div className="flex flex-wrap gap-2">
                {verifiedSources.slice(0, 3).map((src, i) => (
                  <a 
                    key={i} 
                    href={src.uri} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[10px] bg-slate-800 text-blue-400 px-2 py-1 rounded border border-slate-700 hover:border-blue-500 transition-all truncate max-w-[150px]"
                  >
                    <i className="fas fa-external-link-alt mr-1"></i> {src.title}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Manual Parameters */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
            <i className="fas fa-sliders-h text-slate-500"></i>
            {t.targetingEngine}
          </h2>

          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">{t.objective}</label>
                <select className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-sm appearance-none" value={objective} onChange={e => setObjective(e.target.value as AdObjective)}>
                  {OBJECTIVES.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">{t.tone}</label>
                <select className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-sm appearance-none" value={sentiment} onChange={e => setSentiment(e.target.value as ConsumerSentiment)}>
                  {SENTIMENTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">{lang === 'es' ? 'Segmento de Target' : 'Target Segment'}</label>
              <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-sm" value={segment} onChange={e => setSegment(e.target.value)} />
            </div>

            <button 
              onClick={handleGenerate}
              disabled={loading || !masterBrief}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${loading ? 'bg-slate-800' : 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-xl'}`}
            >
              {loading ? <i className="fas fa-sync fa-spin"></i> : <i className="fas fa-rocket"></i>}
              {loading ? t.hyperSegmenting : t.generateAds}
            </button>
          </div>
        </div>
      </div>

      <div className="xl:col-span-7 space-y-6 overflow-y-auto max-h-[85vh] pr-4 custom-scrollbar">
        {results.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-800 rounded-3xl p-20 opacity-50">
            <i className="fas fa-satellite-dish text-5xl mb-4"></i>
            <p className="text-sm font-bold uppercase tracking-widest">{t.neuralReady}</p>
          </div>
        )}

        {results.map(ad => (
          <div key={ad.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl animate-fade-in group">
            <div className="p-4 bg-slate-950 flex justify-between border-b border-slate-800">
               <div className="flex gap-2">
                <span className="text-[10px] font-black text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded uppercase tracking-tighter">Target: {ad.strategy.segment}</span>
                <span className="text-[10px] font-black text-purple-400 bg-purple-500/10 px-2 py-1 rounded uppercase tracking-tighter">{ad.strategy.sentiment}</span>
               </div>
               <span className="text-[10px] text-slate-500">{ad.timestamp.toLocaleTimeString()}</span>
            </div>
            <div className="p-6">
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 mb-6 text-slate-200 text-sm leading-relaxed font-sans whitespace-pre-wrap">
                {ad.content}
              </div>
              <div className="flex items-start gap-4 p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
                <i className="fas fa-lightbulb text-indigo-400 mt-1"></i>
                <div>
                  <h4 className="text-[10px] font-black text-indigo-400 uppercase mb-1">{t.dataReasoning}</h4>
                  <p className="text-xs text-indigo-200/70 italic">{ad.reasoning}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignBuilder;
