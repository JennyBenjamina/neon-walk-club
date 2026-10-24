import { useState } from 'react'
import { collection, deleteDoc, doc, getDocs, limit, orderBy, query, updateDoc } from 'firebase/firestore/lite'
import { db } from '../../lib/firebase.js'
import { useQuery, rows, toDate } from '../../lib/useQuery.js'

const KINDS = { all: 'All', contact: 'Contact', partner: 'Partners', spotlight: 'Nominations', merch: 'Merch interest' }

export default function Inbox() {
  const [kind, setKind] = useState('all')
  const { data: all, loading, reload } = useQuery(
    'inbox',
    async (db) => rows(await getDocs(query(collection(db, 'messages'), orderBy('created_at', 'desc'), limit(500)))),
    [],
  )
  const data = kind === 'all' ? all : all.filter((m) => m.kind === kind)

  async function toggleRead(m) {
    await updateDoc(doc(db, 'messages', m.id), { is_read: !m.is_read })
    reload()
  }
  async function remove(m) {
    if (!window.confirm('Delete this message?')) return
    await deleteDoc(doc(db, 'messages', m.id))
    reload()
  }

  const merch = all.filter((m) => m.kind === 'merch')
  const tally = merch.reduce((acc, m) => {
    const k = `${m.meta?.item || 'Any item'} · ${m.meta?.size || 'no size'}`
    acc[k] = (acc[k] || 0) + 1
    return acc
  }, {})

  return (
    <div className="admin-panel">
      <div className="pill-row">
        {Object.entries(KINDS).map(([k, label]) => (
          <button key={k} className={`pill ${kind === k ? 'active' : ''}`} onClick={() => setKind(k)}>{label}</button>
        ))}
      </div>
      {kind === 'merch' && merch.length > 0 && (
        <div className="card">
          <h3>Merch interest tally</h3>
          <ul className="tally">
            {Object.entries(tally).sort((a, b) => b[1] - a[1]).map(([k, n]) => (
              <li key={k}><span>{k}</span><strong>{n}</strong></li>
            ))}
          </ul>
        </div>
      )}
      {loading && <p className="muted">Loading…</p>}
      {!loading && data.length === 0 && <p className="muted">No messages yet.</p>}
      <div className="admin-list">
        {data.map((m) => (
          <article key={m.id} className={`card msg ${m.is_read ? 'is-read' : ''}`}>
            <header>
              <span className="tag">{KINDS[m.kind] || m.kind}</span>
              <strong>{m.name || 'No name'}</strong>
              <a href={`mailto:${m.email}`}>{m.email}</a>
              <time className="muted small">{toDate(m.created_at)?.toLocaleString()}</time>
            </header>
            {m.meta && Object.values(m.meta).some(Boolean) && (
              <dl className="meta">
                {Object.entries(m.meta).filter(([, v]) => v).map(([k, v]) => (
                  <div key={k}><dt>{k}</dt><dd>{String(v)}</dd></div>
                ))}
              </dl>
            )}
            {m.body && <p>{m.body}</p>}
            <div className="btn-row">
              <button className="btn btn-ghost btn-sm" onClick={() => toggleRead(m)}>{m.is_read ? 'Mark unread' : 'Mark read'}</button>
              <a className="btn btn-ghost btn-sm" href={`mailto:${m.email}?subject=Re: Neon Walk Club`}>Reply</a>
              <button className="btn btn-danger btn-sm" onClick={() => remove(m)}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
