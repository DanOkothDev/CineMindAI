import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-ink">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
