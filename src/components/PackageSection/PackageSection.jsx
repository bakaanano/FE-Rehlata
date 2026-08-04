import { motion } from 'framer-motion'
import SectionTitle from '../SectionTitle/SectionTitle'
import PackageCard from '../PackageCard/PackageCard'
import { packageData } from '../../constants/siteData'
import { staggerContainer } from '../../utils/motion'

export default function PackageSection() {
  return (
    <section className="section" id="paket">
      <div className="container">
        <SectionTitle
          eyebrow="Paket Umrah"
          title="Pilihan paket elegan untuk setiap kebutuhan"
          description="Semua paket dirancang untuk menghadirkan pengalaman premium, nyaman, dan penuh ketenangan sejak keberangkatan hingga kembali ke tanah air."
        />

        <motion.div className="packages__grid" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
          {packageData.map((packageItem) => (
            <PackageCard key={packageItem.id} packageItem={packageItem} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}