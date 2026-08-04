import PageShell from '../../components/PageShell/PageShell'
import Gallery from '../../components/Gallery/Gallery'

export default function GalleryPage() {
  return (
    <PageShell
      eyebrow="Galeri"
      title="Dokumentasi perjalanan"
      description="Gunakan halaman ini untuk menampilkan momen perjalanan jamaah, foto hotel, dan suasana Tanah Suci."
    >
      <Gallery />
    </PageShell>
  )
}