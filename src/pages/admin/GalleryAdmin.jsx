import { useState } from 'react'
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore/lite'
import { db } from '../../lib/firebase.js'
import { useQuery, rows } from '../../lib/useQuery.js'
import { deletePhoto, uploadPhoto } from '../../lib/photos.js'

export default function GalleryAdmin() {
  const { data, reload } = useQuery(
    'admin-gallery',
    async (db) => rows(await getDocs(query(collection(db, 'gallery_photos'), orderBy('created_at', 'desc')))),
    [],
  )
  const [caption, setCaption] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  async function upload(e) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setBusy(true)
    setErr('')
    for (const file of files) {
      try {
        const { path, url } = await uploadPhoto(file, 'walks')
        await addDoc(collection(db, 'gallery_photos'), {
          storage_path: path,
          url,
          caption: caption || null,
          sort_order: 0,
          created_at: serverTimestamp(),
        })
      } catch (e2) {
        setErr(e2.message)
      }
    }
    e.target.value = ''
    setCaption('')
    setBusy(false)
    reload()
  }

  async function remove(p) {
    if (!window.confirm('Delete this photo?')) return
    await deletePhoto(p.storage_path)
    await deleteDoc(doc(db, 'gallery_photos', p.id))
    reload()
  }

  async function saveCaption(p, value) {
    await updateDoc(doc(db, 'gallery_photos', p.id), { caption: value || null })
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
            <img src={p.url} alt={p.caption || ''} />
            <input defaultValue={p.caption || ''} placeholder="Caption" onBlur={(e) => saveCaption(p, e.target.value)} />
            <button className="btn btn-danger btn-sm" onClick={() => remove(p)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}
