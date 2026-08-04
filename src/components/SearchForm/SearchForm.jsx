import Button from '../Button/Button'
import Card from '../Card/Card'
import { searchFields } from '../../constants/siteData'

export default function SearchForm() {
  return (
    <Card className="search-card">
      <div className="search-card__header">
        <span className="badge">Search Package</span>
        <h2 className="search-card__title">Temukan paket yang paling sesuai</h2>
        <p className="search-card__description">Pilih jadwal, durasi, harga, dan maskapai terbaik untuk perjalanan umrah Anda.</p>
      </div>

      <form className="search-form">
        <div className="search-form__grid">
          {searchFields.map((field) => (
            <label className={`field ${field.name === 'price' ? 'field--full' : ''}`} key={field.name}>
              <span className="field__label">{field.label}</span>
              <input className="field__control" type="text" defaultValue={field.value} placeholder={field.placeholder} />
            </label>
          ))}
        </div>

        <div className="search-form__actions">
          <Button type="submit" variant="primary">Cari</Button>
          <Button type="button" variant="ghost">Lihat semua paket</Button>
        </div>
      </form>
    </Card>
  )
}