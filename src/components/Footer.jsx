import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'
import { NewsletterForm } from './Forms.jsx'
import { useSettings } from '../lib/settings.jsx'

export default function Footer() {
  const { settings } = useSettings()
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Logo size={34} />
          <p className="muted footer-tag">
            Free group walks on the Las Vegas Strip. Open to everyone, every week.
          </p>
          <p className="muted small">
            <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a>
            {settings.instagram_url && (
              <>
                {' · '}
                <a href={settings.instagram_url} target="_blank" rel="noreferrer">Instagram</a>
              </>
            )}
          </p>
        </div>
        <div className="footer-links">
          <h3>Explore</h3>
          <Link to="/walks">Walk calendar</Link>
          <Link to="/routes">Route maps</Link>
          <Link to="/first-walk">Your first walk</Link>
          <Link to="/first-walk#safety">Safety & conduct</Link>
          <Link to="/visiting-vegas">Visiting Vegas</Link>
        </div>
        <div className="footer-links">
          <h3>Club</h3>
          <Link to="/community">Photos & spotlights</Link>
          <Link to="/perks">Perks & partners</Link>
          <Link to="/perks#merch">Merch</Link>
          <Link to="/faq">FAQ & contact</Link>
        </div>
        <div>
          <h3>Get the newsletter</h3>
          <p className="muted small">Not ready for the app? Get a short monthly recap of walks and news.</p>
          <NewsletterForm source="footer" compact />
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Neon Walk Club</span>
        <span>Walk at your own pace. Hydrate. Have fun.</span>
      </div>
    </footer>
  )
}
