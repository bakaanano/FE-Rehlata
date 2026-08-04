const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
console.log('[auth] API_BASE_URL', API_BASE_URL)

export async function sendGoogleLogin(idToken) {
  const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id_token: idToken }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || data.detail || 'Google login failed')
  }

  return data
}
