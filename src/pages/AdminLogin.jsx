import React, { useState } from 'react';
import { useCMS } from '../context/CMSContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import Logo from '../brand/Logo';
import { ADMIN_BASE } from '../config/adminPath';

/**
 * AdminLogin — CMS sign-in (secret admin route + Firebase Auth).
 * Quiet "operate" screen: paper ground, one brand panel, one form.
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

  const locked = isLoading || attempts >= 5;
  const field = 'h-14 w-full rounded-2xl bg-paper-2 px-5 text-[1rem] text-ink placeholder:text-ink-3 outline-none transition-[background-color,box-shadow] duration-300 focus:bg-paper focus:shadow-[0_0_0_2px_var(--brand-cyan)] disabled:opacity-60';

  return (
    <div className="grid min-h-screen bg-paper text-ink lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative m-3 hidden flex-col justify-between overflow-hidden rounded-media bg-paper-2 p-[clamp(32px,4vw,64px)] lg:flex">
        <p className="t-small text-ink-3">xyberclan.dev</p>
        <div className="flex flex-col gap-10">
          <p className="t-headline max-w-[12ch]">Edit the site, in place.</p>
          <Logo variant="lockup" decorative className="h-auto w-full max-w-[560px]" style={{ '--mark-ring': 'var(--paper-2)' }} />
        </div>
      </div>

      {/* Form */}
      <main className="flex items-center justify-center px-5 py-16 sm:px-10">
        <div className="w-full max-w-[400px]" style={{ animation: 'cmsSlideUp 0.6s var(--ease-out)' }}>
          <Logo variant="symbol" decorative className="mb-10 h-10 w-auto lg:hidden" />
          <h1 className="t-title">
            Xyber<span className="text-accent">CMS</span>
          </h1>
          <p className="t-small mt-1.5 text-ink-3">Secure Content Management</p>

          <form onSubmit={handleSubmit} noValidate className="mt-10 flex flex-col gap-5">
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-2xl bg-[color-mix(in_oklab,#e5484d_12%,var(--paper))] px-4 py-3.5 text-[#b42318] dark:text-[#ff8a8a]"
                style={{ animation: 'cmsShake 0.3s ease-out' }}
              >
                <AlertCircle size={18} className="mt-px shrink-0" aria-hidden="true" />
                <span className="t-small font-medium">{error}</span>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label htmlFor="cms-email" className="t-small font-medium text-ink-2">Email Address</label>
              <input
                id="cms-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={field}
                placeholder="admin@xyberclan.com"
                autoComplete="email"
                disabled={isLoading}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="cms-password" className="t-small font-medium text-ink-2">Password</label>
              <div className="relative">
                <input
                  id="cms-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${field} pr-14`}
                  placeholder="••••••••••"
                  autoComplete="current-password"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-paper-3 hover:text-ink"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={locked}
              className={`group relative isolate mt-3 flex h-14 w-full items-center justify-center gap-2.5 overflow-hidden rounded-full text-[1rem] font-medium transition-colors duration-500 ease-[var(--ease-out)] ${
                locked ? 'cursor-not-allowed bg-paper-3 text-ink-3' : 'bg-ink text-paper hover:text-on-cyan active:scale-[0.99]'
              }`}
            >
              {!locked && (
                <span aria-hidden="true" className="absolute inset-0 -z-10 origin-left scale-x-0 rounded-full bg-cyan transition-transform duration-[650ms] ease-[var(--ease-out)] group-hover:scale-x-100 group-focus-visible:scale-x-100" />
              )}
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                  Authenticating...
                </>
              ) : (
                'Access CMS'
              )}
            </button>
          </form>

          <p className="t-small mt-8 text-ink-3">
            Protected by Firebase Authentication · Encrypted connection
          </p>
        </div>
      </main>

      <style>{`
        @keyframes cmsSlideUp {
          from { opacity: 0; transform: translateY(16px); }
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
