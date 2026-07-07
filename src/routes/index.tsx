import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

// Layouts
import { PublicLayout } from '../layouts/PublicLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { AdminLayout } from '../layouts/AdminLayout';

// Public Pages
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { ForgotPassword } from '../pages/ForgotPassword';
import { PublicInvitation } from '../pages/PublicInvitation';
import { NotFound } from '../pages/NotFound';
import { Developer } from '../pages/Developer';
import { About } from '../pages/About';
import { Contact } from '../pages/Contact';
import { Privacy } from '../pages/Privacy';
import { Terms } from '../pages/Terms';
import { CookiePolicy } from '../pages/CookiePolicy';

// Dashboard Pages
import { Dashboard } from '../pages/Dashboard';
import { MyInvitations } from '../pages/MyInvitations';
import { CreateInvitation } from '../pages/CreateInvitation';
import { EditInvitation } from '../pages/EditInvitation';
import { TemplateGallery } from '../pages/TemplateGallery';
import { TemplatePreview } from '../pages/TemplatePreview';
import { Profile } from '../pages/Profile';
import { Settings } from '../pages/Settings';
import { Pricing } from '../pages/Pricing';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminUsers } from '../pages/admin/AdminUsers';
import { AdminPayments } from '../pages/admin/AdminPayments';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isInitializing } = useAuthStore();
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 rounded-full border-2 border-rose-500/20 border-t-rose-500 animate-spin" />
        <p className="text-slate-400 text-xs font-medium tracking-wide">Securing session...</p>
      </div>
    );
  }
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export const AppRoutes: React.FC = () => {
  const { initializeAuth, isInitializing } = useAuthStore();

  React.useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 rounded-full border-2 border-rose-500/20 border-t-rose-500 animate-spin" />
        <p className="text-slate-400 text-xs font-medium tracking-wide">Securing session...</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Pages */}
      <Route
        path="/"
        element={
          <PublicLayout>
            <Home />
          </PublicLayout>
        }
      />
      <Route
        path="/login"
        element={
          <PublicLayout>
            <Login />
          </PublicLayout>
        }
      />
      <Route
        path="/register"
        element={
          <PublicLayout>
            <Register />
          </PublicLayout>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicLayout>
            <ForgotPassword />
          </PublicLayout>
        }
      />

      {/* Standalone Pages */}
      <Route path="/invitation/:slug" element={<PublicInvitation />} />
      <Route path="/template-preview/:id" element={<TemplatePreview />} />
      <Route path="/developer" element={<Developer />} />

      {/* Protected Dashboard Pages */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/events"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <MyInvitations />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/events/create"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CreateInvitation />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/events/edit/:id"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <EditInvitation />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/templates"
        element={
          <PublicLayout>
            <TemplateGallery />
          </PublicLayout>
        }
      />
      <Route
        path="/dashboard/profile"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/settings"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/pricing"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Pricing />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Policy & Company Pages */}
      <Route
        path="/about"
        element={
          <PublicLayout>
            <About />
          </PublicLayout>
        }
      />
      <Route
        path="/contact"
        element={
          <PublicLayout>
            <Contact />
          </PublicLayout>
        }
      />
      <Route
        path="/privacy"
        element={
          <PublicLayout>
            <Privacy />
          </PublicLayout>
        }
      />
      <Route
        path="/terms"
        element={
          <PublicLayout>
            <Terms />
          </PublicLayout>
        }
      />
      <Route
        path="/cookie-policy"
        element={
          <PublicLayout>
            <CookiePolicy />
          </PublicLayout>
        }
      />

      {/* Admin Panel */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminUsers />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/payments"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminPayments />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Error & Mismatch fallback */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};
