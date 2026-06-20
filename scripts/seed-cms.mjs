/**
 * Seed script for CMS Firestore content.
 * Run: node scripts/seed-cms.mjs
 *
 * Prerequisites:
 *   - Firebase project must already exist
 *   - Firestore must be initialized
 *   - A Firebase service account key JSON file
 *
 * Steps:
 *   1. Go to Firebase Console → Project Settings → Service Accounts
 *   2. Click "Generate New Private Key"
 *   3. Save the JSON file as serviceAccountKey.json in project root
 *   4. Run: GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json node scripts/seed-cms.mjs
 */

import { readFileSync, existsSync } from 'fs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const KEY_PATH = './serviceAccountKey.json';

if (!existsSync(KEY_PATH)) {
  console.error(`
  ❌ Service account key not found at ${KEY_PATH}
  
  Steps to fix:
    1. Go to https://console.firebase.google.com/project/xyberclan-cms-dc2d5/settings/serviceaccounts/adminsdk
    2. Click "Generate New Private Key"
    3. Save the JSON as serviceAccountKey.json in the project root
    4. Re-run this script
  `);
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(KEY_PATH, 'utf8'));

const app = initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore(app);

const initialContent = {
  en: {
    hero: {
      title: 'Your Trusted Digital Partner',
      subtitle: 'Professional digital solutions for ambitious businesses and individuals.',
    },
    footer: {
      email: 'xyberclandev@gmail.com',
      emailLabel: 'EMAIL US',
      phoneLabel: 'CALL US',
      phone: '+237 6 54 26 94 88 / +237 6 96 81 43 91',
    },
    teamPage: {
      title: 'Meet Our',
      titleBold: 'Specialists',
      subtitle: 'A premium collective of engineers, designers, and strategists.',
    },
  },
};

try {
  await db.collection('cms').doc('content').set(initialContent, { merge: true });
  console.log('✅ CMS content seeded successfully!');
  console.log('📄 Document: cms/content');
  console.log('📍 Firestore path: projects/xyberclan-cms-dc2d5/databases/(default)/documents/cms/content');
} catch (err) {
  console.error('❌ Failed to seed CMS content:', err);
  process.exit(1);
}
