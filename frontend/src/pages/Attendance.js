import React, { useEffect, useState } from 'react';
import { getAttendance } from '../services/api';
import Header from '../components/Header';

export default function Attendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAttendance().then(r => setRecords(r.data)).finally(() => setLoading(false));
  }, []);

  const todayCount = records.filter(r => {
    const d = new Date(r.entry_time);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  }).length;

  const activeCount = records.filter(r => !r.exit_time).length;

  return (
    <div>
      <Header title="Attendance" subtitle="Track member check-ins and check-outs" />

      <div className="grid grid-cols-3 gap-5 mb-6">
        {[
          { label: "Today's Check-ins", value: todayCount, icon: 'fa-right-to-bracket', color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Currently Inside', value: activeCount, icon: 'fa-users', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Total Records', value: records.length, icon: 'fa-list-check', color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">{c.label}</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{c.value}</p>
              </div>
              <div className={`w-12 h-12 ${c.bg} rounded-xl flex items-center justify-center`}>
                <i className={`fas ${c.icon} ${c.color} text-lg`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Attendance Records</h3>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12"><i className="fas fa-spinner fa-spin text-2xl text-indigo-500"></i></div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['ID','Member ID','Member Name','Entry Time','Exit Time','Duration','Status'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {records.map(r => {
                  const entry = r.entry_time ? new Date(r.entry_time) : null;
                  const exit = r.exit_time ? new Date(r.exit_time) : null;
                  const duration = entry && exit ? Math.round((exit - entry) / 60000) : null;
                  const isActive = !r.exit_time;
                  return (
                    <tr key={r.id} className="table-row-hover">
                      <td className="px-5 py-4 text-sm font-mono text-slate-500">#{r.id}</td>
                      <td className="px-5 py-4 text-sm font-mono text-indigo-600">{r.member_id}</td>
                      <td className="px-5 py-4 text-sm font-semibold text-slate-800">{r.member_name || '—'}</td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {entry ? entry.toLocaleString('en-IN') : '—'}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {exit ? exit.toLocaleString('en-IN') : '—'}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {duration != null ? `${duration} min` : '—'}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${isActive ? 'badge-active' : 'bg-slate-100 text-slate-600'}`}>
                          {isActive ? 'Inside' : 'Exited'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {records.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-12 text-slate-400">No attendance records found</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
