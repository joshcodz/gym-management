import React, { useEffect, useState } from 'react';
import { getPayments, addPayment, getMembers } from '../services/api';
import Header from '../components/Header';
import Modal from '../components/Modal';

export default function Payments() {
  const [data, setData] = useState({ payments: [], summary: {} });
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ member_id: '', member_name: '', plan: 'Basic Plan', amount: 1499, status: 'Paid', method: 'Cash' });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getPayments().then(r => setData(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    getMembers().then(r => setMembers(r.data));
  }, []);

  const handleMemberSelect = (e) => {
    const m = members.find(x => x.member_id === e.target.value);
    setForm(f => ({ ...f, member_id: e.target.value, member_name: m ? `${m.first_name} ${m.last_name}` : '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addPayment(form);
      setModal(false);
      load();
    } catch(err) { alert(err.response?.data?.error || 'Error'); }
    finally { setSaving(false); }
  };

  const { payments, summary } = data;

  const summaryCards = [
    { label: 'Total Payments', value: `₹${Number(summary.total||0).toLocaleString('en-IN')}`, sub: '+10% this month', icon: 'fa-indian-rupee-sign', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'This Month', value: `₹${Number(summary.monthly||0).toLocaleString('en-IN')}`, sub: '+10% vs last month', icon: 'fa-calendar-check', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pending Payments', value: `₹${Number(summary.pending||0).toLocaleString('en-IN')}`, sub: `${summary.pendingCount||0} pending`, icon: 'fa-clock', color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div>
      <Header title="Payment Management" subtitle="Track and manage all payments" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {summaryCards.map(c => (
          <div key={c.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 card-hover">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">{c.label}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{c.value}</p>
                <p className="text-xs text-emerald-600 font-medium mt-1">▲ {c.sub}</p>
              </div>
              <div className={`w-12 h-12 ${c.bg} rounded-xl flex items-center justify-center`}>
                <i className={`fas ${c.icon} ${c.color} text-lg`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Payment Records</h3>
          <button onClick={() => setModal(true)}
            className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/20">
            <i className="fas fa-plus"></i> Record Payment
          </button>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12"><i className="fas fa-spinner fa-spin text-2xl text-indigo-500"></i></div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Payment ID','Member Name','Plan','Amount','Payment Date','Status','Method','Receipt'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {payments.map(p => (
                  <tr key={p.payment_id} className="table-row-hover">
                    <td className="px-5 py-4 text-sm font-mono text-indigo-600 font-medium">{p.payment_id}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-slate-800">{p.member_name}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{p.plan}</td>
                    <td className="px-5 py-4 text-sm font-bold text-slate-800">₹{Number(p.amount||0).toLocaleString('en-IN')}</td>
                    <td className="px-5 py-4 text-sm text-slate-500">
                      {p.payment_date ? new Date(p.payment_date).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${p.status === 'Paid' ? 'badge-active' : 'badge-pending'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">{p.method}</td>
                    <td className="px-5 py-4">
                      <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition text-sm">
                        <i className="fas fa-file-invoice"></i>
                      </button>
                    </td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-12 text-slate-400">No payments found</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modal && (
        <Modal title="Record Payment" onClose={() => setModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Member</label>
              <select value={form.member_id} onChange={handleMemberSelect}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white" required>
                <option value="">Select member</option>
                {members.map(m => (
                  <option key={m.member_id} value={m.member_id}>{m.member_id} - {m.first_name} {m.last_name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Plan</label>
              <select value={form.plan} onChange={e => setForm({...form, plan: e.target.value})}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white">
                {['Basic Plan','Standard Plan','Premium Plan','Elite Plan'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Amount (₹)</label>
              <input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Method</label>
                <select value={form.method} onChange={e => setForm({...form, method: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white">
                  {['Cash','Card','UPI','Net Banking'].map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white">
                  <option>Paid</option><option>Pending</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setModal(false)}
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="flex-1 btn-primary py-2.5 rounded-xl text-sm font-semibold">
                {saving ? <i className="fas fa-spinner fa-spin"></i> : 'Record Payment'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
