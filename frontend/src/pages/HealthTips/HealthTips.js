/* eslint-disable */
import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { HeartPulse, ChevronRight, Activity, Zap, Apple, TrendingUp } from 'lucide-react';

const MOCK_TIPS = [
  { _id: 't1', title: 'The Power of Hydration', category: 'Nutrition', readTime: '3 min', icon: Apple, color: 'emerald', content: 'Drinking at least 8 glasses of water daily helps maintain energy levels, supports digestion, and keeps your skin clear.' },
  { _id: 't2', title: 'Sleep Hygiene Essentials', category: 'Wellness', readTime: '4 min', icon: Zap, color: 'violet', content: 'Create a dark, quiet, and cool environment. Avoid screens 1 hour before bed to regulate your circadian rhythm.' },
  { _id: 't3', title: '5-Minute Desk Stretches', category: 'Fitness', readTime: '5 min', icon: Activity, color: 'blue', content: 'Combat prolonged sitting with these quick desk exercises targeting your neck, shoulders, and lower back.' },
  { _id: 't4', title: 'Managing Sugar Intake', category: 'Diet', readTime: '6 min', icon: TrendingUp, color: 'rose', content: 'Learn how to identify hidden sugars in processed foods and healthier alternatives to satisfy your sweet tooth.' },
];

const HealthTips = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get('/health-tips');
        setTips(data.tips || []);
      } catch {
        setTips(MOCK_TIPS);
      } finally { setLoading(false); }
    };
    fetch();
  }, []);

  const categories = ['All', ...Array.from(new Set(MOCK_TIPS.map(t => t.category)))];
  const filteredTips = activeCategory === 'All' ? tips : tips.filter(t => t.category === activeCategory);

  return (
    <div className="page-container max-w-5xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 mx-auto rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
          <HeartPulse className="w-8 h-8 text-rose-400" />
        </div>
        <h1 className="text-3xl font-black text-white mb-3">Health Insights & Tips</h1>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">Expert-curated articles to help you maintain a healthy lifestyle, improve your diet, and boost mental wellbeing.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {categories.map(c => (
          <button key={c} onClick={() => setActiveCategory(c)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${activeCategory === c ? 'bg-white text-black shadow-lg shadow-white/10' : 'bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-48 rounded-3xl border animate-pulse" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTips.map((tip, i) => {
            const Icon = tip.icon || HeartPulse;
            const c = tip.color || 'blue';
            return (
              <div key={tip._id} className="group rounded-3xl p-6 border flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl relative overflow-hidden cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.025)', borderColor: 'rgba(255,255,255,0.06)' }}>
                {/* Glow ring on hover */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-${c}-500 opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500 rounded-full`} />
                
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-${c}-500/10 border border-${c}-500/20 flex flex-shrink-0 items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-${c}-400`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{tip.title}</h3>
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <span className={`text-${c}-400`}>{tip.category}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-700" />
                      <span>{tip.readTime} read</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-400 leading-relaxed overflow-hidden line-clamp-2 mb-4 flex-1">
                  {tip.content}
                </p>

                <div className={`pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-${c}-400 group-hover:text-${c}-300 transition-colors`}>
                  Read Article
                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HealthTips;
