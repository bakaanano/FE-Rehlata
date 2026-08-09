import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FiMenu, FiX } from 'react-icons/fi'
import { FaGoogle } from 'react-icons/fa6'
import { motion, AnimatePresence } from 'framer-motion'
import { navigationLinks } from '../../constants/siteData'
import useScrollPosition from '../../hooks/useScrollPosition'
import { sendGoogleLogin } from '../../services/auth'
import Button from '../Button/Button'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('authUser')
    return storedUser ? JSON.parse(storedUser) : null
  })
  const [authError, setAuthError] = useState(null)
  const [isGoogleReady, setIsGoogleReady] = useState(false)
  const isScrolled = useScrollPosition(24)
  const location = useLocation()
  const navigate = useNavigate()

  const isHome = location.pathname === '/' && !location.hash

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

  // Pakai ref supaya callback yang dipegang Google SDK selalu memanggil versi terbaru,
  // meskipun initialize() cuma dipanggil sekali.
  const handleCredentialResponseRef = useRef(null)

  const handleCredentialResponse = async (response) => {
    try {
      setAuthError(null)
      console.log('[GoogleAuth] credential response diterima:', response)

      if (!response?.credential) {
        throw new Error('Google credential missing')
      }

      const data = await sendGoogleLogin(response.credential)
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('authUser', JSON.stringify(data.user))
      setUser(data.user)
      setIsLoginOpen(false)

      // Redirect ke dashboard admin kalau role user adalah admin.
      // Sebelumnya tidak ada pengecekan role/redirect sama sekali di sini,
      // itu sebabnya admin login sukses tapi tidak pernah diarahkan ke /admin.
      if (data.user?.role?.toLowerCase() === 'admin') {
        navigate('/admin')
      }
    } catch (error) {
      console.error('[GoogleAuth] login gagal:', error)
      setAuthError(error.message)
    }
  }

  // Simpan versi terbaru function ke ref setiap render, tanpa memicu init ulang
  useEffect(() => {
    handleCredentialResponseRef.current = handleCredentialResponse
  })

  useEffect(() => {
    const storedUser = localStorage.getItem('authUser')
    if (storedUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(JSON.parse(storedUser))
    }
  }, [])

  // Inisialisasi Google Identity Services HANYA SEKALI
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      console.warn('Missing VITE_GOOGLE_CLIENT_ID in environment')
      return
    }

    const initializeGoogle = () => {
      if (!window.google?.accounts?.id) return
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        // callback stabil, tapi selalu delegasikan ke versi terbaru lewat ref
        callback: (response) => handleCredentialResponseRef.current?.(response),
      })
      setIsGoogleReady(true)
      console.log('[GoogleAuth] Google Identity Services initialized')
    }

    // Kalau script sudah pernah dimuat sebelumnya (misal saat dev hot-reload), langsung init
    const existingScript = document.getElementById('google-gsi-script')
    if (existingScript) {
      if (window.google?.accounts?.id) {
        initializeGoogle()
      } else {
        existingScript.addEventListener('load', initializeGoogle)
      }
      return
    }

    const script = document.createElement('script')
    script.id = 'google-gsi-script'
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = initializeGoogle
    document.head.appendChild(script)

    // Sengaja TIDAK di-remove saat unmount, karena Google SDK bersifat global/singleton
    // dan menghapusnya justru memicu initialize() ganda saat komponen mount ulang.
  }, [GOOGLE_CLIENT_ID])

  const handleGoogleLogin = () => {
    if (!isGoogleReady || !window.google?.accounts?.id) {
      setAuthError('Tunggu sebentar, Google auth sedang dimuat.')
      return
    }

    setAuthError(null)
    window.google.accounts.id.prompt((notification) => {
      // Debug: tahu kalau prompt di-skip/di-dismiss oleh browser
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        console.warn(
          '[GoogleAuth] prompt tidak tampil:',
          notification.getNotDisplayedReason?.() || notification.getSkippedReason?.()
        )
      }
    })
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
    setUser(null)
    setAuthError(null)
  }

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

          <div className="navbar__actions">
            {user ? (
              <div className="navbar__user-box">
                <span className="navbar__user-name">Halo, {user.nama || user.name || 'Pengguna'}</span>
                <Button type="button" variant="ghost" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="ghost"
                className="navbar__login-button"
                onClick={() => setIsLoginOpen(true)}
              >
                <FaGoogle /> Log In
              </Button>
            )}

            <Button as={Link} to="/contact" variant="primary" className="navbar__register-button">
              Daftar Umrah
            </Button>
          </div>

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
                onClick={handleGoogleLogin}
              >
                <FaGoogle /> Lanjutkan dengan Google
              </Button>
              {authError ? <p className="auth-modal__error">{authError}</p> : null}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}