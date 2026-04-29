import React, { useEffect, useState } from 'react';
import { getMemberships, updateMembership, deleteMembership } from '../services/api';
import Header from '../components/Header';
import Modal from '../components/Modal';

const PLANS = [
  { name: 'Basic Plan', duration: '1 Month', price: 1499, features: 'Gym Access, Basic Equipment' },
  { name: 'Standard Plan', duration: '3 Months', price: 3999, features: 'Gym Access, Cardio, Weights' },
  { name: 'Premium Plan', duration: '6 Months', price: 6999, features: 'All Access, Personal Trainer' },
  { name: 'Elite Plan', duration: '12 Months', price: 11999, features: 'All Access, PT, Diet Plan' },
];

export default function Memberships() {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getMemberships().then(r => setMemberships(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openEdit = (ms) => {
    setForm({
      membership_type: ms.membership_type,
      start_date: ms.start_date?.split('T')[0] || '',
      end_date: ms.end_date?.split('T')[0] || '',
      validity: ms.validity,
      amount: ms.amount,
      status: ms.status,
    });
    setEditModal(ms.membership_id);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateMembership(editModal, form);
      setEditModal(null);
      load();
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this membership?')) return;
    await deleteMembership(id);
    load();
  };

  const getStatus = (s) => {
    const cls = s === 'Active' ? 'badge-active' : s === 'Expired' ? 'badge-expired' : 'badge-pending';
    return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>{s}</span>;
  };

  return (
    <div>
      <Header title="Membership Management" subtitle="View and manage all membership plans" />

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        {PLANS.map((p, i) => (
          <div key={p.name} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 card-hover">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                i === 0 ? 'bg-blue-100 text-blue-600' : i === 1 ? 'bg-emerald-100 text-emerald-600' :
                i === 2 ? 'bg-purple-100 text-purple-600' : 'bg-amber-100 text-amber-600'
              }`}>
                <i className={`fas ${i === 0 ? 'fa-seedling' : i === 1 ? 'fa-star' : i === 2 ? 'fa-crown' : 'fa-gem'}`}></i>
              </div>
              <span className="badge-active px-2.5 py-1 rounded-full text-xs font-semibold">Active</span>
            </div>
            <h3 className="font-bold text-slate-800">{p.name}</h3>
            <p className="text-2xl font-bold text-indigo-600 mt-2">₹{p.price.toLocaleString('en-IN')}</p>
            <p className="text-xs text-slate-500 mt-1">{p.duration}</p>
            <p className="text-xs text-slate-600 mt-2 border-t border-slate-100 pt-2">{p.features}</p>
          </div>
        ))}
      </div>

      {/* Memberships Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">All Memberships</h3>
          <a href="/add-membership" className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/20 no-underline">
            <i className="fas fa-plus"></i> Add New Plan
          </a>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12"><i className="fas fa-spinner fa-spin text-2xl text-indigo-500"></i></div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Plan Name','Member','Duration','Price (₹)','Features','Status','Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {memberships.map(ms => {
                  const plan = PLANS.find(p => p.name === ms.membership_type) || {};
                  return (
                    <tr key={ms.membership_id} className="table-row-hover">
                      <td className="px-5 py-4 text-sm font-semibold text-slate-800">{ms.membership_type}</td>
                      <td className="px-5 py-4 text-sm text-slate-600">{ms.member_name || ms.member_id}</td>
                      <td className="px-5 py-4 text-sm text-slate-600">{ms.validity}</td>
                      <td className="px-5 py-4 text-sm font-semibold text-slate-800">₹{Number(ms.amount||0).toLocaleString('en-IN')}</td>
                      <td className="px-5 py-4 text-sm text-slate-500">{plan.features || '—'}</td>
                      <td className="px-5 py-4">{getStatus(ms.status)}</td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(ms)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition text-sm">
                            <i className="fas fa-pen"></i>
                          </button>
                          <button onClick={() => handleDelete(ms.membership_id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition text-sm">
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {memberships.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-12 text-slate-400">No memberships found</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {editModal && (
        <Modal title="Edit Membership" onClose={() => setEditModal(null)}>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Plan Type</label>
              <select value={form.membership_type} onChange={e => setForm({...form, membership_type: e.target.value})}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white">
                {PLANS.map(p => <option key={p.name}>{p.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Start Date</label>
                <input type="date" value={form.start_date} onChange={e => setForm({...form, start_date: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">End Date</label>
                <input type="date" value={form.end_date} onChange={e => setForm({...form, end_date: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Amount (₹)</label>
              <input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white">
                <option>Active</option><option>Expired</option><option>Pending</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setEditModal(null)}
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="flex-1 btn-primary py-2.5 rounded-xl text-sm font-semibold">
                {saving ? <i className="fas fa-spinner fa-spin"></i> : 'Save Changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
