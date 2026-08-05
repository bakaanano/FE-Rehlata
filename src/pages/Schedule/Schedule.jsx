import PageShell from '../../components/PageShell/PageShell'
import ScheduleTable from '../../components/ScheduleTable/ScheduleTable'

export default function Schedule() {
  return (
    <PageShell
      eyebrow="Jadwal"
      title="Jadwal Keberangkatan"
      description="Halaman yang menampilkan semua jadwal keberangkatan paket umrah."
    >
      <ScheduleTable />
    </PageShell>
  )
}
