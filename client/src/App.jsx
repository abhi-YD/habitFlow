import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';

// pages (we'll create these next)
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Habits from './pages/Habits';
import Tasks from './pages/Tasks';
import Goals from './pages/Goals';
import Layout from './components/layout/Layout';

// protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuthStore();
  return isLoggedIn ? children : <Navigate to="/login" />;
};

// public route (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { isLoggedIn } = useAuthStore();
  return !isLoggedIn ? children : <Navigate to="/dashboard" />;
};

export default function App() {
  const { fetchMe, isLoggedIn } = useAuthStore();

  // fetch user on app load if token exists
  useEffect(() => {
    if (isLoggedIn) fetchMe();
  }, []);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#111118',
            color: '#F8FAFC',
            border: '1px solid #1E1E2E',
            borderRadius: '12px',
          }
        }}
      />
      <Routes>
        {/* public routes */}
        <Route path="/login" element={
          <PublicRoute><Login /></PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute><Register /></PublicRoute>
        } />

        {/* protected routes inside layout */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="habits" element={<Habits />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="goals" element={<Goals />} />
        </Route>

        {/* catch all */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}