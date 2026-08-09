import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Button from '../Button/Button'
import Card from '../Card/Card'
import SectionTitle from '../SectionTitle/SectionTitle'
import { getPublicSchedules } from '../../services/public'
import { fadeUp } from '../../utils/motion'

export default function ScheduleTable() {
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadSchedules() {
      try {
        setError('')
        setLoading(true)
        const data = await getPublicSchedules()

        const normalized = (data || []).map((item) => ({
          date: item.tanggal_berangkat || '-',
          packageName: item.packageName || 'Paket tidak tersedia',
          quota: item.kuota != null ? String(item.kuota) : '0',
          status: item.status || 'Tersedia',
        }))

        setSchedules(normalized)
      } catch (fetchError) {
        setError(fetchError.message)
      } finally {
        setLoading(false)
      }
    }

    loadSchedules()
  }, [])

  return (
    <section className="section" id="jadwal">
      <div className="container">
        <SectionTitle
          eyebrow="Jadwal Keberangkatan"
          title="Jadwal yang jelas, modern, dan mudah dipantau"
          description="Lihat seat yang tersedia, status keberangkatan, dan paket yang paling sesuai dengan rencana perjalanan Anda."
        />

        {error ? <p className="section-error">Gagal memuat jadwal: {error}</p> : null}
        {loading ? <p className="section-loading">Memuat jadwal...</p> : null}

        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
          <Card className="schedule-card">
            <div style={{ overflowX: 'auto' }}>
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Paket</th>
                    <th>Kuota</th>
                    <th>Status</th>
                    {/* <th>Aksi</th> */}
                  </tr>
                </thead>
                <tbody>
                  {schedules.map((schedule) => {
                    const isAvailable = schedule.status.toLowerCase() === 'tersedia'

                    return (
                      <tr key={`${schedule.date}-${schedule.packageName}`}>
                        <td>{schedule.date}</td>
                        <td>{schedule.packageName}</td>
                        <td>{schedule.quota}</td>
                        <td>
                          <span className={`schedule-table__status ${isAvailable ? 'schedule-table__status--available' : 'schedule-table__status--full'}`}>
                            {schedule.status}
                          </span>
                        </td>
                        {/* <td>
                          <Button type="button" variant="ghost">Detail</Button>
                        </td> */}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}