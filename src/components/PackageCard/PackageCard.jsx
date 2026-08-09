import { motion } from 'framer-motion'
import { FaStar, FaRegClock } from 'react-icons/fa6'
import Button from '../Button/Button'
import Card from '../Card/Card'
import { scaleIn } from '../../utils/motion'

const badgeLabels = ['Diskon Awal', 'Tersisa Terbatas', 'Diskon Akhir', 'Paling Favorit']

export default function PackageCard({ packageItem, index = 0 }) {
  const badgeLabel = badgeLabels[index % badgeLabels.length]
  const description = [packageItem.hotel, packageItem.airline].filter(Boolean).join(' • ')

  return (
    <motion.article variants={scaleIn} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
      <Card className="package-card">
        <div className="package-card__media">
          <span className="package-card__badge">{badgeLabel}</span>
          <img className="package-card__image" src={packageItem.image} alt={packageItem.name} />
        </div>

        <div className="package-card__body">
          <h3 className="package-card__title">{packageItem.name}</h3>

          <div className="package-card__meta">
            <span><FaRegClock /> {packageItem.duration}</span>
            <span><FaStar /> {packageItem.rating}</span>
          </div>

          {description ? <p className="package-card__description">{description}</p> : null}

          <div className="package-card__footer">
            <div className="package-card__price-block">
              <span className="package-card__price-label">Mulai dari</span>
              <span className="package-card__price">{packageItem.price}</span>
            </div>

            <Button type="button" variant="primary" className="package-card__cta">
              Pesan Sekarang
            </Button>
          </div>
        </div>
      </Card>
    </motion.article>
  )
}