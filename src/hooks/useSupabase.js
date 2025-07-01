import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const useSupabase = () => {
  const [isConfigured, setIsConfigured] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkConfiguration = () => {
      const configured = supabase.supabaseUrl !== 'https://your-project-id.supabase.co' && 
                       supabase.supabaseKey !== 'your-anon-key'
      setIsConfigured(configured)
      setIsLoading(false)
    }

    checkConfiguration()
  }, [])

  return { isConfigured, isLoading }
}