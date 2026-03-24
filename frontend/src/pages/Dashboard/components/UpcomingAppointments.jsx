import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const STATUS_CONFIG = {
  pending:   { badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/20', icon: AlertCircle, color: 'text-amber-400' },
  confirmed: { badge: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',   icon: Clock,        color: 'text-blue-400' },
  completed: { badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',  icon: CheckCircle,  color: 'text-emerald-400' },
  cancelled: { badge: 'bg-red-500/10 text-red-400 border border-red-500/20',    icon: XCircle,      color: 'text-red-400' },
};

const UpcomingAppointments = ({ appointments, loading }) => {
  if (loading) {
    return (
      <div className="rounded-2xl p-6 border relative overflow-hidden bg-slate-900/40 border-slate-800/50">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
        <div className="flex justify-between mb-6">
          <div className="h-6 w-48 skeleton bg-slate-800" />
          <div className="h-4 w-16 skeleton bg-slate-800" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 w-full skeleton bg-slate-800 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl p-6 border glass" 
      style={{ borderColor: 'rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-400" /> Recent Appointments
        </h2>
        <Link to="/appointments" className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 hover:underline">
          View all <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto mb-4 border border-slate-700/50">
            <Calendar className="w-6 h-6 text-slate-500" />
          </div>
          <p className="text-slate-400 text-sm mb-4">No appointments scheduled</p>
          <Link to="/doctors" className="btn-primary text-sm py-2">
            Book Now
          </Link>
        </div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
          {appointments.slice(0, 4).map((appt) => {
            const cfg = STATUS_CONFIG[appt.status] || STATUS_CONFIG.pending;
            const Icon = cfg.icon;
            return (
              <motion.div 
                variants={item}
                key={appt._id || appt.id} 
                className="flex items-center justify-between p-4 rounded-xl transition-all hover:bg-slate-800/40 relative overflow-hidden group border border-slate-800/50 hover:border-slate-700/80 cursor-pointer"
              >
                {/* Subtle hover accent */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-slate-300 font-bold text-sm flex-shrink-0 border border-slate-700/50 shadow-inner">
                    <span className="bg-gradient-to-br from-blue-400 to-indigo-400 text-transparent bg-clip-text text-lg">
                      {(appt.doctor?.name || 'D')[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-200 text-sm group-hover:text-white transition-colors">{appt.doctor?.name || 'Doctor'}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-slate-500 font-medium">{appt.date ? new Date(appt.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Today'}</p>
                      <span className="w-1 h-1 rounded-full bg-slate-700" />
                      <p className="text-xs text-slate-500 font-medium">{appt.timeSlot || appt.time || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${cfg.badge}`}>
                    <Icon className="w-3 h-3" /> {appt.status}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
};

export default UpcomingAppointments;
