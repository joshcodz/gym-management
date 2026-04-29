import React, { useEffect, useState } from 'react';
import { getMembers, addMember, updateMember, deleteMember } from '../services/api';
import Header from '../components/Header';
import Modal from '../components/Modal';

const AVATAR_COLORS = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6'];
function getInitials(first, last) { return `${first?.[0]||''}${last?.[0]||''}`.toUpperCase(); }

const EMPTY_FORM = { first_name: '', last_name: '', phone: '', email: '', gender: 'Male', address: '' };

export default function Members() {
  const [members, setMembers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // 'add' | 'edit'
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getMembers().then(r => {
      setMembers(r.data);
      setFiltered(r.data);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(members.filter(m =>
      `${m.first_name} ${m.last_name} ${m.phone} ${m.email} ${m.member_id}`.toLowerCase().includes(q)
    ));
  }, [search, members]);

  const openAdd = () => { setForm(EMPTY_FORM); setModal('add'); };
  const openEdit = (m) => {
    setForm({ first_name: m.first_name, last_name: m.last_name, phone: m.phone||'', email: m.email||'', gender: m.gender||'Male', address: m.address||'' });
    setEditId(m.member_id);
    setModal('edit');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal === 'add') await addMember(form);
      else await updateMember(editId, form);
      setModal(null);
      load();
    } catch(err) {
      alert(err.response?.data?.error || 'Error saving member');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this member and all their data?')) return;
    await deleteMember(id);
    load();
  };

  const getStatusBadge = (status) => {
    const s = status || 'Active';
    const cls = s === 'Active' ? 'badge-active' : s === 'Expired' ? 'badge-expired' : 'badge-pending';
    return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>{s}</span>;
  };

  return (
    <div>
      <Header title="Members" subtitle="View and manage all gym members" />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search members..."
              className="pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 w-72 transition"
            />
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm hover:bg-slate-50 transition">
              <i className="fas fa-sliders-h text-xs"></i> Filter
            </button>
            <button onClick={openAdd} className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/20">
              <i className="fas fa-plus"></i> Add Member
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-16">
              <i className="fas fa-spinner fa-spin text-2xl text-indigo-500 mb-3"></i>
              <p className="text-slate-500 text-sm">Loading members...</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Member ID','Photo','Name','Phone','Plan','Status','Join Date','Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((m, i) => (
                  <tr key={m.member_id} className="table-row-hover transition-colors">
                    <td className="px-5 py-4 text-sm font-mono text-indigo-600 font-medium">{m.member_id}</td>
                    <td className="px-5 py-4">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                        style={{ backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                      >
                        {getInitials(m.first_name, m.last_name)}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-slate-800">{m.first_name} {m.last_name}</p>
                      <p className="text-xs text-slate-400">{m.email}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">{m.phone}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{m.plan || '—'}</td>
                    <td className="px-5 py-4">{getStatusBadge(m.status)}</td>
                    <td className="px-5 py-4 text-sm text-slate-500">
                      {m.join_date ? new Date(m.join_date).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(m)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition text-sm">
                          <i className="fas fa-pen"></i>
                        </button>
                        <button onClick={() => handleDelete(m.member_id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition text-sm">
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-12 text-slate-400">No members found</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        <div className="px-6 py-4 border-t border-slate-100 text-sm text-slate-500">
          Showing {filtered.length} of {members.length} members
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <Modal title={modal === 'add' ? 'Add New Member' : 'Edit Member'} onClose={() => setModal(null)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">First Name *</label>
                <input value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Last Name *</label>
                <input value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
              <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Gender</label>
              <select value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white">
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
              <textarea value={form.address} onChange={e => setForm({...form, address: e.target.value})}
                rows={2} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm resize-none"></textarea>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setModal(null)}
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
                Cancel
              </button>
              <button type="submit" disabled={saving}
                className="flex-1 btn-primary py-2.5 rounded-xl text-sm font-semibold">
                {saving ? <i className="fas fa-spinner fa-spin"></i> : modal === 'add' ? 'Add Member' : 'Save Changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
