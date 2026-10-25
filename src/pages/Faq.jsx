import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import { MessageForm, NewsletterForm } from '../components/Forms.jsx'
import { useSettings } from '../lib/settings.jsx'
import GroupCode from '../components/GroupCode.jsx'

export default function Faq() {
  const { settings } = useSettings()
  const FAQS = [
    ['Is it really free?', 'Yes. Membership and every walk are free, and they always will be.'],
    ['Who can join?', <>Anyone: locals, visitors, every age and every fitness level. Download Sirkl and join our group with code <GroupCode inline />.</>],
    ['Do I need the Sirkl app?', <>Yes. Sirkl is how we post walks and take RSVPs. In the app, join our group with code <GroupCode inline /> to see the calendar and save your spot. The newsletter is a lighter way to keep up.</>],
    ['Who do I contact about joining?', <><strong>{settings.point_of_contact}</strong> is the club's point of contact. Send a message using the <a href="#contact">contact form</a> below and it will reach the organizers.</>],
    ['How long are the walks?', <>Most cover between one and four miles depending on the route, at a relaxed, social pace. See the <Link to="/routes">route maps</Link> for distances.</>],
    ['How often do you walk?', `${settings.walks_per_week} times a week, mornings and evenings. Check Sirkl for this week's schedule.`],
    ['Can I bring my kids?', 'Families are welcome. Children should be with a parent or guardian, who is responsible for them during the walk.'],
    ['What if it is too hot or the weather is bad?', <>We move to cooler times in summer and may cancel during excessive-heat warnings or bad weather. Any change goes out in Sirkl. See our <Link to="/walks">heat schedule</Link>.</>],
    ['Is it accessible?', <>Most routes are fully paved and use pedestrian bridges with elevators. Message the walk leader in Sirkl ahead of time and we'll help plan. <Link to="/first-walk">More details</Link>.</>],
    ["I'm only visiting. Can I come?", <>Absolutely! Visitors are some of our favorite walkers. See the <Link to="/visiting-vegas">visitor guide</Link>.</>],
    ['How do I become a walk leader?', 'Come to a few walks, then tell the organizer you are interested. We love new leaders, especially for extra morning walks.'],
  ]

  return (
    <>
      <PageHeader eyebrow="FAQ & contact" title="Questions?">
        The answers to what people ask us most. Still stuck? Send us a message.
      </PageHeader>

      <section className="section pt-0">
        <div className="container faq">
          {FAQS.map(([q, a]) => (
            <details key={q} className="card">
              <summary>{q}</summary>
              <div className="muted">{a}</div>
            </details>
          ))}
        </div>
      </section>

      <section className="section section-alt" id="contact">
        <div className="container split">
          <div>
            <p className="eyebrow">Contact</p>
            <h2>Say hello</h2>
            <p className="muted">
              <strong>{settings.point_of_contact}</strong> is our point of contact for joining the club. Questions, ideas,
              press or a group booking? Send us a message here or email{' '}
              <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a>.
            </p>
            <div className="card newsletter-card">
              <h3>Monthly newsletter</h3>
              <p className="muted small">A short recap of walks, milestones and news. No spam, unsubscribe any time.</p>
              <NewsletterForm source="faq" />
            </div>
          </div>
          <MessageForm kind="contact" submitLabel="Send message" />
        </div>
      </section>
    </>
  )
}
