import React, { useState, useRef, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';
import { Save, RotateCcw, LogOut, ExternalLink, Loader2, CheckCircle2, AlertCircle, Pencil, ChevronDown, Home, Users, Handshake, Map, Calendar, Rocket } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ADMIN_BASE, ADMIN_PAGES as RAW_ADMIN_PAGES } from '../../config/adminPath';

/**
 * Admin pages registry — all navigable pages in the CMS.
 * Icons are added here (config only exports paths/labels).
 */
const PAGE_ICONS = { Home, Team: Users, Partners: Handshake, Journey: Map, Events: Calendar, 'Start Project': Rocket };
const ADMIN_PAGES = RAW_ADMIN_PAGES.map(p => ({ ...p, icon: PAGE_ICONS[p.label] || Home }));

/**
 * CMSToolbar — Floating bottom toolbar visible only in CMS editing mode.
 * Shows page switcher, save/discard buttons, unsaved indicator, and navigation.
 */
const CMSToolbar = () => {
  const { isEditing, hasChanges, saveAll, discardAll, isSaving, saveStatus, logout, user } = useCMS();
  const location = useLocation();
  const navigate = useNavigate();
  const [showPageSwitcher, setShowPageSwitcher] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowPageSwitcher(false);
      }
    };
    if (showPageSwitcher) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPageSwitcher]);

  if (!isEditing) return null;

  const currentPage = ADMIN_PAGES.find(p => p.path === location.pathname) || ADMIN_PAGES[0];
  const publicPath = location.pathname.replace(ADMIN_BASE, '') || '/';

  const handlePageSwitch = (page) => {
    if (page.path === location.pathname) {
      setShowPageSwitcher(false);
      return;
    }
    if (hasChanges) {
      if (!window.confirm('You have unsaved changes. Switch page anyway?')) return;
      discardAll();
    }
    navigate(page.path);
    setShowPageSwitcher(false);
  };

  return (
    <>
      {/* Top CMS indicator bar */}
      <div className="fixed top-0 left-0 right-0 z-[9998] h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />

      {/* ═══ Left-side Page Switcher Panel ═══ */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-[9997]" style={{ animation: 'cmsSlideRight 0.4s ease-out' }}>
        <div className="flex flex-col gap-1.5 p-2 bg-gray-900/95 backdrop-blur-2xl border border-gray-700/50 rounded-2xl shadow-2xl shadow-black/50">
          {ADMIN_PAGES.map((page) => {
            const Icon = page.icon;
            const isActive = page.path === location.pathname;
            return (
              <button
                key={page.path}
                onClick={() => handlePageSwitch(page)}
                title={page.label}
                className={`
                  group relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200
                  ${isActive
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200 border border-transparent'
                  }
                `}
              >
                <Icon size={16} className={isActive ? 'text-cyan-400' : 'text-gray-500 group-hover:text-gray-300'} />
                <span className="hidden lg:inline whitespace-nowrap">{page.label}</span>
                {/* Tooltip on small screens */}
                <span className="lg:hidden absolute left-full ml-2 px-2 py-1 bg-gray-800 text-gray-200 text-[11px] font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap border border-gray-700 shadow-xl">
                  {page.label}
                </span>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-1 h-4 bg-cyan-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ Floating bottom toolbar ═══ */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]" style={{ animation: 'cmsSlideUp 0.5s ease-out' }}>
        <div className="flex items-center gap-3 px-5 py-3 bg-gray-900/95 backdrop-blur-2xl border border-gray-700/50 rounded-2xl shadow-2xl shadow-black/50">
          {/* CMS Mode indicator */}
          <div className="flex items-center gap-2 pr-3 border-r border-gray-700">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">CMS</span>
          </div>

          {/* Current page — clickable dropdown */}
          <div className="hidden sm:block relative pr-3 border-r border-gray-700" ref={dropdownRef}>
            <button
              onClick={() => setShowPageSwitcher(!showPageSwitcher)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-gray-800 transition-colors group"
            >
              <Pencil size={12} className="text-gray-500" />
              <span className="text-xs text-gray-300 font-medium">{currentPage.label}</span>
              <ChevronDown size={12} className={`text-gray-500 transition-transform duration-200 ${showPageSwitcher ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {showPageSwitcher && (
              <div
                className="absolute bottom-full mb-2 left-0 min-w-[180px] py-1.5 bg-gray-900/98 backdrop-blur-2xl border border-gray-700/60 rounded-xl shadow-2xl shadow-black/60"
                style={{ animation: 'cmsPopIn 0.2s ease-out' }}
              >
                <div className="px-3 py-1.5 mb-1 border-b border-gray-800">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Switch Page</span>
                </div>
                {ADMIN_PAGES.map((page) => {
                  const Icon = page.icon;
                  const isActive = page.path === location.pathname;
                  return (
                    <button
                      key={page.path}
                      onClick={() => handlePageSwitch(page)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-cyan-500/10 text-cyan-400'
                          : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                      }`}
                    >
                      <Icon size={14} className={isActive ? 'text-cyan-400' : 'text-gray-600'} />
                      {page.label}
                      {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Changes indicator */}
          {hasChanges && (
            <div className="flex items-center gap-1.5 pr-3 border-r border-gray-700">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-xs text-amber-400 font-semibold">Unsaved</span>
            </div>
          )}

          {/* Save status */}
          {saveStatus === 'success' && (
            <div className="flex items-center gap-1.5 pr-3 border-r border-gray-700" style={{ animation: 'cmsFadeIn 0.3s ease-out' }}>
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span className="text-xs text-emerald-400 font-semibold">Saved!</span>
            </div>
          )}
          {saveStatus === 'error' && (
            <div className="flex items-center gap-1.5 pr-3 border-r border-gray-700">
              <AlertCircle size={14} className="text-red-400" />
              <span className="text-xs text-red-400 font-semibold">Error</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {/* Save */}
            <button
              onClick={saveAll}
              disabled={!hasChanges || isSaving}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                hasChanges
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:scale-[1.02]'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {isSaving ? 'Saving...' : 'Save'}
            </button>

            {/* Discard */}
            <button
              onClick={() => {
                if (hasChanges && window.confirm('Discard all unsaved changes?')) {
                  discardAll();
                }
              }}
              disabled={!hasChanges}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                hasChanges
                  ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              <RotateCcw size={14} />
              Discard
            </button>

            {/* View public site */}
            <Link
              to={publicPath}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-gray-800 hover:bg-gray-700 text-gray-300 transition-all border border-gray-700"
              title="View public site"
            >
              <ExternalLink size={14} />
              <span className="hidden sm:inline">View Site</span>
            </Link>

            {/* Logout */}
            <button
              onClick={() => {
                if (!hasChanges || window.confirm('You have unsaved changes. Logout anyway?')) {
                  logout();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-gray-800 hover:bg-gray-700 text-gray-400 transition-all border border-gray-700"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* User email small label */}
        {user && (
          <div className="text-center mt-1.5">
            <span className="text-[10px] text-gray-600 font-medium">{user.email}</span>
          </div>
        )}
      </div>

      {/* CMS global styles */}
      <style>{`
        @keyframes cmsSlideUp {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes cmsSlideRight {
          from { opacity: 0; transform: translate(-20px, -50%); }
          to { opacity: 1; transform: translate(0, -50%); }
        }
        @keyframes cmsFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes cmsPopIn {
          from { opacity: 0; transform: scale(0.95) translateY(4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .cms-editable {
          position: relative;
          transition: box-shadow 0.2s, border-color 0.2s;
          border: 1px dashed transparent;
          border-radius: 4px;
          padding: 1px 2px;
        }
        .cms-editable:hover {
          border-color: rgba(34, 211, 238, 0.4);
          box-shadow: 0 0 0 2px rgba(34, 211, 238, 0.1);
        }
        .cms-editable-active {
          border-color: rgba(34, 211, 238, 0.8) !important;
          box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.2) !important;
          background: rgba(34, 211, 238, 0.05);
        }
        .cms-editable-link {
          position: relative;
          transition: box-shadow 0.2s;
        }
        .cms-editable-link:hover {
          box-shadow: 0 0 0 2px rgba(34, 211, 238, 0.3);
          border-radius: 4px;
        }
        .cms-editable-image {
          transition: box-shadow 0.2s;
          border-radius: inherit;
        }
        .cms-editable-image:hover {
          box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.4);
        }
      `}</style>
    </>
  );
};

export default CMSToolbar;
