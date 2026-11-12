import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import { useSettings } from '../lib/settings.jsx'
import { LEGAL_UPDATED } from './Privacy.jsx'

export default function Terms() {
  const { settings } = useSettings()
  const email = <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a>

  return (
    <>
      <PageHeader eyebrow="Legal" title="Terms of Use" color="violet">
        The ground rules for using this website and walking with us.
      </PageHeader>

      <section className="section pt-0">
        <div className="container legal">
          <p className="muted small">Last updated: {LEGAL_UPDATED}</p>

          <p>
            By using this website or joining a Neon Walk Club walk, you agree to these terms. If you don't
            agree, please don't use the site or join the walks.
          </p>

          <h2>About the club</h2>
          <p>
            Neon Walk Club is a free, volunteer-run community walking group. We are not a business, and we are
            not affiliated with the Sirkl app, or with any of the resorts, casinos or businesses along our
            routes unless we say so.
          </p>

          <h2>Walking at your own risk</h2>
          <ul>
            <li>
              Walking is physical activity, and the Strip has real hazards: heat, traffic, crowds, uneven
              ground, stairs and escalators. By joining a walk, you accept these risks and take part at your
              own risk.
            </li>
            <li>
              You are responsible for your own health and safety. Check with a doctor before starting a new
              exercise routine if you have any health concerns, and bring water.
            </li>
            <li>
              Walk leaders are volunteers. They are not medical, fitness or security professionals. In an
              emergency, call 911.
            </li>
            <li>
              Children are welcome with a parent or guardian, who is responsible for them throughout the walk.
            </li>
            <li>
              Follow traffic laws, posted rules and staff instructions on private property, and the{' '}
              <Link to="/first-walk#safety">safety tips</Link> on our first-walk page.
            </li>
          </ul>

          <h2>Be kind</h2>
          <p>
            Everyone is welcome. Harassment, discrimination, or behavior that puts other walkers at risk isn't.
            Organizers may ask anyone to leave a walk or the group.
          </p>

          <h2>Information on this site</h2>
          <ul>
            <li>
              Routes, distances, times and meeting spots are approximate and can change. Walks may be moved or
              cancelled, for example for heat or weather. The Sirkl app always has the current schedule.
            </li>
            <li>
              Partner perks are offered by those businesses, not by us, and can change or end at any time.
            </li>
            <li>
              Links to other websites and apps are for convenience. We aren't responsible for their content.
            </li>
          </ul>

          <h2>Things you send us</h2>
          <p>
            When you send us a spotlight story, photo or other content, you keep ownership of it, and you give
            us permission to share it on this site and on the club's social media. Only send things you have
            the right to share. Ask us at any time and we'll take it down.
          </p>

          <h2>Photos from walks</h2>
          <p>
            We sometimes take photos on walks and share them. If you'd rather not appear, tell the walk leader
            or email us. See our <Link to="/privacy">Privacy Policy</Link> for more.
          </p>

          <h2>No warranties</h2>
          <p>
            This website is provided "as is." We do our best to keep it accurate and online, but we can't
            promise it always will be. To the fullest extent allowed by law, Neon Walk Club and its volunteers
            are not liable for any loss, injury or damage arising from your use of this website or your
            participation in walks.
          </p>

          <h2>Changes</h2>
          <p>
            We may update these terms. When we do, we'll change the date at the top of this page. These terms
            are governed by the laws of the State of Nevada.
          </p>

          <h2>Contact</h2>
          <p>
            Questions? Email {email} or use the <Link to="/faq#contact">contact form</Link>.
          </p>
        </div>
      </section>
    </>
  )
}
