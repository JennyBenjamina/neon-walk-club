import { collection, deleteDoc, doc, getDocs, orderBy, query } from 'firebase/firestore/lite'
import { db } from '../../lib/firebase.js'
import { useQuery, rows, toDate } from '../../lib/useQuery.js'

export default function Subscribers() {
  const { data, loading, reload } = useQuery(
    'subscribers',
    async (db) => rows(await getDocs(query(collection(db, 'newsletter_subscribers'), orderBy('created_at', 'desc')))),
    [],
  )

  function exportCsv() {
    const out = [['email', 'source', 'signed_up'], ...data.map((s) => [s.email, s.source || '', toDate(s.created_at)?.toISOString() || ''])]
    const csv = out.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const a = Object.assign(document.createElement('a'), { href: url, download: 'neon-walk-club-subscribers.csv' })
    a.click()
    URL.revokeObjectURL(url)
  }

  async function remove(s) {
    if (!window.confirm(`Remove ${s.email}?`)) return
    await deleteDoc(doc(db, 'newsletter_subscribers', s.id))
    reload()
  }

  return (
    <div className="admin-panel">
      <div className="admin-row">
        <p><strong>{data.length}</strong> subscribers</p>
        <button className="btn btn-primary btn-sm" onClick={exportCsv} disabled={!data.length}>Download CSV</button>
      </div>
      <p className="muted small">Import the CSV into your email tool (Mailchimp, Buttondown, etc.) to send the newsletter.</p>
      {loading ? <p className="muted">Loading…</p> : (
        <table className="table">
          <thead><tr><th>Email</th><th>Source</th><th>Signed up</th><th /></tr></thead>
          <tbody>
            {data.map((s) => (
              <tr key={s.id}>
                <td>{s.email}</td>
                <td className="muted">{s.source}</td>
                <td className="muted">{toDate(s.created_at)?.toLocaleDateString()}</td>
                <td><button className="btn btn-danger btn-sm" onClick={() => remove(s)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
