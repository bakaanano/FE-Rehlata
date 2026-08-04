import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/Footer/Footer'
import Chatbot from '../components/Chatbot/Chatbot'

export default function MainLayout() {
  return (
    <div className="site-shell">
      <Navbar />
      <Outlet />
      <Footer />
      <Chatbot />
    </div>
  )
}