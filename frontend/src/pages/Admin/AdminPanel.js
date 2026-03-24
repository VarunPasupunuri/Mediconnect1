/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { 
  Users, Activity, Calendar, DollarSign, CheckCircle, 
  XCircle, Trash2, Edit, Plus, Shield, Search, TrendingUp, AlertTriangle
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell 
} from 'recharts';

const TABS = [
  { id: 'dashboard', label: 'Overview' },
  { id: 'users', label: 'Users' },
  { id: 'approvals', label: 'Doctor Approvals' },
  { id: 'tips', label: 'Health Tips' },
];

const mockStats = [
  { label: 'Total Users', value: 1254, change: '+12%', icon: Users, color: 'blue' },
  { label: 'Verified Doctors', value: 142, change: '+5%', icon: Shield, color: 'emerald' },
  { label: 'Appointments', value: 3840, change: '+18%', icon: Calendar, color: 'violet' },
  { label: 'Revenue (₹)', value: '8.4L', change: '+24%', icon: DollarSign, color: 'amber' },
];

const mockChart = [
  { day: 'Mon', visits: 400 },
  { day: 'Tue', visits: 520 },
  { day: 'Wed', visits: 380 },
  { day: 'Thu', visits: 600 },
  { day: 'Fri', visits: 450 },
  { day: 'Sat', visits: 720 },
  { day: 'Sun', visits: 850 },
];

const mockUsers = [
  { _id: 'u1', name: 'John Doe', email: 'john@example.com', role: 'patient', active: true, joined: '2023-10-12' },
  { _id: 'u2', name: 'Dr. Sarah Jenkins', email: 'sarah@hospital.com', role: 'doctor', active: true, joined: '2023-09-05' },
  { _id: 'u3', name: 'Mike Ross', email: 'mike@example.com', role: 'patient', active: false, joined: '2023-11-20' },
  { _id: 'u4', name: 'Admin Demo', email: 'admin@mediconnect.com', role: 'admin', active: true, joined: '2023-01-01' },
];

const mockApprovals = [
  { _id: 'a1', user: { name: 'Dr. Emily Chen', email: 'emily.c@med.com' }, specialization: 'Neurologist', experience: 12, hospital: 'City Brain Center', documentUrl: '#' },
  { _id: 'a2', user: { name: 'Dr. Raj Patel', email: 'patel.raj@clinic.com' }, specialization: 'Dermatologist', experience: 5, hospital: 'Skin Cares', documentUrl: '#' },
];

const StatCard = ({ icon: Icon, label, value, change, color, index }) => (
  <div className="rounded-2xl p-5 border relative overflow-hidden animate-slideUp" style={{ animationDelay: `${index * 0.1}s`, background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }}>
    <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-10 blur-2xl bg-${color}-500`} />
    <div className="flex items-start justify-between">
      <div>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">{label}</p>
        <p className="text-3xl font-black text-white">{value}</p>
        <p className="text-xs font-bold text-emerald-400 mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {change} this month</p>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${color}-500/10 border border-${color}-500/20 shadow-lg shadow-${color}-500/20`}>
        <Icon className={`w-6 h-6 text-${color}-400`} />
      </div>
    </div>
  </div>
);

const AdminPanel = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState(mockUsers);
  const [approvals, setApprovals] = useState(mockApprovals);
  const [search, setSearch] = useState('');

  if (user?.role !== 'admin') {
    return (
      <div className="page-container flex flex-col items-center justify-center h-96 text-center">
        <Shield className="w-16 h-16 text-red-500 mb-4 opacity-80" />
        <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-slate-400">You do not have administrator privileges to view this page.</p>
      </div>
    );
  }

  const handleApprove = (id) => {
    setApprovals(approvals.filter(a => a._id !== id));
    toast.success('Doctor approved!');
  };

  const handleReject = (id) => {
    setApprovals(approvals.filter(a => a._id !== id));
    toast.success('Application rejected');
  };

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const RoleBadge = ({ role }) => {
    const cfgs = {
      admin: 'bg-violet-500/20 text-violet-400 border border-violet-500/30',
      doctor: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      patient: 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
    };
    return <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${cfgs[role]}`}>{role}</span>;
  };

  return (
    <div className="page-container max-w-6xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Shield className="w-8 h-8 text-violet-500" /> Admin Control
          </h1>
          <p className="text-slate-500 text-sm mt-1">System overview and management</p>
        </div>
        <div className="flex gap-1 p-1 rounded-2xl w-fit" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${tab === t.id ? 'bg-violet-600 text-white shadow-md shadow-violet-500/30' : 'text-slate-500 hover:text-slate-300'}`}>
              {t.label} 
              {t.id === 'approvals' && approvals.length > 0 && <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{approvals.length}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* ── OVERVIEW ── */}
      {tab === 'dashboard' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockStats.map((s, i) => <StatCard key={s.label} {...s} index={i} />)}
          </div>
          <div className="rounded-2xl p-6 border bg-slate-900/50 backdrop-blur-md" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Activity className="w-5 h-5 text-blue-400" /> Platform Traffic</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockChart}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.05} vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                <Bar dataKey="visits" radius={[6, 6, 0, 0]}>
                  {mockChart.map((e, index) => (
                    <Cell key={`cell-${index}`} fill={index === mockChart.length - 1 ? '#8b5cf6' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── USERS ── */}
      {tab === 'users' && (
        <div className="rounded-2xl border bg-slate-900/50 backdrop-blur-md overflow-hidden animate-fadeIn" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input type="text" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)}
                className="input-field pl-9 h-9 text-sm" style={{ background: 'rgba(255,255,255,0.05)', border: 'none' }} />
            </div>
            <button className="btn-primary text-xs py-1.5 px-3"><Plus className="w-4 h-4" /> Add User</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/50 text-xs uppercase text-slate-500 font-bold border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map(u => (
                  <tr key={u._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-white">{u.name}</p>
                      <p className="text-xs text-slate-500">{u.email}</p>
                    </td>
                    <td className="px-6 py-4"><RoleBadge role={u.role} /></td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 text-xs font-bold ${u.active ? 'text-emerald-400' : 'text-slate-500'}`}>
                        <span className={`w-2 h-2 rounded-full ${u.active ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                        {u.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{u.joined}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 transition-colors mr-1"><Edit className="w-4 h-4" /></button>
                      <button className="p-1.5 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors" onClick={() => toast.success('Deleted')}><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr><td colSpan="5" className="text-center py-10 text-slate-500">No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── APPROVALS ── */}
      {tab === 'approvals' && (
        <div className="space-y-4 animate-fadeIn">
          {approvals.length === 0 ? (
            <div className="rounded-2xl border p-12 text-center" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }}>
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-bold text-white mb-1">All caught up!</h3>
              <p className="text-slate-400 text-sm">There are no pending doctor approvals.</p>
            </div>
          ) : approvals.map(app => (
            <div key={app._id} className="rounded-2xl border p-5 flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl">
                  {app.user.name[0]}
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">{app.user.name}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                    <span>{app.specialization}</span> • <span>{app.experience} yrs exp.</span> • <span>{app.hospital}</span>
                  </div>
                  <a href={app.documentUrl} className="text-xs text-blue-400 hover:underline mt-1 inline-block">View Credentials</a>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleReject(app._id)} className="btn-danger py-2 px-4 text-sm flex items-center gap-2"><XCircle className="w-4 h-4" /> Reject</button>
                <button onClick={() => handleApprove(app._id)} className="btn-primary py-2 px-4 text-sm bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/30 font-bold flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Approve</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── HEALTH TIPS ── */}
      {tab === 'tips' && (
        <div className="rounded-2xl border p-12 text-center" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }}>
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-white mb-1">Health Tips Module</h3>
          <p className="text-slate-400 text-sm mb-4">Under construction. Content management system coming soon.</p>
          <button className="btn-primary mx-auto">Create New Tip</button>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
