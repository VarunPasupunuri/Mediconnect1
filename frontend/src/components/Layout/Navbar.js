import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Bell, Search, ChevronDown, User, LogOut, Settings, CheckCheck, X, Calendar, FileText, Activity, Menu } from 'lucide-react';

const NOTIF_ICONS = {
  appointment: { icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  lab:         { icon: FileText, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  tip:         { icon: Activity, color: 'text-amber-400', bg: 'bg-amber-500/10' },
};

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'appointment', text: 'Upcoming Appointment in 30 mins', time: 'Just now', read: false },
    { id: 2, type: 'lab', text: 'Prescription Refill Reminder', time: '2h ago', read: false },
    { id: 3, type: 'tip', text: 'Daily tip: Drink 2L of water 💧', time: 'Today', read: true },
  ]);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unread = notifications.filter(n => !n.read).length;
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const roleColors = { patient: 'badge-blue', doctor: 'badge-green', admin: 'badge-purple' };

  return (
    <header className="h-16 flex items-center justify-between px-6 flex-shrink-0 z-40 sticky top-0"
      style={{ background: 'rgba(8,14,26,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>

      {/* Left / Search */}
      <div className="flex items-center gap-3">
        <button onClick={onToggleSidebar} className="btn-icon lg:hidden block">
          <Menu className="w-5 h-5 text-slate-300" />
        </button>

        <div className="hidden sm:flex items-center gap-2.5 rounded-xl px-3.5 py-2 w-64 transition-all border"
          style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.07)' }}>
          <Search className="w-4 h-4 text-slate-500 flex-shrink-0" />
          <input type="text" placeholder="Search..." className="bg-transparent text-sm text-slate-300 placeholder-slate-600 focus:outline-none w-full" />
          <span className="text-[10px] text-slate-600 border border-slate-700 rounded px-1 py-0.5 font-mono hidden sm:block">⌘K</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Theme */}
        <button onClick={toggleTheme} className="btn-icon">
          {darkMode
            ? <Sun className="w-5 h-5 text-amber-400" />
            : <Moon className="w-5 h-5 text-indigo-400 animate-fadeIn" />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button onClick={() => { setShowNotifications(v => !v); setShowProfile(false); }}
            className="btn-icon relative">
            <Bell className="w-5 h-5" />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full">
                <span className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-60" />
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border shadow-2xl z-50 animate-slideDown overflow-hidden"
              style={{ background: 'rgba(15,23,42,0.96)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255,255,255,0.08)', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}>
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">Notifications</span>
                  {unread > 0 && <span className="badge badge-blue text-[10px]">{unread} new</span>}
                </div>
                <button onClick={markAllRead} className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                  <CheckCheck className="w-3.5 h-3.5" /> Mark read
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto no-scrollbar">
                {notifications.map(n => {
                  const cfg = NOTIF_ICONS[n.type] || NOTIF_ICONS.tip;
                  const Icon = cfg.icon;
                  return (
                    <div key={n.id} className="flex items-start gap-3 px-4 py-3 transition-colors cursor-pointer" style={{ background: !n.read ? 'rgba(37,99,235,0.05)' : 'transparent' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                      onMouseLeave={e => e.currentTarget.style.background = !n.read ? 'rgba(37,99,235,0.05)' : 'transparent'}>
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                        <Icon className={`w-4 h-4 ${cfg.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-200 leading-snug">{n.text}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{n.time}</p>
                      </div>
                      {!n.read && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button onClick={() => { setShowProfile(v => !v); setShowNotifications(false); }}
            className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 transition-all"
            style={{ background: showProfile ? 'rgba(255,255,255,0.06)' : 'transparent' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
            onMouseLeave={e => e.currentTarget.style.background = showProfile ? 'rgba(255,255,255,0.06)' : 'transparent'}>
            {user?.avatar ? (
              <img src={`http://localhost:5000${user.avatar}`} alt="" className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold" style={{ boxShadow: '0 0 12px rgba(37,99,235,0.4)' }}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
            )}
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-slate-200 leading-tight">{user?.name}</p>
              <span className={`text-[10px] ${roleColors[user?.role]}`}>{user?.role}</span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-500 hidden sm:block transition-transform duration-200 ${showProfile ? 'rotate-180' : ''}`} />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-52 rounded-2xl border shadow-2xl z-50 animate-slideDown overflow-hidden"
              style={{ background: 'rgba(15,23,42,0.96)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255,255,255,0.08)', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}>
              <div className="p-2 space-y-0.5">
                <Link to="/profile" onClick={() => setShowProfile(false)}
                  className="flex items-center gap-2.5 text-sm text-slate-300 hover:text-white p-2.5 rounded-xl transition-all hover:bg-white/5">
                  <User className="w-4 h-4 text-slate-500" /> My Profile
                </Link>
                <Link to="/settings" onClick={() => setShowProfile(false)}
                  className="flex items-center gap-2.5 text-sm text-slate-300 hover:text-white p-2.5 rounded-xl transition-all hover:bg-white/5">
                  <Settings className="w-4 h-4 text-slate-500" /> Settings
                </Link>
                <div className="h-px my-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <button onClick={logout}
                  className="flex w-full items-center gap-2.5 text-sm text-red-400 hover:text-red-300 p-2.5 rounded-xl transition-all hover:bg-red-500/10">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
