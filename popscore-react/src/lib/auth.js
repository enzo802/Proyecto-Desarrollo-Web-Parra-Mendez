// logica de usuarios y sesion (localStorage). Sin React, solo funciones.
const USERS_KEY = 'popscore_users'
const SESSION_KEY = 'popscore_session'

const getUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || {}
  } catch {
    return {}
  }
}
const saveUsers = (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users))
const normalizeEmail = (email) => email.trim().toLowerCase()

async function hash(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

function randomSalt() {
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
}

function startSession(user, remember) {
  localStorage.removeItem(SESSION_KEY)
  sessionStorage.removeItem(SESSION_KEY)
  const storage = remember ? localStorage : sessionStorage
  storage.setItem(SESSION_KEY, JSON.stringify({ email: user.email, name: user.name }))
}

export function readSession() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY))
  } catch {
    return null
  }
}

export async function registerUser({ name, email, password }) {
  const users = getUsers()
  const key = normalizeEmail(email)
  if (users[key]) throw new Error('Ya existe una cuenta con ese correo.')

  const salt = randomSalt()
  users[key] = { name: name.trim(), email: key, salt, passHash: await hash(salt + password) }
  saveUsers(users)
}

export async function loginUser({ email, password, remember }) {
  const user = getUsers()[normalizeEmail(email)]
  const ok = user && (await hash(user.salt + password)) === user.passHash
  if (!ok) throw new Error('Correo o contraseña incorrectos.')
  startSession(user, remember)
  return { email: user.email, name: user.name }
}

export function endSession() {
  localStorage.removeItem(SESSION_KEY)
  sessionStorage.removeItem(SESSION_KEY)
}
