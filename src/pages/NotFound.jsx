import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="section page-header">
      <div className="container">
        <h1 className="neon-title neon-pink flicker">404</h1>
        <p className="lead">This stretch of the Strip doesn't exist. Let's get you back on route.</p>
        <Link className="btn btn-primary" to="/">Back home</Link>
      </div>
    </section>
  )
}
