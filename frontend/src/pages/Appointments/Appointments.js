/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { Calendar, Clock, XCircle, RefreshCw, Plus, Stethoscope, CheckCircle2, AlertCircle, X } from 'lucide-react';

const STATUS_CONFIG = {
  pending:   { badge: 'badge-yellow', label: 'Pending',   dot: 'bg-amber-400',   icon: AlertCircle },
  confirmed: { badge: 'badge-blue',   label: 'Confirmed', dot: 'bg-blue-400',    icon: Clock },
  completed: { badge: 'badge-green',  label: 'Completed', dot: 'bg-emerald-400', icon: CheckCircle2 },
  cancelled: { badge: 'badge-red',    label: 'Cancelled', dot: 'bg-red-400',     icon: XCircle },
};

const AVATAR_GRADS = [
  'from-blue-500 to-indigo-600',
  'from-violet-500 to-purple-600',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-amber-600',
];

const CancelModal = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
    <div className="rounded-2xl p-6 w-full max-w-sm border animate-scaleIn" style={{ background: 'rgba(15,23,42,0.97)', borderColor: 'rgba(255,255,255,0.08)', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}>
      <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
        <XCircle className="w-6 h-6 text-red-400" />
      </div>
      <h3 className="text-lg font-bold text-white text-center mb-2">Cancel Appointment?</h3>
      <p className="text-slate-400 text-sm text-center mb-6">This action cannot be undone. The slot will be freed for other patients.</p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="btn-secondary flex-1">Keep it</button>
        <button onClick={onConfirm} className="btn-danger flex-1">Yes, Cancel</button>
      </div>
    </div>
  </div>
);

const MOCK_APPOINTMENTS = [
  { _id: 'a1', doctorName: 'Dr. Sarah Jenkins', doctor: { specialization: 'Cardiologist' }, date: '2023-11-25', timeSlot: '10:00 AM', status: 'confirmed', reason: 'Routine checkup' },
  { _id: 'a2', doctorName: 'Dr. Michael Chen', doctor: { specialization: 'Neurologist' }, date: '2023-11-28', timeSlot: '02:30 PM', status: 'pending', reason: 'Headache analysis' }
];

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [cancelId, setCancelId] = useState(null);

  const fetchAppts = async () => {
    setLoading(true);
    try {
      const params = filter !== 'all' ? `?status=${filter}` : '';
      const { data } = await API.get(`/appointments/my${params}`);
      setAppointments(data.appointments || []);
    } catch {
      const local = JSON.parse(localStorage.getItem('mediconnect_appointments')) || MOCK_APPOINTMENTS;
      setAppointments(filter === 'all' ? local : local.filter(a => a.status === filter));
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchAppts(); }, [filter]);

  const handleCancel = async () => {
    if (!cancelId) return;
    try {
      await API.put(`/appointments/${cancelId}`, { status: 'cancelled' });
    } catch {
      const local = JSON.parse(localStorage.getItem('mediconnect_appointments')) || [];
      localStorage.setItem('mediconnect_appointments', JSON.stringify(local.map(a => (a._id || a.id) === cancelId ? { ...a, status: 'cancelled' } : a)));
    }
    toast.success('Appointment cancelled');
    setCancelId(null);
    fetchAppts();
  };

  const grouped = { pending: 0, confirmed: 0, completed: 0 };
  appointments.forEach(a => { if (grouped[a.status] !== undefined) grouped[a.status]++; });

  const statItems = [
    { label: 'Pending', count: grouped.pending, color: 'amber', from: 'from-amber-500', to: 'to-orange-500' },
    { label: 'Confirmed', count: grouped.confirmed, color: 'blue', from: 'from-blue-500', to: 'to-indigo-500' },
    { label: 'Completed', count: grouped.completed, color: 'emerald', from: 'from-emerald-500', to: 'to-teal-500' },
  ];

  return (
    <div className="page-container max-w-5xl mx-auto animate-fadeIn">
      {cancelId && <CancelModal onConfirm={handleCancel} onCancel={() => setCancelId(null)} />}

      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center" style={{ boxShadow: '0 0 20px rgba(37,99,235,0.35)' }}>
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">My Appointments</h1>
            <p className="text-slate-500 text-sm">Track and manage your consultations</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchAppts} className="btn-ghost border border-slate-800 text-sm">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <Link to="/doctors" className="btn-primary text-sm"><Plus className="w-4 h-4" /> Book New</Link>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {statItems.map(s => (
          <div key={s.label} className="rounded-2xl p-5 text-center border" style={{ background: 'rgba(255,255,255,0.025)', borderColor: 'rgba(255,255,255,0.06)' }}>
            <p className={`text-3xl font-black bg-gradient-to-r ${s.from} ${s.to} bg-clip-text text-transparent`}>{s.count}</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-1 p-1 rounded-2xl w-fit my-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 text-xs font-bold rounded-xl capitalize transition-all ${filter === s ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'text-slate-500 hover:text-slate-300'}`}>
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-2xl p-5 border animate-pulse" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }}>
              <div className="flex gap-4 items-center">
                <div className="w-14 h-14 bg-slate-800 rounded-2xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-800 rounded w-1/3" />
                  <div className="h-3 bg-slate-800 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <div className="rounded-2xl py-16 text-center border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }}>
          <Calendar className="w-14 h-14 mx-auto mb-3 text-slate-700" />
          <p className="text-slate-400 font-semibold text-lg mb-1">No appointments found</p>
          <p className="text-slate-600 text-sm mb-5">Book an appointment with a specialist</p>
          <Link to="/doctors" className="btn-primary">Find a Doctor</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((appt, i) => {
            const cfg = STATUS_CONFIG[appt.status] || STATUS_CONFIG.pending;
            const Icon = cfg.icon;
            return (
              <div key={appt._id || appt.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl border group transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                style={{ background: 'rgba(255,255,255,0.025)', borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${AVATAR_GRADS[i % AVATAR_GRADS.length]} flex items-center justify-center text-white font-black text-xl flex-shrink-0 shadow-lg`}>
                  {(appt.doctor?.name || appt.doctorName || 'D')[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-100">{appt.doctor?.name || appt.doctorName || 'Doctor'}</h3>
                    <span className={`${cfg.badge} flex items-center gap-1`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
                      {cfg.label}
                    </span>
                    {appt.paymentStatus === 'paid' && <span className="badge badge-green">✓ Paid</span>}
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5"><Stethoscope className="w-3.5 h-3.5" />{appt.doctor?.specialization || 'General Physician'}</span>
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{appt.date ? new Date(appt.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Scheduled'}</span>
                    {appt.timeSlot && <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{appt.timeSlot}</span>}
                  </div>
                  {appt.reason && <p className="text-xs text-slate-600 mt-1 truncate">📋 {appt.reason}</p>}
                </div>
                {(appt.status === 'pending' || appt.status === 'confirmed') && (
                  <button onClick={() => setCancelId(appt._id || appt.id)}
                    className="btn-danger py-2 px-4 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 flex items-center gap-1.5">
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Appointments;
