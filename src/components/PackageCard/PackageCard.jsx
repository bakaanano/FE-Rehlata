import { motion } from 'framer-motion'
import { FaStar } from 'react-icons/fa6'
import Button from '../Button/Button'
import Card from '../Card/Card'
import { scaleIn } from '../../utils/motion'

export default function PackageCard({ packageItem }) {
  return (
    <motion.article variants={scaleIn} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
      <Card className="package-card">
        <img className="package-card__image" src={packageItem.image} alt={packageItem.name} />
        <div className="package-card__body">
          <div>
            <h3 className="package-card__title">{packageItem.name}</h3>
            <div className="package-card__meta">
              <span>{packageItem.duration}</span>
              <span>{packageItem.rating}</span>
            </div>
          </div>

          <div className="package-card__specs">
            <div className="package-card__spec">
              <span>Hotel</span>
              <strong>{packageItem.hotel}</strong>
            </div>
          </div>

          <div className="package-card__footer">
            <div>
              <span className="package-card__price">{packageItem.price}</span>
              <div className="package-card__rating">
                <span className="package-card__rating-badge">
                  <FaStar /> {packageItem.rating}
                </span>
              </div>
            </div>

            <Button type="button" variant="ghost">Detail</Button>
          </div>
        </div>
      </Card>
    </motion.article>
  )
}