import { Link } from 'react-router-dom'
import { useSettings } from '../lib/settings.jsx'
import GroupCode from './GroupCode.jsx'

/**
 * One-line reminder shown wherever someone is about to join:
 * the Sirkl group code plus who to contact with questions.
 */
export default function JoinHelp({ showCode = true, className = '' }) {
  const { settings } = useSettings()
  return (
    <p className={`join-help ${className}`}>
      {showCode && settings.sirkl_group_code && (
        <>
          Join on Sirkl with group code <GroupCode inline />.{' '}
        </>
      )}
      {settings.point_of_contact && (
        <>
          Questions? <strong>{settings.point_of_contact}</strong> is our point of contact.{' '}
          <Link to="/faq#contact">Get in touch</Link>
        </>
      )}
    </p>
  )
}
