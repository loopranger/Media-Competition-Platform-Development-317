import React, { createContext, useContext, useState, useEffect } from 'react'
import { 
  createUserProfile, 
  updateUserProfile, 
  getUserProfile 
} from '../utils/supabaseService'
import { useSupabase } from '../hooks/useSupabase'

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
  const [loading, setLoading] = useState(true)
  const { isConfigured } = useSupabase()

  useEffect(() => {
    // Check for existing user session
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      
      // Sync with Supabase if configured
      if (isConfigured) {
        syncUserWithSupabase(userData.id)
      }
    }
    setLoading(false)
  }, [isConfigured])

  const syncUserWithSupabase = async (userId) => {
    try {
      const supabaseUser = await getUserProfile(userId)
      if (supabaseUser) {
        const updatedUser = { ...user, ...supabaseUser }
        setUser(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
    } catch (error) {
      console.log('User not found in Supabase, will create on next update')
    }
  }

  const login = async (userData) => {
    try {
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))

      // Create user profile in Supabase if configured
      if (isConfigured) {
        try {
          await createUserProfile(userData.id, {
            name: userData.name,
            email: userData.email,
            bio: userData.bio || '',
            location: userData.location || '',
            avatar_url: userData.avatar || null
          })
        } catch (error) {
          console.error('Error creating user profile in Supabase:', error)
        }
      }
    } catch (error) {
      console.error('Error during login:', error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const updateUser = async (userData) => {
    try {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))

      // Update user profile in Supabase if configured
      if (isConfigured) {
        try {
          await updateUserProfile(user.id, {
            name: updatedUser.name,
            email: updatedUser.email,
            bio: updatedUser.bio || '',
            location: updatedUser.location || '',
            avatar_url: updatedUser.avatar || null
          })
        } catch (error) {
          console.error('Error updating user profile in Supabase:', error)
          // Try creating if update fails (user might not exist)
          try {
            await createUserProfile(user.id, {
              name: updatedUser.name,
              email: updatedUser.email,
              bio: updatedUser.bio || '',
              location: updatedUser.location || '',
              avatar_url: updatedUser.avatar || null
            })
          } catch (createError) {
            console.error('Error creating user profile in Supabase:', createError)
          }
        }
      }
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }

  const value = {
    user,
    login,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}