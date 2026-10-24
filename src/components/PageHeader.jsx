export default function PageHeader({ eyebrow, title, children, color = 'pink' }) {
  return (
    <section className="page-header">
      <div className="container">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className={`neon-title neon-${color}`}>{title}</h1>
        {children && <p className="lead">{children}</p>}
      </div>
    </section>
  )
}
