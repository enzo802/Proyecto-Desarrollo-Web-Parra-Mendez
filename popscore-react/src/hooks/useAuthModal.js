import { useCallback, useState } from 'react'

// estado de la ventana de error de login/registro
export default function useAuthModal() {
  const [data, setData] = useState(null)

  const show = useCallback(
    (message, title = 'Algo salió mal', buttonText = 'Entendido') =>
      setData({ message, title, buttonText, id: Date.now() }),
    []
  )
  const close = useCallback(() => setData(null), [])

  return { data, show, close }
}
