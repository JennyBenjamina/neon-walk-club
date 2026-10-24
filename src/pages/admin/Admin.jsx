import { useEffect, useState } from 'react'
import {
  GoogleAuthProvider,
  isSignInWithEmailLink,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore/lite'
import { db, isFirebaseConfigured } from '../../lib/firebase.js'
import { auth } from '../../lib/firebase-admin.js'
import Inbox from './Inbox.jsx'
import Subscribers from './Subscribers.jsx'
import GalleryAdmin from './GalleryAdmin.jsx'
import SpotlightsAdmin from './SpotlightsAdmin.jsx'
import PartnersAdmin from './PartnersAdmin.jsx'
import RoutesAdmin from './RoutesAdmin.jsx'
import SettingsAdmin from './SettingsAdmin.jsx'

const TABS = [
  ['inbox', 'Inbox', Inbox],
  ['subscribers', 'Newsletter', Subscribers],
  ['gallery', 'Photos', GalleryAdmin],
  ['spotlights', 'Spotlights', SpotlightsAdmin],
  ['partners', 'Partners', PartnersAdmin],
  ['routes', 'Routes', RoutesAdmin],
  ['settings', 'Settings', SettingsAdmin],
]

const EMAIL_KEY = 'nwc-signin-email'
const readSavedEmail = () => {
  try { return window.localStorage.getItem(EMAIL_KEY) || '' } catch { return '' }
}
const saveEmail = (v) => {
  try { v ? window.localStorage.setItem(EMAIL_KEY, v) : window.localStorage.removeItem(EMAIL_KEY) } catch { /* ignore */ }
}

function Login({ finishingLink }) {
  const [email, setEmail] = useState(readSavedEmail())
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState('')

  async function google() {
    setErr('')
    try {
      await signInWithPopup(auth, new GoogleAuthProvider())
    } catch (e) {
      if (e?.code !== 'auth/popup-closed-by-user') setErr(e.message)
    }
  }

  async function onSubmit(e) {
    e.preventDefault()
    setErr('')
    try {
      if (finishingLink) {
        await signInWithEmailLink(auth, email, window.location.href)
        saveEmail('')
        window.history.replaceState(null, '', '/admin')
      } else {
        await sendSignInLinkToEmail(auth, email, { url: `${window.location.origin}/admin`, handleCodeInApp: true })
        saveEmail(email)
        setSent(true)
      }
    } catch (e2) {
      setErr(e2.message)
    }
  }

  return (
    <div className="card admin-login">
      <h2>Organizer sign in</h2>
      {sent ? (
        <p className="muted">Check your email for a sign-in link. Open it on this same device.</p>
      ) : (
        <div className="form">
          {!finishingLink && (
            <>
              <button type="button" className="btn btn-primary" onClick={google}>Sign in with Google</button>
              <p className="muted small">or get a sign-in link by email:</p>
            </>
          )}
          <form className="form" onSubmit={onSubmit}>
            <label>
              {finishingLink ? 'Confirm the email you used' : 'Email'}
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <button className="btn btn-ghost">{finishingLink ? 'Finish signing in' : 'Email me a sign-in link'}</button>
          </form>
          {err && <p className="form-note is-error">{err}</p>}
        </div>
      )}
    </div>
  )
}

export default function Admin() {
  const [user, setUser] = useState(undefined) // undefined = still checking
  const [isAdmin, setIsAdmin] = useState(null)
  const [tab, setTab] = useState('inbox')
  const [finishingLink, setFinishingLink] = useState(false)

  useEffect(() => {
    if (!auth) return
    const unsub = onAuthStateChanged(auth, setUser)
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const saved = readSavedEmail()
      if (saved) {
        signInWithEmailLink(auth, saved, window.location.href)
          .then(() => {
            saveEmail('')
            window.history.replaceState(null, '', '/admin')
          })
          .catch(() => setFinishingLink(true))
      } else {
        setFinishingLink(true) // opened the link on a different device
      }
    }
    return unsub
  }, [])

  useEffect(() => {
    if (!user) return setIsAdmin(null)
    getDoc(doc(db, 'admins', user.uid))
      .then((snap) => setIsAdmin(snap.exists()))
      .catch(() => setIsAdmin(false))
  }, [user])

  let body
  if (!isFirebaseConfigured) {
    body = (
      <div className="card">
        <h2>Connect Firebase first</h2>
        <p className="muted">
          Add your Firebase web app settings (the <code>VITE_FIREBASE_…</code> values) to <code>.env.local</code>, then
          restart <code>npm run dev</code>. The README walks you through it.
        </p>
      </div>
    )
  } else if (user === undefined) {
    body = <p className="muted">Loading…</p>
  } else if (!user) {
    body = <Login finishingLink={finishingLink} />
  } else if (isAdmin === null) {
    body = <p className="muted">Checking access…</p>
  } else if (!isAdmin) {
    body = (
      <div className="card">
        <h2>Not an organizer yet</h2>
        <p className="muted">
          You're signed in as {user.email}, but this account isn't on the organizer list. In the Firebase console, open
          Firestore Database, create a collection called <code>admins</code>, and add a document whose ID is your user ID:
        </p>
        <p><code className="uid">{user.uid}</code></p>
        <div className="btn-row">
          <button className="btn btn-ghost btn-sm" onClick={() => navigator.clipboard?.writeText(user.uid)}>Copy user ID</button>
          <button className="btn btn-ghost btn-sm" onClick={() => signOut(auth)}>Sign out</button>
        </div>
      </div>
    )
  } else {
    const Active = TABS.find(([k]) => k === tab)[2]
    body = (
      <>
        <div className="admin-bar">
          <div className="admin-tabs" role="tablist">
            {TABS.map(([k, label]) => (
              <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'active' : ''} onClick={() => setTab(k)}>
                {label}
              </button>
            ))}
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => signOut(auth)}>Sign out</button>
        </div>
        <Active />
      </>
    )
  }

  return (
    <section className="section admin">
      <div className="container">
        <p className="eyebrow">Organizer tools</p>
        <h1 className="admin-title">Club admin</h1>
        {body}
      </div>
    </section>
  )
}
