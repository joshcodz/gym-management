import React from 'react';

export default function Card({ title, value, sub, icon, iconBg, trend, trendUp }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 card-hover">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-500 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
          {sub && (
            <p className={`text-xs mt-1 font-medium ${trendUp !== false ? 'text-emerald-600' : 'text-red-500'}`}>
              {trendUp !== false ? '▲' : '▼'} {sub}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 ${iconBg || 'bg-indigo-100'} rounded-xl flex items-center justify-center`}>
          <i className={`fas ${icon} text-lg ${iconBg ? 'text-white' : 'text-indigo-600'}`}></i>
        </div>
      </div>
    </div>
  );
}
