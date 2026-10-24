import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Walks from './pages/Walks.jsx'
import RoutesPage from './pages/RoutesPage.jsx'
import FirstWalk from './pages/FirstWalk.jsx'
import Visitors from './pages/Visitors.jsx'
import Community from './pages/Community.jsx'
import Perks from './pages/Perks.jsx'
import Faq from './pages/Faq.jsx'
import Admin from './pages/admin/Admin.jsx'
import NotFound from './pages/NotFound.jsx'

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/walks" element={<Walks />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/first-walk" element={<FirstWalk />} />
          <Route path="/visiting-vegas" element={<Visitors />} />
          <Route path="/community" element={<Community />} />
          <Route path="/perks" element={<Perks />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
