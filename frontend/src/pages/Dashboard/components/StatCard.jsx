import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ label, value, suffix, icon: Icon, from, to, glow, loading, delay = 0 }) => {
  if (loading) {
    return (
      <div className="relative rounded-2xl p-5 overflow-hidden border bg-slate-900/50 border-slate-800/50 h-[120px]">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
        <div className="w-11 h-11 rounded-xl skeleton bg-slate-800 mb-3" />
        <div className="h-8 w-16 skeleton bg-slate-800 mb-2" />
        <div className="h-3 w-24 skeleton bg-slate-800" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative rounded-2xl p-5 overflow-hidden border group glass hover:-translate-y-1 transition-all duration-300"
      style={{ borderColor: 'rgba(255,255,255,0.06)' }}
    >
      {/* Background glow effect on hover */}
      <div className="absolute -inset-4 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none blur-xl" style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }} />
      
      <div 
        className={`w-11 h-11 rounded-xl bg-gradient-to-br ${from} ${to} flex items-center justify-center mb-3 flex-shrink-0 relative z-10 transition-transform group-hover:scale-110`} 
        style={{ boxShadow: glow }}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      
      <div className="relative z-10">
        <p className="text-3xl font-black text-white tracking-tight">{value}{suffix || ''}</p>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">{label}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;
