import React, { useState, useRef, useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';
import { Save, RotateCcw, LogOut, ExternalLink, Loader2, CheckCircle2, AlertCircle, ChevronDown, Home, Users, Handshake, Map, Calendar, Rocket, Inbox } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ADMIN_BASE, ADMIN_PAGES as RAW_ADMIN_PAGES } from '../../config/adminPath';

/**
 * Admin pages registry — all navigable pages in the CMS.
 * Icons are added here (config only exports paths/labels).
 */
const PAGE_ICONS = { Home, Team: Users, Partners: Handshake, Journey: Map, Events: Calendar, 'Start Project': Rocket, Leads: Inbox };
const ADMIN_PAGES = RAW_ADMIN_PAGES.map(p => ({ ...p, icon: PAGE_ICONS[p.label] || Home }));

/** Shared look for the quiet controls on the ink bar. */
const CHIP = 'inline-flex h-10 items-center gap-2 rounded-full px-3.5 text-[0.875rem] font-medium transition-colors duration-300';

/**
 * CMSToolbar — Floating toolbar visible only in CMS editing mode.
 * Page switcher (left rail + dropdown), save/discard, unsaved indicator, view site, logout.
 */
const CMSToolbar = () => {
  const { isEditing, hasChanges, saveAll, discardAll, isSaving, saveStatus, logout, user } = useCMS();
  const location = useLocation();
  const navigate = useNavigate();
  const [showPageSwitcher, setShowPageSwitcher] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowPageSwitcher(false);
      }
    };
    const handleKey = (e) => { if (e.key === 'Escape') setShowPageSwitcher(false); };
    if (showPageSwitcher) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKey);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
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
      <div aria-hidden="true" className="fixed left-0 right-0 top-0 z-[9998] h-[3px] bg-cyan" />

      {/* ═══ Left-side page rail ═══ */}
      <nav
        aria-label="CMS pages"
        className="fixed left-3 top-1/2 z-[9997] -translate-y-1/2"
        style={{ animation: 'xcCmsRail 0.5s var(--ease-out)' }}
      >
        <div className="flex flex-col gap-1 rounded-[24px] bg-ink p-1.5 text-paper shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)]">
          {ADMIN_PAGES.map((page) => {
            const Icon = page.icon;
            const isActive = page.path === location.pathname;
            return (
              <button
                key={page.path}
                type="button"
                onClick={() => handlePageSwitch(page)}
                title={page.label}
                aria-current={isActive ? 'page' : undefined}
                className={`group relative flex h-10 items-center gap-2.5 rounded-full px-3 text-[0.8125rem] font-medium transition-colors duration-300 ${
                  isActive ? 'bg-cyan text-on-cyan' : 'text-paper/65 hover:bg-paper/10 hover:text-paper'
                }`}
              >
                <Icon size={16} aria-hidden="true" />
                <span className="hidden whitespace-nowrap xl:inline">{page.label}</span>
                {/* Tooltip when the rail is collapsed */}
                <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-full bg-ink px-3 py-1.5 text-[0.75rem] text-paper opacity-0 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.4)] transition-opacity group-hover:opacity-100 xl:hidden">
                  {page.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ═══ Floating bottom toolbar ═══ */}
      <div
        role="toolbar"
        aria-label="CMS editing"
        className="fixed bottom-5 left-1/2 z-[9999] w-max max-w-[calc(100vw-24px)] -translate-x-1/2"
        style={{ animation: 'xcCmsBar 0.5s var(--ease-out)' }}
      >
        <div className="flex items-center gap-1 rounded-full bg-ink p-1.5 text-paper shadow-[0_24px_60px_-20px_rgba(0,0,0,0.5)]">
          {/* CMS mode indicator */}
          <div className="flex items-center gap-2 pl-3 pr-2">
            <span aria-hidden="true" className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-cyan opacity-60" />
              <span className="relative h-2 w-2 rounded-full bg-cyan" />
            </span>
            <span className="text-[0.875rem] font-semibold">CMS</span>
          </div>

          {/* Current page — dropdown */}
          <div className="relative hidden sm:block" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setShowPageSwitcher(!showPageSwitcher)}
              aria-haspopup="menu"
              aria-expanded={showPageSwitcher}
              className={`${CHIP} bg-paper/10 hover:bg-paper/15`}
            >
              <span className="text-paper/55">Editing</span>
              <span>{currentPage.label}</span>
              <ChevronDown size={14} aria-hidden="true" className={`transition-transform duration-300 ${showPageSwitcher ? 'rotate-180' : ''}`} />
            </button>

            {showPageSwitcher && (
              <div
                role="menu"
                className="absolute bottom-full left-0 mb-3 min-w-[220px] rounded-[22px] bg-ink p-1.5 text-paper shadow-[0_24px_60px_-16px_rgba(0,0,0,0.5)]"
                style={{ animation: 'xcCmsPop 0.22s var(--ease-out)' }}
              >
                <p className="px-3 pb-1.5 pt-2 text-[0.8125rem] text-paper/55">Switch Page</p>
                {ADMIN_PAGES.map((page) => {
                  const Icon = page.icon;
                  const isActive = page.path === location.pathname;
                  return (
                    <button
                      key={page.path}
                      type="button"
                      role="menuitem"
                      onClick={() => handlePageSwitch(page)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex w-full items-center gap-2.5 rounded-full px-3 py-2.5 text-[0.875rem] transition-colors ${
                        isActive ? 'bg-paper/10 text-paper' : 'text-paper/70 hover:bg-paper/10 hover:text-paper'
                      }`}
                    >
                      <Icon size={15} aria-hidden="true" />
                      {page.label}
                      {isActive && <span aria-hidden="true" className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Status */}
          <div aria-live="polite" className="flex items-center">
            {hasChanges && (
              <span className={`${CHIP} cursor-default`}>
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#f5a524]" />
                Unsaved
              </span>
            )}
            {saveStatus === 'success' && (
              <span className={`${CHIP} cursor-default`} style={{ animation: 'xcCmsFade 0.3s ease-out' }}>
                <CheckCircle2 size={16} aria-hidden="true" className="text-[#30a46c]" />
                Saved!
              </span>
            )}
            {saveStatus === 'error' && (
              <span className={`${CHIP} cursor-default`}>
                <AlertCircle size={16} aria-hidden="true" className="text-[#e5484d]" />
                Error
              </span>
            )}
          </div>

          {/* Actions */}
          <button
            type="button"
            onClick={saveAll}
            disabled={!hasChanges || isSaving}
            className={`${CHIP} ${hasChanges ? 'bg-cyan text-on-cyan hover:brightness-105 active:scale-[0.98]' : 'cursor-not-allowed text-paper/35'}`}
          >
            {isSaving ? <Loader2 size={15} className="animate-spin" aria-hidden="true" /> : <Save size={15} aria-hidden="true" />}
            {isSaving ? 'Saving...' : 'Save'}
          </button>

          <button
            type="button"
            title="Discard"
            onClick={() => {
              if (hasChanges && window.confirm('Discard all unsaved changes?')) {
                discardAll();
              }
            }}
            disabled={!hasChanges}
            className={`${CHIP} ${hasChanges ? 'text-paper hover:bg-paper/10' : 'cursor-not-allowed text-paper/35'}`}
          >
            <RotateCcw size={15} aria-hidden="true" />
            <span className="hidden sm:inline">Discard</span>
          </button>

          <Link to={publicPath} className={`${CHIP} text-paper/75 hover:bg-paper/10 hover:text-paper`} title="View public site">
            <ExternalLink size={15} aria-hidden="true" />
            <span className="hidden sm:inline">View Site</span>
          </Link>

          <button
            type="button"
            onClick={() => {
              if (!hasChanges || window.confirm('You have unsaved changes. Logout anyway?')) {
                logout();
              }
            }}
            title="Logout"
            className={`${CHIP} text-paper/75 hover:bg-paper/10 hover:text-paper`}
          >
            <LogOut size={15} aria-hidden="true" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

        {/* Signed-in account */}
        {user && (
          <p className="mt-2 text-center text-[0.75rem] text-ink-3">{user.email}</p>
        )}
      </div>

      {/* CMS global styles */}
      <style>{`
        @keyframes xcCmsBar {
          from { opacity: 0; transform: translate(-50%, 16px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes xcCmsRail {
          from { opacity: 0; transform: translate(-16px, -50%); }
          to { opacity: 1; transform: translate(0, -50%); }
        }
        @keyframes xcCmsFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes xcCmsPop {
          from { opacity: 0; transform: scale(0.96) translateY(6px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .cms-editable {
          position: relative;
          transition: box-shadow 0.2s, border-color 0.2s;
          border: 1px dashed transparent;
          border-radius: 6px;
          padding: 1px 2px;
        }
        .cms-editable:hover {
          border-color: rgba(34, 196, 210, 0.45);
          box-shadow: 0 0 0 2px rgba(34, 196, 210, 0.12);
        }
        .cms-editable-active {
          border-color: rgba(34, 196, 210, 0.9) !important;
          box-shadow: 0 0 0 3px rgba(34, 196, 210, 0.22) !important;
          background: rgba(34, 196, 210, 0.06);
        }
        .cms-editable-link {
          position: relative;
          transition: box-shadow 0.2s;
        }
        .cms-editable-link:hover {
          box-shadow: 0 0 0 2px rgba(34, 196, 210, 0.35);
          border-radius: 6px;
        }
        .cms-editable-image {
          transition: box-shadow 0.2s;
          border-radius: inherit;
        }
        .cms-editable-image:hover {
          box-shadow: 0 0 0 3px rgba(34, 196, 210, 0.45);
        }
      `}</style>
    </>
  );
};

export default CMSToolbar;
