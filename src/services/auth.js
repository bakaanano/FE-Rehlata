const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export async function sendGoogleLogin(credential) {
  const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // PENTING: key harus "id_token", bukan "credential"
    body: JSON.stringify({ id_token: credential }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    console.error('[sendGoogleLogin] backend menolak:', data)
    throw new Error(data.detail || data.error || 'Login gagal')
  }

  return data
}