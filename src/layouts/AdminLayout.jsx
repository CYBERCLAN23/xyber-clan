import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useCMS } from '../context/CMSContext';
import CMSToolbar from '../components/cms/CMSToolbar';
import { Loader2 } from 'lucide-react';
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
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={32} className="text-cyan-400 animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Verifying access...</p>
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
