import { motion } from 'framer-motion'
import PageShell from '../../components/PageShell/PageShell'
import { fadeUp } from '../../utils/motion'

const articles = [
  { title: 'Panduan memilih paket umrah yang tepat', excerpt: 'Tips sederhana untuk menyesuaikan paket dengan kebutuhan keluarga dan kenyamanan perjalanan.', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80' },
  { title: 'Persiapan dokumen sebelum berangkat', excerpt: 'Daftar dokumen, timing, dan hal administratif yang perlu disiapkan jauh hari sebelum keberangkatan.', image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=900&q=80' },
  { title: 'Etika dan adab selama umrah', excerpt: 'Ringkasan praktis tentang adab, kenyamanan, dan fokus ibadah selama berada di Tanah Suci.', image: 'https://images.unsplash.com/photo-1540882801904-118a38f6f21d?auto=format&fit=crop&w=900&q=80' },
]

export default function Blog() {
  return (
    <PageShell
      eyebrow="Artikel"
      title="Informasi dan panduan perjalanan"
      description="Bagian blog bisa diisi artikel informatif, tips ibadah, dan update keberangkatan paket."
    >
      <div className="blog__grid">
        {articles.map((article) => (
          <motion.article className="blog-card" key={article.title} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
            <img className="blog-card__image" src={article.image} alt={article.title} />
            <div className="blog-card__body">
              <h2 className="package-card__title">{article.title}</h2>
              <p className="blog-card__excerpt">{article.excerpt}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </PageShell>
  )
}