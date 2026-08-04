const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

function getAuthHeaders() {
  const token = localStorage.getItem('authToken')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const error = new Error(data.detail || data.error || 'Permintaan admin gagal')
    error.status = response.status
    throw error
  }

  return data
}

export async function getAdminDashboard() {
  const response = await fetch(`${API_BASE_URL}/api/admin/dashboard`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  return handleResponse(response)
}

export async function getPackages() {
  const response = await fetch(`${API_BASE_URL}/api/admin/packages`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  return handleResponse(response)
}

export async function createPackage(payload) {
  const response = await fetch(`${API_BASE_URL}/api/admin/packages`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  })
  return handleResponse(response)
}

export async function updatePackage(id, payload) {
  const response = await fetch(`${API_BASE_URL}/api/admin/packages/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  })
  return handleResponse(response)
}

export async function deletePackage(id) {
  const response = await fetch(`${API_BASE_URL}/api/admin/packages/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  return handleResponse(response)
}

export async function getSchedules() {
  const response = await fetch(`${API_BASE_URL}/api/admin/schedules`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  return handleResponse(response)
}

export async function createSchedule(payload) {
  const response = await fetch(`${API_BASE_URL}/api/admin/schedules`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  })
  return handleResponse(response)
}

export async function updateSchedule(id, payload) {
  const response = await fetch(`${API_BASE_URL}/api/admin/schedules/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  })
  return handleResponse(response)
}

export async function deleteSchedule(id) {
  const response = await fetch(`${API_BASE_URL}/api/admin/schedules/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  return handleResponse(response)
}
