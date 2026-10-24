import { useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import { MessageForm } from '../components/Forms.jsx'
import { MILESTONES } from '../data/fallback.js'
import { useGallery, useSpotlights } from '../lib/content.js'
import { photoUrl } from '../lib/supabase.js'
import { WalkerMark } from '../components/Logo.jsx'

export default function Community() {
  const { data: photos } = useGallery()
  const { data: spotlights } = useSpotlights()
  const [lightbox, setLightbox] = useState(null)

  return (
    <>
      <PageHeader eyebrow="Community" title="Faces of the club" color="violet">
        Photos from our walks, members worth celebrating, and the milestones we hit along the way.
      </PageHeader>

      <section className="section pt-0">
        <div className="container">
          <h2>Photo gallery</h2>
          {photos.length === 0 ? (
            <div className="gallery">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={`photo-ph ph-${i % 4}`}>
                  {i === 0 && <span>Walk photos coming soon</span>}
                </div>
              ))}
            </div>
          ) : (
            <div className="gallery">
              {photos.map((p) => (
                <button key={p.id} className="gallery-item" onClick={() => setLightbox(p)}>
                  <img src={photoUrl(p.storage_path)} alt={p.caption || 'Neon Walk Club walk photo'} loading="lazy" />
                  {p.caption && <span className="gallery-cap">{p.caption}</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {lightbox && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo" onClick={() => setLightbox(null)}>
          <figure onClick={(e) => e.stopPropagation()}>
            <img src={photoUrl(lightbox.storage_path)} alt={lightbox.caption || 'Walk photo'} />
            {lightbox.caption && <figcaption>{lightbox.caption}</figcaption>}
            <button className="btn btn-ghost btn-sm" onClick={() => setLightbox(null)}>Close</button>
          </figure>
        </div>
      )}

      <section className="section section-alt">
        <div className="container">
          <p className="eyebrow">Member spotlights</p>
          <h2>Walkers worth celebrating</h2>
          <div className="grid grid-3">
            {spotlights.map((s) => (
              <article className="card spotlight" key={s.id}>
                {s.photo_path ? (
                  <img className="avatar" src={photoUrl(s.photo_path)} alt={s.name} />
                ) : (
                  <div className="avatar avatar-ph"><WalkerMark size={44} /></div>
                )}
                <h3>{s.name}</h3>
                {s.walk_count ? <p className="neon-pink small strong">{s.walk_count} walks</p> : null}
                {s.quote && <blockquote>“{s.quote}”</blockquote>}
              </article>
            ))}
            {spotlights.length === 0 && (
              <article className="card spotlight spotlight-empty">
                <div className="avatar avatar-ph"><WalkerMark size={44} /></div>
                <h3>Your story here</h3>
                <p className="muted">Our first member spotlights are on the way. Know someone who deserves one? Nominate them below.</p>
              </article>
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow">Milestones</p>
          <h2>Light up the leaderboard</h2>
          <p className="muted measure">
            Every walk you RSVP to and attend in Sirkle counts. Hit a milestone and we'll celebrate you on a walk and on
            this page.
          </p>
          <div className="milestones">
            {MILESTONES.map((m) => (
              <div className="milestone" key={m.walks} style={{ '--c': m.color }}>
                <span className="milestone-ring">{m.walks}</span>
                <strong>{m.name}</strong>
                <span className="muted small">{m.walks === 1 ? 'first walk' : `${m.walks} walks`}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt" id="nominate">
        <div className="container split">
          <div>
            <p className="eyebrow">Nominate a walker</p>
            <h2>Know someone who shines?</h2>
            <p className="muted">
              Maybe they never miss a sunrise walk, they welcome every newcomer, or they just hit a big milestone. Tell us
              about them. You can nominate yourself too!
            </p>
          </div>
          <MessageForm
            kind="spotlight"
            fields={[{ name: 'nominee', label: "Who are you nominating?", placeholder: 'Their name' }]}
            bodyLabel="Why should we spotlight them?"
            submitLabel="Send nomination"
            successMessage="Thanks! We'll reach out before featuring anyone."
          />
        </div>
      </section>
    </>
  )
}
