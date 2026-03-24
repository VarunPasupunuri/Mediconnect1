/* eslint-disable */
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, UserRound, Calendar, FileText, Activity,
  Salad, Pill, Bell, Lightbulb, MessageCircle,
  LogOut, Stethoscope, Shield, ChevronLeft, ChevronRight,
  HeartPulse
} from 'lucide-react';

const NAV_COLORS = {
  '/dashboard': { icon: 'text-blue-500', bg: 'bg-blue-500/10' },
  '/doctors':   { icon: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  '/appointments': { icon: 'text-violet-500', bg: 'bg-violet-500/10' },
  '/medical-history': { icon: 'text-rose-500', bg: 'bg-rose-500/10' },
  '/symptom-checker': { icon: 'text-amber-500', bg: 'bg-amber-500/10' },
  '/diet-plan': { icon: 'text-lime-500', bg: 'bg-lime-500/10' },
  '/medicine-scanner': { icon: 'text-cyan-500', bg: 'bg-cyan-500/10' },
  '/reminders': { icon: 'text-orange-500', bg: 'bg-orange-500/10' },
  '/health-tips': { icon: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  '/chat':      { icon: 'text-pink-500',  bg: 'bg-pink-500/10' },
  '/doctor':    { icon: 'text-blue-500',  bg: 'bg-blue-500/10' },
  '/admin':     { icon: 'text-purple-500', bg: 'bg-purple-500/10' },
  '/profile':   { icon: 'text-teal-500',  bg: 'bg-teal-500/10' },
};

const patientNav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/doctors', icon: Stethoscope, label: 'Find Doctors' },
  { to: '/appointments', icon: Calendar, label: 'Appointments' },
  { to: '/medical-history', icon: FileText, label: 'Medical History' },
  { to: '/symptom-checker', icon: Activity, label: 'Symptom Checker' },
  { to: '/diet-plan', icon: Salad, label: 'Diet Plan' },
  { to: '/medicine-scanner', icon: Pill, label: 'Medicine Scanner' },
  { to: '/reminders', icon: Bell, label: 'Reminders' },
  { to: '/health-tips', icon: Lightbulb, label: 'Health Tips' },
  { to: '/chat', icon: MessageCircle, label: 'Chat' },
];

const doctorNav = [
  { to: '/doctor', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/health-tips', icon: Lightbulb, label: 'Health Tips' },
  { to: '/chat', icon: MessageCircle, label: 'Chat' },
];

const adminNav = [
  { to: '/admin', icon: Shield, label: 'Admin Panel' },
  { to: '/health-tips', icon: Lightbulb, label: 'Health Tips' },
];

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = user?.role === 'admin' ? adminNav : user?.role === 'doctor' ? doctorNav : patientNav;

  const handleLogout = () => { logout(); navigate('/login'); };

  const roleGradients = {
    patient: 'from-blue-500 to-indigo-600',
    doctor:  'from-emerald-500 to-teal-600',
    admin:   'from-violet-500 to-purple-600',
  };

  const roleBadgeColors = {
    patient: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    doctor:  'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    admin:   'text-violet-400 bg-violet-500/10 border-violet-500/20',
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`${collapsed ? 'w-[72px]' : 'w-64'} flex-shrink-0 flex flex-col fixed lg:sticky top-0 h-screen z-50 transition-transform duration-300 ease-in-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ background: 'rgba(8,14,26,0.97)', borderRight: '1px solid rgba(255,255,255,0.05)' }}>

      {/* Logo */}
      <div className={`flex items-center h-16 px-3 border-b ${collapsed ? 'justify-center' : 'justify-between'}`}
        style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        {!collapsed && (
          <div className="flex items-center gap-2.5 animate-fadeIn">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center" style={{ boxShadow: '0 0 16px rgba(37,99,235,0.4)' }}>
              <HeartPulse className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-extrabold gradient-text">MediConnect</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center animate-fadeIn" style={{ boxShadow: '0 0 16px rgba(37,99,235,0.4)' }}>
            <HeartPulse className="w-4 h-4 text-white" />
          </div>
        )}
        {!collapsed && (
          <button onClick={() => setCollapsed(true)}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-300 hover:bg-white/5 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {collapsed && (
        <button onClick={() => setCollapsed(false)}
          className="absolute -right-3 top-16 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-400 shadow-md z-50 transition-colors">
          <ChevronRight className="w-3 h-3" />
        </button>
      )}

      {/* Nav */}
      <nav className="flex-1 p-2 overflow-y-auto space-y-0.5 no-scrollbar">
        {!collapsed && (
          <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-600">Menu</p>
        )}
        {navItems.map(({ to, icon: Icon, label }) => {
          const colors = NAV_COLORS[to] || { icon: 'text-blue-500', bg: 'bg-blue-500/10' };
          return (
            <div key={to}>
            <NavLink to={to} title={collapsed ? label : ''} onClick={() => setMobileOpen(false)}
              className={({ isActive }) => isActive ? 'sidebar-item-active' : 'sidebar-item'}>
              {({ isActive }) => (
                <>
                  <div className={`${collapsed ? 'mx-auto' : ''} w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${isActive ? colors.bg : 'bg-transparent'}`}>
                    <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? colors.icon : ''}`} />
                  </div>
                  {!collapsed && <span className="truncate">{label}</span>}
                </>
              )}
            </NavLink>
            </div>
          );
        })}
      </nav>

      {/* Bottom – user card */}
      <div className="p-2 border-t space-y-0.5" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <NavLink to="/profile" title={collapsed ? 'Profile' : ''}
          className={({ isActive }) => isActive ? 'sidebar-item-active' : 'sidebar-item'}>
          {({ isActive }) => (
            <>
              <div className={`${collapsed ? 'mx-auto' : ''} w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-teal-500/10' : 'bg-transparent'}`}>
                <UserRound className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-teal-500' : ''}`} />
              </div>
              {!collapsed && <span>Profile</span>}
            </>
          )}
        </NavLink>

        <button onClick={handleLogout} title={collapsed ? 'Logout' : ''}
          className="sidebar-item w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
          <div className={`${collapsed ? 'mx-auto' : ''} w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0`}>
            <LogOut className="w-4 h-4 flex-shrink-0" />
          </div>
          {!collapsed && <span>Logout</span>}
        </button>

        {/* User mini-card */}
        {!collapsed && (
          <div className="mt-2 p-3 rounded-xl flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${roleGradients[user?.role] || 'from-blue-500 to-indigo-600'} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-300 truncate">{user?.name}</p>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${roleBadgeColors[user?.role]}`}>
                {user?.role}
              </span>
            </div>
          </div>
        )}
      </div>
    </aside>
    </>
  );
};

export default Sidebar;
