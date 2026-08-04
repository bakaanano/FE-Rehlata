import { Link } from 'react-router-dom'
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp } from 'react-icons/fa6'
import { footerMenu } from '../../constants/siteData'

const socialMap = {
  Instagram: { Icon: FaInstagram, href: 'https://instagram.com' },
  Facebook: { Icon: FaFacebookF, href: 'https://facebook.com' },
  YouTube: { Icon: FaYoutube, href: 'https://youtube.com' },
  WhatsApp: { Icon: FaWhatsapp, href: 'https://wa.me/6281234567890' },
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <Link className="footer__brand" to="/">
              <span className="footer__mark">R</span>
              <span>Rehlata Tour</span>
            </Link>
            <p className="footer__text">Perjalanan umrah modern, elegan, dan aman untuk keluarga Indonesia.</p>
          </div>

          <div>
            <h3 className="footer__title">Alamat</h3>
            <p className="footer__text">Jl. Haji No. 12, Jakarta Selatan, Indonesia</p>
            <p className="footer__text">Telepon: +62 812-3456-7890</p>
            <p className="footer__text">Email: hello@rehlatatour.id</p>
          </div>

          <div>
            <h3 className="footer__title">Menu</h3>
            <ul className="footer__list">
              {footerMenu.map((item) => (
                <li key={item.label}>
                  <Link className="footer__link" to={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="footer__title">Media Sosial</h3>
            <ul className="footer__list">
              {Object.entries(socialMap).map(([name, social]) => (
                <li key={name}>
                  <a className="footer__link" href={social.href} target="_blank" rel="noreferrer">
                    <social.Icon /> {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer__bottom">Copyright © 2026 Rehlata Tour. All rights reserved.</div>
      </div>
    </footer>
  )
}