import React from 'react';
import Sidebar from './Sidebar';

export default function Layout({ children, user, onLogout }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar user={user} onLogout={onLogout} />
      <main className="flex-1 ml-64 p-8 min-h-screen">
        {children}
      </main>
    </div>
  );
}
