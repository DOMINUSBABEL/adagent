
import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { translations } from '../translations';
import { COLOMBIA_ELECTION_DATA } from '../constants';
import { GoogleGenAI } from "@google/genai";

const TrendDashboard: React.FC<{lang: 'es' | 'en'}> = ({ lang }) => {
  const t = translations[lang];
  const [liveTrends, setLiveTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveIntelligence = async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: "Provide current real-time metrics for: 1. Polymarket US Election odds, 2. Bitcoin/USD price, 3. Global AI Sentiment index, 4. Tech Stock Volatility. Return as JSON array with name, value (number), delta (number), and category.",
          config: {
            tools: [{ googleSearch: {} }],
            responseMimeType: "application/json"
          }
        });
        const data = JSON.parse(response.text || "[]");
        setLiveTrends(data);
      } catch (e) {
        console.error("Live metrics fetch failed", e);
        setLiveTrends([
          { name: 'Polymarket Odds', value: 62.4, delta: 2.1, category: 'Politics' },
          { name: 'BTC/USD', value: 94200, delta: -1.5, category: 'Crypto' },
          { name: 'AI Sentiment', value: 88, delta: 5.4, category: 'Tech' },
          { name: 'S&P 500 Vol', value: 14.2, delta: 0.8, category: 'Economy' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveIntelligence();
    const interval = setInterval(fetchLiveIntelligence, 60000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(loading ? Array(4).fill({}) : liveTrends).map((metric: any, idx) => (
          <div key={idx} className={`bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl transition-all duration-500 hover:border-indigo-500/50 ${loading ? 'animate-pulse' : ''}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-[8px] uppercase font-black tracking-[0.2em]">{metric.category || 'Loading...'}</p>
                <h3 className="text-white text-[11px] font-black mt-1 uppercase tracking-wider truncate max-w-[120px]">{metric.name || '---'}</h3>
              </div>
              {!loading && (
                <div className={`text-[10px] font-mono font-bold ${metric.delta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {metric.delta > 0 ? '▲' : '▼'} {Math.abs(metric.delta)}%
                </div>
              )}
            </div>
            <div className="mt-4 text-2xl font-black text-indigo-100 tracking-tighter">
              {loading ? '---' : typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-2xl relative group min-h-[400px]">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
            <i className="fas fa-chart-line text-indigo-500"></i>
            {t.projection}
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={COLOMBIA_ELECTION_DATA}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                <Area type="monotone" dataKey="value2" stroke="#ec4899" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-2xl relative min-h-[400px]">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
            <i className="fas fa-microchip text-emerald-500"></i>
            {t.marketAnalysis}
          </h3>
          <div className="h-72 w-full">
             <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={[{ name: 'Meta', pos: 40, neg: 24 }, { name: 'X', pos: 30, neg: 45 }, { name: 'WA', pos: 60, neg: 10 }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }} />
                <Bar dataKey="pos" name={t.posEngagement} fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="neg" name={t.negFeedback} fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendDashboard;
