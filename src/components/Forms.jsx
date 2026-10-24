import { useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { useSettings } from '../lib/settings.jsx'

function useSubmit() {
  const [status, setStatus] = useState({ state: 'idle', message: '' })
  return [status, setStatus]
}

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
  const [status, setStatus] = useSubmit()

  async function onSubmit(e) {
    e.preventDefault()
    if (hp) return // bot trap
    if (!supabase) return setStatus({ state: 'error', message: 'Newsletter sign-ups open soon.' })
    setStatus({ state: 'sending' })
    const { error } = await supabase.from('newsletter_subscribers').insert({ email: email.trim().toLowerCase(), source })
    if (error && error.code !== '23505') {
      setStatus({ state: 'error', message: 'Something went wrong. Please try again.' })
    } else {
      setStatus({ state: 'ok', message: error ? "You're already on the list. See you out there!" : "You're in! Watch your inbox." })
      setEmail('')
    }
  }

  return (
    <form className={`form ${compact ? 'form-inline' : ''}`} onSubmit={onSubmit}>
      <label className="sr-only" htmlFor={`nl-${source}`}>Email address</label>
      <input
        id={`nl-${source}`}
        type="email"
        required
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input className="hp" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} aria-hidden="true" />
      <button className="btn btn-ghost" disabled={status.state === 'sending'}>
        {status.state === 'sending' ? 'Adding…' : 'Subscribe'}
      </button>
      {!supabase && compact ? null : <Status status={status} />}
      {!supabase && !compact && <NotConnected email={settings.contact_email} />}
    </form>
  )
}

/**
 * Generic message form that writes to the `messages` table.
 * kind: 'contact' | 'partner' | 'spotlight' | 'merch'
 */
export function MessageForm({ kind, fields = [], bodyLabel = 'Message', bodyPlaceholder = '', submitLabel = 'Send', successMessage = 'Thanks! We got your message.' }) {
  const { settings } = useSettings()
  const [values, setValues] = useState({ name: '', email: '', body: '' })
  const [hp, setHp] = useState('')
  const [status, setStatus] = useSubmit()
  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }))

  async function onSubmit(e) {
    e.preventDefault()
    if (hp) return
    if (!supabase) return setStatus({ state: 'error', message: 'Online forms open soon.' })
    setStatus({ state: 'sending' })
    const meta = {}
    for (const f of fields) meta[f.name] = values[f.name] || null
    const { error } = await supabase.from('messages').insert({
      kind,
      name: values.name.trim() || null,
      email: values.email.trim(),
      body: values.body.trim() || null,
      meta,
    })
    if (error) setStatus({ state: 'error', message: 'Something went wrong. Please try again or email us.' })
    else {
      setStatus({ state: 'ok', message: successMessage })
      setValues({ name: '', email: '', body: '' })
    }
  }

  return (
    <form className="form card" onSubmit={onSubmit}>
      <div className="form-row">
        <label>
          Name
          <input value={values.name} onChange={set('name')} autoComplete="name" />
        </label>
        <label>
          Email
          <input type="email" required value={values.email} onChange={set('email')} autoComplete="email" />
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
            <input value={values[f.name] || ''} onChange={set(f.name)} placeholder={f.placeholder} />
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
      {!supabase && <NotConnected email={settings.contact_email} />}
    </form>
  )
}
