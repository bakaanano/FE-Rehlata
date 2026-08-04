import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiMenu, FiX } from 'react-icons/fi'
import { FaGoogle } from 'react-icons/fa6'
import { motion, AnimatePresence } from 'framer-motion'
import { navigationLinks } from '../../constants/siteData'
import useScrollPosition from '../../hooks/useScrollPosition'
import Button from '../Button/Button'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const isScrolled = useScrollPosition(24)
  const location = useLocation()

  const isHome = location.pathname === '/' && !location.hash

  return (
    <header className={`navbar ${isHome && !isScrolled ? 'navbar--transparent' : 'navbar--scrolled'}`}>
      <div className="container">
        <div className="navbar__inner">
          <Link className="navbar__brand" to="/">
            <span className="navbar__mark">R</span>
            <span>Rehlata Tour</span>
          </Link>

          <nav className="navbar__menu" aria-label="Navigasi utama">
            {navigationLinks.map((link) => (
              <Link key={link.label} className="navbar__link" to={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>

          <Button as={Link} to="/contact" variant="ghost">
            Daftar Umrah
          </Button>

          <Button
            type="button"
            variant="primary"
            className="navbar__login-button"
            onClick={() => setIsLoginOpen(true)}
          >
            <FaGoogle /> Login
          </Button>

          <button
            type="button"
            className="navbar__toggle"
            onClick={() => setIsMenuOpen((current) => !current)}
            aria-label="Buka menu navigasi"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen ? (
            <motion.div
              className="navbar__mobile"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="navbar__mobile-panel">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.label}
                    className="navbar__mobile-link"
                    to={link.href}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <Button as={Link} to="/contact" variant="primary" onClick={() => setIsMenuOpen(false)}>
                  Daftar Umrah
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  className="navbar__mobile-login"
                  onClick={() => {
                    setIsMenuOpen(false)
                    setIsLoginOpen(true)
                  }}
                >
                  <FaGoogle /> Login
                </Button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isLoginOpen ? (
          <motion.div
            className="auth-modal"
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="auth-modal__backdrop"
              aria-label="Tutup login modal"
              onClick={() => setIsLoginOpen(false)}
            />

            <motion.div
              className="auth-modal__panel"
              role="dialog"
              aria-modal="true"
              aria-label="Login Google Rehlata Tour"
              initial={{ scale: 0.96, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="auth-modal__header">
                <div>
                  <span className="auth-modal__eyebrow">Login</span>
                  <h3 className="auth-modal__title">Masuk dengan Google</h3>
                </div>
                <button
                  type="button"
                  className="auth-modal__close"
                  onClick={() => setIsLoginOpen(false)}
                  aria-label="Tutup login modal"
                >
                  <FiX size={18} />
                </button>
              </div>

              <p className="auth-modal__description">
                Gunakan akun Google untuk masuk lebih cepat dan menyimpan riwayat konsultasi.
              </p>

              <Button
                type="button"
                variant="ghost"
                className="auth-modal__google"
                onClick={() => {
                  window.open('https://accounts.google.com/signin', '_blank', 'noopener,noreferrer')
                }}
              >
                <FaGoogle /> Lanjutkan dengan Google
              </Button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}