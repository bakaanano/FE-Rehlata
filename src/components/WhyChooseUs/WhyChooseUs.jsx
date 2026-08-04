import { motion } from 'framer-motion'
import { FaShieldHalved, FaHotel, FaUserTie, FaMoneyBillWave, FaHeadset, FaPlaneDeparture } from 'react-icons/fa6'
import SectionTitle from '../SectionTitle/SectionTitle'
import { whyChooseUsData } from '../../constants/siteData'
import { fadeUp, staggerContainer } from '../../utils/motion'

const icons = [FaShieldHalved, FaHotel, FaUserTie, FaMoneyBillWave, FaHeadset, FaPlaneDeparture]

export default function WhyChooseUs() {
  return (
    <section className="section section--muted" id="mengapa">
      <div className="container">
        <SectionTitle
          eyebrow="Mengapa Memilih Kami"
          title="Layanan premium yang terasa dari awal"
          description="Kami menggabungkan nilai profesional, kenyamanan, dan perhatian detail agar perjalanan umrah terasa lebih tenang dan berkesan."
          center
        />

        <motion.div className="features__grid" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
          {whyChooseUsData.map((feature, index) => {
            const Icon = icons[index]

            return (
              <motion.article key={feature.title} className="feature-card" variants={fadeUp}>
                <div className="feature-card__icon" aria-hidden="true">
                  <Icon size={22} />
                </div>
                <h3 className="feature-card__title">{feature.title}</h3>
                <p className="feature-card__description">{feature.description}</p>
              </motion.article>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}