import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore/lite'

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

// When the env vars aren't set yet, the site still runs using the built-in
// fallback content in src/data/fallback.js, and forms explain they aren't connected.
export const isFirebaseConfigured = Boolean(config.apiKey && config.projectId)

export const app = isFirebaseConfigured ? initializeApp(config) : null
export const db = app ? getFirestore(app) : null
// Auth and Storage are only needed by /admin, so they live in firebase-admin.js.

// Firestore can't store nested arrays, so route paths are saved as [{lat, lng}, ...]
// and converted to [[lat, lng], ...] for the map.
export const pathToFirestore = (path) => path.map(([lat, lng]) => ({ lat, lng }))
export const pathFromFirestore = (path = []) => path.map((p) => (Array.isArray(p) ? p : [p.lat, p.lng]))
