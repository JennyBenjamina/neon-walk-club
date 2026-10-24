import { useState } from 'react'
import { supabase, photoUrl, GALLERY_BUCKET } from '../../lib/supabase.js'
import { useQuery } from '../../lib/useQuery.js'

export default function GalleryAdmin() {
  const { data, reload } = useQuery('admin-gallery', (sb) => sb.from('gallery_photos').select('*').order('created_at', { ascending: false }), [])
  const [caption, setCaption] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  async function upload(e) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setBusy(true)
    setErr('')
    for (const file of files) {
      const ext = file.name.split('.').pop().toLowerCase()
      const path = `walks/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
      const { error: upErr } = await supabase.storage.from(GALLERY_BUCKET).upload(path, file, { cacheControl: '31536000' })
      if (upErr) { setErr(upErr.message); continue }
      const { error } = await supabase.from('gallery_photos').insert({ storage_path: path, caption: caption || null })
      if (error) setErr(error.message)
    }
    e.target.value = ''
    setCaption('')
    setBusy(false)
    reload()
  }

  async function remove(p) {
    if (!window.confirm('Delete this photo?')) return
    await supabase.storage.from(GALLERY_BUCKET).remove([p.storage_path])
    await supabase.from('gallery_photos').delete().eq('id', p.id)
    reload()
  }

  async function saveCaption(p, value) {
    await supabase.from('gallery_photos').update({ caption: value || null }).eq('id', p.id)
  }

  return (
    <div className="admin-panel">
      <div className="card form">
        <h3>Upload photos</h3>
        <p className="muted small">Only post photos where everyone pictured is happy to be on the website.</p>
        <label>
          Caption (optional, applied to this upload)
          <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="e.g. Holiday lights walk" />
        </label>
        <label className="btn btn-primary file-btn">
          {busy ? 'Uploading…' : 'Choose photos'}
          <input type="file" accept="image/*" multiple onChange={upload} disabled={busy} hidden />
        </label>
        {err && <p className="form-note is-error">{err}</p>}
      </div>
      <div className="gallery admin-gallery">
        {data.map((p) => (
          <div key={p.id} className="card admin-photo">
            <img src={photoUrl(p.storage_path)} alt={p.caption || ''} />
            <input defaultValue={p.caption || ''} placeholder="Caption" onBlur={(e) => saveCaption(p, e.target.value)} />
            <button className="btn btn-danger btn-sm" onClick={() => remove(p)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}
