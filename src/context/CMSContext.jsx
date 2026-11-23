import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { db, auth } from '../firebase';

const CMSContext = createContext(null);

// ── Utility: deep get / set on nested object by dot-path ──
const deepGet = (obj, path) => {
  if (!path) return undefined;
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
};

const deepSet = (obj, path, value) => {
  const clone = JSON.parse(JSON.stringify(obj));
  const keys = path.split('.');
  let cur = clone;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!cur[keys[i]]) cur[keys[i]] = {};
    cur = cur[keys[i]];
  }
  cur[keys[keys.length - 1]] = value;
  return clone;
};

export const CMSProvider = ({ children }) => {
  // ── Auth state ──
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // ── CMS mode (editing vs. viewing) ──
  const [isEditing, setIsEditing] = useState(false);

  // ── Content from Firestore (the "saved" version) ──
  const [savedContent, setSavedContent] = useState({});

  // ── Pending changes (not yet saved) ──
  const [pendingChanges, setPendingChanges] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null

  const hasChanges = Object.keys(pendingChanges).length > 0;

  // ── Global Edit Mode Side Effects ──
  useEffect(() => {
    if (isEditing) {
      document.body.classList.add('cms-editing');
      
      const interceptClicks = (e) => {
        // If they click on a link or inside a link, prevent default navigation
        const link = e.target.closest('a');
        if (link && !link.closest('.cms-toolbar')) {
          e.preventDefault();
        }
      };
      
      // Capture phase so we grab it before React Router
      document.addEventListener('click', interceptClicks, true);
      return () => {
        document.body.classList.remove('cms-editing');
        document.removeEventListener('click', interceptClicks, true);
      };
    } else {
      document.body.classList.remove('cms-editing');
    }
  }, [isEditing]);

  // ── Listen for auth state ──
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  // ── Load content from Firestore on mount ──
  useEffect(() => {
    const loadContent = async () => {
      try {
        // We store all CMS content in a single Firestore doc: cms/content
        const snap = await getDoc(doc(db, 'cms', 'content'));
        if (snap.exists()) {
          setSavedContent(snap.data());
        }
      } catch (err) {
        console.warn('CMS: Could not load content from Firestore', err);
      }
    };
    loadContent();
  }, []);

  // ── Get content value: pending → saved → fallback ──
  const getContent = useCallback((path, fallback) => {
    // First check pending changes
    if (pendingChanges[path] !== undefined) return pendingChanges[path];
    // Then check saved Firestore content
    const saved = deepGet(savedContent, path);
    if (saved !== undefined) return saved;
    // Fallback to original translation value
    return fallback;
  }, [pendingChanges, savedContent]);

  // ── Queue a content change ──
  const updateContent = useCallback((path, value) => {
    setPendingChanges(prev => ({ ...prev, [path]: value }));
    setSaveStatus(null);
  }, []);

  // ── Convert an image to Base64 and queue its data URL ──
  const updateImage = useCallback(async (path, file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target.result;
        updateContent(path, url);
        resolve(url);
      };
      reader.onerror = (err) => {
        console.error('CMS: Image conversion failed', err);
        reject(err);
      };
      reader.readAsDataURL(file);
    });
  }, [updateContent]);

  // ── Save all pending changes to Firestore ──
  const saveAll = useCallback(async () => {
    if (!hasChanges) return;
    setIsSaving(true);
    setSaveStatus(null);
    try {
      // Merge pending changes into saved content
      let merged = { ...savedContent };
      Object.entries(pendingChanges).forEach(([path, value]) => {
        merged = deepSet(merged, path, value);
      });

      // Write to Firestore (merge to preserve other fields)
      await setDoc(doc(db, 'cms', 'content'), merged, { merge: true });

      setSavedContent(merged);
      setPendingChanges({});
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error('CMS: Save failed', err);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  }, [hasChanges, pendingChanges, savedContent]);

  // ── Discard all pending changes ──
  const discardAll = useCallback(() => {
    setPendingChanges({});
    setSaveStatus(null);
  }, []);

  // ── Auth methods ──
  const login = useCallback(async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  }, []);

  const logout = useCallback(async () => {
    setIsEditing(false);
    return signOut(auth);
  }, []);

  return (
    <CMSContext.Provider value={{
      // Auth
      user,
      authLoading,
      login,
      logout,
      // CMS mode
      isEditing,
      setIsEditing,
      // Content
      getContent,
      updateContent,
      updateImage,
      savedContent,
      // Save / Discard
      saveAll,
      discardAll,
      hasChanges,
      isSaving,
      saveStatus
    }}>
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};

export default CMSContext;
