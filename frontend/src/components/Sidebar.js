import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const navItems = [
  { path: '/dashboard', icon: 'fa-gauge-high', label: 'Dashboard' },
  { path: '/biometric', icon: 'fa-fingerprint', label: 'Biometric Intake' },
  { path: '/memberships', icon: 'fa-id-card', label: 'Memberships' },
  { path: '/add-membership', icon: 'fa-plus-circle', label: 'Add Membership' },
  { path: '/payments', icon: 'fa-credit-card', label: 'Payments' },
  { path: '/members', icon: 'fa-users', label: 'Members' },
  { path: '/trainers', icon: 'fa-dumbbell', label: 'Trainers' },
  { path: '/attendance', icon: 'fa-calendar-check', label: 'Attendance' },
];

export default function Sidebar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <aside className="sidebar-gradient w-64 min-h-screen flex flex-col fixed left-0 top-0 z-50 shadow-2xl">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
          <i className="fas fa-bolt text-white text-sm"></i>
        </div>
        <div>
          <span className="text-white font-bold text-lg tracking-wide">GYM</span>
          <span className="text-indigo-400 font-bold text-lg"> PLUS</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ path, icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <i className={`fas ${icon} w-5 text-center text-sm`}></i>
            <span className="text-sm font-medium">{label}</span>
          </NavLink>
        ))}

        <div className="pt-2 border-t border-white/10 mt-2">
          {[
            { path: '/reports', icon: 'fa-chart-bar', label: 'Reports' },
            { path: '/settings', icon: 'fa-gear', label: 'Settings' },
          ].map(({ path, icon, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 mt-1 ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <i className={`fas ${icon} w-5 text-center text-sm`}></i>
              <span className="text-sm font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User Profile */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
            {user?.username?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate capitalize">{user?.username || 'Admin'}</p>
            <p className="text-slate-400 text-xs">Gym Manager</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-400 transition-colors text-sm"
            title="Logout"
          >
            <i className="fas fa-right-from-bracket"></i>
          </button>
        </div>
      </div>
    </aside>
  );
}
