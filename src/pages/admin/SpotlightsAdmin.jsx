import { useState } from 'react'
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore/lite'
import { db } from '../../lib/firebase.js'
import { useQuery, rows } from '../../lib/useQuery.js'
import { deletePhoto, uploadPhoto } from '../../lib/photos.js'

const EMPTY = { name: '', walk_count: '', quote: '' }

export default function SpotlightsAdmin() {
  const { data, reload } = useQuery(
    'admin-spotlights',
    async (db) => rows(await getDocs(query(collection(db, 'spotlights'), orderBy('created_at', 'desc')))),
    [],
  )
  const [form, setForm] = useState(EMPTY)
  const [file, setFile] = useState(null)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  async function add(e) {
    e.preventDefault()
    const formEl = e.currentTarget
    setErr('')
    setBusy(true)
    try {
      const photo = file ? await uploadPhoto(file, 'spotlights') : null
      await addDoc(collection(db, 'spotlights'), {
        name: form.name,
        walk_count: form.walk_count ? Number(form.walk_count) : null,
        quote: form.quote || null,
        photo_path: photo?.path || null,
        photo_url: photo?.url || null,
        is_published: true,
        created_at: serverTimestamp(),
      })
      setForm(EMPTY)
      setFile(null)
      formEl.reset()
      reload()
    } catch (e2) {
      setErr(e2.message)
    }
    setBusy(false)
  }

  async function toggle(s) {
    await updateDoc(doc(db, 'spotlights', s.id), { is_published: !s.is_published })
    reload()
  }
  async function remove(s) {
    if (!window.confirm(`Delete spotlight for ${s.name}?`)) return
    await deletePhoto(s.photo_path)
    await deleteDoc(doc(db, 'spotlights', s.id))
    reload()
  }

  return (
    <div className="admin-panel">
      <form className="card form" onSubmit={add}>
        <h3>Add a spotlight</h3>
        <p className="muted small">Get the member's OK before featuring them.</p>
        <div className="form-row">
          <label>Name<input required value={form.name} onChange={set('name')} /></label>
          <label>Walks attended<input type="number" min="0" value={form.walk_count} onChange={set('walk_count')} /></label>
        </div>
        <label>Quote<textarea rows={3} value={form.quote} onChange={set('quote')} placeholder="What do they love about the club?" /></label>
        <label>Photo (optional)<input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} /></label>
        <button className="btn btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Add spotlight'}</button>
        {err && <p className="form-note is-error">{err}</p>}
      </form>
      <div className="admin-list">
        {data.map((s) => (
          <article key={s.id} className="card admin-item">
            {s.photo_url && <img className="avatar" src={s.photo_url} alt="" />}
            <div>
              <strong>{s.name}</strong> {s.walk_count ? <span className="muted">· {s.walk_count} walks</span> : null}
              {!s.is_published && <span className="tag">hidden</span>}
              {s.quote && <p className="muted small">“{s.quote}”</p>}
            </div>
            <div className="btn-row">
              <button className="btn btn-ghost btn-sm" onClick={() => toggle(s)}>{s.is_published ? 'Hide' : 'Publish'}</button>
              <button className="btn btn-danger btn-sm" onClick={() => remove(s)}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
