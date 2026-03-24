import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 text-xs space-y-1 backdrop-blur-md" style={{ background: 'rgba(15,23,42,0.85)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
      <p className="font-bold text-slate-300 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color }} className="flex justify-between gap-4">
          <span>{p.name}:</span>
          <span className="font-bold">{p.value} {p.name === 'Sleep' ? 'hrs' : ''}</span>
        </p>
      ))}
    </div>
  );
};

const ActivityChart = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="lg:col-span-2 rounded-2xl p-6 border relative overflow-hidden bg-slate-900/40 border-slate-800/50 h-[280px]">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
        <div className="flex justify-between mb-6">
          <div className="h-6 w-40 skeleton bg-slate-800" />
          <div className="h-4 w-32 skeleton bg-slate-800" />
        </div>
        <div className="h-[180px] w-full skeleton bg-slate-800 rounded-xl" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="lg:col-span-2 rounded-2xl p-6 border glass" 
      style={{ borderColor: 'rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" /> Weekly Activity
        </h2>
        <div className="flex gap-4 text-xs font-medium text-slate-400">
          <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-blue-500 rounded-full inline-block shadow-[0_0_8px_rgba(59,130,246,0.6)]" />Steps</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-purple-500 rounded-full inline-block shadow-[0_0_8px_rgba(168,85,247,0.6)]" />Sleep hrs</span>
        </div>
      </div>
      
      <div className="h-[210px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gSteps" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gSleep" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.06} vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            
            {/* Dual Y-Axis configuration */}
            <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={45} tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(1)}k` : val} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={30} domain={[0, 12]} />
            
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }} />
            
            <Area yAxisId="left" type="monotone" dataKey="steps" stroke="#3b82f6" fill="url(#gSteps)" strokeWidth={3} name="Steps" activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6', style: { filter: 'drop-shadow(0px 0px 8px rgba(59,130,246,0.8))' } }} />
            <Area yAxisId="right" type="monotone" dataKey="sleep" stroke="#a855f7" fill="url(#gSleep)" strokeWidth={3} name="Sleep" activeDot={{ r: 6, strokeWidth: 0, fill: '#a855f7', style: { filter: 'drop-shadow(0px 0px 8px rgba(168,85,247,0.8))' } }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default ActivityChart;
