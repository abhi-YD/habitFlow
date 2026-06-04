// import { useEffect } from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';
// import useAuthStore from './store/authStore';

// // pages (we'll create these next)
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Dashboard from './pages/Dashboard';
// import Habits from './pages/Habits';
// import Tasks from './pages/Tasks';
// import Goals from './pages/Goals';
// import Layout from './components/layout/Layout';

// import Settings from './pages/Settings';

// import AI from './pages/AI';

// import Analytics from './pages/Analytics';
// // importing landing page for now, can remove later
// import Landing from './pages/Landing';

// import Pricing from './pages/Pricing';

// // protected route wrapper
// const ProtectedRoute = ({ children }) => {
//   const { isLoggedIn } = useAuthStore();
//   return isLoggedIn ? children : <Navigate to="/login" />;
// };

// // public route (redirect if already logged in)
// const PublicRoute = ({ children }) => {
//   const { isLoggedIn } = useAuthStore();
//   return !isLoggedIn ? children : <Navigate to="/dashboard" />;
// };

// export default function App() {
//   const { fetchMe, isLoggedIn } = useAuthStore();

//   // fetch user on app load if token exists
//   useEffect(() => {
//     if (isLoggedIn) fetchMe();
//   }, []);

//   return (
//     <BrowserRouter>
//       <Toaster
//         position="top-right"
//         toastOptions={{
//           style: {
//             background: '#111118',
//             color: '#F8FAFC',
//             border: '1px solid #1E1E2E',
//             borderRadius: '12px',
//           }
//         }}
//       />
      
//       <Routes>
        
        
//         {/* public routes */}
// // we can remove the landing page later, but for now it serves as a nice welcome screen
//         <Route path="/" element={
//           <PublicRoute><Landing /></PublicRoute>
//         } />
        
//         <Route path="/pricing" element={<Pricing />} />
        

//         <Route path="/login" element={
//           <PublicRoute><Login /></PublicRoute>
//         } />
//         <Route path="/register" element={
//           <PublicRoute><Register /></PublicRoute>
//         } />

//         {/* protected routes inside layout */}
//         <Route path="/" element={
//           <ProtectedRoute>
//             <Layout />
//           </ProtectedRoute>
//         }>
          

//           <Route index element={<Navigate to="/dashboard" />} />
//           <Route path="dashboard" element={<Dashboard />} />
//           <Route path="habits" element={<Habits />} />
//           <Route path="tasks" element={<Tasks />} />
//           <Route path="goals" element={<Goals />} />
//           <Route path="settings" element={<Settings />} />
//           <Route path="ai" element={<AI />} />
//           <Route path="analytics" element={<Analytics />} />
//         </Route>

//         {/* catch all */}
//         <Route path="*" element={<Navigate to="/dashboard" />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';

import Login     from './pages/Login';
import Register  from './pages/Register';
import Dashboard from './pages/Dashboard';
import Habits    from './pages/Habits';
import Tasks     from './pages/Tasks';
import Goals     from './pages/Goals';
import Settings  from './pages/Settings';
import AI        from './pages/AI';
import Analytics from './pages/Analytics';
import Layout    from './components/layout/Layout';
import Landing   from './pages/Landing';
import Pricing   from './pages/Pricing';
import Admin     from './pages/Admin';

// ── Protected: must be logged in ──
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuthStore();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

// ── Admin: must be logged in and admin ──
const AdminRoute = ({ children }) => {
  const { isLoggedIn, user } = useAuthStore();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/app/dashboard" replace />;
  return children;
};

// ── Auth pages: redirect to dashboard if already logged in ──
const AuthRoute = ({ children }) => {
  const { isLoggedIn } = useAuthStore();
  return !isLoggedIn ? children : <Navigate to="/app/dashboard" replace />;
};

export default function App() {
  const { fetchMe, isLoggedIn } = useAuthStore();

  useEffect(() => {
    if (isLoggedIn) fetchMe();
  }, []);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background:   '#111118',
            color:        '#F8FAFC',
            border:       '1px solid #1E1E2E',
            borderRadius: '12px',
          }
        }}
      />
      <Routes>

        {/* ── PUBLIC — always accessible ── */}
        <Route path="/"       element={<Landing />} />
        <Route path="/pricing" element={<Pricing />} />

        {/* ── AUTH — redirect to dashboard if logged in ── */}
        <Route path="/login" element={
          <AuthRoute><Login /></AuthRoute>
        } />
        <Route path="/register" element={
          <AuthRoute><Register /></AuthRoute>
        } />

        {/* ── PROTECTED — inside app layout ── */}
        <Route path="/app" element={
          <ProtectedRoute><Layout /></ProtectedRoute>
        }>
          <Route index                element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard"     element={<Dashboard />} />
          <Route path="habits"        element={<Habits />} />
          <Route path="tasks"         element={<Tasks />} />
          <Route path="goals"         element={<Goals />} />
          <Route path="settings"      element={<Settings />} />
          <Route path="ai"            element={<AI />} />
          <Route path="analytics"     element={<Analytics />} />
          <Route path="admin"         element={<AdminRoute><Admin /></AdminRoute>} />
        </Route>

        {/* ── LEGACY REDIRECTS ── */}
        {/* keeps old /dashboard links working */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Navigate to="/app/dashboard" replace />
          </ProtectedRoute>
        } />
        <Route path="/habits"   element={<Navigate to="/app/habits"   replace />} />
        <Route path="/tasks"    element={<Navigate to="/app/tasks"    replace />} />
        <Route path="/goals"    element={<Navigate to="/app/goals"    replace />} />
        <Route path="/settings" element={<Navigate to="/app/settings" replace />} />
        <Route path="/ai"       element={<Navigate to="/app/ai"       replace />} />
        <Route path="/analytics"element={<Navigate to="/app/analytics"replace />} />

        {/* ── CATCH ALL ── */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}