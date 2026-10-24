import { useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import { useQuery } from '../../lib/useQuery.js'

const KINDS = { all: 'All', contact: 'Contact', partner: 'Partners', spotlight: 'Nominations', merch: 'Merch interest' }

export default function Inbox() {
  const [kind, setKind] = useState('all')
  const { data, loading, reload } = useQuery(
    `inbox-${kind}`,
    (sb) => {
      let q = sb.from('messages').select('*').order('created_at', { ascending: false }).limit(500)
      if (kind !== 'all') q = q.eq('kind', kind)
      return q
    },
    [],
  )

  async function toggleRead(m) {
    await supabase.from('messages').update({ is_read: !m.is_read }).eq('id', m.id)
    reload()
  }
  async function remove(m) {
    if (!window.confirm('Delete this message?')) return
    await supabase.from('messages').delete().eq('id', m.id)
    reload()
  }

  const merch = data.filter((m) => m.kind === 'merch')
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
              <time className="muted small">{new Date(m.created_at).toLocaleString()}</time>
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
