import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// ──────────────────────────────────────────────
// 🔥 FIREBASE CONFIGURATION
// Replace these values with your Firebase project config.
// Go to: Firebase Console → Project Settings → General → Your Apps → Config
// The Spark (free) plan covers everything this CMS needs.
// ──────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyCydVkLgeVgj9FHHYP9Uhnt2pHuFwRdxm4",
  authDomain: "xyberclan-cms-dc2d5.firebaseapp.com",
  projectId: "xyberclan-cms-dc2d5",
  storageBucket: "xyberclan-cms-dc2d5.firebasestorage.app",
  messagingSenderId: "1097230828912",
  appId: "1:1097230828912:web:a2dce0feaa0a5ac8233bb5",
  measurementId: "G-HJXGZWV7PB"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
