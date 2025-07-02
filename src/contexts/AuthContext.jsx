import React, { createContext, useContext, useState, useEffect } from 'react'
import { 
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  getUserProfile,
  updateUserProfile,
  createUserProfile,
  resetPassword
} from '../utils/supabaseService'
import { useSupabase } from '../hooks/useSupabase'
import { supabase } from '../lib/supabase'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)
  const { isConfigured } = useSupabase()

  useEffect(() => {
    initializeAuth()
  }, [isConfigured])

  const initializeAuth = async () => {
    if (isConfigured) {
      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            setUser(session.user)
            await loadUserProfile(session.user.id)
          } else {
            setUser(null)
            setProfile(null)
            // Check localStorage fallback
            loadLocalUser()
          }
          setLoading(false)
        }
      )

      // Get initial session
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        await loadUserProfile(session.user.id)
      } else {
        loadLocalUser()
      }

      return () => subscription?.unsubscribe()
    } else {
      // Fallback to localStorage
      loadLocalUser()
    }
    setLoading(false)
  }

  const loadLocalUser = () => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setProfile(userData)
    }
  }

  const loadUserProfile = async (userId) => {
    try {
      const userProfile = await getUserProfile(userId)
      setProfile(userProfile)
    } catch (error) {
      console.error('Error loading user profile:', error)
    }
  }

  const register = async (email, password, userData) => {
    setAuthLoading(true)
    try {
      if (isConfigured) {
        const { user: newUser } = await signUp(email, password, userData)
        if (newUser) {
          setUser(newUser)
          // Profile will be loaded by the auth state change listener
        }
        return newUser
      } else {
        // Fallback to localStorage
        const newUser = {
          id: Date.now().toString(),
          email,
          ...userData,
          createdAt: new Date().toISOString()
        }
        localStorage.setItem('user', JSON.stringify(newUser))
        setProfile(newUser)
        return newUser
      }
    } catch (error) {
      console.error('Error registering:', error)
      throw error
    } finally {
      setAuthLoading(false)
    }
  }

  const login = async (email, password) => {
    setAuthLoading(true)
    try {
      if (isConfigured) {
        const { user: loggedInUser } = await signIn(email, password)
        if (loggedInUser) {
          setUser(loggedInUser)
          // Profile will be loaded by the auth state change listener
        }
        return loggedInUser
      } else {
        throw new Error('Login requires Supabase configuration')
      }
    } catch (error) {
      console.error('Error logging in:', error)
      throw error
    } finally {
      setAuthLoading(false)
    }
  }

  const logout = async () => {
    setAuthLoading(true)
    try {
      if (isConfigured) {
        await signOut()
      } else {
        localStorage.removeItem('user')
        setProfile(null)
      }
      setUser(null)
      setProfile(null)
    } catch (error) {
      console.error('Error logging out:', error)
    } finally {
      setAuthLoading(false)
    }
  }

  const updateProfile = async (userData) => {
    setAuthLoading(true)
    try {
      if (isConfigured && user) {
        const updatedProfile = await updateUserProfile(user.id, userData)
        setProfile(updatedProfile)
        return updatedProfile
      } else if (profile) {
        // Update localStorage
        const updatedProfile = { ...profile, ...userData }
        localStorage.setItem('user', JSON.stringify(updatedProfile))
        setProfile(updatedProfile)
        return updatedProfile
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    } finally {
      setAuthLoading(false)
    }
  }

  const sendPasswordReset = async (email) => {
    if (!isConfigured) {
      throw new Error('Password reset requires Supabase configuration')
    }

    try {
      await resetPassword(email)
    } catch (error) {
      console.error('Error sending password reset:', error)
      throw error
    }
  }

  const value = {
    user: user || profile, // Use Supabase user if available, otherwise profile
    profile,
    loading,
    authLoading,
    isAuthenticated: !!(user || profile),
    isSupabaseAuth: !!user, // True if using Supabase auth
    register,
    login,
    logout,
    updateProfile,
    sendPasswordReset
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}