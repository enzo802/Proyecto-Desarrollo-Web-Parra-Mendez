import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Inicio from './pages/Inicio.jsx'
import Resenas from './pages/Resenas.jsx'
import Foros from './pages/Foros.jsx'
import Trivia from './pages/Trivia.jsx'
import Configuracion from './pages/Configuracion.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* paginas con barra lateral */}
      <Route element={<Layout />}>
        <Route path="/" element={<Inicio />} />
        <Route path="/resenas" element={<Resenas />} />
        <Route path="/foros" element={<Foros />} />
        <Route path="/trivia" element={<Trivia />} />
        <Route path="/configuracion" element={<Configuracion />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
