/* eslint-disable */
import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { Bell, Plus, Clock, Pill, Trash2, Edit2, CheckCircle2, XCircle } from 'lucide-react';

const MOCK_REMINDERS = [
  { _id: 'r1', title: 'Morning Medication', time: '08:00 AM', type: 'Medicine', frequency: 'Daily', isActive: true },
  { _id: 'r2', title: 'Drink Water', time: 'Every 2 Hours', type: 'Hydration', frequency: 'Daily', isActive: true },
  { _id: 'r3', title: 'Evening Walk', time: '06:30 PM', type: 'Exercise', frequency: 'Weekdays', isActive: false },
  { _id: 'r4', title: 'Blood Pressure Check', time: '09:00 AM', type: 'Measurement', frequency: 'Weekly', isActive: true },
];

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get('/reminders');
        setReminders(data.reminders || []);
      } catch {
        const local = JSON.parse(localStorage.getItem('mediconnect_reminders')) || MOCK_REMINDERS;
        setReminders(local);
        localStorage.setItem('mediconnect_reminders', JSON.stringify(local));
      } finally { setLoading(false); }
    };
    fetch();
  }, []);

  const toggleStatus = (id) => {
    const updated = reminders.map(r => r._id === id ? { ...r, isActive: !r.isActive } : r);
    setReminders(updated);
    localStorage.setItem('mediconnect_reminders', JSON.stringify(updated));
    toast.success('Reminder status updated');
  };

  const deleteReminder = (id) => {
    const updated = reminders.filter(r => r._id !== id);
    setReminders(updated);
    localStorage.setItem('mediconnect_reminders', JSON.stringify(updated));
    toast.success('Reminder deleted');
  };

  const getTypeColor = (type) => {
    if (type.includes('Medicine')) return 'from-blue-500 to-indigo-600 text-blue-400 bg-blue-500/10 border-blue-500/20';
    if (type.includes('Hydration')) return 'from-cyan-500 to-blue-600 text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
    if (type.includes('Exercise')) return 'from-emerald-500 to-teal-600 text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    return 'from-violet-500 to-purple-600 text-violet-400 bg-violet-500/10 border-violet-500/20';
  };

  const activeCount = reminders.filter(r => r.isActive).length;

  return (
    <div className="page-container max-w-5xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="relative rounded-3xl p-8 overflow-hidden mb-6" style={{ background: 'linear-gradient(135deg,#4c1d95 0%,#3b0764 100%)' }}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30" />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-bl-full bg-violet-500/20 blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 z-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl">
              <Bell className="w-8 h-8 text-violet-300 animate-[bounce_3s_infinite]" />
            </div>
            <div>
              <p className="text-violet-300 text-sm font-bold uppercase tracking-widest mb-1">Health Assistant</p>
              <h1 className="text-3xl font-black text-white tracking-tight">Daily Reminders</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center bg-black/20 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <p className="text-2xl font-black text-white">{activeCount}</p>
              <p className="text-[10px] font-bold text-violet-300 uppercase tracking-wider">Active</p>
            </div>
            <button onClick={() => toast('Add reminder form coming soon')} className="btn-primary h-14 px-6 flex items-center gap-2 shadow-lg shadow-violet-500/30">
              <Plus className="w-5 h-5" /> New Reminder
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="h-32 rounded-2xl border animate-pulse" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }} />)}
        </div>
      ) : reminders.length === 0 ? (
        <div className="rounded-2xl p-16 text-center border bg-slate-900/50 backdrop-blur-md" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <Bell className="w-16 h-16 text-slate-700 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-white mb-2">No Reminders Set</h3>
          <p className="text-slate-500 text-sm mb-6">Create your first reminder to stay on top of your health habits.</p>
          <button className="btn-primary mx-auto">Create Reminder</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reminders.map(r => {
            const colors = getTypeColor(r.type);
            const [gradFrom, gradTo, textCol, bgCol, borderCol] = colors.split(' ');
            
            return (
              <div key={r._id} className={`group rounded-2xl p-5 border transition-all duration-300 hover:shadow-xl relative overflow-hidden ${r.isActive ? 'hover:-translate-y-1' : 'opacity-60 grayscale-[0.5]'}`}
                style={{ background: 'rgba(255,255,255,0.025)', borderColor: 'rgba(255,255,255,0.06)' }}>
                {/* Active glow */}
                {r.isActive && <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-gradient-to-br ${gradFrom} ${gradTo} group-hover:opacity-40 transition-opacity`} />}
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center border font-bold ${bgCol} ${borderCol} ${textCol}`}>
                    <Clock className="w-5 h-5 mb-0.5" />
                  </div>
                  <button onClick={() => toggleStatus(r._id)} className="w-10 h-6 bg-slate-800 rounded-full relative border border-slate-700 transition-colors" style={{ backgroundColor: r.isActive ? '#10b981' : '#1e293b' }}>
                    <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${r.isActive ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="relative z-10">
                  <h3 className="text-lg font-bold text-white mb-1">{r.title}</h3>
                  <p className="text-2xl font-black text-slate-300 tracking-tight mb-3">{r.time}</p>
                  
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                    <span className={`px-2 py-1 rounded border inline-block ${bgCol} ${textCol} ${borderCol}`}>{r.type}</span>
                    <span className="text-slate-500 bg-slate-800/50 px-2 py-1 rounded border border-slate-700/50">{r.frequency}</span>
                  </div>
                </div>

                {/* Hover actions */}
                <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300 mr-12 z-20">
                  <button className="p-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-lg backdrop-blur-sm border border-slate-600 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => deleteReminder(r._id)} className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg backdrop-blur-sm border border-red-500/20 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Reminders;
