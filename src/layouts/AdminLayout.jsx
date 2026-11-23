import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useCMS } from '../context/CMSContext';
import CMSToolbar from '../components/cms/CMSToolbar';
import { Loader2 } from 'lucide-react';
import Logo from '../brand/Logo';
import { ADMIN_BASE, adminPath } from '../config/adminPath';

/**
 * AdminLayout — Wraps all secret admin routes.
 * - If not authenticated: redirects to login
 * - If authenticated: renders child route + CMS toolbar
 */
const AdminLayout = () => {
  const { user, authLoading, setIsEditing } = useCMS();
  const location = useLocation();

  useEffect(() => {
    if (user) setIsEditing(true);
    return () => setIsEditing(false);
  }, [user, setIsEditing]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper" role="status" aria-live="polite">
        <div className="flex flex-col items-center gap-5">
          <Logo variant="symbol" decorative className="h-12 w-auto animate-pulse" />
          <p className="t-small flex items-center gap-2 text-ink-3">
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            Verifying access...
          </p>
        </div>
      </div>
    );
  }

  // Not logged in — redirect to login
  if (!user && location.pathname !== adminPath('login')) {
    return <Navigate to={adminPath('login')} state={{ from: location }} replace />;
  }

  // Already logged in on login page — redirect to admin home
  if (user && location.pathname === adminPath('login')) {
    return <Navigate to={ADMIN_BASE} replace />;
  }

  return (
    <>
      <Outlet />
      <CMSToolbar />
    </>
  );
};

export default AdminLayout;
