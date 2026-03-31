import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Dynamic / Lazy Imports for heavy modules
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Leads = lazy(() => import('./pages/Leads'));
const Properties = lazy(() => import('./pages/Properties'));
const Activities = lazy(() => import('./pages/Activities'));
const AuditLogs = lazy(() => import('./pages/AuditLogs'));
const Users = lazy(() => import('./pages/Users'));
const LeadProfile = lazy(() => import('./pages/LeadProfile'));
const Guide = lazy(() => import('./pages/Guide'));

// Fallback Loader (Minimalist Pulse)
const PageLoader = () => (
  <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-6">
    <div className="relative">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
      <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse" />
    </div>
    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground animate-pulse">Syncing Metropolis...</p>
  </div>
);

const App = () => {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/leads" element={<Leads />} />
              <Route path="/leads/:id" element={<LeadProfile />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/guide" element={<Guide />} />
              {/* Admin/Superadmin Only Routes */}
              <Route element={<ProtectedRoute allowedRoles={['admin', 'superadmin']} />}>
                <Route path="/audit-logs" element={<AuditLogs />} />
                <Route path="/users" element={<Users />} />
              </Route>
            </Route>
          </Route>

          {/* Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
