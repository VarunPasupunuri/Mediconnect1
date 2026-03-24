import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HealthScore = ({ score }) => {
  const [isHovered, setIsHovered] = useState(false);
  const r = 38, circ = 2 * Math.PI * r;
  const progress = ((100 - score) / 100) * circ;

  return (
    <div 
      className="relative flex-shrink-0 flex flex-col items-center gap-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      // For mobile tap interactions
      onClick={() => setIsHovered(!isHovered)}
    >
      <div className="relative w-24 h-24 flex items-center justify-center cursor-help">
        {/* Glow behind the ring */}
        <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
        
        <svg className="rotate-[-90deg] relative z-10" width="96" height="96" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r={r} fill="rgba(15,23,42,0.4)" stroke="rgba(255,255,255,0.07)" strokeWidth="8" />
          <motion.circle 
            cx="48" cy="48" r={r} fill="none"
            stroke="url(#ringGrad)" strokeWidth="8"
            strokeLinecap="round" strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: progress }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          />
          <defs>
            <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 select-none">
          <span className="text-2xl font-black text-white drop-shadow-md">{score}</span>
          <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest drop-shadow-md">Score</span>
        </div>
      </div>
      <p className="text-blue-200/80 text-xs font-semibold select-none">Overall Wellness</p>

      {/* Interactive Tooltip Breakdown */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[110%] right-0 md:left-1/2 md:-translate-x-1/2 w-48 p-4 rounded-xl border border-slate-700/50 glass z-50 shadow-2xl"
            style={{ background: 'rgba(15,23,42,0.95)' }}
          >
            <div className="absolute -top-1.5 right-10 md:left-1/2 md:-translate-x-1/2 w-3 h-3 bg-slate-900 border-l border-t border-slate-700/50 rotate-45" />
            <h4 className="text-xs font-bold text-white mb-3 uppercase tracking-wider">Score Breakdown</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 font-medium">Activity</span>
                <span className="text-xs font-bold text-blue-400">8/10</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5"><div className="bg-blue-500 h-1.5 rounded-full w-[80%]" /></div>
              
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-slate-400 font-medium">Sleep</span>
                <span className="text-xs font-bold text-purple-400">9/10</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5"><div className="bg-purple-500 h-1.5 rounded-full w-[90%]" /></div>

              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-slate-400 font-medium">Nutrition</span>
                <span className="text-xs font-bold text-emerald-400">7/10</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5"><div className="bg-emerald-500 h-1.5 rounded-full w-[70%]" /></div>
            </div>
            <p className="text-[10px] text-slate-500 mt-3 text-center leading-tight">Calculated from recent 7 days of synchronized health data.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HealthScore;
