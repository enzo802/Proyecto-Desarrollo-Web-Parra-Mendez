import { getAvatar } from '../lib/avatar.js'

// foto de perfil del usuario, o un circulo con su inicial si no subio ninguna
export default function Avatar({ email, name = '', size = 40 }) {
  const foto = email ? getAvatar(email) : null

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