import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import usePage from '../hooks/usePage.js'

export default function Layout() {
  usePage({ bodyClass: 'app-page' })

  return (
    <div className="layout">
      <Sidebar />
      <main className="contenido-principal">
        <Outlet />
      </main>
    </div>
  )
}
