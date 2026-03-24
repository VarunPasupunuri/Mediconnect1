import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, HeartPulse, Droplets } from 'lucide-react';

const VitalsWidget = ({ loading }) => {
  const [vitals, setVitals] = useState({
    hr: 75,
    bp: '120/80',
    spo2: 98,
    lastUpdated: new Date()
  });

  useEffect(() => {
    if (loading) return;
    const interval = setInterval(() => {
      setVitals(prev => ({
        hr: Math.floor(Math.random() * 5) + 72, // 72-76
        bp: `${Math.floor(Math.random() * 5) + 118}/${Math.floor(Math.random() * 3) + 79}`,
        spo2: Math.random() > 0.8 ? 99 : 98,
        lastUpdated: new Date()
      }));
    }, 5000); // Simulate updates every 5s
    return () => clearInterval(interval);
  }, [loading]);

  if (loading) {
    return (
      <div className="rounded-2xl p-6 border relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
        <div className="flex items-center justify-between mb-5">
          <div className="h-6 w-32 skeleton bg-slate-800" />
          <div className="h-4 w-20 skeleton bg-slate-800" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex flex-col items-center gap-2 p-3">
              <div className="w-10 h-10 skeleton bg-slate-800 rounded-full" />
              <div className="h-6 w-12 skeleton bg-slate-800" />
              <div className="h-3 w-16 skeleton bg-slate-800" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, duration: 0.5 } }
  };
  const item = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="rounded-2xl p-6 border relative overflow-hidden glass"
      style={{ borderColor: 'rgba(255,255,255,0.1)' }}
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h2 className="font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-red-500" /> 
          Live Vitals
        </h2>
        <span className="text-xs text-slate-400 font-medium">
          Updated: {vitals.lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 relative z-10">
        <motion.div variants={item} className="flex flex-col items-center gap-3 p-4 rounded-xl bg-slate-900/40 border border-slate-700/50 hover:bg-slate-800/60 transition-colors">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full border border-red-500/30 animate-ping opacity-75" />
            <HeartPulse className="w-6 h-6 text-red-500 relative z-10" />
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-white">{vitals.hr} <span className="text-xs font-semibold text-slate-500 uppercase">bpm</span></p>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-1">Heart Rate</p>
          </div>
        </motion.div>

        <motion.div variants={item} className="flex flex-col items-center gap-3 p-4 rounded-xl bg-slate-900/40 border border-slate-700/50 hover:bg-slate-800/60 transition-colors">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Activity className="w-6 h-6 text-blue-500" />
          </div>
          <div className="text-center">
            <p className="text-lg font-black text-white leading-tight mt-1">{vitals.bp} <span className="text-xs font-semibold text-slate-500 min-w-max hidden lg:inline">mmHg</span></p>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-1.5">Blood Prs</p>
          </div>
        </motion.div>

        <motion.div variants={item} className="flex flex-col items-center gap-3 p-4 rounded-xl bg-slate-900/40 border border-slate-700/50 hover:bg-slate-800/60 transition-colors">
          <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center">
            <Droplets className="w-6 h-6 text-cyan-500" />
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-white">{vitals.spo2} <span className="text-xs font-semibold text-slate-500">%</span></p>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-1">SpO2</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default VitalsWidget;
