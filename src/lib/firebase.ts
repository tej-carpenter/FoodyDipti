import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const isConfigured = Object.values(firebaseConfig).every(Boolean);
const app = isConfigured ? getApps()[0] ?? initializeApp(firebaseConfig) : null;
const forceLongPolling = process.env.NEXT_PUBLIC_FIRESTORE_FORCE_LONG_POLLING === 'true';

function createFirestore() {
  if (!app) {
    return null;
  }

  try {
    return initializeFirestore(app, {
      experimentalForceLongPolling: forceLongPolling,
    });
  } catch {
    return getFirestore(app);
  }
}

export const firebaseReady = Boolean(app);
export const firebaseAuth = app ? getAuth(app) : null;
export const firebaseDb = createFirestore();
export const firebaseStorage = app ? getStorage(app) : null;

function parseEmailList(value?: string) {
  if (!value) return [];

  return value
    .split(',')
    .map((email) => email.toLowerCase().trim())
    .filter(Boolean);
}

export function getAdminEmails() {
  const configured = process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const parsed = parseEmailList(configured);

  return parsed.length > 0 ? parsed : ['tejprakashcarpenter@gmail.com'];
}

export function getAdminEmail() {
  return getAdminEmails()[0];
}