import Modal from './Modal.jsx'

// poster en grande (se abre al hacer click en el poster de una tarjeta)
export default function PosterLightbox({ url, title, onClose }) {
  return (
    <Modal onClose={onClose} extraClass="modal-poster-overlay" ariaLabel="Póster en tamaño completo">
      <div className="modal-poster-contenido">
        <button type="button" className="modal-cerrar btn-cerrar-poster" aria-label="Cerrar póster" onClick={onClose}>
          &times;
        </button>
        <img src={url} alt={`Póster oficial de ${title}`} />
        <h3 className="lightbox-poster-titulo">{title}</h3>
      </div>
    </Modal>
  )
}
