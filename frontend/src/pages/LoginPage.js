import React, { useState } from 'react';
import { login } from '../services/api';

export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(form);
      onLogin(res.data.user);
    } catch {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 sidebar-gradient flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full border-2 border-white"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full border border-white"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-4 border-indigo-400"></div>
        </div>
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <i className="fas fa-bolt text-white text-3xl"></i>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">GYM PLUS</h1>
          <p className="text-indigo-300 text-lg mb-8">Professional Gym Management</p>
          <div className="space-y-4 text-left">
            {['Member Management', 'Biometric Attendance', 'Membership Tracking', 'Payment Records'].map(f => (
              <div key={f} className="flex items-center gap-3 text-slate-300">
                <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-check text-white text-xs"></i>
                </div>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="lg:hidden w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-bolt text-white text-2xl"></i>
            </div>
            <h2 className="text-3xl font-bold text-slate-800">Welcome back</h2>
            <p className="text-slate-500 mt-2">Sign in to your admin account</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
                <div className="relative">
                  <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                  <input
                    type="text"
                    value={form.username}
                    onChange={e => setForm({ ...form, username: e.target.value })}
                    placeholder="Enter username"
                    className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                  <input
                    type="password"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="Enter password"
                    className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 transition"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                  <i className="fas fa-circle-exclamation"></i> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 rounded-xl font-semibold text-sm shadow-lg shadow-indigo-500/30"
              >
                {loading ? (
                  <span><i className="fas fa-spinner fa-spin mr-2"></i>Signing in...</span>
                ) : (
                  <span><i className="fas fa-right-to-bracket mr-2"></i>Sign In</span>
                )}
              </button>
            </form>

            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-500 font-medium mb-2">Demo Credentials:</p>
              <p className="text-xs text-slate-600">Admin: <span className="font-mono font-semibold">admin / admin123</span></p>
              <p className="text-xs text-slate-600 mt-1">Trainer: <span className="font-mono font-semibold">trainer1 / trainer123</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
