import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import { FaStar } from 'react-icons/fa6'
import SectionTitle from '../SectionTitle/SectionTitle'
import Card from '../Card/Card'
import { testimonialData } from '../../constants/siteData'
import { fadeUp } from '../../utils/motion'
import 'swiper/css'

export default function Testimonial() {
  return (
    <section className="section section--muted" id="testimoni">
      <div className="container">
        <SectionTitle
          eyebrow="Testimoni"
          title="Cerita nyata dari jamaah kami"
          description="Swiper autoplay menampilkan pengalaman jamaah yang menilai layanan kami dari sisi kenyamanan, komunikasi, dan ketepatan layanan."
        />

        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
          <Swiper
            className="testimonial__slider"
            modules={[Autoplay]}
            autoplay={{ delay: 3200, disableOnInteraction: false }}
            loop
            spaceBetween={24}
            breakpoints={{ 0: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1200: { slidesPerView: 3 } }}
          >
            {testimonialData.map((testimonial) => (
              <SwiperSlide key={testimonial.name}>
                <Card className="testimonial-card">
                  <div className="testimonial-card__profile">
                    <img className="testimonial-card__avatar" src={testimonial.avatar} alt={testimonial.name} />
                    <div>
                      <h3 className="testimonial-card__name">{testimonial.name}</h3>
                      <span className="testimonial-card__rating">
                        <FaStar /> {testimonial.rating}
                      </span>
                    </div>
                  </div>
                  <p className="testimonial-card__quote">“{testimonial.comment}”</p>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  )
}