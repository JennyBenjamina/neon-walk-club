import { useState } from 'react'
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore/lite'
import { db } from '../lib/firebase.js'
import { useSettings } from '../lib/settings.jsx'

function NotConnected({ email }) {
  return (
    <p className="form-note">
      Online forms aren't switched on yet. Email us at <a href={`mailto:${email}`}>{email}</a> in the meantime.
    </p>
  )
}

function Status({ status }) {
  if (status.state === 'idle' || status.state === 'sending') return null
  return (
    <p className={`form-note ${status.state === 'error' ? 'is-error' : 'is-ok'}`} role="status">
      {status.message}
    </p>
  )
}

export function NewsletterForm({ source = 'site', compact = false }) {
  const { settings } = useSettings()
  const [email, setEmail] = useState('')
  const [hp, setHp] = useState('')
  const [status, setStatus] = useState({ state: 'idle', message: '' })

  async function onSubmit(e) {
    e.preventDefault()
    if (hp) return // bot trap
    if (!db) return setStatus({ state: 'error', message: 'Newsletter sign-ups open soon.' })
    setStatus({ state: 'sending' })
    const clean = email.trim().toLowerCase()
    try {
      // The email is the document ID, so each address can only sign up once.
      await setDoc(doc(db, 'newsletter_subscribers', clean), { email: clean, source, created_at: serverTimestamp() })
      setStatus({ state: 'ok', message: "You're in! Watch your inbox." })
      setEmail('')
    } catch (err) {
      // Security rules reject a second sign-up for the same address.
      if (err?.code === 'permission-denied') {
        setStatus({ state: 'ok', message: "You're on the list. See you out there!" })
        setEmail('')
      } else {
        setStatus({ state: 'error', message: 'Something went wrong. Please try again.' })
      }
    }
  }

  return (
    <form className={`form ${compact ? 'form-inline' : ''}`} onSubmit={onSubmit}>
      <label className="sr-only" htmlFor={`nl-${source}`}>Email address</label>
      <input
        id={`nl-${source}`}
        type="email"
        required
        maxLength={254}
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input className="hp" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} aria-hidden="true" />
      <button className="btn btn-ghost" disabled={status.state === 'sending'}>
        {status.state === 'sending' ? 'Adding…' : 'Subscribe'}
      </button>
      {!db && compact ? null : <Status status={status} />}
      {!db && !compact && <NotConnected email={settings.contact_email} />}
    </form>
  )
}

/**
 * Generic message form that writes to the `messages` collection.
 * kind: 'contact' | 'partner' | 'spotlight' | 'merch'
 */
export function MessageForm({ kind, fields = [], bodyLabel = 'Message', bodyPlaceholder = '', submitLabel = 'Send', successMessage = 'Thanks! We got your message.' }) {
  const { settings } = useSettings()
  const [values, setValues] = useState({ name: '', email: '', body: '' })
  const [hp, setHp] = useState('')
  const [status, setStatus] = useState({ state: 'idle', message: '' })
  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }))

  async function onSubmit(e) {
    e.preventDefault()
    if (hp) return
    if (!db) return setStatus({ state: 'error', message: 'Online forms open soon.' })
    setStatus({ state: 'sending' })
    const meta = {}
    for (const f of fields) meta[f.name] = (values[f.name] || '').slice(0, 200) || null
    try {
      await addDoc(collection(db, 'messages'), {
        kind,
        name: values.name.trim().slice(0, 120) || null,
        email: values.email.trim().toLowerCase(),
        body: values.body.trim() || null,
        meta,
        is_read: false,
        created_at: serverTimestamp(),
      })
      setStatus({ state: 'ok', message: successMessage })
      setValues({ name: '', email: '', body: '' })
    } catch {
      setStatus({ state: 'error', message: 'Something went wrong. Please try again or email us.' })
    }
  }

  return (
    <form className="form card" onSubmit={onSubmit}>
      <div className="form-row">
        <label>
          Name
          <input value={values.name} onChange={set('name')} autoComplete="name" maxLength={120} />
        </label>
        <label>
          Email
          <input type="email" required value={values.email} onChange={set('email')} autoComplete="email" maxLength={254} />
        </label>
      </div>
      {fields.map((f) => (
        <label key={f.name}>
          {f.label}
          {f.options ? (
            <select value={values[f.name] || ''} onChange={set(f.name)}>
              <option value="">Choose…</option>
              {f.options.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          ) : (
            <input value={values[f.name] || ''} onChange={set(f.name)} placeholder={f.placeholder} maxLength={200} />
          )}
        </label>
      ))}
      <label>
        {bodyLabel}
        <textarea rows={4} value={values.body} onChange={set('body')} placeholder={bodyPlaceholder} maxLength={4000} />
      </label>
      <input className="hp" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} aria-hidden="true" />
      <button className="btn btn-primary" disabled={status.state === 'sending'}>
        {status.state === 'sending' ? 'Sending…' : submitLabel}
      </button>
      <Status status={status} />
      {!db && <NotConnected email={settings.contact_email} />}
    </form>
  )
}
