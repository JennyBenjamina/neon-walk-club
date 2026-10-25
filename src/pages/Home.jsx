import { Link } from 'react-router-dom'
import JoinButton from '../components/JoinButton.jsx'
import CountUp from '../components/CountUp.jsx'
import GroupCode from '../components/GroupCode.jsx'
import Skyline from '../components/Skyline.jsx'
import SirkleCalendar from '../components/SirkleCalendar.jsx'
import { useSettings } from '../lib/settings.jsx'
import { useGallery, useRoutes } from '../lib/content.js'
import { pathMiles } from '../lib/geo.js'

export default function Home() {
  const { settings } = useSettings()
  const { data: routes } = useRoutes()
  const { data: photos } = useGallery(6)

  return (
    <>
      <section className="hero">
        <div className="hero-glow" aria-hidden="true" />
        <div className="container hero-inner">
          <p className="eyebrow">Las Vegas Strip · Free · Open to everyone</p>
          <h1 className="hero-title">
            <span className="neon-pink flicker">Walk</span> <span className="neon-cyan">the Strip</span>
            <br />
            <span className="hero-sub">with us.</span>
          </h1>
          <p className="lead">
            Neon Walk Club is a free community of {settings.member_count}+ walkers exploring the Las Vegas Strip together
            {' '}{settings.walks_per_week} times a week. No membership fees and no pressure. Just good company and a lot of
            bright lights.
          </p>
          <div className="btn-row">
            <JoinButton />
            <Link className="btn btn-ghost" to="/first-walk">Your first walk →</Link>
          </div>
        </div>
        <Skyline />
      </section>

      <section className="stats-band">
        <div className="container stats">
          <div className="stat"><CountUp className="neon-pink" value={`${settings.member_count}+`} /><span>members</span></div>
          <div className="stat"><CountUp className="neon-cyan" value={settings.walks_per_week} delay={150} /><span>walks a week</span></div>
          <div className="stat"><CountUp className="neon-amber" value="$0" delay={300} /><span>forever free</span></div>
          <div className="stat"><CountUp className="neon-violet" value={routes.length} delay={450} /><span>signature routes</span></div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow">How it works</p>
          <h2>Three steps to your first walk</h2>
          <ol className="steps">
            <li className="card">
              <span className="step-num neon-pink">1</span>
              <h3>Get Sirkl</h3>
              <p className="muted">Download the free Sirkl app. It's where our calendar and RSVPs live.</p>
            </li>
            <li className="card">
              <span className="step-num neon-cyan">2</span>
              <h3>Join the club</h3>
              <p className="muted">Join our group with code <GroupCode inline />. Membership is free and open to anyone.</p>
            </li>
            <li className="card">
              <span className="step-num neon-amber">3</span>
              <h3>Show up and walk</h3>
              <p className="muted">RSVP to a walk, meet the group at the posted spot, and enjoy the lights.</p>
            </li>
          </ol>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Upcoming walks</p>
              <h2>What's on this week</h2>
            </div>
            <Link to="/walks" className="text-link">All walk info →</Link>
          </div>
          <SirkleCalendar height={520} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Routes</p>
              <h2>Where we walk</h2>
            </div>
            <Link to="/routes" className="text-link">See the maps →</Link>
          </div>
          <div className="route-chips">
            {routes.map((r) => (
              <Link key={r.slug} to={`/routes?r=${r.slug}`} className="route-chip card" style={{ '--c': r.color }}>
                <span className="chip-line" />
                <strong>{r.name}</strong>
                <span className="muted small">{r.area} · {pathMiles(r.path).toFixed(1)} mi</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container split">
          <div>
            <p className="eyebrow">Visiting Vegas?</p>
            <h2>Tourists welcome. Seriously.</h2>
            <p className="muted">
              In town for a few days? Join a walk and see the Strip with people who know it: the best photo spots, the
              shortcuts through the resorts, and where to find shade.
            </p>
            <Link className="btn btn-ghost" to="/visiting-vegas">Visitor guide</Link>
          </div>
          <div className="photo-mosaic">
            {(photos.length ? photos.slice(0, 4) : [0, 1, 2, 3]).map((p, i) =>
              p.url ? (
                <img key={p.id} src={p.url} alt={p.caption || 'Neon Walk Club walk'} loading="lazy" />
              ) : (
                <div key={i} className={`photo-ph ph-${i}`} aria-hidden="true" />
              ),
            )}
          </div>
        </div>
      </section>

      <section className="section cta-band">
        <div className="container cta-inner">
          <h2 className="neon-title neon-pink">Lace up. Light up.</h2>
          <p className="lead">Your first walk is free. So is every one after that.</p>
          <JoinButton />
        </div>
      </section>
    </>
  )
}
