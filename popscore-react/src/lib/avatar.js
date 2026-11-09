// foto de perfil por usuario (localStorage). Se guarda como imagen chica en base64.
const clave = (email) => `popscore_avatar_${email}`

export function getAvatar(email) {
  try {
    return localStorage.getItem(clave(email))
  } catch {
    return null
  }
}

export function saveAvatar(email, dataUrl) {
  try {
    localStorage.setItem(clave(email), dataUrl)
    window.dispatchEvent(new Event('popscore-avatar'))
    return true
  } catch {
    return false
  }
}

export function removeAvatar(email) {
  try {
    localStorage.removeItem(clave(email))
    window.dispatchEvent(new Event('popscore-avatar'))
  } catch {
    /* sin storage no hay nada que borrar */
  }
}

// recorta la imagen al centro en cuadrado y la achica (ocupa pocos KB en vez de varios MB)
export function resizeImage(file, size = 128) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const lado = Math.min(img.width, img.height)
      const sx = (img.width - lado) / 2
      const sy = (img.height - lado) / 2
      canvas.getContext('2d').drawImage(img, sx, sy, lado, lado, 0, 0, size, size)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.85))
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('No se pudo leer la imagen.'))
    }

    img.src = url
  })
}