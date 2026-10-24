import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Logo from './Logo.jsx'
import JoinButton from './JoinButton.jsx'

const NAV = [
  ['/walks', 'Walks'],
  ['/routes', 'Routes'],
  ['/first-walk', 'First Walk'],
  ['/visiting-vegas', 'Visiting Vegas'],
  ['/community', 'Community'],
  ['/perks', 'Perks & Merch'],
  ['/faq', 'FAQ'],
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => setOpen(false), [pathname])

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label="Neon Walk Club home">
          <Logo size={38} />
        </Link>
        <button
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="sr-only">Menu</span>
          <span className="bars" aria-hidden="true" />
        </button>
        <nav id="site-nav" className={`site-nav ${open ? 'open' : ''}`} aria-label="Main">
          {NAV.map(([to, label]) => (
            <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'active' : undefined)}>
              {label}
            </NavLink>
          ))}
          <JoinButton className="btn btn-primary btn-sm">Join free</JoinButton>
        </nav>
      </div>
    </header>
  )
}
