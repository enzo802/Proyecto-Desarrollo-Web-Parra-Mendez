import { createContext, useContext, useState } from 'react'
import { loginUser, registerUser, readSession, endSession, updateName } from '../lib/auth.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readSession())

  const login = async (data) => {
    const u = await loginUser(data)
    setUser(u)
    return u
  }

  const logout = () => {
    endSession()
    setUser(null)
  }

  // cambia el nombre y actualiza al usuario en toda la app
  const updateProfile = (name) => {
    updateName(user.email, name)
    setUser((u) => ({ ...u, name: name.trim() }))
  }

  return (
    <AuthContext.Provider value={{ user, login, register: registerUser, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)