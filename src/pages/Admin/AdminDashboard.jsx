import { useEffect, useMemo, useState } from 'react'
import Button from '../../components/Button/Button'
import {
  createPackage,
  createSchedule,
  deletePackage,
  deleteSchedule,
  getAdminDashboard,
  updatePackage,
  updateSchedule,
} from '../../services/admin'

const emptyPackageForm = {
  nama_paket: '',
  deskripsi: '',
  harga: '',
  durasi: '',
  fasilitas: '',
}

const emptyScheduleForm = {
  id_paket: '',
  tanggal_berangkat: '',
  kuota: '',
  status: 'tersedia',
}

export default function AdminDashboard() {
  const [user] = useState(() => {
    const storedUser = localStorage.getItem('authUser')
    if (!storedUser) return null

    try {
      return JSON.parse(storedUser)
    } catch {
      return null
    }
  })
  const [dashboard, setDashboard] = useState({
    summary: { packages: 0, schedules: 0, users: 0 },
    packages: [],
    schedules: [],
  })
  const [packages, setPackages] = useState([])
  const [schedules, setSchedules] = useState([])
  const [packageForm, setPackageForm] = useState(emptyPackageForm)
  const [scheduleForm, setScheduleForm] = useState(emptyScheduleForm)
  const [editingPackageId, setEditingPackageId] = useState(null)
  const [editingScheduleId, setEditingScheduleId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const packageOptions = useMemo(() => {
    return packages.map((item) => ({
      value: item.id_paket,
      label: item.nama_paket,
    }))
  }, [packages])

  const loadAdminData = async () => {
    try {
      setLoading(true)
      const data = await getAdminDashboard()
      setDashboard(data)
      setPackages(data.packages || [])
      setSchedules(data.schedules || [])
    } catch (loadError) {
      setError(loadError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAdminData()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
    window.location.href = '/'
  }

  const submitPackage = async (event) => {
    event.preventDefault()

    try {
      setError('')
      setMessage('')

      if (editingPackageId) {
        const updatedPackage = await updatePackage(editingPackageId, packageForm)
        setPackages((current) =>
          current.map((item) => (item.id_paket === editingPackageId ? updatedPackage : item)),
        )
        setMessage('Paket berhasil diperbarui.')
      } else {
        const createdPackage = await createPackage(packageForm)
        setPackages((current) => [...current, createdPackage])
        setMessage('Paket berhasil ditambahkan.')
      }

      setPackageForm(emptyPackageForm)
      setEditingPackageId(null)
      await loadAdminData()
    } catch (submitError) {
      setError(submitError.message)
    }
  }

  const submitSchedule = async (event) => {
    event.preventDefault()

    try {
      setError('')
      setMessage('')

      if (editingScheduleId) {
        const updatedSchedule = await updateSchedule(editingScheduleId, scheduleForm)
        setSchedules((current) =>
          current.map((item) => (item.id_jadwal === editingScheduleId ? updatedSchedule : item)),
        )
        setMessage('Jadwal berhasil diperbarui.')
      } else {
        const createdSchedule = await createSchedule(scheduleForm)
        setSchedules((current) => [...current, createdSchedule])
        setMessage('Jadwal berhasil ditambahkan.')
      }

      setScheduleForm(emptyScheduleForm)
      setEditingScheduleId(null)
      await loadAdminData()
    } catch (submitError) {
      setError(submitError.message)
    }
  }

  const startEditPackage = (item) => {
    setEditingPackageId(item.id_paket)
    setPackageForm({
      nama_paket: item.nama_paket || '',
      deskripsi: item.deskripsi || '',
      harga: item.harga || '',
      durasi: item.durasi || '',
      fasilitas: item.fasilitas || '',
    })
  }

  const startEditSchedule = (item) => {
    setEditingScheduleId(item.id_jadwal)
    setScheduleForm({
      id_paket: item.id_paket || '',
      tanggal_berangkat: item.tanggal_berangkat || '',
      kuota: item.kuota || '',
      status: item.status || 'tersedia',
    })
  }

  const handleDeletePackage = async (id) => {
    try {
      await deletePackage(id)
      setPackages((current) => current.filter((item) => item.id_paket !== id))
      setMessage('Paket berhasil dihapus.')
      await loadAdminData()
    } catch (deleteError) {
      setError(deleteError.message)
    }
  }

  const handleDeleteSchedule = async (id) => {
    try {
      await deleteSchedule(id)
      setSchedules((current) => current.filter((item) => item.id_jadwal !== id))
      setMessage('Jadwal berhasil dihapus.')
      await loadAdminData()
    } catch (deleteError) {
      setError(deleteError.message)
    }
  }

  return (
    <main className="admin-dashboard">
      <section className="section">
        <div className="container">
          <div className="card admin-dashboard__shell">
            <div className="admin-dashboard__header">
              <div>
                <span className="section-title__eyebrow">Admin Panel</span>
                <h1 className="section-title__heading">Dashboard Rehlata</h1>
                <p className="section-title__description">
                  Kelola paket Umrah dan jadwal keberangkatan dari satu dashboard admin.
                </p>
              </div>
              <div className="admin-dashboard__actions">
                <div className="admin-dashboard__user-pill">{user?.nama || user?.name || 'Admin'}</div>
                <Button type="button" variant="ghost" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>

            <div className="admin-dashboard__grid">
              <div className="admin-dashboard__card admin-dashboard__metric-card">
                <div className="admin-dashboard__metric-header">
                  <span className="admin-dashboard__metric-icon">📦</span>
                  <span>Jumlah Paket</span>
                </div>
                <p className="admin-dashboard__metric-value">{dashboard.summary.packages}</p>
              </div>
              <div className="admin-dashboard__card admin-dashboard__metric-card">
                <div className="admin-dashboard__metric-header">
                  <span className="admin-dashboard__metric-icon">🗓️</span>
                  <span>Jumlah Jadwal</span>
                </div>
                <p className="admin-dashboard__metric-value">{dashboard.summary.schedules}</p>
              </div>
              <div className="admin-dashboard__card admin-dashboard__metric-card">
                <div className="admin-dashboard__metric-header">
                  <span className="admin-dashboard__metric-icon">👥</span>
                  <span>Jumlah Pengguna</span>
                </div>
                <p className="admin-dashboard__metric-value">{dashboard.summary.users}</p>
              </div>
            </div>

            {error ? <div className="admin-dashboard__alert admin-dashboard__alert--error">{error}</div> : null}
            {message ? <div className="admin-dashboard__alert admin-dashboard__alert--success">{message}</div> : null}
            {loading ? <p className="admin-dashboard__loading">Memuat data admin...</p> : null}

            <div className="admin-dashboard__content">
              <section className="admin-dashboard__panel">
                <div className="admin-dashboard__panel-header">
                  <div>
                    <h2>CRUD Paket</h2>
                    <span className="admin-dashboard__panel-subtitle">{editingPackageId ? 'Edit paket aktif' : 'Tambah paket baru'}</span>
                  </div>
                  {editingPackageId ? <span className="admin-dashboard__status-badge admin-dashboard__status-badge--edit">Mode Edit</span> : null}
                </div>

                <form className="admin-dashboard__form" onSubmit={submitPackage}>
                  <input
                    type="text"
                    placeholder="Nama paket"
                    value={packageForm.nama_paket}
                    onChange={(event) => setPackageForm((current) => ({ ...current, nama_paket: event.target.value }))}
                  />
                  <textarea
                    placeholder="Deskripsi"
                    value={packageForm.deskripsi}
                    onChange={(event) => setPackageForm((current) => ({ ...current, deskripsi: event.target.value }))}
                  />
                  <textarea
                    placeholder="Fasilitas (mis. Hotel bintang 5, Tiket pesawat, Visa, dll.)"
                    value={packageForm.fasilitas}
                    onChange={(event) => setPackageForm((current) => ({ ...current, fasilitas: event.target.value }))}
                  />
                  <input
                    type="text"
                    placeholder="Harga"
                    value={packageForm.harga}
                    onChange={(event) => setPackageForm((current) => ({ ...current, harga: event.target.value }))}
                  />
                  <input
                    type="text"
                    placeholder="Durasi (hari)"
                    value={packageForm.durasi}
                    onChange={(event) => setPackageForm((current) => ({ ...current, durasi: event.target.value }))}
                  />

                  <div className="admin-dashboard__form-actions">
                    <Button type="submit" variant="primary">{editingPackageId ? 'Simpan Perubahan' : 'Tambah Paket'}</Button>
                    {editingPackageId ? (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setEditingPackageId(null)
                          setPackageForm(emptyPackageForm)
                        }}
                      >
                        Batal
                      </Button>
                    ) : null}
                  </div>
                </form>

                <div className="admin-dashboard__table-wrap">
                  <table className="admin-dashboard__table">
                    <thead>
                      <tr>
                        <th>Nama</th>
                        <th>Harga</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {packages.map((item) => (
                        <tr key={item.id_paket}>
                          <td>{item.nama_paket}</td>
                          <td>{item.harga}</td>
                          <td>
                            <div className="admin-dashboard__table-actions">
                              <Button type="button" variant="ghost" onClick={() => startEditPackage(item)}>
                                Edit
                              </Button>
                              <Button type="button" variant="ghost" onClick={() => handleDeletePackage(item.id_paket)}>
                                Hapus
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="admin-dashboard__panel">
                <div className="admin-dashboard__panel-header">
                  <div>
                    <h2>CRUD Jadwal Keberangkatan</h2>
                    <span className="admin-dashboard__panel-subtitle">{editingScheduleId ? 'Edit jadwal aktif' : 'Tambah jadwal baru'}</span>
                  </div>
                  {editingScheduleId ? <span className="admin-dashboard__status-badge admin-dashboard__status-badge--edit">Mode Edit</span> : null}
                </div>

                <form className="admin-dashboard__form" onSubmit={submitSchedule}>
                  <select
                    value={scheduleForm.id_paket}
                    onChange={(event) => setScheduleForm((current) => ({ ...current, id_paket: event.target.value }))}
                  >
                    <option value="">Pilih paket</option>
                    {packageOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={scheduleForm.tanggal_berangkat}
                    onChange={(event) => setScheduleForm((current) => ({ ...current, tanggal_berangkat: event.target.value }))}
                  />
                  <input
                    type="number"
                    placeholder="Kuota"
                    value={scheduleForm.kuota}
                    onChange={(event) => setScheduleForm((current) => ({ ...current, kuota: event.target.value }))}
                  />
                  <select
                    value={scheduleForm.status}
                    onChange={(event) => setScheduleForm((current) => ({ ...current, status: event.target.value }))}
                  >
                    <option value="tersedia">Tersedia</option>
                    <option value="penuh">Penuh</option>
                  </select>

                  <div className="admin-dashboard__form-actions">
                    <Button type="submit" variant="primary">{editingScheduleId ? 'Simpan Perubahan' : 'Tambah Jadwal'}</Button>
                    {editingScheduleId ? (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setEditingScheduleId(null)
                          setScheduleForm(emptyScheduleForm)
                        }}
                      >
                        Batal
                      </Button>
                    ) : null}
                  </div>
                </form>

                <div className="admin-dashboard__table-wrap">
                  <table className="admin-dashboard__table">
                    <thead>
                      <tr>
                        <th>Tanggal</th>
                        <th>Kuota</th>
                        <th>Status</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedules.map((item) => (
                        <tr key={item.id_jadwal}>
                          <td>{item.tanggal_berangkat}</td>
                          <td>{item.kuota}</td>
                          <td>
                        <span className={`admin-dashboard__status-badge admin-dashboard__status-badge--${item.status === 'tersedia' ? 'available' : 'full'}`}>
                          {item.status}
                        </span>
                      </td>
                          <td>
                            <div className="admin-dashboard__table-actions">
                              <Button type="button" variant="ghost" onClick={() => startEditSchedule(item)}>
                                Edit
                              </Button>
                              <Button type="button" variant="ghost" onClick={() => handleDeleteSchedule(item.id_jadwal)}>
                                Hapus
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}