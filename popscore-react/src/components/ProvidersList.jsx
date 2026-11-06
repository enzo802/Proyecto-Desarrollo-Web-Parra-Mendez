const CATEGORIAS = [
  { clave: 'flatrate', titulo: 'Streaming (Suscripción)' },
  { clave: 'rent', titulo: 'Alquiler Digital' },
  { clave: 'buy', titulo: 'Compra Digital' },
  { clave: 'free', titulo: 'Gratuito / Con Anuncios' },
  { clave: 'ads', titulo: 'Con Publicidad' },
]

// plataformas donde se puede ver (datos de JustWatch via TMDB)
export default function ProvidersList({ results, status }) {
  if (status === 'loading') {
    return <p className="sin-proveedores">Buscando servicios y plataformas legales...</p>
  }
  if (status === 'error') {
    return <p className="sin-proveedores">No se pudo cargar la información de las plataformas legales.</p>
  }
  if (!results || Object.keys(results).length === 0) {
    return (
      <p className="sin-proveedores">
        No hay información de plataformas de streaming legales registrada para esta película actualmente.
      </p>
    )
  }

  // pais en este orden: AR, ES, MX, US, y si no hay ninguno el primero que venga
  const region = results.AR || results.ES || results.MX || results.US || Object.values(results)[0]
  const grupos = CATEGORIAS.filter((cat) => region[cat.clave]?.length > 0)

  return (
    <>
      {grupos.length === 0 && (
        <p className="sin-proveedores">
          Actualmente no está disponible en servicios de streaming o alquiler digital en esta región.
        </p>
      )}

      {grupos.map((cat) => (
        <div className="grupo-proveedores" key={cat.clave}>
          <span className="grupo-proveedores-titulo">{cat.titulo}</span>
          <div className="proveedores-grid">
            {region[cat.clave].map((prov) => (
              <div className="proveedor-card" key={prov.provider_id}>
                {prov.logo_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/original${prov.logo_path}`}
                    alt={prov.provider_name}
                    className="proveedor-logo"
                    loading="lazy"
                  />
                )}
                <span className="proveedor-nombre">{prov.provider_name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {region.link && (
        <a className="link-justwatch" href={region.link} target="_blank" rel="noopener noreferrer">
          Ver todas las opciones de visualización y precios en JustWatch ↗
        </a>
      )}
    </>
  )
}
