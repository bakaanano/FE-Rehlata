import PageShell from '../../components/PageShell/PageShell'
import Button from '../../components/Button/Button'

export default function Contact() {
  return (
    <PageShell
      eyebrow="Kontak"
      title="Hubungi tim Rehlata Tour"
      description="Halaman kontak ini menjadi titik masuk untuk konsultasi paket, jadwal, dan booking perjalanan."
    >
      <div className="search-form__grid">
        <label className="field">
          <span className="field__label">Nama</span>
          <input className="field__control" type="text" placeholder="Nama lengkap" />
        </label>
        <label className="field">
          <span className="field__label">Telepon</span>
          <input className="field__control" type="tel" placeholder="Nomor WhatsApp" />
        </label>
        <label className="field field--full">
          <span className="field__label">Pesan</span>
          <textarea className="field__control" rows="5" placeholder="Tulis kebutuhan perjalanan Anda" />
        </label>
      </div>
      <Button type="button" variant="primary">Kirim Pesan</Button>
    </PageShell>
  )
}