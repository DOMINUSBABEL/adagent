
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { translations } from '../translations';
import { MOCK_TRENDS, COLOMBIA_ELECTION_DATA } from '../constants';

const TrendDashboard: React.FC<{lang: 'es' | 'en'}> = ({ lang }) => {
  const t = translations[lang];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {MOCK_TRENDS.map((metric, idx) => (
          <div key={idx} className="bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-indigo-500 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-xs uppercase font-semibold tracking-wider">{metric.category}</p>
                <h3 className="text-white text-lg font-bold mt-1">{metric.name}</h3>
              </div>
              <div className={`text-sm font-bold ${metric.delta >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {metric.delta > 0 ? '+' : ''}{metric.delta}%
              </div>
            </div>
            <div className="mt-4 text-2xl font-mono text-slate-200">
              {metric.value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <i className="fas fa-vote-yea text-indigo-400"></i>
            {t.projection}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={COLOMBIA_ELECTION_DATA}>
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569' }} />
                <Area type="monotone" dataKey="value" stroke="#818cf8" fill="#818cf8" fillOpacity={0.2} />
                <Area type="monotone" dataKey="value2" stroke="#f472b6" fill="#f472b6" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <i className="fab fa-python text-yellow-400"></i>
            {t.marketAnalysis}
          </h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{ name: 'Meta', pos: 40, neg: 24 }, { name: 'X', pos: 30, neg: 45 }, { name: 'WA', pos: 60, neg: 10 }]}>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b' }} />
                <Legend />
                <Bar dataKey="pos" name={t.posEngagement} fill="#34d399" />
                <Bar dataKey="neg" name={t.negFeedback} fill="#f87171" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendDashboard;
