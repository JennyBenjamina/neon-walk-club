import { useState } from 'react'
import { collection, doc, getDocs, updateDoc, writeBatch } from 'firebase/firestore/lite'
import { db, pathFromFirestore, pathToFirestore } from '../../lib/firebase.js'
import { useQuery, rows } from '../../lib/useQuery.js'
import { pathMiles } from '../../lib/geo.js'
import { FALLBACK_ROUTES } from '../../data/fallback.js'

export default function RoutesAdmin() {
  const { data, loading, reload } = useQuery(
    'admin-routes',
    async (db) =>
      rows(await getDocs(collection(db, 'routes')))
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map((r) => ({ ...r, path: pathFromFirestore(r.path) })),
    [],
  )
  const [busy, setBusy] = useState(false)

  async function save(r, patch) {
    await updateDoc(doc(db, 'routes', r.id), patch)
    reload()
  }

  async function loadStarters() {
    setBusy(true)
    const batch = writeBatch(db)
    FALLBACK_ROUTES.forEach((r, i) => {
      batch.set(doc(db, 'routes', r.slug), {
        ...r,
        path: pathToFirestore(r.path),
        sort_order: i + 1,
        is_published: true,
      })
    })
    await batch.commit()
    setBusy(false)
    reload()
  }

  return (
    <div className="admin-panel">
      <p className="muted small">
        Edit names, descriptions and highlights here. To change the line drawn on the map, edit the route's{' '}
        <code>path</code> in the Firebase console (Firestore → routes). It's a list of points with <code>lat</code> and{' '}
        <code>lng</code>.
      </p>
      {!loading && data.length === 0 && (
        <div className="card">
          <h3>No routes saved yet</h3>
          <p className="muted">The site is showing the five built-in starter routes. Load them into Firestore so you can edit them here.</p>
          <button className="btn btn-primary" onClick={loadStarters} disabled={busy}>{busy ? 'Loading…' : 'Load starter routes'}</button>
        </div>
      )}
      <div className="admin-list">
        {data.map((r) => (
          <article key={r.id} className="card form route-admin" style={{ '--c': r.color }}>
            <div className="admin-row">
              <strong><span className="dot" /> {r.name}</strong>
              <span className="muted small">{pathMiles(r.path).toFixed(1)} mi · {r.is_published ? 'published' : 'hidden'}</span>
            </div>
            <label>Name<input defaultValue={r.name} onBlur={(e) => e.target.value !== r.name && save(r, { name: e.target.value })} /></label>
            <label>Description<textarea rows={2} defaultValue={r.description || ''} onBlur={(e) => save(r, { description: e.target.value })} /></label>
            <label>
              Highlights (comma separated)
              <input
                defaultValue={(r.highlights || []).join(', ')}
                onBlur={(e) => save(r, { highlights: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
              />
            </label>
            <div className="btn-row">
              <label className="inline">Color <input type="color" defaultValue={r.color} onChange={(e) => save(r, { color: e.target.value })} /></label>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => save(r, { is_published: !r.is_published })}>
                {r.is_published ? 'Hide route' : 'Publish route'}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
