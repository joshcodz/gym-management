import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { getDashboard } from '../services/api';
import Header from '../components/Header';

const AVATAR_COLORS = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981'];

function getInitials(first, last) {
  return `${first?.[0] || ''}${last?.[0] || ''}`.toUpperCase();
}

export default function Dashboard({ user }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <i className="fas fa-spinner fa-spin text-3xl text-indigo-500 mb-3"></i>
        <p className="text-slate-500">Loading dashboard...</p>
      </div>
    </div>
  );

  const stats = data?.stats || {};
  const status = data?.membershipStatus || {};
  const recentMembers = data?.recentMembers || [];

  const total = (status.active || 0) + (status.expired || 0) + (status.pending || 0);
  const pieData = [
    { name: 'Active', value: status.active || 0, color: '#10b981' },
    { name: 'Expired', value: status.expired || 0, color: '#ef4444' },
    { name: 'Pending', value: status.pending || 0, color: '#f59e0b' },
  ];

  const statCards = [
    {
      title: 'Total Members',
      value: stats.totalMembers || 0,
      sub: '+12 this month',
      icon: 'fa-users',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Active Memberships',
      value: stats.activeMembers || 0,
      sub: '+8 this month',
      icon: 'fa-circle-check',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      title: "Today's Check-ins",
      value: stats.todayCheckins || 0,
      sub: '+15% vs yesterday',
      icon: 'fa-wave-square',
      color: 'text-violet-600',
      bg: 'bg-violet-50',
    },
    {
      title: 'Monthly Revenue',
      value: `₹${Number(stats.monthlyRevenue || 0).toLocaleString('en-IN')}`,
      sub: '+18% vs last month',
      icon: 'fa-indian-rupee-sign',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ];

  return (
    <div>
      {/* Welcome */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Welcome back, <span className="font-semibold text-indigo-600 capitalize">{user?.username}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 shadow-sm border border-slate-100 text-sm text-slate-600">
            <i className="fas fa-calendar text-indigo-500"></i>
            <span>{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
          </div>
          <button className="relative w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-500 hover:text-indigo-600 transition">
            <i className="fas fa-bell"></i>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        {statCards.map(card => (
          <div key={card.title} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 card-hover">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">{card.title}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{card.value}</p>
                <p className="text-xs text-emerald-600 font-medium mt-1">▲ {card.sub}</p>
              </div>
              <div className={`w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center`}>
                <i className={`fas ${card.icon} ${card.color} text-lg`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-6">
        {/* Membership Status */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h3 className="text-base font-bold text-slate-800 mb-4">Membership Status</h3>
          <div className="flex items-center gap-4">
            <div className="relative">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => [val, '']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-2xl font-bold text-slate-800">{status.active || 0}</span>
                <span className="text-xs text-slate-500">Active</span>
              </div>
            </div>
            <div className="space-y-3 flex-1">
              {pieData.map(item => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-sm text-slate-600">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-slate-800">{item.value}</span>
                    <span className="text-xs text-slate-400 ml-1">({total ? Math.round(item.value / total * 100) : 0}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Members */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">Recent Members</h3>
            <a href="/members" className="text-indigo-600 text-sm font-medium hover:underline">View All →</a>
          </div>
          <div className="space-y-3">
            {recentMembers.map((m, i) => (
              <div key={m.member_id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                >
                  {getInitials(m.first_name, m.last_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{m.first_name} {m.last_name}</p>
                  <p className="text-xs text-slate-500">{m.membership_type || 'No Plan'}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-slate-400">{m.join_date ? new Date(m.join_date).toLocaleDateString('en-IN') : '-'}</p>
                </div>
              </div>
            ))}
            {recentMembers.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-4">No members found</p>
            )}
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-2xl p-6 flex items-center justify-between overflow-hidden relative">
        <div className="absolute -right-6 -top-6 w-36 h-36 bg-white/10 rounded-full"></div>
        <div className="absolute right-20 bottom-0 w-24 h-24 bg-white/5 rounded-full"></div>
        <div className="relative z-10">
          <h3 className="text-white font-bold text-lg">Keep your members engaged!</h3>
          <p className="text-indigo-200 text-sm mt-1">Track attendance, manage plans and grow your gym.</p>
        </div>
        <div className="relative z-10 text-5xl opacity-80">🏋️</div>
      </div>
    </div>
  );
}
