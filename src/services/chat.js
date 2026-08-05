const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const error = new Error(data.detail || data.error || 'Permintaan gagal')
    error.status = response.status
    throw error
  }

  return data
}

export async function sendChatMessage({ message, id_pengguna }) {
  const token = localStorage.getItem('authToken')
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  const response = await fetch(`${API_BASE_URL}/api/chat/send`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      message,
      user_id: id_pengguna,
    }),
  })

  return handleResponse(response)
}

export async function getChatBotInfo() {
  const response = await fetch(`${API_BASE_URL}/api/chat/info`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return handleResponse(response)
}
