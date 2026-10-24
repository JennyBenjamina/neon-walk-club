import { useState } from 'react'
import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp, updateDoc } from 'firebase/firestore/lite'
import { db } from '../../lib/firebase.js'
import { useQuery, rows } from '../../lib/useQuery.js'

const EMPTY = { name: '', perk: '', address: '', url: '' }

export default function PartnersAdmin() {
  const { data, reload } = useQuery(
    'admin-partners',
    async (db) => rows(await getDocs(collection(db, 'partners'))).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [],
  )
  const [form, setForm] = useState(EMPTY)
  const [err, setErr] = useState('')
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  async function add(e) {
    e.preventDefault()
    try {
      await addDoc(collection(db, 'partners'), {
        name: form.name,
        perk: form.perk,
        address: form.address || null,
        url: form.url || null,
        is_active: true,
        sort_order: data.length,
        created_at: serverTimestamp(),
      })
      setErr('')
      setForm(EMPTY)
      reload()
    } catch (e2) {
      setErr(e2.message)
    }
  }
  async function toggle(p) {
    await updateDoc(doc(db, 'partners', p.id), { is_active: !p.is_active })
    reload()
  }
  async function remove(p) {
    if (!window.confirm(`Delete ${p.name}?`)) return
    await deleteDoc(doc(db, 'partners', p.id))
    reload()
  }

  return (
    <div className="admin-panel">
      <form className="card form" onSubmit={add}>
        <h3>Add a partner</h3>
        <div className="form-row">
          <label>Business name<input required value={form.name} onChange={set('name')} /></label>
          <label>Perk<input required value={form.perk} onChange={set('perk')} placeholder="10% off drinks after a walk" /></label>
        </div>
        <div className="form-row">
          <label>Address<input value={form.address} onChange={set('address')} /></label>
          <label>Website<input type="url" value={form.url} onChange={set('url')} placeholder="https://" /></label>
        </div>
        <button className="btn btn-primary">Add partner</button>
        {err && <p className="form-note is-error">{err}</p>}
      </form>
      <div className="admin-list">
        {data.map((p) => (
          <article key={p.id} className="card admin-item">
            <div>
              <strong>{p.name}</strong> {!p.is_active && <span className="tag">hidden</span>}
              <p className="muted small">{p.perk}{p.address ? ` · ${p.address}` : ''}</p>
            </div>
            <div className="btn-row">
              <button className="btn btn-ghost btn-sm" onClick={() => toggle(p)}>{p.is_active ? 'Hide' : 'Show'}</button>
              <button className="btn btn-danger btn-sm" onClick={() => remove(p)}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
