/* eslint-disable */
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { User, Heart, Shield, Camera, Edit3, Save, X, Mail, Phone, MapPin, Calendar, Droplets, Weight, Ruler, Activity } from 'lucide-react';

const TABS = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'health', label: 'Health Metrics', icon: Heart },
  { id: 'security', label: 'Security', icon: Shield },
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const MetricCard = ({ icon: Icon, label, value, unit, color, bg }) => (
  <div className="rounded-2xl p-5 border flex items-center gap-4" style={{ background: 'rgba(255,255,255,0.025)', borderColor: 'rgba(255,255,255,0.06)' }}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
      <Icon className={`w-6 h-6 ${color}`} />
    </div>
    <div>
      <p className="text-2xl font-black text-white">{value} <span className="text-sm font-medium text-slate-500">{unit}</span></p>
      <p className="text-xs text-slate-500 font-semibold">{label}</p>
    </div>
  </div>
);

const InputRow = ({ label, icon: Icon, value, onChange, type = 'text', disabled, options }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">{label}</label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />}
      {options ? (
        <select value={value} onChange={e => onChange(e.target.value)} disabled={disabled}
          className="input-field appearance-none pl-10" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)', color: '#e2e8f0' }}>
          {options.map(o => <option key={o} className="bg-slate-900">{o}</option>)}
        </select>
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} disabled={disabled}
          className={`input-field ${Icon ? 'pl-10' : ''} disabled:opacity-50`}
          style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)', color: '#e2e8f0' }} />
      )}
    </div>
  </div>
);

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState('personal');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dob: user?.dob || '',
    location: user?.location || '',
    bloodGroup: user?.bloodGroup || 'O+',
    weight: user?.weight || '',
    height: user?.height || '',
    allergies: user?.allergies || 'None',
    currentMedications: user?.currentMedications || 'None',
    emergencyContact: user?.emergencyContact || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const bmi = (form.weight && form.height) ? (parseFloat(form.weight) / Math.pow(parseFloat(form.height) / 100, 2)).toFixed(1) : '--';
  const bmiCategory = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';
  const bmiColor = bmi < 18.5 ? 'text-blue-400' : bmi < 25 ? 'text-emerald-400' : bmi < 30 ? 'text-amber-400' : 'text-red-400';

  const handleSave = async () => {
    setSaving(true);
    try {
      const { currentPassword, newPassword, confirmPassword, ...updateData } = form;
      await updateUser(updateData);
      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch(err) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = () => {
    if (!form.currentPassword || !form.newPassword) return toast.error('Fill in all password fields');
    if (form.newPassword !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    toast.success('Password changed successfully!');
    setForm(f => ({ ...f, currentPassword: '', newPassword: '', confirmPassword: '' }));
  };

  const roleGrad = { patient: 'from-blue-500 to-indigo-600', doctor: 'from-emerald-500 to-teal-600', admin: 'from-violet-500 to-purple-600' };

  return (
    <div className="page-container max-w-4xl mx-auto animate-fadeIn">
      {/* Hero avatar section */}
      <div className="rounded-3xl p-8 border relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#0f1b3a,#111f4f)', borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl" style={{ background: 'rgba(37,99,235,0.15)' }} />
        <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className={`w-28 h-28 rounded-3xl bg-gradient-to-br ${roleGrad[user?.role] || roleGrad.patient} flex items-center justify-center text-white text-4xl font-black shadow-2xl`}
              style={{ boxShadow: '0 0 40px rgba(37,99,235,0.4)' }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg hover:bg-blue-500 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-black text-white">{form.name}</h1>
            <p className="text-slate-400 text-sm">{form.email}</p>
            <span className={`inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${roleGrad[user?.role] || roleGrad.patient} text-white`}>
              {user?.role || 'patient'}
            </span>
          </div>
          {!editing ? (
            <button onClick={() => setEditing(true)} className="btn-secondary text-sm flex items-center gap-2">
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setEditing(false)} disabled={saving} className="btn-ghost text-sm border border-slate-700"><X className="w-4 h-4" /> Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary text-sm flex items-center gap-2">
                {saving ? <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <Save className="w-4 h-4" />}
                Save
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-2xl w-fit" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === t.id ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'text-slate-500 hover:text-slate-300'}`}>
              <Icon className="w-4 h-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {/* ── PERSONAL INFO ── */}
      {tab === 'personal' && (
        <div className="rounded-2xl p-6 border space-y-5 animate-fadeIn" style={{ background: 'rgba(255,255,255,0.025)', borderColor: 'rgba(255,255,255,0.06)' }}>
          <h2 className="font-bold text-white">Personal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InputRow label="Full Name" icon={User} value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} disabled={!editing} />
            <InputRow label="Email Address" icon={Mail} value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} type="email" disabled={!editing} />
            <InputRow label="Phone Number" icon={Phone} value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} disabled={!editing} />
            <InputRow label="Date of Birth" icon={Calendar} value={form.dob} onChange={v => setForm(f => ({ ...f, dob: v }))} type="date" disabled={!editing} />
            <InputRow label="Location" icon={MapPin} value={form.location} onChange={v => setForm(f => ({ ...f, location: v }))} disabled={!editing} />
            <InputRow label="Emergency Contact" icon={Phone} value={form.emergencyContact} onChange={v => setForm(f => ({ ...f, emergencyContact: v }))} disabled={!editing} />
          </div>
        </div>
      )}

      {/* ── HEALTH METRICS ── */}
      {tab === 'health' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Metric tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <MetricCard icon={Weight} label="Weight" value={form.weight} unit="kg" color="text-blue-400" bg="bg-blue-500/10" />
            <MetricCard icon={Ruler} label="Height" value={form.height} unit="cm" color="text-violet-400" bg="bg-violet-500/10" />
            <MetricCard icon={Droplets} label="Blood Group" value={form.bloodGroup} unit="" color="text-red-400" bg="bg-red-500/10" />
            <div className="rounded-2xl p-5 border flex items-center gap-4" style={{ background: 'rgba(255,255,255,0.025)', borderColor: 'rgba(255,255,255,0.06)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-emerald-500/10">
                <Activity className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-black text-white">{bmi} <span className="text-sm font-medium text-slate-500">BMI</span></p>
                <p className={`text-xs font-bold ${bmiColor}`}>{bmiCategory}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-6 border space-y-5" style={{ background: 'rgba(255,255,255,0.025)', borderColor: 'rgba(255,255,255,0.06)' }}>
            <h2 className="font-bold text-white">Health Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InputRow label="Weight (kg)" icon={Weight} value={form.weight} onChange={v => setForm(f => ({ ...f, weight: v }))} type="number" disabled={!editing} />
              <InputRow label="Height (cm)" icon={Ruler} value={form.height} onChange={v => setForm(f => ({ ...f, height: v }))} type="number" disabled={!editing} />
              <InputRow label="Blood Group" icon={Droplets} value={form.bloodGroup} onChange={v => setForm(f => ({ ...f, bloodGroup: v }))} options={BLOOD_GROUPS} disabled={!editing} />
              <InputRow label="Allergies" value={form.allergies} onChange={v => setForm(f => ({ ...f, allergies: v }))} disabled={!editing} />
              <InputRow label="Current Medications" value={form.currentMedications} onChange={v => setForm(f => ({ ...f, currentMedications: v }))} disabled={!editing} />
            </div>
          </div>
        </div>
      )}

      {/* ── SECURITY ── */}
      {tab === 'security' && (
        <div className="rounded-2xl p-6 border space-y-5 animate-fadeIn" style={{ background: 'rgba(255,255,255,0.025)', borderColor: 'rgba(255,255,255,0.06)' }}>
          <h2 className="font-bold text-white">Change Password</h2>
          <div className="space-y-4 max-w-sm">
            <InputRow label="Current Password" icon={Shield} value={form.currentPassword} onChange={v => setForm(f => ({ ...f, currentPassword: v }))} type="password" />
            <InputRow label="New Password" icon={Shield} value={form.newPassword} onChange={v => setForm(f => ({ ...f, newPassword: v }))} type="password" />
            <InputRow label="Confirm New Password" icon={Shield} value={form.confirmPassword} onChange={v => setForm(f => ({ ...f, confirmPassword: v }))} type="password" />
            <button onClick={handlePasswordChange} className="btn-primary w-full py-3 text-sm">Update Password</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
