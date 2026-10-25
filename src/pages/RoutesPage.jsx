import { useSearchParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import RouteMap from '../components/RouteMap.jsx'
import { useRoutes } from '../lib/content.js'
import { pathMiles, walkMinutes } from '../lib/geo.js'

export default function RoutesPage() {
  const { data: routes } = useRoutes()
  const [params, setParams] = useSearchParams()
  const selected = params.get('r') || routes[0]?.slug
  const select = (slug) => setParams({ r: slug }, { replace: true })
  const active = routes.find((r) => r.slug === selected) || routes[0]

  return (
    <>
      <PageHeader eyebrow="Route maps" title="Our routes" color="cyan">
        Our regular routes, from the classic Center Strip loop to the full sign-to-Sahara challenge. Each walk in Sirkl
        lists which route we're taking.
      </PageHeader>

      <section className="section pt-0">
        <div className="container routes-layout">
          <div className="route-list" role="list">
            {routes.map((r) => {
              const miles = pathMiles(r.path)
              return (
                <button
                  key={r.slug}
                  role="listitem"
                  className={`route-item card ${r.slug === active?.slug ? 'is-active' : ''}`}
                  style={{ '--c': r.color }}
                  onClick={() => select(r.slug)}
                  aria-pressed={r.slug === active?.slug}
                >
                  <span className="chip-line" />
                  <span className="route-item-head">
                    <strong>{r.name}</strong>
                    <span className="muted small">{r.area}</span>
                  </span>
                  <span className="route-meta">
                    <span>{miles.toFixed(1)} mi one way</span>
                    <span>~{walkMinutes(miles)} min</span>
                  </span>
                </button>
              )
            })}
          </div>

          <div className="route-detail">
            {routes.length > 0 && <RouteMap routes={routes} selected={active?.slug} onSelect={select} />}
            {active && (
              <div className="card route-info" style={{ '--c': active.color }}>
                <h2>{active.name}</h2>
                <p className="muted">{active.description}</p>
                <div className="route-stats">
                  <div><strong>{pathMiles(active.path).toFixed(1)} mi</strong><span>one way</span></div>
                  <div><strong>{(pathMiles(active.path) * 2).toFixed(1)} mi</strong><span>out and back</span></div>
                  <div><strong>~{walkMinutes(pathMiles(active.path))} min</strong><span>one way at about 3 mph</span></div>
                </div>
                {active.highlights?.length > 0 && (
                  <>
                    <h3>Highlights along the way</h3>
                    <ul className="tag-list">
                      {active.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  </>
                )}
                <p className="small muted">Routes are approximate. Always follow the walk leader and use crosswalks and pedestrian bridges.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
