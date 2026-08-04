import PageShell from '../../components/PageShell/PageShell'
import PackageSection from '../../components/PackageSection/PackageSection'

export default function Package() {
  return (
    <PageShell
      eyebrow="Paket"
      title="Halaman paket umrah"
      description="Use page ini untuk listing lengkap, filter, dan detail setiap paket pada tahap berikutnya."
    >
      <PackageSection />
    </PageShell>
  )
}