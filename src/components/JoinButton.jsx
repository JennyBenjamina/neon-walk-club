import { Link } from 'react-router-dom'
import { useSettings } from '../lib/settings.jsx'
import { trackEvent } from '../lib/analytics.js'

export default function JoinButton({ children = 'Join us on Sirkl', className = 'btn btn-primary' }) {
  const { settings } = useSettings()
  const track = () => trackEvent('join_sirkl_click', { button_text: typeof children === 'string' ? children : 'Join' })
  if (settings.sirkle_join_url) {
    return (
      <a className={className} href={settings.sirkle_join_url} target="_blank" rel="noreferrer" onClick={track}>
        {children}
      </a>
    )
  }
  // No invite link yet: send people to the how-to-join instructions instead.
  return (
    <Link className={className} to="/first-walk#join" onClick={track}>
      {children}
    </Link>
  )
}
