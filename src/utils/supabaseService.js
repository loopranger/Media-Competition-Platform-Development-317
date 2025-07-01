import { supabase } from '../lib/supabase'

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  return supabase.supabaseUrl !== 'https://your-project-id.supabase.co' && 
         supabase.supabaseKey !== 'your-anon-key'
}

// Upload file to Supabase Storage
export const uploadFile = async (file, bucket = 'media-files', folder = '') => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured')
  }

  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
    const filePath = folder ? `${folder}/${fileName}` : fileName

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    return {
      path: data.path,
      publicUrl,
      fullPath: data.fullPath
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}

// Delete file from Supabase Storage
export const deleteFile = async (filePath, bucket = 'media-files') => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured')
  }

  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath])

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting file:', error)
    throw error
  }
}

// User profile operations
export const createUserProfile = async (userId, profileData) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured')
  }

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([{
        id: userId,
        ...profileData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()

    if (error) throw error
    return data[0]
  } catch (error) {
    console.error('Error creating user profile:', error)
    throw error
  }
}

export const updateUserProfile = async (userId, profileData) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured')
  }

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()

    if (error) throw error
    return data[0]
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw error
  }
}

export const getUserProfile = async (userId) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured')
  }

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching user profile:', error)
    throw error
  }
}

// Media file operations
export const createMediaFile = async (fileData) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured')
  }

  try {
    const { data, error } = await supabase
      .from('media_files')
      .insert([{
        ...fileData,
        created_at: new Date().toISOString()
      }])
      .select()

    if (error) throw error
    return data[0]
  } catch (error) {
    console.error('Error creating media file:', error)
    throw error
  }
}

export const getUserMediaFiles = async (userId) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured')
  }

  try {
    const { data, error } = await supabase
      .from('media_files')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching user media files:', error)
    throw error
  }
}

// Competition operations
export const createCompetition = async (competitionData) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured')
  }

  try {
    const { data, error } = await supabase
      .from('competitions')
      .insert([{
        ...competitionData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()

    if (error) throw error
    return data[0]
  } catch (error) {
    console.error('Error creating competition:', error)
    throw error
  }
}

export const getCompetitions = async () => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured')
  }

  try {
    const { data, error } = await supabase
      .from('competitions')
      .select(`
        *,
        competition_entries (
          id,
          user_id,
          media_file_id,
          created_at,
          user_profiles (name),
          media_files (name, file_url, file_type)
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching competitions:', error)
    throw error
  }
}