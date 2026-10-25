import { Link } from 'react-router-dom'
import { useSettings } from '../lib/settings.jsx'

export default function JoinButton({ children = 'Join us on Sirkl', className = 'btn btn-primary' }) {
  const { settings } = useSettings()
  if (settings.sirkle_join_url) {
    return (
      <a className={className} href={settings.sirkle_join_url} target="_blank" rel="noreferrer">
        {children}
      </a>
    )
  }
  // No invite link yet: send people to the how-to-join instructions instead.
  return (
    <Link className={className} to="/first-walk#join">
      {children}
    </Link>
  )
}
