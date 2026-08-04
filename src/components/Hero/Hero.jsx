import { motion } from 'framer-motion'
import Button from '../Button/Button'
import SearchForm from '../SearchForm/SearchForm'
import { heroStats } from '../../constants/siteData'
import { fadeLeft, fadeRight, staggerContainer } from '../../utils/motion'

export default function Hero() {
  return (
    <section className="hero" id="beranda">
      <div className="hero__inner">
        <div className="container">
          <div className="hero__grid">
            <motion.div className="hero__content" variants={staggerContainer} initial="hidden" animate="show">
              <motion.span className="hero__eyebrow" variants={fadeLeft}>
                Luxury Umrah Experience
              </motion.span>
              <motion.h1 className="hero__title" variants={fadeLeft}>
                Temukan Perjalanan Umrah Terbaik Bersama Rehlata Tour
              </motion.h1>
              <motion.p className="hero__description" variants={fadeLeft}>
                Rasakan pengalaman perjalanan yang modern, nyaman, dan penuh ketenangan dengan layanan premium serta pendampingan profesional.
              </motion.p>

              <motion.div className="hero__actions" variants={fadeLeft}>
                <Button as="a" href="#paket" variant="primary">Lihat Paket</Button>
                <Button as="a" href="#kontak" variant="secondary">Hubungi Kami</Button>
              </motion.div>

              <motion.div className="hero__stats" variants={fadeLeft}>
                {heroStats.map((stat) => (
                  <div className="hero__stat" key={stat.label}>
                    <span className="hero__stat-value">{stat.value}</span>
                    <span className="hero__stat-label">{stat.label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div variants={fadeRight} initial="hidden" animate="show">
              <SearchForm />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}