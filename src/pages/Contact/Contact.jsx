import { useState } from 'react'
import PageShell from '../../components/PageShell/PageShell'
import Button from '../../components/Button/Button'

const whatsappNumber = '628113663681'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const message = `Halo Rehlata Tour, saya ${formData.name || '...'}.
Alamat Email: ${formData.email || '-'}
Pesan: ${formData.message || '-'}`

    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <PageShell
      eyebrow="Kontak"
      title="Hubungi tim Rehlata Tour"
      description="Halaman kontak ini menjadi titik masuk untuk konsultasi paket, jadwal, dan booking perjalanan."
    >
      <form onSubmit={handleSubmit}>
        <div className="search-form__grid">
          <label className="field">
            <span className="field__label">Nama</span>
            <input
              className="field__control"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nama lengkap"
            />
          </label>
          <label className="field">
            <span className="field__label">Email</span>
            <input
              className="field__control"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Alamat Email"
            />
          </label>
          <label className="field field--full">
            <span className="field__label">Pesan</span>
            <textarea
              className="field__control"
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tulis kebutuhan perjalanan Anda"
            />
          </label>
        </div>
        <Button type="submit" variant="primary">
          Kirim Pesan
        </Button>
      </form>
    </PageShell>
  )
}