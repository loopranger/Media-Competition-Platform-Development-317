import { createClient } from '@supabase/supabase-js'

// Supabase project credentials
const SUPABASE_URL = 'https://iztmhfopvajlshegbxwb.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6dG1oZm9wdmFqbHNoZWdieHdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNjM3ODgsImV4cCI6MjA2NjkzOTc4OH0.Fte5unbNzAiKn40bfq44X7bXene1O8zzo3umMXTQlYE'

// Validate credentials
if (SUPABASE_URL === 'https://your-project-id.supabase.co' || SUPABASE_ANON_KEY === 'your-anon-key') {
  console.warn('Supabase credentials not configured. Using localStorage fallback.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

export default supabase