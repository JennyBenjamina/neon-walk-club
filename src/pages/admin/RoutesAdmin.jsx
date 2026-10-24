import { supabase } from '../../lib/supabase.js'
import { useQuery } from '../../lib/useQuery.js'
import { pathMiles } from '../../lib/geo.js'

export default function RoutesAdmin() {
  const { data, reload } = useQuery('admin-routes', (sb) => sb.from('routes').select('*').order('sort_order'), [])

  async function save(r, patch) {
    await supabase.from('routes').update(patch).eq('id', r.id)
    reload()
  }

  return (
    <div className="admin-panel">
      <p className="muted small">
        Edit names, descriptions and highlights here. To change the line drawn on the map, edit the route's{' '}
        <code>path</code> in Supabase (Table Editor → routes). It's a list of [latitude, longitude] points.
      </p>
      {data.length === 0 && <p className="muted">No routes in the database yet. Run supabase/seed.sql to add the starter routes.</p>}
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
