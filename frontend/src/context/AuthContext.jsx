import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const current = localStorage.getItem('currentUser')
    if (current) setUser(JSON.parse(current))
  }, [])

  const register = ({ email, password }) => {
    // store user in localStorage as a simple users map
    const usersRaw = localStorage.getItem('users')
    const users = usersRaw ? JSON.parse(usersRaw) : {}
    if (users[email]) {
      return { success: false, message: 'User already exists' }
    }
    users[email] = { email, password }
    localStorage.setItem('users', JSON.stringify(users))
    localStorage.setItem('currentUser', JSON.stringify({ email }))
    setUser({ email })
    return { success: true }
  }

  const login = ({ email, password }) => {
    const usersRaw = localStorage.getItem('users')
    const users = usersRaw ? JSON.parse(usersRaw) : {}
    const u = users[email]
    if (!u || u.password !== password) return { success: false, message: 'Invalid credentials' }

    localStorage.setItem('currentUser', JSON.stringify({ email }))
    setUser({ email })
    return { success: true }
  }

  const logout = () => {
    localStorage.removeItem('currentUser')
    setUser(null)
    navigate('/')
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
