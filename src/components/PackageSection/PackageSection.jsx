import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import SectionTitle from '../SectionTitle/SectionTitle'
import PackageCard from '../PackageCard/PackageCard'
import { getPublicPackages } from '../../services/public'
import { staggerContainer } from '../../utils/motion'

const placeholderImages = [
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
]

export default function PackageSection() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadPackages() {
      try {
        setError('')
        setLoading(true)
        const data = await getPublicPackages()

        const normalized = (data || []).map((item, index) => ({
          id: item.id_paket,
          name: item.nama_paket || 'Paket Umrah',
          duration: item.durasi ? `${item.durasi} Hari` : 'Durasi belum tersedia',
          hotel: item.fasilitas || 'Detail paket tersedia',
          airline: item.maskapai || 'Maskapai bervariasi',
          price: item.harga ? `Rp ${Number(item.harga).toLocaleString('id-ID')}` : 'Harga belum tersedia',
          rating: '4.8',
          image: item.image || placeholderImages[index % placeholderImages.length],
        }))

        setPackages(normalized)
      } catch (fetchError) {
        setError(fetchError.message)
      } finally {
        setLoading(false)
      }
    }

    loadPackages()
  }, [])

  return (
    <section className="section" id="paket">
      <div className="container">
        <SectionTitle
          eyebrow="Paket Umrah"
          title="Pilihan paket elegan untuk setiap kebutuhan"
          description="Semua paket dirancang untuk menghadirkan pengalaman premium, nyaman, dan penuh ketenangan sejak keberangkatan hingga kembali ke tanah air."
        />

        {error ? <p className="section-error">Gagal memuat paket: {error}</p> : null}
        {loading ? <p className="section-loading">Memuat paket...</p> : null}

        <motion.div className="packages__grid" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
          {packages.map((packageItem) => (
            <PackageCard key={packageItem.id} packageItem={packageItem} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}