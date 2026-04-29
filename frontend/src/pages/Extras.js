import React from 'react';
import Header from '../components/Header';

export function Reports() {
  return (
    <div>
      <Header title="Reports" subtitle="Analytics and business insights" />
      <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-100 text-center">
        <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-chart-bar text-indigo-600 text-2xl"></i>
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Reports Coming Soon</h3>
        <p className="text-slate-500 text-sm">Advanced analytics and reporting features will be available here.</p>
      </div>
    </div>
  );
}

export function Settings() {
  return (
    <div>
      <Header title="Settings" subtitle="System configuration" />
      <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-100 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-gear text-slate-600 text-2xl"></i>
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Settings Coming Soon</h3>
        <p className="text-slate-500 text-sm">System configuration and preferences will be available here.</p>
      </div>
    </div>
  );
}
