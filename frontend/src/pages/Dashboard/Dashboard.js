import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import {
  Calendar, Users, FileText, Bell, Activity, TrendingUp,
  Stethoscope, Zap, Heart
} from 'lucide-react';
import { motion } from 'framer-motion';

// Import New Modular Components
import StatCard from './components/StatCard';
import ActivityChart from './components/ActivityChart';
import UpcomingAppointments from './components/UpcomingAppointments';
import VitalsWidget from './components/VitalsWidget';
import HealthScore from './components/HealthScore';

const healthData = [
  { day: 'Mon', steps: 6500, sleep: 7 },
  { day: 'Tue', steps: 8200, sleep: 6.5 },
  { day: 'Wed', steps: 7100, sleep: 8 },
  { day: 'Thu', steps: 9400, sleep: 7.5 },
  { day: 'Fri', steps: 5800, sleep: 6 },
  { day: 'Sat', steps: 11000, sleep: 8.5 },
  { day: 'Sun', steps: 7600, sleep: 9 },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [score] = useState(85);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [a, r, rem] = await Promise.all([
          API.get('/appointments/my?limit=5'),
          API.get('/medical-history'),
          API.get('/reminders'),
        ]);
        setAppointments(a.data.appointments || []);
        setRecords(r.data.records || []);
        setReminders(rem.data.reminders || []);
      } catch {
        setAppointments(JSON.parse(localStorage.getItem('mediconnect_appointments')) || []);
        setRecords(JSON.parse(localStorage.getItem('mediconnect_history')) || []);
        setReminders(JSON.parse(localStorage.getItem('mediconnect_reminders')) || []);
      } finally { 
        // Simulated latency for skeleton illustration
        setTimeout(() => setLoading(false), 800);
      }
    };
    fetchData();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const greetEmoji = hour < 12 ? '🌅' : hour < 17 ? '☀️' : '🌙';

  const stats = [
    { label: 'Appointments', value: appointments.length, icon: Calendar, from: 'from-blue-500', to: 'to-indigo-600', glow: '0 0 20px rgba(37,99,235,0.35)' },
    { label: 'Medical Records', value: records.length, icon: FileText, from: 'from-violet-500', to: 'to-purple-600', glow: '0 0 20px rgba(124,58,237,0.35)' },
    { label: 'Active Reminders', value: reminders.filter(r => r.isActive).length || reminders.length, icon: Bell, from: 'from-orange-500', to: 'to-amber-600', glow: '0 0 20px rgba(245,158,11,0.35)' },
    { label: 'Health Score', value: score, suffix: '%', icon: Heart, from: 'from-emerald-500', to: 'to-teal-600', glow: '0 0 20px rgba(16,185,129,0.35)' },
  ];

  const quickActions = [
    { to: '/doctors',          icon: Users,         label: 'Find Doctor',       from: 'from-blue-600',   to2: 'to-indigo-700' },
    { to: '/symptom-checker',  icon: Activity,      label: 'Symptom Check',     from: 'from-violet-600', to2: 'to-purple-700' },
    { to: '/diet-plan',        icon: TrendingUp,    label: 'Diet Plan',         from: 'from-emerald-600',to2: 'to-teal-700' },
    { to: '/medicine-scanner', icon: Stethoscope,   label: 'Medicine Info',     from: 'from-orange-500', to2: 'to-amber-600' },
  ];

  return (
    <div className="page-container overflow-x-hidden">
      {/* ── HERO BANNER ── */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-3xl overflow-hidden p-8" 
        style={{ background: 'linear-gradient(135deg,#1d3a7a 0%,#1e3a8a 40%,#312e81 100%)' }}
      >
        <div className="absolute inset-0 animate-shimmer pointer-events-none opacity-20" />
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(99,102,241,0.3)' }} />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(6,182,212,0.2)' }} />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 z-10">
          <div>
            <p className="text-blue-300 text-sm font-semibold mb-1">{greetEmoji} {greeting}</p>
            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">{user?.name?.split(' ')[0]}! 👋</h1>
            <p className="text-blue-200/70 text-sm max-w-sm">
              You have <span className="font-bold text-white">{appointments.filter(a => a.status === 'pending').length}</span> pending appointments.
              Stay healthy and on track today.
            </p>
            <div className="flex gap-3 mt-5 flex-wrap">
              <Link to="/doctors" className="btn-primary text-sm py-2.5 shadow-[0_0_16px_rgba(37,99,235,0.4)]">
                <Calendar className="w-4 h-4" /> Book Appointment
              </Link>
              <Link to="/symptom-checker" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white border transition-all hover:scale-105 hover:bg-white/5"
                style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.2)' }}>
                <Zap className="w-4 h-4 text-yellow-400" /> Check Symptoms
              </Link>
            </div>
          </div>

          <HealthScore score={score} />
        </div>
      </motion.div>

      {/* ── STATS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} {...stat} loading={loading} delay={i * 0.1} />
        ))}
      </div>

      {/* ── CHARTS + VITALS + REMINDERS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ActivityChart data={healthData} loading={loading} />
        
        <div className="space-y-6 lg:col-span-1">
          <VitalsWidget loading={loading} />
          
          {/* Quick Actions Panel Mini */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-2 gap-3"
          >
            {quickActions.map(({ to, icon: Icon, label, from, to2 }, i) => (
              <Link key={to} to={to}
                className={`relative overflow-hidden rounded-xl p-4 text-center group bg-gradient-to-br ${from} ${to2} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-white/10`}
              >
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300" />
                <Icon className="w-5 h-5 mx-auto mb-2 text-white/90 group-hover:scale-110 transition-transform duration-300" />
                <p className="text-[10px] font-bold text-white uppercase tracking-wider">{label}</p>
              </Link>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── RECENT APPOINTMENTS ── */}
      <UpcomingAppointments appointments={appointments} loading={loading} />
      
    </div>
  );
};

export default Dashboard;
