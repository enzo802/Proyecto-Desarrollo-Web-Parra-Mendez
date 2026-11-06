import { createContext, useContext, useState } from 'react'
import { loginUser, registerUser, readSession, endSession } from '../lib/auth.js'

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

  return (
    <AuthContext.Provider value={{ user, login, register: registerUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
