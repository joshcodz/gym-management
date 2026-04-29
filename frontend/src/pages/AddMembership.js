import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addMembership } from '../services/api';
import Header from '../components/Header';

const PLANS = [
  { name: 'Basic Plan', duration: '1 Month', months: 1, price: 1499 },
  { name: 'Standard Plan', duration: '3 Months', months: 3, price: 3999 },
  { name: 'Premium Plan', duration: '6 Months', months: 6, price: 6999 },
  { name: 'Elite Plan', duration: '12 Months', months: 12, price: 11999 },
];

const DURATIONS = ['1 Month', '3 Months', '6 Months', '12 Months'];

function addMonths(dateStr, months) {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split('T')[0];
}

export default function AddMembership() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    member_id: '', full_name: '', phone: '', email: '',
    dob: '', gender: 'Male', address: '',
    plan: 'Premium Plan', duration: '6 Months',
    start_date: today, end_date: addMonths(today, 6), amount: 6999,
  });
  const [photo, setPhoto] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const updatePlan = (planName) => {
    const p = PLANS.find(x => x.name === planName);
    if (!p) return;
    const end = addMonths(form.start_date, p.months);
    setForm(f => ({ ...f, plan: planName, duration: p.duration, end_date: end, amount: p.price }));
  };

  const updateDuration = (dur) => {
    const p = PLANS.find(x => x.duration === dur);
    const months = p?.months || 1;
    setForm(f => ({ ...f, duration: dur, end_date: addMonths(f.start_date, months), amount: p?.price || f.amount }));
  };

  const updateStartDate = (date) => {
    const p = PLANS.find(x => x.name === form.plan);
    const end = addMonths(date, p?.months || 1);
    setForm(f => ({ ...f, start_date: date, end_date: end }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPhoto(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.member_id) return alert('Member ID is required');
    setSaving(true);
    try {
      await addMembership({
        member_id: form.member_id,
        membership_type: form.plan,
        start_date: form.start_date,
        end_date: form.end_date,
        validity: form.duration,
        amount: form.amount,
      });
      setSuccess(true);
      setTimeout(() => navigate('/memberships'), 2000);
    } catch (err) {
      alert(err.response?.data?.error || 'Error saving membership');
    } finally { setSaving(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Add New Membership</h1>
          <p className="text-slate-500 text-sm mt-0.5">Register a new member</p>
        </div>
        <button onClick={() => navigate('/members')}
          className="flex items-center gap-2 px-5 py-2.5 border border-indigo-600 text-indigo-600 rounded-xl text-sm font-semibold hover:bg-indigo-50 transition">
          <i className="fas fa-list"></i> Manual Entry
        </button>
      </div>

      {success && (
        <div className="mb-4 flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-4 rounded-xl">
          <i className="fas fa-circle-check text-xl"></i>
          <div>
            <p className="font-semibold">Membership saved successfully!</p>
            <p className="text-sm">Redirecting to memberships...</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Member Info */}
          <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-user text-indigo-600 text-xs"></i>
              </div>
              Member Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Member ID *</label>
                <input value={form.member_id} onChange={e => setForm({...form, member_id: e.target.value})}
                  placeholder="e.g. MBR1001" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" required />
                <p className="text-xs text-slate-400 mt-1">Enter existing member ID</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <input value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})}
                  placeholder="Neha Kapoor" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
                <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                  placeholder="9123456780" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  placeholder="neha.kapoor@email.com" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Date of Birth</label>
                  <input type="date" value={form.dob} onChange={e => setForm({...form, dob: e.target.value})}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Gender</label>
                  <select value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white">
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
                <textarea value={form.address} onChange={e => setForm({...form, address: e.target.value})}
                  placeholder="45, Park Street, Bangalore" rows={2}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm resize-none"></textarea>
              </div>
            </div>
          </div>

          {/* Membership Plan */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-id-card text-purple-600 text-xs"></i>
              </div>
              Membership Plan
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Select Plan</label>
                <select value={form.plan} onChange={e => updatePlan(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white">
                  {PLANS.map(p => <option key={p.name}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Duration</label>
                <select value={form.duration} onChange={e => updateDuration(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white">
                  {DURATIONS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Start Date</label>
                <input type="date" value={form.start_date} onChange={e => updateStartDate(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">End Date</label>
                <input type="date" value={form.end_date} readOnly
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Amount (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">₹</span>
                  <input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})}
                    className="w-full pl-8 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold" />
                </div>
              </div>

              {/* Plan Summary */}
              <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                <p className="text-xs font-semibold text-indigo-700 mb-2">Plan Summary</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Plan</span>
                    <span className="font-semibold text-slate-800">{form.plan}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Duration</span>
                    <span className="font-semibold text-slate-800">{form.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-indigo-200 pt-1 mt-1">
                    <span className="text-slate-700 font-medium">Total</span>
                    <span className="font-bold text-indigo-700">₹{Number(form.amount).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <div className="w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-camera text-emerald-600 text-xs"></i>
              </div>
              Upload Photo
            </h3>
            <div className="flex-1 flex flex-col items-center justify-center">
              {photo ? (
                <div className="w-full text-center">
                  <img src={photo} alt="Member" className="w-40 h-48 object-cover rounded-xl mx-auto shadow-md" />
                  <button type="button" onClick={() => setPhoto(null)}
                    className="mt-3 text-sm text-red-500 hover:text-red-700">
                    <i className="fas fa-trash mr-1"></i> Remove
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer w-full">
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-indigo-400 hover:bg-indigo-50 transition">
                    <i className="fas fa-cloud-upload-alt text-3xl text-slate-400 mb-3"></i>
                    <p className="text-sm font-medium text-slate-600">Click to upload photo</p>
                    <p className="text-xs text-slate-400 mt-1">JPG, PNG up to 5MB</p>
                  </div>
                  <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
                </label>
              )}
            </div>

            <div className="mt-6">
              <button type="submit" disabled={saving}
                className="w-full btn-primary py-3 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/30">
                {saving ? (
                  <span><i className="fas fa-spinner fa-spin mr-2"></i>Saving...</span>
                ) : (
                  <span><i className="fas fa-save mr-2"></i>Save Membership</span>
                )}
              </button>
              <button type="button" onClick={() => navigate('/memberships')}
                className="w-full mt-3 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
