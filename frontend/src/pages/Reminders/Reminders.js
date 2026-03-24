/* eslint-disable */
import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { Bell, Plus, Clock, Trash2, Edit2, CheckCircle2, XCircle, X, Save } from 'lucide-react';

const MOCK_REMINDERS = [
  { _id: 'r1', title: 'Morning Medication', time: '08:00', type: 'Medicine', frequency: 'Daily', isActive: true },
  { _id: 'r2', title: 'Drink Water', time: '10:00', type: 'Hydration', frequency: 'Daily', isActive: true },
  { _id: 'r3', title: 'Evening Walk', time: '18:30', type: 'Exercise', frequency: 'Weekdays', isActive: false },
  { _id: 'r4', title: 'Blood Pressure Check', time: '09:00', type: 'Measurement', frequency: 'Weekly', isActive: true },
];

const TYPES = ['Medicine', 'Hydration', 'Exercise', 'Measurement', 'Appointment', 'Other'];
const FREQUENCIES = ['Daily', 'Weekdays', 'Weekends', 'Weekly', 'Monthly'];

const AddReminderModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({ title: '', time: '08:00', type: 'Medicine', frequency: 'Daily', notes: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Please enter a title');
    if (!form.time) return toast.error('Please set a time');
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-md rounded-3xl border border-slate-700 shadow-2xl overflow-hidden" style={{ background: 'rgba(15,23,42,0.98)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <Bell className="w-4 h-4 text-violet-400" />
            </div>
            <h2 className="text-white font-black text-lg">New Reminder</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Reminder Title*</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Take Vitamin D"
              className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all placeholder:text-slate-500"
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Time*</label>
            <input
              type="time"
              required
              value={form.time}
              onChange={e => setForm({ ...form, time: e.target.value })}
              className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
              style={{ colorScheme: 'dark' }}
            />
          </div>

          {/* Type + Frequency */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Type</label>
              <select
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value })}
                className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-all appearance-none"
              >
                {TYPES.map(t => <option key={t} value={t} className="bg-slate-900">{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Frequency</label>
              <select
                value={form.frequency}
                onChange={e => setForm({ ...form, frequency: e.target.value })}
                className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-all appearance-none"
              >
                {FREQUENCIES.map(f => <option key={f} value={f} className="bg-slate-900">{f}</option>)}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Notes (Optional)</label>
            <textarea
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              placeholder="Any additional instructions..."
              rows={2}
              className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all resize-none placeholder:text-slate-500"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-2xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-all font-bold text-sm">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-violet-500/30 transition-all">
              {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Reminder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchReminders = async () => {
    try {
      const { data } = await API.get('/reminders');
      setReminders(data.reminders || []);
    } catch {
      const local = JSON.parse(localStorage.getItem('mediconnect_reminders')) || MOCK_REMINDERS;
      setReminders(local);
      localStorage.setItem('mediconnect_reminders', JSON.stringify(local));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReminders(); }, []);

  const handleSave = async (formData) => {
    try {
      const { data } = await API.post('/reminders', formData);
      setReminders(prev => [data.reminder, ...prev]);
      toast.success('Reminder created!');
    } catch {
      const newReminder = { _id: Date.now().toString(), ...formData, isActive: true };
      const updated = [newReminder, ...reminders];
      setReminders(updated);
      localStorage.setItem('mediconnect_reminders', JSON.stringify(updated));
      toast.success('Reminder saved locally!');
    }
    setShowModal(false);
  };

  const toggleStatus = async (id) => {
    const reminder = reminders.find(r => r._id === id);
    const updated = reminders.map(r => r._id === id ? { ...r, isActive: !r.isActive } : r);
    setReminders(updated);
    try {
      await API.put(`/reminders/${id}`, { isActive: !reminder.isActive });
    } catch {
      localStorage.setItem('mediconnect_reminders', JSON.stringify(updated));
    }
    toast.success('Reminder updated');
  };

  const deleteReminder = async (id) => {
    const updated = reminders.filter(r => r._id !== id);
    setReminders(updated);
    try {
      await API.delete(`/reminders/${id}`);
    } catch {
      localStorage.setItem('mediconnect_reminders', JSON.stringify(updated));
    }
    toast.success('Reminder deleted');
  };

  const getTypeColor = (type) => {
    if (!type) return 'text-violet-400 bg-violet-500/10 border-violet-500/20';
    if (type.includes('Medicine')) return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    if (type.includes('Hydration')) return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
    if (type.includes('Exercise')) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (type.includes('Appointment')) return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    return 'text-violet-400 bg-violet-500/10 border-violet-500/20';
  };

  // Format 24h time to 12h display
  const formatTime = (time) => {
    if (!time) return '';
    if (time.includes('AM') || time.includes('PM')) return time;
    const [h, m] = time.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  };

  const activeCount = reminders.filter(r => r.isActive).length;

  return (
    <div className="page-container max-w-5xl mx-auto animate-fadeIn">
      {showModal && <AddReminderModal onClose={() => setShowModal(false)} onSave={handleSave} />}

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
            <button onClick={() => setShowModal(true)} className="btn-primary h-14 px-6 flex items-center gap-2 shadow-lg shadow-violet-500/30">
              <Plus className="w-5 h-5" /> New Reminder
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="h-40 rounded-2xl border animate-pulse" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }} />)}
        </div>
      ) : reminders.length === 0 ? (
        <div className="rounded-2xl p-16 text-center border bg-slate-900/50 backdrop-blur-md" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <Bell className="w-16 h-16 text-slate-700 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-white mb-2">No Reminders Set</h3>
          <p className="text-slate-500 text-sm mb-6">Create your first reminder to stay on top of your health habits.</p>
          <button onClick={() => setShowModal(true)} className="btn-primary mx-auto"><Plus className="w-4 h-4" /> Create Reminder</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reminders.map(r => {
            const colorClass = getTypeColor(r.type);
            return (
              <div key={r._id} className={`group rounded-2xl p-5 border transition-all duration-300 hover:shadow-xl relative overflow-hidden ${r.isActive ? 'hover:-translate-y-1' : 'opacity-60 grayscale-[0.5]'}`}
                style={{ background: 'rgba(255,255,255,0.025)', borderColor: 'rgba(255,255,255,0.06)' }}>

                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center border font-bold ${colorClass}`}>
                    <Clock className="w-5 h-5 mb-0.5" />
                  </div>
                  {/* Toggle */}
                  <button onClick={() => toggleStatus(r._id)} className="w-10 h-6 rounded-full relative border border-slate-700 transition-colors" style={{ backgroundColor: r.isActive ? '#7c3aed' : '#1e293b' }}>
                    <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${r.isActive ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="relative z-10">
                  <h3 className="text-lg font-bold text-white mb-1">{r.title}</h3>
                  <p className="text-2xl font-black text-slate-300 tracking-tight mb-3">{formatTime(r.time)}</p>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                    <span className={`px-2 py-1 rounded border inline-block ${colorClass}`}>{r.type}</span>
                    <span className="text-slate-500 bg-slate-800/50 px-2 py-1 rounded border border-slate-700/50">{r.frequency}</span>
                  </div>
                  {r.notes && <p className="text-slate-500 text-xs mt-2 truncate">{r.notes}</p>}
                </div>

                {/* Delete on hover */}
                <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity mr-12 z-20">
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
