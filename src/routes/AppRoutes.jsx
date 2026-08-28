import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import ComingSoonPage from '../components/layout/ComingSoonPage';
import { navigationItems } from './navigationConfig';

// Any navigation item not yet implemented (`enabled: false`) still gets a
// route registered so the sidebar can link somewhere and future feature
// work only needs to swap ComingSoonPage for a real page component.
const notYetBuiltItems = navigationItems.filter((item) => !item.enabled);

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        {notYetBuiltItems.map((item) => (
          <Route
            key={item.key}
            path={item.path.replace('/admin/', '')}
            element={<ComingSoonPage title={item.label} />}
          />
        ))}
      </Route>
      <Route path="/" element={<Navigate to="/admin" replace />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}