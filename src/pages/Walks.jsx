import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import SirkleCalendar from '../components/SirkleCalendar.jsx'
import JoinButton from '../components/JoinButton.jsx'
import GroupCode from '../components/GroupCode.jsx'
import JoinHelp from '../components/JoinHelp.jsx'
import { WALK_TYPES } from '../data/fallback.js'
import { useSettings } from '../lib/settings.jsx'

export default function Walks() {
  const { settings } = useSettings()
  return (
    <>
      <PageHeader eyebrow="Walk calendar" title="Upcoming walks">
        {settings.walks_per_week} walks every week. Times, meeting spots and routes are posted live in Sirkl. Tap any walk
        to RSVP.
      </PageHeader>

      <section className="section pt-0">
        <div className="container">
          <SirkleCalendar />
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <p className="eyebrow">Themed walks</p>
          <h2>More than a stroll</h2>
          <div className="grid grid-3">
            {WALK_TYPES.map((w) => (
              <div className="card" key={w.name}>
                <div className="card-icon" aria-hidden="true">{w.icon}</div>
                <h3>{w.name}</h3>
                <p className="muted">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div className="card heat-card">
            <p className="eyebrow neon-amber">Summer heat schedule</p>
            <h2>We beat the heat</h2>
            <p className="muted">
              Las Vegas summers regularly climb past 105°F. From roughly June through September we shift to early-morning
              and later-evening walks, and we cancel or shorten walks during excessive-heat warnings. Any change is posted
              in Sirkl first.
            </p>
            <Link className="text-link" to="/first-walk#safety">Heat safety tips →</Link>
          </div>
          <div>
            <p className="eyebrow">How to RSVP</p>
            <h2>Save your spot</h2>
            <ol className="check-list">
              <li>First time? Join our group in the Sirkl app with code <GroupCode inline />.</li>
              <li>Open Neon Walk Club in the Sirkl app.</li>
              <li>Pick a walk on the calendar.</li>
              <li>Tap to RSVP so the leader knows to look for you.</li>
              <li>Can't make it after all? Un-RSVP so the headcount stays accurate.</li>
            </ol>
            <JoinButton />
            <JoinHelp showCode={false} />
          </div>
        </div>
      </section>
    </>
  )
}
