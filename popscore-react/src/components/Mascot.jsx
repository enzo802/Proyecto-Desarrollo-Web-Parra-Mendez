import { useEffect, useRef } from 'react'

// mascota de pochoclos: las pupilas siguen el mouse y los ojos se cierran con eyesClosed
export default function Mascot({ eyesClosed = false }) {
  const ref = useRef(null)

  useEffect(() => {
    const onMove = (event) => {
      if (!ref.current) return
      ref.current.querySelectorAll('.eye').forEach((eye) => {
        const pupil = eye.querySelector('.pupil')
        if (!pupil) return

        const rect = eye.getBoundingClientRect()
        const deltaX = event.clientX - (rect.left + rect.width / 2)
        const deltaY = event.clientY - (rect.top + rect.height / 2)

        const angle = Math.atan2(deltaY, deltaX)
        const distance = Math.hypot(deltaX, deltaY)
        const distanceScale = Math.min(distance / 400, 1)

        const moveX = Math.cos(angle) * rect.width * 0.17 * distanceScale
        const moveY = Math.sin(angle) * rect.height * 0.17 * distanceScale

        pupil.style.setProperty('--dx', `${moveX}px`)
        pupil.style.setProperty('--dy', `${moveY}px`)
      })
    }

    document.addEventListener('mousemove', onMove)
    return () => document.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div className="stage">
      <div
        ref={ref}
        className={`mascot${eyesClosed ? ' eyes-closed' : ''}`}
        role="img"
        aria-label="PopScore, la mascota de pochoclos"
      >
        <img src="/images/logo-ojos-vacios.png" alt="" className="mascot-img" draggable={false} />
        <div className="eye eye-left" aria-hidden="true"><span className="pupil"></span></div>
        <div className="eye eye-right" aria-hidden="true"><span className="pupil"></span></div>
      </div>
      <p className="wordmark">PopScore</p>
    </div>
  )
}
