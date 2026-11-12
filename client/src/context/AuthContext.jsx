import { useState } from 'react'
import { AuthContext } from './authContextInstance'

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    return (
      localStorage.getItem('blog_admin_token') ||
      localStorage.getItem('token') ||
      null
    )
  })

  const [user, setUser] = useState(() => {
    try {
      const savedUser =
        localStorage.getItem('blog_admin_user') ||
        localStorage.getItem('user')
      return savedUser ? JSON.parse(savedUser) : null
    } catch {
      return null
    }
  })

  const login = (newToken, newUser) => {
    setToken(newToken)
    setUser(newUser)
    localStorage.setItem('blog_admin_token', newToken)
    localStorage.setItem('token', newToken)
    if (newUser) {
      const userStr = JSON.stringify(newUser)
      localStorage.setItem('blog_admin_user', userStr)
      localStorage.setItem('user', userStr)
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('blog_admin_token')
    localStorage.removeItem('blog_admin_user')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: Boolean(token),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
