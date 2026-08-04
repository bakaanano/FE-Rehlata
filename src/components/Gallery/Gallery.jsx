import { motion } from 'framer-motion'
import SectionTitle from '../SectionTitle/SectionTitle'
import { galleryData } from '../../constants/siteData'
import { zoomIn, staggerContainer } from '../../utils/motion'

export default function Gallery() {
  return (
    <section className="section" id="galeri">
      <div className="container">
        <SectionTitle
          eyebrow="Gallery"
          title="Masonry grid untuk momen perjalanan terbaik"
          description="Hover zoom memberikan sentuhan visual yang elegan saat jamaah melihat dokumentasi perjalanan dan suasana Tanah Suci."
        />

        <motion.div className="gallery__grid" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
          {galleryData.map((item) => (
            <motion.figure className="gallery-card" key={item.title} variants={zoomIn}>
              <img className="gallery-card__image" src={item.image} alt={item.title} />
              <figcaption className="gallery-card__overlay">{item.title}</figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  )
}