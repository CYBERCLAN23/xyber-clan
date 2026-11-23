import React, { useState } from 'react';
import { useCMS } from '../context/CMSContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Loader2, AlertCircle, Lock } from 'lucide-react';
import { ADMIN_BASE } from '../config/adminPath';

/**
 * AdminLogin — Ultra-secure CMS login page.
 * /admin/login route — dark, minimal, cybersecurity-themed.
 */
const AdminLogin = () => {
  const { login, user } = useCMS();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  // If already logged in, redirect
  React.useEffect(() => {
    if (user) navigate(ADMIN_BASE);
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (attempts >= 5) {
      setError('Too many attempts. Please wait a moment.');
      return;
    }

    if (!email || !password) {
      setError('All fields are required.');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      navigate(ADMIN_BASE);
    } catch (err) {
      setAttempts((a) => a + 1);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid credentials. Access denied.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Account temporarily locked. Try again later.');
      } else {
        setError('Authentication failed. Try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/20 via-transparent to-purple-950/20" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        {/* Animated glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] animate-pulse" />
      </div>

      {/* Login card */}
      <div className="relative w-full max-w-md" style={{ animation: 'cmsSlideUp 0.6s ease-out' }}>
        {/* Shield icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center">
            <Shield size={28} className="text-cyan-400" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-white tracking-tight">
            XYBER<span className="text-cyan-400">CMS</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">Secure Content Management</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 space-y-5 shadow-2xl">
            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl" style={{ animation: 'cmsShake 0.3s ease-out' }}>
                <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                <span className="text-xs text-red-400 font-semibold">{error}</span>
              </div>
            )}

            {/* Email field */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                placeholder="admin@xyberclan.com"
                autoComplete="email"
                disabled={isLoading}
              />
            </div>

            {/* Password field */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                  placeholder="••••••••••"
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || attempts >= 5}
              className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                isLoading || attempts >= 5
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 hover:scale-[1.01]'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Lock size={16} />
                  Access CMS
                </>
              )}
            </button>
          </div>
        </form>

        {/* Security note */}
        <p className="text-center text-[10px] text-gray-600 mt-6">
          Protected by Firebase Authentication · Encrypted connection
        </p>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes cmsSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes cmsShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
