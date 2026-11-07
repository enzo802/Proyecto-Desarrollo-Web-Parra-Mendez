// preferencias de configuracion por usuario (localStorage)
export const POR_DEFECTO = {
  perfilPublico: true,
  spoilers: false,
  idioma: 'es',
  recomendaciones: true,
  notifComunidad: true,
  notifNovedades: false,
}

const clave = (email) => `popscore_prefs_${email}`

export function loadPrefs(email) {
  try {
    return { ...POR_DEFECTO, ...JSON.parse(localStorage.getItem(clave(email))) }
  } catch {
    return { ...POR_DEFECTO }
  }
}

export function savePrefs(email, prefs) {
  try {
    localStorage.setItem(clave(email), JSON.stringify(prefs))
  } catch {
    /* sin storage no se guarda */
  }
}