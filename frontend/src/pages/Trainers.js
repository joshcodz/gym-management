import React, { useEffect, useState } from 'react';
import { getTrainers, addTrainer, updateTrainer, deleteTrainer } from '../services/api';
import Header from '../components/Header';
import Modal from '../components/Modal';

const SPECIALIZATIONS = ['Strength & Conditioning','Cardio & HIIT','Yoga & Flexibility','CrossFit','Martial Arts','Nutrition & Diet','Personal Training','Bodybuilding'];
const COLORS = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6'];

const EMPTY = { name: '', specialization: 'Strength & Conditioning', phone: '', email: '', experience: '' };

export default function Trainers() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getTrainers().then(r => setTrainers(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (t) => {
    setForm({ name: t.name, specialization: t.specialization, phone: t.phone||'', email: t.email||'', experience: t.experience||'' });
    setEditId(t.trainer_id);
    setModal('edit');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal === 'add') await addTrainer(form);
      else await updateTrainer(editId, { ...form, status: 'Active' });
      setModal(null);
      load();
    } catch(err) { alert(err.response?.data?.error || 'Error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this trainer?')) return;
    await deleteTrainer(id);
    load();
  };

  return (
    <div>
      <Header title="Trainer Management" subtitle="View and manage gym trainers" />

      {/* Cards Grid */}
      {loading ? (
        <div className="text-center py-16"><i className="fas fa-spinner fa-spin text-2xl text-indigo-500"></i></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
          {trainers.map((t, i) => (
            <div key={t.trainer_id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 card-hover">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  >
                    {t.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{t.name}</h3>
                    <p className="text-xs text-slate-500">{t.specialization}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${t.status === 'Active' ? 'badge-active' : 'badge-expired'}`}>
                  {t.status || 'Active'}
                </span>
              </div>
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <i className="fas fa-phone text-slate-400 w-4"></i>
                  <span>{t.phone || '—'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <i className="fas fa-envelope text-slate-400 w-4"></i>
                  <span className="truncate">{t.email || '—'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <i className="fas fa-briefcase text-slate-400 w-4"></i>
                  <span>{t.experience || 0} years experience</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => openEdit(t)}
                  className="flex-1 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-medium hover:bg-indigo-100 transition">
                  <i className="fas fa-pen mr-1"></i> Edit
                </button>
                <button onClick={() => handleDelete(t.trainer_id)}
                  className="flex-1 py-2 bg-red-50 text-red-500 rounded-xl text-sm font-medium hover:bg-red-100 transition">
                  <i className="fas fa-trash mr-1"></i> Delete
                </button>
              </div>
            </div>
          ))}

          {/* Add New Card */}
          <button onClick={openAdd}
            className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center hover:border-indigo-400 hover:bg-indigo-50 transition group min-h-[240px]">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center mb-3 group-hover:bg-indigo-200 transition">
              <i className="fas fa-plus text-indigo-600 text-xl"></i>
            </div>
            <p className="font-semibold text-slate-700 group-hover:text-indigo-700">Add New Trainer</p>
            <p className="text-xs text-slate-400 mt-1">Click to add a trainer</p>
          </button>
        </div>
      )}

      {/* Table view */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">All Trainers ({trainers.length})</h3>
          <button onClick={openAdd} className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/20">
            <i className="fas fa-plus"></i> Add Trainer
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['ID','Name','Specialization','Phone','Email','Experience','Status','Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {trainers.map((t, i) => (
                <tr key={t.trainer_id} className="table-row-hover">
                  <td className="px-5 py-4 text-sm font-mono text-indigo-600">T{String(t.trainer_id).padStart(3,'0')}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}>{t.name[0]}</div>
                      <span className="text-sm font-semibold text-slate-800">{t.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">{t.specialization}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{t.phone}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{t.email}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{t.experience} yrs</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${t.status === 'Active' ? 'badge-active' : 'badge-expired'}`}>
                      {t.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(t)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition text-sm">
                        <i className="fas fa-pen"></i>
                      </button>
                      <button onClick={() => handleDelete(t.trainer_id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition text-sm">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {trainers.length === 0 && !loading && (
                <tr><td colSpan={8} className="text-center py-12 text-slate-400">No trainers found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Add New Trainer' : 'Edit Trainer'} onClose={() => setModal(null)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Specialization</label>
              <select value={form.specialization} onChange={e => setForm({...form, specialization: e.target.value})}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white">
                {SPECIALIZATIONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
                <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Experience (yrs)</label>
                <input type="number" value={form.experience} onChange={e => setForm({...form, experience: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setModal(null)}
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
              <button type="submit" disabled={saving} className="flex-1 btn-primary py-2.5 rounded-xl text-sm font-semibold">
                {saving ? <i className="fas fa-spinner fa-spin"></i> : modal === 'add' ? 'Add Trainer' : 'Save Changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
