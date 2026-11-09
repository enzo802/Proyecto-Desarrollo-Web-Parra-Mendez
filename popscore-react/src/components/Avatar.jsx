import { useEffect, useState } from 'react'
import { getAvatar } from '../lib/avatar.js'

// foto de perfil del usuario, o un circulo con su inicial si no subio ninguna.
// Se actualiza sola cuando cambia la foto (evento popscore-avatar)
export default function Avatar({ email, name = '', size = 40 }) {
  const [foto, setFoto] = useState(() => (email ? getAvatar(email) : null))

  useEffect(() => {
    const leer = () => setFoto(email ? getAvatar(email) : null)
    leer()
    window.addEventListener('popscore-avatar', leer)
    return () => window.removeEventListener('popscore-avatar', leer)
  }, [email])

  if (foto) {
    return <img className="avatar" src={foto} alt={`Foto de ${name}`} style={{ width: size, height: size }} />
  }

  const inicial = name.trim().charAt(0).toUpperCase() || '?'
  return (
    <span
      className="avatar avatar-inicial"
      style={{ width: size, height: size, fontSize: size * 0.45 }}
      aria-hidden="true"
    >
      {inicial}
    </span>
  )
}