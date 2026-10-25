import PageHeader from '../components/PageHeader.jsx'
import { MessageForm } from '../components/Forms.jsx'
import { usePartners } from '../lib/content.js'
import { WalkerMark } from '../components/Logo.jsx'

const TEES = [
  { name: 'Classic Neon Tee', bg: '#0a0612', fg: 'var(--pink)' },
  { name: 'Sunrise Walker Tee', bg: '#2a1240', fg: 'var(--amber)' },
  { name: 'Night Shift Hoodie', bg: '#05232a', fg: 'var(--cyan)' },
]

export default function Perks() {
  const { data: partners } = usePartners()
  return (
    <>
      <PageHeader eyebrow="Perks & merch" title="Perks for walkers" color="amber">
        Local spots that love walkers, plus club gear so people can spot you on the Strip.
      </PageHeader>

      <section className="section pt-0">
        <div className="container">
          <h2>Partner perks</h2>
          <p className="muted measure">Show your Neon Walk Club membership in Sirkl at these partners to claim the perk.</p>
          {partners.length ? (
            <div className="grid grid-3">
              {partners.map((p) => (
                <article className="card partner" key={p.id}>
                  <h3>{p.name}</h3>
                  <p className="partner-perk neon-amber">{p.perk}</p>
                  {p.address && <p className="muted small">{p.address}</p>}
                  {p.url && <a className="text-link small" href={p.url} target="_blank" rel="noreferrer">Visit website →</a>}
                </article>
              ))}
            </div>
          ) : (
            <div className="card empty-state">
              <h3>First partners coming soon</h3>
              <p className="muted">We're lining up cafés, shops and restaurants on and near the Strip. Check back soon.</p>
            </div>
          )}
        </div>
      </section>

      <section className="section section-alt">
        <div className="container split">
          <div>
            <p className="eyebrow">For businesses</p>
            <h2>Become a partner</h2>
            <p className="muted">
              {`Hundreds of local walkers pass your door every week. Offer a small perk, like a discount on coffee after a walk, and we'll feature you here and tell our members.`}
            </p>
          </div>
          <MessageForm
            kind="partner"
            fields={[
              { name: 'business', label: 'Business name' },
              { name: 'perk', label: 'Perk you would offer', placeholder: 'e.g. 10% off drinks after a walk' },
            ]}
            bodyLabel="Anything else?"
            submitLabel="Send partner inquiry"
            successMessage="Thanks! We'll be in touch soon."
          />
        </div>
      </section>

      <section className="section" id="merch">
        <div className="container">
          <p className="eyebrow">Merch</p>
          <h2>Club gear is coming</h2>
          <p className="muted measure">Tell us what you'd wear and in what size. We'll order based on interest so nothing goes to waste.</p>
          <div className="grid grid-3 merch-grid">
            {TEES.map((t) => (
              <div className="card merch" key={t.name}>
                <div className="tee" style={{ '--tee': t.bg, '--ink': t.fg }}>
                  <svg viewBox="0 0 200 200" aria-hidden="true">
                    <path d="M60 20 L30 35 L10 70 L38 84 L45 70 L45 185 L155 185 L155 70 L162 84 L190 70 L170 35 L140 20 Q100 45 60 20 Z" fill="var(--tee)" stroke="rgba(255,255,255,.18)" strokeWidth="2" />
                  </svg>
                  <div className="tee-print"><WalkerMark size={30} /><span>NEON WALK CLUB</span></div>
                </div>
                <h3>{t.name}</h3>
                <p className="muted small">Price to be announced</p>
              </div>
            ))}
          </div>
          <div className="merch-form">
            <MessageForm
              kind="merch"
              fields={[
                { name: 'item', label: 'Which item?', options: TEES.map((t) => t.name) },
                { name: 'size', label: 'Size', options: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'] },
              ]}
              bodyLabel="Ideas or requests (optional)"
              submitLabel="Count me in"
              successMessage="Noted! We'll email you when merch is ready."
            />
          </div>
        </div>
      </section>
    </>
  )
}
