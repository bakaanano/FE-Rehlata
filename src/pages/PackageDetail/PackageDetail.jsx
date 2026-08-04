import PageShell from '../../components/PageShell/PageShell'
import Button from '../../components/Button/Button'

export default function PackageDetail() {
  return (
    <PageShell
      eyebrow="Detail Paket"
      title="Detail paket umrah"
      description="Halaman detail disiapkan untuk itinerary, fasilitas, gallery, dan formulir booking yang lebih lengkap."
    >
      <p className="page-shell__text">Tambahkan galeri, itinerary harian, hotel, maskapai, dan FAQ spesifik paket di sini.</p>
      <Button type="button" variant="primary">Hubungi CS</Button>
    </PageShell>
  )
}