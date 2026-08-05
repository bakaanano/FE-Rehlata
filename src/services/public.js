const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.detail || data.error || 'Permintaan gagal');
    error.status = response.status;
    throw error;
  }

  return data;
}

export async function getPublicPackages() {
  const response = await fetch(`${API_BASE_URL}/api/public/packages`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  return handleResponse(response);
}

export async function getPublicSchedules() {
  const response = await fetch(`${API_BASE_URL}/api/public/schedules`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  return handleResponse(response);
}
