import { useState } from 'react'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore/lite'
import { db } from '../../lib/firebase.js'
import { useSettings, SETTING_LABELS, SETTINGS_DOC } from '../../lib/settings.jsx'

export default function SettingsAdmin() {
  const { settings, reload } = useSettings()
  const [values, setValues] = useState(settings)
  const [msg, setMsg] = useState('')

  async function save(e) {
    e.preventDefault()
    const data = Object.fromEntries(Object.keys(SETTING_LABELS).map((k) => [k, (values[k] || '').trim()]))
    try {
      await setDoc(doc(db, ...SETTINGS_DOC), { ...data, updated_at: serverTimestamp() }, { merge: true })
      setMsg('Saved! The site uses the new values right away.')
      reload()
    } catch (err) {
      setMsg(err.message)
    }
  }

  return (
    <form className="card form admin-panel" onSubmit={save}>
      <h3>Site settings</h3>
      <p className="muted small">
        When Sirkl gives you an embed code, copy only the URL inside <code>src="…"</code> into the calendar field.
      </p>
      {Object.entries(SETTING_LABELS).map(([key, label]) => (
        <label key={key}>
          {label}
          <input value={values[key] || ''} onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))} />
        </label>
      ))}
      <button className="btn btn-primary">Save settings</button>
      {msg && <p className="form-note is-ok">{msg}</p>}
    </form>
  )
}
