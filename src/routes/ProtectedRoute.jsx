import { Navigate } from 'react-router-dom'

function getStoredUser() {
const storedUser = localStorage.getItem('authUser')
if (!storedUser) return null

try {
    return JSON.parse(storedUser)
} catch {
    return null
}
}

export default function ProtectedRoute({ children, requiredRole }) {
const token = localStorage.getItem('authToken')
const user = getStoredUser()

if (!token || !user) {
    return <Navigate to="/" replace />
}

if (requiredRole && user.role?.toLowerCase() !== requiredRole.toLowerCase()) {
    return <Navigate to="/" replace />
}

return children
}
