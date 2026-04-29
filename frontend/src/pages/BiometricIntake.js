import React, { useState, useEffect } from 'react';
import { lookupMember, markEntry, markExit } from '../services/api';
import Header from '../components/Header';

const FingerprintIcon = () => (
  <svg viewBox="0 0 100 100" className="w-24 h-24 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M50 10 C28 10 10 28 10 50" strokeLinecap="round"/>
    <path d="M50 10 C72 10 90 28 90 50" strokeLinecap="round"/>
    <path d="M50 20 C32 20 18 34 18 50" strokeLinecap="round"/>
    <path d="M50 20 C68 20 82 34 82 50" strokeLinecap="round"/>
    <path d="M50 30 C36 30 26 39 26 50 C26 60 34 68 50 72" strokeLinecap="round"/>
    <path d="M50 30 C64 30 74 39 74 50 C74 62 64 70 50 72" strokeLinecap="round"/>
    <path d="M50 40 C43 40 36 44 36 52 C36 60 42 66 50 68" strokeLinecap="round"/>
    <path d="M50 40 C57 40 64 44 64 52 C64 60 58 66 50 68" strokeLinecap="round"/>
    <path d="M50 52 C50 52 50 52 50 52" strokeLinecap="round" strokeWidth="4"/>
    <ellipse cx="50" cy="50" rx="40" ry="40" strokeDasharray="4 4" opacity="0.2"/>
  </svg>
);

export default function BiometricIntake() {
  const [memberId, setMemberId] = useState('');
  const [memberInfo, setMemberInfo] = useState(null);
  const [lookupError, setLookupError] = useState('');
  const [fingerStatus, setFingerStatus] = useState('idle'); // idle | scanning | captured
  const [faceStatus, setFaceStatus] = useState('idle');
  const [actionMsg, setActionMsg] = useState('');
  const [actionType, setActionType] = useState(''); // success | error
  const [loading, setLoading] = useState(false);

  const handleLookup = async () => {
    if (!memberId.trim()) return;
    setLookupError('');
    setMemberInfo(null);
    try {
      const res = await lookupMember(memberId.trim());
      setMemberInfo(res.data);
    } catch {
      setLookupError('Member not found. Check the ID and try again.');
    }
  };

  const simulateScan = (type) => {
    if (type === 'finger') {
      setFingerStatus('scanning');
      setTimeout(() => setFingerStatus('captured'), 1800);
    } else {
      setFaceStatus('scanning');
      setTimeout(() => setFaceStatus('captured'), 2000);
    }
  };

  const handleEntry = async () => {
    if (!memberId) return alert('Enter member ID first');
    setLoading(true);
    try {
      await markEntry({ member_id: memberId });
      setActionMsg('✅ Entry marked successfully!');
      setActionType('success');
    } catch(err) {
      setActionMsg('❌ ' + (err.response?.data?.error || 'Error marking entry'));
      setActionType('error');
    } finally { setLoading(false); }
    setTimeout(() => setActionMsg(''), 4000);
  };

  const handleExit = async () => {
    if (!memberId) return alert('Enter member ID first');
    setLoading(true);
    try {
      await markExit({ member_id: memberId });
      setActionMsg('✅ Exit marked successfully!');
      setActionType('success');
    } catch(err) {
      setActionMsg('❌ ' + (err.response?.data?.error || 'Error marking exit'));
      setActionType('error');
    } finally { setLoading(false); }
    setTimeout(() => setActionMsg(''), 4000);
  };

  const reset = () => {
    setMemberId(''); setMemberInfo(null); setLookupError('');
    setFingerStatus('idle'); setFaceStatus('idle'); setActionMsg('');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Biometric Intake</h1>
          <p className="text-slate-500 text-sm mt-0.5">Capture and manage member biometrics</p>
        </div>
        <button onClick={reset}
          className="flex items-center gap-2 px-5 py-2.5 border border-indigo-600 text-indigo-600 rounded-xl text-sm font-semibold hover:bg-indigo-50 transition">
          <i className="fas fa-rotate-right"></i> Reset
        </button>
      </div>

      {actionMsg && (
        <div className={`mb-4 px-5 py-4 rounded-xl border text-sm font-medium ${
          actionType === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {actionMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-fingerprint text-indigo-600 text-xs"></i>
            </div>
            Capture Member Biometrics
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Member ID</label>
              <div className="flex gap-3">
                <input
                  value={memberId}
                  onChange={e => setMemberId(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLookup()}
                  placeholder="e.g. MBR1024"
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm"
                />
                <button onClick={handleLookup} className="btn-primary px-4 py-2.5 rounded-xl text-sm font-semibold">
                  <i className="fas fa-search mr-1"></i> Lookup
                </button>
              </div>
              {lookupError && <p className="text-xs text-red-500 mt-1">{lookupError}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <input
                value={memberInfo ? `${memberInfo.first_name} ${memberInfo.last_name}` : ''}
                readOnly placeholder="Auto-filled on lookup"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
              <input value={memberInfo?.phone || ''} readOnly
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input value={memberInfo?.email || ''} readOnly
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50" />
            </div>

            <div className="flex gap-4 pt-2">
              <button
                onClick={() => simulateScan('finger')}
                disabled={fingerStatus === 'scanning'}
                className="flex-1 btn-primary py-3 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20"
              >
                {fingerStatus === 'scanning' ? (
                  <span><i className="fas fa-spinner fa-spin mr-2"></i>Scanning...</span>
                ) : fingerStatus === 'captured' ? (
                  <span><i className="fas fa-check-circle mr-2"></i>Fingerprint OK</span>
                ) : (
                  <span><i className="fas fa-fingerprint mr-2"></i>Capture Fingerprint</span>
                )}
              </button>
              <button
                onClick={() => simulateScan('face')}
                disabled={faceStatus === 'scanning'}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl text-sm font-bold transition"
              >
                {faceStatus === 'scanning' ? (
                  <span><i className="fas fa-spinner fa-spin mr-2"></i>Scanning...</span>
                ) : faceStatus === 'captured' ? (
                  <span><i className="fas fa-check-circle mr-2"></i>Face OK</span>
                ) : (
                  <span><i className="fas fa-camera mr-2"></i>Capture Face</span>
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <button
                onClick={handleEntry}
                disabled={loading}
                className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition shadow-lg shadow-emerald-500/20"
              >
                {loading ? <i className="fas fa-spinner fa-spin"></i> : <span><i className="fas fa-sign-in-alt mr-2"></i>Mark Entry</span>}
              </button>
              <button
                onClick={handleExit}
                disabled={loading}
                className="py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition shadow-lg shadow-red-500/20"
              >
                {loading ? <i className="fas fa-spinner fa-spin"></i> : <span><i className="fas fa-sign-out-alt mr-2"></i>Mark Exit</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Biometric Status Panel */}
        <div className="lg:col-span-2 space-y-5">
          {/* Fingerprint Status */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <p className="text-sm font-semibold text-slate-700 mb-3">Fingerprint Status</p>
            <div className="flex items-center gap-4">
              <div className={`relative w-28 h-28 flex items-center justify-center rounded-2xl border-2 transition-all ${
                fingerStatus === 'captured' ? 'border-emerald-400 bg-emerald-50' :
                fingerStatus === 'scanning' ? 'border-indigo-400 bg-indigo-50 animate-pulse' :
                'border-slate-200 bg-slate-50'
              }`}>
                <FingerprintIcon />
                {fingerStatus === 'captured' && (
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center shadow">
                    <i className="fas fa-check text-white text-xs"></i>
                  </div>
                )}
              </div>
              <div>
                <p className={`font-bold text-lg ${
                  fingerStatus === 'captured' ? 'text-emerald-600' :
                  fingerStatus === 'scanning' ? 'text-indigo-600' : 'text-slate-400'
                }`}>
                  {fingerStatus === 'captured' ? 'Captured' : fingerStatus === 'scanning' ? 'Scanning...' : 'Waiting'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {fingerStatus === 'captured' ? 'Fingerprint verified ✓' : 'Click button to scan'}
                </p>
              </div>
            </div>
          </div>

          {/* Face Status */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <p className="text-sm font-semibold text-slate-700 mb-3">Face Status</p>
            <div className="flex items-center gap-4">
              <div className={`relative w-28 h-28 flex items-center justify-center rounded-2xl border-2 overflow-hidden transition-all ${
                faceStatus === 'captured' ? 'border-emerald-400' :
                faceStatus === 'scanning' ? 'border-indigo-400 animate-pulse' : 'border-slate-200 bg-slate-50'
              }`}>
                {faceStatus === 'captured' ? (
                  <>
                    <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                      <i className="fas fa-user text-4xl text-slate-500"></i>
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center shadow">
                      <i className="fas fa-check text-white text-xs"></i>
                    </div>
                  </>
                ) : (
                  <i className={`fas fa-camera text-3xl ${faceStatus === 'scanning' ? 'text-indigo-400' : 'text-slate-300'}`}></i>
                )}
              </div>
              <div>
                <p className={`font-bold text-lg ${
                  faceStatus === 'captured' ? 'text-emerald-600' :
                  faceStatus === 'scanning' ? 'text-indigo-600' : 'text-slate-400'
                }`}>
                  {faceStatus === 'captured' ? 'Captured' : faceStatus === 'scanning' ? 'Scanning...' : 'Waiting'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {faceStatus === 'captured' ? 'Face recognized ✓' : 'Click button to scan'}
                </p>
              </div>
            </div>
          </div>

          {/* Enrollment Status */}
          {fingerStatus === 'captured' && faceStatus === 'captured' && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <i className="fas fa-shield-check text-emerald-600"></i>
                </div>
                <div>
                  <p className="font-bold text-emerald-700 text-sm">Biometric Enrollment</p>
                  <p className="text-emerald-600 text-xs mt-0.5">Completed Successfully!</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
