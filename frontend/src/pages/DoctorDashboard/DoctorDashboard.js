/* eslint-disable */
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import { Users, Calendar, Clock, DollarSign, Activity, FileText, CheckCircle, ChevronRight, Phone } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const mockData = [
  { day: 'Mon', patients: 12 },
  { day: 'Tue', patients: 18 },
  { day: 'Wed', patients: 15 },
  { day: 'Thu', patients: 22 },
  { day: 'Fri', patients: 19 },
  { day: 'Sat', patients: 8 },
];

const MOCK_APPOINTMENTS = [
  { _id: '1', patientName: 'John Doe', time: '09:00 AM', type: 'Follow Up', status: 'confirmed' },
  { _id: '2', patientName: 'Jane Smith', time: '10:30 AM', type: 'Consultation', status: 'pending' },
  { _id: '3', patientName: 'Mike Johnson', time: '11:15 AM', type: 'Checkup', status: 'completed' },
  { _id: '4', patientName: 'Sarah Williams', time: '02:00 PM', type: 'Consultation', status: 'confirmed' },
];

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="rounded-2xl p-5 border relative overflow-hidden group" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }}>
    <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl opacity-10 bg-${color}-500 group-hover:opacity-30 transition-opacity duration-500`} />
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 bg-${color}-500/10 border-${color}-500/20 text-${color}-400`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-3xl font-black text-white">{value}</p>
      </div>
    </div>
  </div>
);

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get('/appointments/doctor');
        setAppointments(data.appointments || []);
      } catch {
        // Fallback or ignore
      }
    };
    fetch();
  }, []);

  if (user?.role !== 'doctor' && user?.role !== 'admin') {
    return (
      <div className="page-container text-center pt-20">
        <h1 className="text-3xl font-bold text-white mb-2">Access Restricted</h1>
        <p className="text-slate-500">Only verified doctors can view this dashboard.</p>
      </div>
    );
  }

  const handleStatus = async (id, newStatus) => {
    try {
      await API.put(`/appointments/${id}`, { status: newStatus });
      setAppointments(appointments.map(a => (a._id || a.id) === id ? { ...a, status: newStatus } : a));
    } catch (err) { }
  };

  return (
    <div className="page-container max-w-6xl mx-auto animate-fadeIn">
      {/* Hero Banner */}
      <div className="relative rounded-3xl p-8 overflow-hidden mb-6" style={{ background: 'linear-gradient(135deg,#042f2e 0%,#064e3b 50%,#0f766e 100%)' }}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 animate-pulse" />
        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-64 h-64 rounded-full blur-[80px] bg-emerald-400/20" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-emerald-300 font-bold uppercase tracking-widest text-xs mb-2 flex items-center gap-2"><Activity className="w-4 h-4" /> Doctor Portal</p>
            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Welcome, {user?.name || 'Dr. Jenkins'} 👋</h1>
            <p className="text-emerald-200/70 text-sm max-w-sm">You have <strong className="text-white">4</strong> appointments scheduled today. Your next patient is arriving in <strong className="text-white">15 minutes</strong>.</p>
          </div>
          <button className="btn-primary bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/30 flex items-center gap-2 text-sm px-6 py-3">
            <Calendar className="w-4 h-4" /> View Full Schedule
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Users} label="Total Patients" value="1,248" color="blue" />
        <StatCard icon={Calendar} label="Appointments" value="42" color="violet" />
        <StatCard icon={Clock} label="Hours Logged" value="128" color="amber" />
        <StatCard icon={DollarSign} label="Revenue" value="₹45k" color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 rounded-2xl border p-6 bg-slate-900/40 backdrop-blur-md" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><Activity className="w-5 h-5 text-emerald-400" /> Patient Volume</h2>
            <select className="bg-slate-800 border border-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-lg focus:outline-none">
              <option>This Week</option><option>Last Week</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={mockData}>
              <defs>
                <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
              <Area type="monotone" dataKey="patients" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPatients)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Appointments Queue */}
        <div className="rounded-2xl border p-6 bg-slate-900/40 backdrop-blur-md flex flex-col" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><Clock className="w-5 h-5 text-blue-400" /> Today's Queue</h2>
            <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-full font-bold">4 Total</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {appointments.map(appt => (
              <div key={appt._id || appt.id} className="p-4 rounded-2xl border transition-all hover:bg-white/5" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-white text-sm">{appt.patientName}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{appt.type}</p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border inline-block ${
                    appt.status === 'confirmed' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 
                    appt.status === 'pending' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-slate-400 bg-slate-500/10 border-slate-500/20'
                  }`}>{appt.status}</span>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                  <div className="text-xs font-bold text-slate-300 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">{appt.time}</div>
                  <div className="flex gap-2">
                    {appt.status !== 'completed' && <button onClick={() => handleStatus(appt._id || appt.id, 'completed')} className="p-1.5 text-emerald-500 hover:bg-emerald-500/20 rounded-lg transition-colors" title="Mark Completed"><CheckCircle className="w-4 h-4" /></button>}
                    <button className="p-1.5 text-blue-500 hover:bg-blue-500/20 rounded-lg transition-colors" title="View Records"><FileText className="w-4 h-4" /></button>
                    <button className="p-1.5 text-emerald-500 hover:bg-emerald-500/20 rounded-lg transition-colors" title="Start Call"><Phone className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 text-xs font-bold text-slate-400 hover:text-white flex items-center justify-center gap-1 transition-colors">
            View All Patients <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
