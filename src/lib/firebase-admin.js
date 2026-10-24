// Firebase Auth + Storage, used only by the organizer pages (/admin).
// Kept separate so public visitors don't download them.
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import { app } from './firebase.js'

export const auth = app ? getAuth(app) : null
export const storage = app && import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ? getStorage(app) : null
