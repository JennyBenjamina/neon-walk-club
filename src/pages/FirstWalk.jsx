import PageHeader from '../components/PageHeader.jsx'
import JoinButton from '../components/JoinButton.jsx'
import GroupCode from '../components/GroupCode.jsx'
import JoinHelp from '../components/JoinHelp.jsx'

const BRING = [
  ['👟', 'Comfortable shoes', 'Broken-in sneakers. The Strip is longer than it looks.'],
  ['💧', 'Water', 'A refillable bottle, year-round. In summer bring more than you think you need.'],
  ['🧢', 'Sun protection', 'Hat, sunglasses and sunscreen for daytime walks.'],
  ['📱', 'A charged phone', 'For photos, for Sirkl updates, and to find the group if you are running late.'],
  ['🪪', 'ID + a little cash/card', 'Handy if we stop for a coffee or a snack afterwards.'],
  ['🧥', 'A light layer', 'Winter evenings in the desert get chilly once the sun goes down.'],
]

const SAFETY = [
  ['Stay with the group', 'The leader sets the pace and route. If you need to stop or leave early, let someone know.'],
  ['Cross the right way', 'Use crosswalks and the pedestrian bridges. Wait for the signal; Strip traffic is heavy.'],
  ['Heat is serious', 'Drink before you are thirsty. Watch for dizziness, nausea or headache, and stop and get cool if they appear.'],
  ['Keep the sidewalk moving', 'Walk two abreast at most, step aside for photos, and keep space for other pedestrians.'],
  ['Watch your stuff', 'Crowds attract pickpockets. Use a zipped bag or a front pocket.'],
  ['Be kind', 'Everyone is welcome here. No harassment, no pressure and no judgment about pace or fitness.'],
]

export default function FirstWalk() {
  return (
    <>
      <PageHeader eyebrow="New here?" title="Your first walk" color="amber">
        Everything you need to know before you show up, from what to bring to how to find us.
      </PageHeader>

      <section className="section pt-0" id="join">
        <div className="container split">
          <div className="card">
            <p className="eyebrow">Step one</p>
            <h2>Join us on Sirkl</h2>
            <ol className="check-list">
              <li>Download the free <strong>Sirkl</strong> app from the App Store or Google Play.</li>
              <li>
                In Sirkl, join a group by code and enter ours:
                <GroupCode />
              </li>
              <li>Browse the calendar and RSVP to a walk that suits you.</li>
              <li>Turn on notifications so you see last-minute changes.</li>
            </ol>
            <JoinButton />
            <JoinHelp showCode={false} />
          </div>
          <div className="card">
            <p className="eyebrow">On the day</p>
            <h2>Finding the group</h2>
            <ul className="check-list">
              <li>The exact meeting spot is in each Sirkl walk listing.</li>
              <li>Arrive 5–10 minutes early; we usually head off on time.</li>
              <li>Look for the walk leader and say hi. Tell them it's your first walk!</li>
              <li>Running late? Comment on the walk in Sirkl and we'll tell you where we are.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <p className="eyebrow">Packing list</p>
          <h2>What to bring</h2>
          <div className="grid grid-3">
            {BRING.map(([icon, title, text]) => (
              <div className="card" key={title}>
                <div className="card-icon" aria-hidden="true">{icon}</div>
                <h3>{title}</h3>
                <p className="muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <p className="eyebrow">Pace & distance</p>
            <h2>Every pace is welcome</h2>
            <p className="muted">
              Our walks are social, not races. Most cover somewhere between one and four miles depending on the route,
              and each walk listing says which route we're taking. We regroup at crossings so no one gets left behind.
            </p>
          </div>
          <div>
            <p className="eyebrow">Accessibility</p>
            <h2>Strollers & mobility aids</h2>
            <p className="muted">
              The Strip's sidewalks are wide and most pedestrian bridges have elevators or escalators. Elevators are
              sometimes out of service, so if you need step-free access, message the walk leader in Sirkl before the walk
              and we'll plan around it.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-alt" id="safety">
        <div className="container">
          <p className="eyebrow">Safety & conduct</p>
          <h2>Our walk rules</h2>
          <div className="grid grid-3">
            {SAFETY.map(([title, text], i) => (
              <div className="card rule-card" key={title}>
                <span className="rule-num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p className="muted">{text}</p>
              </div>
            ))}
          </div>
          <p className="small muted disclaimer">
            Participation is voluntary and at your own risk. Check with your doctor if you have health concerns about
            walking in heat or over longer distances. In an emergency, call 911.
          </p>
        </div>
      </section>
    </>
  )
}
