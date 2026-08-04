import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronDown } from 'react-icons/fi'
import SectionTitle from '../SectionTitle/SectionTitle'
import Card from '../Card/Card'
import { faqData } from '../../constants/siteData'
import { fadeUp } from '../../utils/motion'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="section section--muted" id="faq">
      <div className="container">
        <SectionTitle
          eyebrow="FAQ"
          title="Pertanyaan yang sering ditanyakan"
          description="Accordion sederhana membantu pengunjung menemukan jawaban cepat tanpa membuat halaman terasa berat."
        />

        <motion.div className="faq-list" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
          {faqData.map((item, index) => {
            const isOpen = openIndex === index

            return (
              <Card className="faq-card" key={item.question}>
                <button
                  type="button"
                  className="faq-card__button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                >
                  <span>{item.question}</span>
                  <FiChevronDown style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 300ms ease' }} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="faq-card__answer">{item.answer}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </Card>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}