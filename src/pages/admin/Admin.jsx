import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase.js'
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

function Login() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState('')
  async function onSubmit(e) {
    e.preventDefault()
    setErr('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/admin`, shouldCreateUser: true },
    })
    if (error) setErr(error.message)
    else setSent(true)
  }
  return (
    <div className="card admin-login">
      <h2>Organizer sign in</h2>
      {sent ? (
        <p className="muted">Check your email for a sign-in link.</p>
      ) : (
        <form className="form" onSubmit={onSubmit}>
          <label>
            Email
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <button className="btn btn-primary">Email me a sign-in link</button>
          {err && <p className="form-note is-error">{err}</p>}
        </form>
      )}
    </div>
  )
}

export default function Admin() {
  const [session, setSession] = useState(null)
  const [isAdmin, setIsAdmin] = useState(null)
  const [tab, setTab] = useState('inbox')

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) return setIsAdmin(null)
    supabase.rpc('is_admin').then(({ data }) => setIsAdmin(Boolean(data)))
  }, [session])

  let body
  if (!isSupabaseConfigured) {
    body = (
      <div className="card">
        <h2>Connect Supabase first</h2>
        <p className="muted">
          Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to <code>.env.local</code>, then restart{' '}
          <code>npm run dev</code>. The README walks you through it.
        </p>
      </div>
    )
  } else if (!session) {
    body = <Login />
  } else if (isAdmin === null) {
    body = <p className="muted">Checking access…</p>
  } else if (!isAdmin) {
    body = (
      <div className="card">
        <h2>Not an organizer yet</h2>
        <p className="muted">
          You're signed in as {session.user.email}, but this account isn't on the organizer list. Add it in Supabase (see
          README, "Make yourself an organizer").
        </p>
        <button className="btn btn-ghost" onClick={() => supabase.auth.signOut()}>Sign out</button>
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
          <button className="btn btn-ghost btn-sm" onClick={() => supabase.auth.signOut()}>Sign out</button>
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
