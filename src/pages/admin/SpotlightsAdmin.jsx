import { useState } from 'react'
import { supabase, photoUrl, GALLERY_BUCKET } from '../../lib/supabase.js'
import { useQuery } from '../../lib/useQuery.js'

const EMPTY = { name: '', walk_count: '', quote: '' }

export default function SpotlightsAdmin() {
  const { data, reload } = useQuery('admin-spotlights', (sb) => sb.from('spotlights').select('*').order('created_at', { ascending: false }), [])
  const [form, setForm] = useState(EMPTY)
  const [file, setFile] = useState(null)
  const [err, setErr] = useState('')
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  async function add(e) {
    e.preventDefault()
    setErr('')
    let photo_path = null
    if (file) {
      const path = `spotlights/${Date.now()}-${file.name.replace(/[^a-z0-9.]+/gi, '-')}`
      const { error } = await supabase.storage.from(GALLERY_BUCKET).upload(path, file)
      if (error) return setErr(error.message)
      photo_path = path
    }
    const { error } = await supabase.from('spotlights').insert({
      name: form.name,
      walk_count: form.walk_count ? Number(form.walk_count) : null,
      quote: form.quote || null,
      photo_path,
    })
    if (error) return setErr(error.message)
    setForm(EMPTY)
    setFile(null)
    e.target.reset()
    reload()
  }

  async function toggle(s) {
    await supabase.from('spotlights').update({ is_published: !s.is_published }).eq('id', s.id)
    reload()
  }
  async function remove(s) {
    if (!window.confirm(`Delete spotlight for ${s.name}?`)) return
    if (s.photo_path) await supabase.storage.from(GALLERY_BUCKET).remove([s.photo_path])
    await supabase.from('spotlights').delete().eq('id', s.id)
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
        <button className="btn btn-primary">Add spotlight</button>
        {err && <p className="form-note is-error">{err}</p>}
      </form>
      <div className="admin-list">
        {data.map((s) => (
          <article key={s.id} className="card admin-item">
            {s.photo_path && <img className="avatar" src={photoUrl(s.photo_path)} alt="" />}
            <div>
              <strong>{s.name}</strong> {s.walk_count ? <span className="muted">· {s.walk_count} walks</span> : null}
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
