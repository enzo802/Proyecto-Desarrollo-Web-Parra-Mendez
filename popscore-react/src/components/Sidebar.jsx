import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const claseActivo = ({ isActive }) => (isActive ? 'activo' : undefined)

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const cerrarSesion = (e) => {
    e.preventDefault()
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside className="sidebar">
      <div className="marca">
        <Link to="/">
          <img src="/images/nombre.png" alt="PopScore" className="logo-marca" />
        </Link>
      </div>

      <nav className="nav-principal" aria-label="Navegación principal">
        <ul>
          <li><NavLink to="/" end className={claseActivo}>Inicio</NavLink></li>
          <li><NavLink to="/resenas" className={claseActivo}>Reseñas</NavLink></li>
          <li><NavLink to="/foros" className={claseActivo}>Foros</NavLink></li>
          <li><NavLink to="/trivia" className={claseActivo}>Trivia</NavLink></li>
        </ul>
      </nav>

      <div className="nav-secundaria">
        <NavLink to="/configuracion" className={claseActivo}>Configuración</NavLink>
        {user ? (
          <a href="/login" onClick={cerrarSesion}>Cerrar sesión</a>
        ) : (
          <Link to="/login">Iniciar sesión</Link>
        )}
      </div>
    </aside>
  )
}
