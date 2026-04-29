import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Memberships from './pages/Memberships';
import AddMembership from './pages/AddMembership';
import Payments from './pages/Payments';
import Trainers from './pages/Trainers';
import BiometricIntake from './pages/BiometricIntake';
import Attendance from './pages/Attendance';
import { Reports, Settings } from './pages/Extras';
import Layout from './components/Layout';

function ProtectedRoute({ children, user }) {
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('gym_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (userData) => {
    sessionStorage.setItem('gym_user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('gym_user');
    setUser(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          user ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} />
        } />
        <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />

        {[
          { path: '/dashboard', el: <Dashboard user={user} /> },
          { path: '/members', el: <Members /> },
          { path: '/memberships', el: <Memberships /> },
          { path: '/add-membership', el: <AddMembership /> },
          { path: '/payments', el: <Payments /> },
          { path: '/trainers', el: <Trainers /> },
          { path: '/biometric', el: <BiometricIntake /> },
          { path: '/attendance', el: <Attendance /> },
          { path: '/reports', el: <Reports /> },
          { path: '/settings', el: <Settings /> },
        ].map(({ path, el }) => (
          <Route key={path} path={path} element={
            <ProtectedRoute user={user}>
              <Layout user={user} onLogout={handleLogout}>{el}</Layout>
            </ProtectedRoute>
          } />
        ))}

        <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
