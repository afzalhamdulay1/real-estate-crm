import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Properties from './pages/Properties';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Activities from './pages/Activities';
import AuditLogs from './pages/AuditLogs';
import Users from './pages/Users';
import LeadProfile from './pages/LeadProfile';
import Guide from './pages/Guide';

const App = () => {
  return (
    <Router>
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
    </Router>
  );
};

export default App;
