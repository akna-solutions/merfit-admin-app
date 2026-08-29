import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import ComingSoonPage from '../components/layout/ComingSoonPage';
import { navigationItems } from './navigationConfig';
import UsersPage from '../features/users/pages/UsersPage';
import WorkoutsPage from '../features/workouts/pages/WorkoutsPage';
import NutritionPage from '../features/nutrition/pages/NutritionPage';
import SubscriptionsPage from '../features/subscriptions/pages/SubscriptionsPage';
import GamificationPage from '../features/gamification/pages/GamificationPage';
import NotificationsPage from '../features/notifications/pages/NotificationsPage';
import SupportPage from '../features/support/pages/SupportPage';
import ContentPage from '../features/content/pages/ContentPage';
import FaqPage from '../features/faq/pages/FaqPage';
import TranslationsPage from '../features/translations/pages/TranslationsPage';
import AnalyticsPage from '../features/analytics/pages/AnalyticsPage';
import AiPage from '../features/ai/pages/AiPage';
import AuditLogsPage from '../features/auditLogs/pages/AuditLogsPage';
import SettingsPage from '../features/settings/pages/SettingsPage';
import LoginPage from '../features/auth/pages/LoginPage';
import ProtectedRoute from '../features/auth/components/ProtectedRoute';

// Explicit map of built feature pages, keyed by nav item `key`. Any
// navigationConfig item not listed here (or with `enabled: false`) still
// gets a route registered via ComingSoonPage, so the sidebar always links
// somewhere even before a screen's UI exists (spec §2/§20 architecture).
const builtPages = {
  users: UsersPage,
  workouts: WorkoutsPage,
  nutrition: NutritionPage,
  subscriptions: SubscriptionsPage,
  gamification: GamificationPage,
  notifications: NotificationsPage,
  support: SupportPage,
  content: ContentPage,
  faq: FaqPage,
  translations: TranslationsPage,
  analytics: AnalyticsPage,
  ai: AiPage,
  'audit-logs': AuditLogsPage,
  settings: SettingsPage,
};

const notYetBuiltItems = navigationItems.filter(
  (item) => !item.enabled || !builtPages[item.key],
);

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        {Object.entries(builtPages).map(([key, Component]) => {
          const item = navigationItems.find((nav) => nav.key === key);
          if (!item) return null;
          return (
            <Route
              key={key}
              path={item.path.replace('/admin/', '')}
              element={<Component />}
            />
          );
        })}
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