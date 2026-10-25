import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import JoinButton from '../components/JoinButton.jsx'
import GroupCode from '../components/GroupCode.jsx'

const TIPS = [
  ['Distances are deceiving', "Resorts are enormous. The one that looks next door can be a 20-minute walk. Our route maps show real distances."],
  ['Shortcuts through the resorts', 'Many casinos and malls connect indoors, which is a lifesaver in the heat or wind. Walk with us and we will show you.'],
  ['Hydrate like you mean it', 'The desert air is very dry. Carry water even on cool days.'],
  ['Comfortable shoes beat cute shoes', 'Locals can spot a tourist by the blisters. Save the dress shoes for dinner.'],
  ['Use the bridges', 'You cross most big Strip intersections on pedestrian bridges, not at street level. Follow the signs.'],
  ['Go at night at least once', 'The Strip is a different place after dark. Our evening walks are the most photogenic.'],
]

export default function Visitors() {
  return (
    <>
      <PageHeader eyebrow="Visiting Las Vegas?" title="Walk with the locals" color="cyan">
        In town for a weekend or a conference? You're welcome on any walk, even just one. It's free, there's no commitment,
        and it's one of the best ways to see the Strip.
      </PageHeader>

      <section className="section pt-0">
        <div className="container split">
          <div className="card">
            <h2>Joining for a single walk</h2>
            <ol className="check-list">
              <li>Get Sirkl and join our group with code <GroupCode inline /> (it takes a minute).</li>
              <li>Pick a walk on a day you're in town and RSVP.</li>
              <li>Meet us at the posted spot. Tell the leader you're visiting!</li>
              <li>Leave the club in Sirkl when you head home, or stay for next time.</li>
            </ol>
            <div className="btn-row">
              <JoinButton />
              <Link className="btn btn-ghost" to="/routes">See routes</Link>
            </div>
          </div>
          <div className="card highlight-card">
            <p className="eyebrow">Why walk with us</p>
            <ul className="check-list">
              <li>The best photo stops, including the famous Welcome sign.</li>
              <li>Safe, simple routes with a group that knows the way.</li>
              <li>Recommendations from locals on where to eat and what to skip.</li>
              <li>A friendly crowd: solo travelers are especially welcome.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <p className="eyebrow">Local tips</p>
          <h2>Walking the Strip like a pro</h2>
          <div className="grid grid-3">
            {TIPS.map(([title, text]) => (
              <div className="card" key={title}>
                <h3>{title}</h3>
                <p className="muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
