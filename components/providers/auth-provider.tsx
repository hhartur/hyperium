'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { deleteCookie } from 'cookies-next'

interface User {
  id: string
  email: string
  username: string
  email_verified: boolean
  is_admin: boolean
  avatar_url?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const loadUser = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Failed to fetch user', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' })
      if (response.ok) {
        setUser(null)
        deleteCookie('session_token')
        window.location.reload()
      } else {
        throw new Error('Logout failed')
      }
    } catch (error) {
      console.error('Error during logout', error)
      alert('Logout failed') // Simple alert for now
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}

// Alias for backward compatibility with useAuth import
export const useAuth = useAuthContext;