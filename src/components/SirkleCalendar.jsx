import { useSettings } from '../lib/settings.jsx'
import JoinButton from './JoinButton.jsx'

/**
 * Shows the live Sirkle calendar when an embed URL is set (in /admin -> Settings,
 * or VITE_SIRKLE_CALENDAR_EMBED_URL). There's no second calendar to keep updated:
 * Sirkle stays the single source of truth.
 */
export default function SirkleCalendar({ height = 640 }) {
  const { settings } = useSettings()
  const src = settings.sirkle_calendar_embed_url

  if (src) {
    return (
      <div className="calendar-embed card">
        <iframe src={src} title="Neon Walk Club walk calendar on Sirkle" height={height} loading="lazy" />
        <div className="calendar-foot">
          <span className="muted small">Live from Sirkle. RSVP there to save your spot.</span>
          <JoinButton className="btn btn-ghost btn-sm">Open in Sirkle</JoinButton>
        </div>
      </div>
    )
  }

  return (
    <div className="calendar-placeholder card">
      <div className="cal-grid" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, i) => (
          <span key={i} className={[1, 3, 4, 6, 8, 10, 11, 13].includes(i) ? 'lit' : ''} />
        ))}
      </div>
      <div>
        <h3>Our live calendar lives on Sirkle</h3>
        <p className="muted">
          We walk {settings.walks_per_week} times a week. Every walk, with its time, meeting spot and route, is posted
          in the Sirkle app, where you can RSVP in one tap.
        </p>
        <JoinButton>See upcoming walks on Sirkle</JoinButton>
      </div>
    </div>
  )
}
