import { motion } from 'framer-motion'
import Button from '../Button/Button'
import Card from '../Card/Card'
import SectionTitle from '../SectionTitle/SectionTitle'
import { scheduleData } from '../../constants/siteData'
import { fadeUp } from '../../utils/motion'

export default function ScheduleTable() {
  return (
    <section className="section" id="jadwal">
      <div className="container">
        <SectionTitle
          eyebrow="Jadwal Keberangkatan"
          title="Jadwal yang jelas, modern, dan mudah dipantau"
          description="Lihat seat yang tersedia, status keberangkatan, dan paket yang paling sesuai dengan rencana perjalanan Anda."
        />

        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
          <Card className="schedule-card">
            <div style={{ overflowX: 'auto' }}>
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Paket</th>
                    <th>Maskapai</th>
                    <th>Kuota</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduleData.map((schedule) => {
                    const isAvailable = schedule.status === 'Tersedia'

                    return (
                      <tr key={`${schedule.date}-${schedule.packageName}`}>
                        <td>{schedule.date}</td>
                        <td>{schedule.packageName}</td>
                        <td>{schedule.airline}</td>
                        <td>{schedule.quota}</td>
                        <td>
                          <span className={`schedule-table__status ${isAvailable ? 'schedule-table__status--available' : 'schedule-table__status--full'}`}>
                            {schedule.status}
                          </span>
                        </td>
                        <td>
                          <Button type="button" variant="ghost">Detail</Button>
                        </td>
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