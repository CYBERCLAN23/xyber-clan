import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useCMS } from '../context/CMSContext';
import CMSToolbar from '../components/cms/CMSToolbar';
import { Loader2 } from 'lucide-react';

/**
 * AdminLayout — Wraps all /admin/* routes.
 * - If not authenticated: redirects to /admin/login
 * - If authenticated: renders child route + CMS toolbar
 */
const AdminLayout = () => {
  const { user, authLoading, setIsEditing } = useCMS();
  const location = useLocation();

  // Enable editing mode when user is authenticated and on admin routes
  useEffect(() => {
    if (user) setIsEditing(true);
    return () => setIsEditing(false);
  }, [user, setIsEditing]);

  // Show loading while checking auth
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

  // Not logged in — redirect to login (except if already on login page)
  if (!user && location.pathname !== '/admin/login') {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // If on login page and already logged in, redirect to admin home
  if (user && location.pathname === '/admin/login') {
    return <Navigate to="/admin" replace />;
  }

  return (
    <>
      {/* Render the matched child route (pages with CMS enabled) */}
      <Outlet />
      {/* CMS floating toolbar */}
      <CMSToolbar />
    </>
  );
};

export default AdminLayout;
