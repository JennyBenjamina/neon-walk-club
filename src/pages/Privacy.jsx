import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import { useSettings } from '../lib/settings.jsx'

export const LEGAL_UPDATED = 'October 25, 2026'

export default function Privacy() {
  const { settings } = useSettings()
  const email = <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a>

  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy Policy" color="cyan">
        What this website collects, why, and what you can do about it.
      </PageHeader>

      <section className="section pt-0">
        <div className="container legal">
          <p className="muted small">Last updated: {LEGAL_UPDATED}</p>

          <p>
            Neon Walk Club is a free, volunteer-run walking group on the Las Vegas Strip. This policy covers
            this website. We keep it short because we collect very little.
          </p>

          <h2>What we collect</h2>
          <ul>
            <li>
              <strong>Newsletter sign-ups:</strong> your email address, which form you used and when you
              signed up.
            </li>
            <li>
              <strong>Messages you send us:</strong> through the contact form and the other forms on the site
              (partner inquiries, spotlight stories, merch interest). This is your name, email address, your
              message and any extra details the form asks for.
            </li>
            <li>
              <strong>Website usage, through Google Analytics:</strong> which pages are viewed, which buttons
              are clicked (such as "Join on Sirkl" or copying the group code), roughly where visitors are (city
              level), what kind of device and browser they use, and how they found the site. Google Analytics
              uses cookies to do this. It does not give us your name or email address.
            </li>
            <li>
              <strong>Organizer sign-in:</strong> when club organizers sign in to manage the site, we store the
              email address of the account they sign in with.
            </li>
          </ul>

          <h2>What we don't do</h2>
          <ul>
            <li>We don't sell or rent your information to anyone.</li>
            <li>We don't show ads, and we don't take payments on this site.</li>
            <li>
              Walk sign-ups and RSVPs happen in the <strong>Sirkl</strong> app, not on this website. Sirkl's
              own privacy policy covers anything you share there.
            </li>
          </ul>

          <h2>How we use it</h2>
          <ul>
            <li>To send the newsletter you signed up for.</li>
            <li>To read and reply to your messages.</li>
            <li>To understand which pages are useful, so we can improve the site.</li>
          </ul>

          <h2>Who else handles it</h2>
          <p>
            The site runs on Google Firebase, which hosts the pages and stores newsletter sign-ups and
            messages. Usage statistics are processed by Google Analytics. Both are Google services that handle
            this data on our behalf. We may also share information if the law requires it.
          </p>

          <h2>Photos from walks</h2>
          <p>
            We sometimes take photos on walks and share them on this site and on social media. If you'd rather
            not appear, tell the walk leader on the day, or email us and we'll take the photo down.
          </p>

          <h2>Your choices</h2>
          <ul>
            <li><strong>Unsubscribe</strong> from the newsletter at any time by emailing us.</li>
            <li><strong>Ask us to see or delete</strong> the information we hold about you by emailing {email}.</li>
            <li>
              <strong>Opt out of Google Analytics</strong> with Google's{' '}
              <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noreferrer">opt-out browser add-on</a>,
              or by blocking cookies in your browser. The site works fine either way.
            </li>
          </ul>

          <h2>How long we keep it</h2>
          <p>
            We keep newsletter emails until you unsubscribe, and messages for as long as we need them to reply
            and follow up. Google Analytics deletes its detailed usage data automatically after a limited
            period.
          </p>

          <h2>Children</h2>
          <p>
            This website isn't aimed at children under 13, and we don't knowingly collect their information.
            If you think a child has sent us their details, email us and we'll delete them.
          </p>

          <h2>Security</h2>
          <p>
            Only club organizers can read sign-ups and messages, and the data is protected by Google's
            security. No system is perfect, though, so please don't send us anything sensitive through the
            forms.
          </p>

          <h2>Changes</h2>
          <p>
            If we change this policy, we'll update the date at the top of this page.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about your privacy? Email {email} or use the <Link to="/faq#contact">contact form</Link>.
            See also our <Link to="/terms">Terms of Use</Link>.
          </p>
        </div>
      </section>
    </>
  )
}
