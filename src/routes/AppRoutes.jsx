import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Home from '../pages/Home/Home'
import About from '../pages/About/About'
import Package from '../pages/Package/Package'
import PackageDetail from '../pages/PackageDetail/PackageDetail'
import GalleryPage from '../pages/Gallery/GalleryPage'
import Blog from '../pages/Blog/Blog'
import Contact from '../pages/Contact/Contact'
import AdminDashboard from '../pages/Admin/AdminDashboard'
import ProtectedRoute from './ProtectedRoute'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="package" element={<Package />} />
        <Route path="package/:slug" element={<PackageDetail />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="blog" element={<Blog />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      <Route
        path="admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}