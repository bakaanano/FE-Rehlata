import { useEffect, useMemo, useState } from 'react'
import Button from '../../components/Button/Button'
import {
  createKnowledgeBase,
  createPackage,
  createSchedule,
  deleteKnowledgeBase,
  deletePackage,
  deleteSchedule,
  getAdminDashboard,
  getKnowledgeBaseDetail,
  getKnowledgeBaseList,
  updateKnowledgeBase,
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

const emptyKnowledgeForm = {
  kategori: '',
  id_paket: '',
  pertanyaan: '',
  jawaban: '',
}

const DEFAULT_KNOWLEDGE_CATEGORIES = [
  'Informasi Umrah',
  'Paket Umrah',
  'Harga',
  'Fasilitas',
  'Jadwal',
  'Dokumen',
  'Pembayaran',
  'Visa',
  'Hotel',
  'Transportasi',
  'Lainnya',
]

const KNOWLEDGE_PAGE_SIZE = 10

function truncateText(value, maxLength = 60) {
  if (!value) return '-'
  const trimmed = String(value).trim()
  return trimmed.length > maxLength ? `${trimmed.slice(0, maxLength).trim()}…` : trimmed
}

function formatDateTime(value) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
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

  // Knowledge Base
  const [knowledgeList, setKnowledgeList] = useState([])
  const [knowledgePagination, setKnowledgePagination] = useState({
    page: 1,
    limit: KNOWLEDGE_PAGE_SIZE,
    total: 0,
    totalPages: 0,
  })
  const [knowledgeLoading, setKnowledgeLoading] = useState(true)
  const [knowledgeError, setKnowledgeError] = useState('')
  const [knowledgeMessage, setKnowledgeMessage] = useState('')
  const [knowledgeSearchInput, setKnowledgeSearchInput] = useState('')
  const [knowledgeSearch, setKnowledgeSearch] = useState('')
  const [knowledgeKategoriFilter, setKnowledgeKategoriFilter] = useState('')
  const [knowledgePaketFilter, setKnowledgePaketFilter] = useState('')
  const [knowledgePage, setKnowledgePage] = useState(1)
  const [knowledgeForm, setKnowledgeForm] = useState(emptyKnowledgeForm)
  const [knowledgeModalMode, setKnowledgeModalMode] = useState(null) // 'add' | 'edit' | 'detail' | null
  const [knowledgeEditingId, setKnowledgeEditingId] = useState(null)
  const [knowledgeDetailItem, setKnowledgeDetailItem] = useState(null)
  const [knowledgeSubmitting, setKnowledgeSubmitting] = useState(false)
  const [knowledgeFormError, setKnowledgeFormError] = useState('')

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

  const knowledgeCategoryOptions = useMemo(() => {
    const fromData = knowledgeList.map((item) => item.kategori).filter(Boolean)
    return Array.from(new Set([...DEFAULT_KNOWLEDGE_CATEGORIES, ...fromData])).sort((a, b) =>
      a.localeCompare(b),
    )
  }, [knowledgeList])

  const loadKnowledgeBase = async () => {
    try {
      setKnowledgeLoading(true)
      setKnowledgeError('')
      const response = await getKnowledgeBaseList({
        page: knowledgePage,
        limit: KNOWLEDGE_PAGE_SIZE,
        search: knowledgeSearch,
        kategori: knowledgeKategoriFilter,
        id_paket: knowledgePaketFilter,
      })
      setKnowledgeList(response.data || [])
      setKnowledgePagination(
        response.pagination || { page: knowledgePage, limit: KNOWLEDGE_PAGE_SIZE, total: 0, totalPages: 0 },
      )
    } catch (loadError) {
      setKnowledgeError(loadError.message)
    } finally {
      setKnowledgeLoading(false)
    }
  }

  useEffect(() => {
    loadKnowledgeBase()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [knowledgePage, knowledgeSearch, knowledgeKategoriFilter, knowledgePaketFilter])

  // Debounce input pencarian agar tidak memanggil API di setiap ketukan.
  useEffect(() => {
    const timer = setTimeout(() => {
      setKnowledgePage(1)
      setKnowledgeSearch(knowledgeSearchInput.trim())
    }, 400)
    return () => clearTimeout(timer)
  }, [knowledgeSearchInput])

  const validateKnowledgeForm = () => {
    if (!knowledgeForm.kategori.trim()) return 'Kategori wajib diisi.'
    if (knowledgeForm.kategori.trim().length > 255) return 'Kategori maksimal 255 karakter.'
    if (!knowledgeForm.pertanyaan.trim() || knowledgeForm.pertanyaan.trim().length < 5) {
      return 'Pertanyaan wajib diisi, minimal 5 karakter.'
    }
    if (!knowledgeForm.jawaban.trim() || knowledgeForm.jawaban.trim().length < 5) {
      return 'Jawaban wajib diisi, minimal 5 karakter.'
    }
    return ''
  }

  const openAddKnowledgeModal = () => {
    setKnowledgeEditingId(null)
    setKnowledgeForm(emptyKnowledgeForm)
    setKnowledgeFormError('')
    setKnowledgeModalMode('add')
  }

  const openEditKnowledge = (item) => {
    setKnowledgeEditingId(item.id_knowledge)
    setKnowledgeForm({
      kategori: item.kategori || '',
      id_paket: item.id_paket === null || item.id_paket === undefined ? '' : String(item.id_paket),
      pertanyaan: item.pertanyaan || '',
      jawaban: item.jawaban || '',
    })
    setKnowledgeFormError('')
    setKnowledgeModalMode('edit')
  }

  const openDetailKnowledge = async (item) => {
    setKnowledgeModalMode('detail')
    setKnowledgeDetailItem(null)
    try {
      const response = await getKnowledgeBaseDetail(item.id_knowledge)
      setKnowledgeDetailItem(response.data)
    } catch (detailError) {
      // Fallback ke data yang sudah ada di tabel jika permintaan detail gagal.
      setKnowledgeDetailItem(item)
      setKnowledgeError(detailError.message)
    }
  }

  const closeKnowledgeModal = () => {
    setKnowledgeModalMode(null)
    setKnowledgeEditingId(null)
    setKnowledgeDetailItem(null)
    setKnowledgeFormError('')
  }

  const submitKnowledgeForm = async (event) => {
    event.preventDefault()

    const validationError = validateKnowledgeForm()
    if (validationError) {
      setKnowledgeFormError(validationError)
      return
    }

    try {
      setKnowledgeSubmitting(true)
      setKnowledgeFormError('')

      const payload = {
        kategori: knowledgeForm.kategori.trim(),
        pertanyaan: knowledgeForm.pertanyaan.trim(),
        jawaban: knowledgeForm.jawaban,
        id_paket: knowledgeForm.id_paket === '' ? null : Number(knowledgeForm.id_paket),
      }

      if (knowledgeEditingId) {
        await updateKnowledgeBase(knowledgeEditingId, payload)
        setMessage('')
        setKnowledgeMessage('Knowledge Base berhasil diperbarui.')
      } else {
        await createKnowledgeBase(payload)
        setKnowledgeMessage('Knowledge Base berhasil ditambahkan.')
      }

      closeKnowledgeModal()
      await loadKnowledgeBase()
    } catch (submitError) {
      setKnowledgeFormError(submitError.message)
    } finally {
      setKnowledgeSubmitting(false)
    }
  }

  const handleDeleteKnowledge = async (item) => {
    const confirmed = window.confirm(
      `Hapus Knowledge Base "${truncateText(item.pertanyaan, 80)}"? Data yang sudah dihapus tidak dapat dikembalikan.`,
    )
    if (!confirmed) return

    try {
      setKnowledgeError('')
      await deleteKnowledgeBase(item.id_knowledge)
      setKnowledgeMessage('Knowledge Base berhasil dihapus.')
      await loadKnowledgeBase()
    } catch (deleteError) {
      setKnowledgeError(deleteError.message)
    }
  }

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

            <section className="admin-dashboard__panel admin-dashboard__panel--wide">
              <div className="admin-dashboard__panel-header">
                <div>
                  <h2>Knowledge Base</h2>
                  <span className="admin-dashboard__panel-subtitle">
                    Kelola pertanyaan &amp; jawaban yang menjadi sumber data chatbot AI
                  </span>
                </div>
                <Button type="button" variant="primary" onClick={openAddKnowledgeModal}>
                  + Tambah Knowledge
                </Button>
              </div>

              <div className="admin-dashboard__kb-toolbar">
                <input
                  type="text"
                  className="admin-dashboard__kb-search"
                  placeholder="Cari pertanyaan, jawaban, atau kategori..."
                  value={knowledgeSearchInput}
                  onChange={(event) => setKnowledgeSearchInput(event.target.value)}
                />
                <select
                  value={knowledgeKategoriFilter}
                  onChange={(event) => {
                    setKnowledgePage(1)
                    setKnowledgeKategoriFilter(event.target.value)
                  }}
                >
                  <option value="">Semua Kategori</option>
                  {knowledgeCategoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <select
                  value={knowledgePaketFilter}
                  onChange={(event) => {
                    setKnowledgePage(1)
                    setKnowledgePaketFilter(event.target.value)
                  }}
                >
                  <option value="">Semua Paket</option>
                  <option value="null">Tidak terkait paket tertentu</option>
                  {packageOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {knowledgeError ? (
                <div className="admin-dashboard__alert admin-dashboard__alert--error">{knowledgeError}</div>
              ) : null}
              {knowledgeMessage ? (
                <div className="admin-dashboard__alert admin-dashboard__alert--success">{knowledgeMessage}</div>
              ) : null}
              {knowledgeLoading ? <p className="admin-dashboard__loading">Memuat Knowledge Base...</p> : null}

              {!knowledgeLoading && knowledgeList.length === 0 ? (
                <div className="admin-dashboard__kb-empty">
                  <p className="admin-dashboard__kb-empty-title">Belum ada Knowledge Base</p>
                  <p>Tambahkan pertanyaan dan jawaban pertama untuk mulai membangun Knowledge Base chatbot.</p>
                  <Button type="button" variant="primary" onClick={openAddKnowledgeModal}>
                    + Tambah Knowledge
                  </Button>
                </div>
              ) : (
                <>
                  <div className="admin-dashboard__table-wrap">
                    <table className="admin-dashboard__table">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Kategori</th>
                          <th>Paket Umrah</th>
                          <th>Pertanyaan</th>
                          <th>Jawaban</th>
                          <th>Tanggal Update</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {knowledgeList.map((item, index) => (
                          <tr key={item.id_knowledge}>
                            <td>{(knowledgePagination.page - 1) * knowledgePagination.limit + index + 1}</td>
                            <td>{item.kategori}</td>
                            <td>{item.paket_umrah?.nama_paket || 'Tidak terkait paket tertentu'}</td>
                            <td>{truncateText(item.pertanyaan, 60)}</td>
                            <td>{truncateText(item.jawaban, 60)}</td>
                            <td>{formatDateTime(item.tanggal_update)}</td>
                            <td>
                              <div className="admin-dashboard__table-actions">
                                <Button type="button" variant="ghost" onClick={() => openDetailKnowledge(item)}>
                                  Lihat
                                </Button>
                                <Button type="button" variant="ghost" onClick={() => openEditKnowledge(item)}>
                                  Edit
                                </Button>
                                <Button type="button" variant="ghost" onClick={() => handleDeleteKnowledge(item)}>
                                  Hapus
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="admin-dashboard__pagination">
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={knowledgePagination.page <= 1}
                      onClick={() => setKnowledgePage((current) => Math.max(current - 1, 1))}
                    >
                      Previous
                    </Button>
                    <span className="admin-dashboard__pagination-info">
                      Halaman {knowledgePagination.page} dari {Math.max(knowledgePagination.totalPages, 1)} (
                      {knowledgePagination.total} data)
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={knowledgePagination.page >= knowledgePagination.totalPages}
                      onClick={() => setKnowledgePage((current) => current + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </>
              )}
            </section>
          </div>
        </div>
      </section>

      {knowledgeModalMode ? (
        <div className="admin-dashboard__modal-backdrop" onClick={closeKnowledgeModal}>
          <div className="admin-dashboard__modal" onClick={(event) => event.stopPropagation()}>
            {knowledgeModalMode === 'detail' ? (
              <>
                <div className="admin-dashboard__modal-header">
                  <h3>Detail Knowledge Base</h3>
                  <button type="button" className="admin-dashboard__modal-close" onClick={closeKnowledgeModal}>
                    ×
                  </button>
                </div>
                {knowledgeDetailItem ? (
                  <div className="admin-dashboard__kb-detail">
                    <p>
                      <strong>Kategori</strong>
                      <br />
                      {knowledgeDetailItem.kategori}
                    </p>
                    <p>
                      <strong>Paket Umrah</strong>
                      <br />
                      {knowledgeDetailItem.paket_umrah?.nama_paket || 'Tidak terkait paket tertentu'}
                    </p>
                    <p>
                      <strong>Pertanyaan</strong>
                      <br />
                      {knowledgeDetailItem.pertanyaan}
                    </p>
                    <p>
                      <strong>Jawaban</strong>
                      <br />
                      {knowledgeDetailItem.jawaban}
                    </p>
                    <p>
                      <strong>Tanggal Update</strong>
                      <br />
                      {formatDateTime(knowledgeDetailItem.tanggal_update)}
                    </p>
                    <p>
                      <strong>Dibuat Pada</strong>
                      <br />
                      {formatDateTime(knowledgeDetailItem.created_at)}
                    </p>
                    <p>
                      <strong>Diperbarui Pada</strong>
                      <br />
                      {formatDateTime(knowledgeDetailItem.updated_at)}
                    </p>
                  </div>
                ) : (
                  <p className="admin-dashboard__loading">Memuat detail...</p>
                )}
                <div className="admin-dashboard__form-actions">
                  <Button type="button" variant="ghost" onClick={closeKnowledgeModal}>
                    Tutup
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="admin-dashboard__modal-header">
                  <h3>{knowledgeModalMode === 'edit' ? 'Edit Knowledge Base' : 'Tambah Knowledge Base'}</h3>
                  <button type="button" className="admin-dashboard__modal-close" onClick={closeKnowledgeModal}>
                    ×
                  </button>
                </div>

                {knowledgeFormError ? (
                  <div className="admin-dashboard__alert admin-dashboard__alert--error">{knowledgeFormError}</div>
                ) : null}

                <form className="admin-dashboard__form" onSubmit={submitKnowledgeForm}>
                  <input
                    type="text"
                    list="knowledge-category-options"
                    placeholder="Kategori (mis. Harga, Jadwal, Visa)"
                    value={knowledgeForm.kategori}
                    onChange={(event) =>
                      setKnowledgeForm((current) => ({ ...current, kategori: event.target.value }))
                    }
                  />
                  <datalist id="knowledge-category-options">
                    {DEFAULT_KNOWLEDGE_CATEGORIES.map((category) => (
                      <option key={category} value={category} />
                    ))}
                  </datalist>

                  <select
                    value={knowledgeForm.id_paket}
                    onChange={(event) =>
                      setKnowledgeForm((current) => ({ ...current, id_paket: event.target.value }))
                    }
                  >
                    <option value="">Tidak terkait paket tertentu</option>
                    {packageOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <textarea
                    placeholder="Pertanyaan"
                    value={knowledgeForm.pertanyaan}
                    onChange={(event) =>
                      setKnowledgeForm((current) => ({ ...current, pertanyaan: event.target.value }))
                    }
                  />

                  <textarea
                    className="admin-dashboard__kb-answer-input"
                    placeholder="Jawaban"
                    value={knowledgeForm.jawaban}
                    onChange={(event) =>
                      setKnowledgeForm((current) => ({ ...current, jawaban: event.target.value }))
                    }
                  />

                  <div className="admin-dashboard__form-actions">
                    <Button type="submit" variant="primary" disabled={knowledgeSubmitting}>
                      {knowledgeSubmitting
                        ? 'Menyimpan...'
                        : knowledgeModalMode === 'edit'
                          ? 'Simpan Perubahan'
                          : 'Tambah Knowledge'}
                    </Button>
                    <Button type="button" variant="ghost" onClick={closeKnowledgeModal}>
                      Batal
                    </Button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      ) : null}
    </main>
  )
}