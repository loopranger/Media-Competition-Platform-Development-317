import { supabase } from '../lib/supabase'

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  return supabase.supabaseUrl !== 'https://your-project-id.supabase.co' && 
         supabase.supabaseKey !== 'your-anon-key'
}

// Authentication functions
export const signUp = async (email, password, userData) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured')
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name,
          bio: userData.bio || '',
          location: userData.location || ''
        }
      }
    })

    if (error) throw error

    // Create user profile
    if (data.user) {
      await createUserProfile(data.user.id, {
        email: data.user.email,
        name: userData.name,
        bio: userData.bio || '',
        location: userData.location || '',
        avatar_url: userData.avatar || null
      })
    }

    return data
  } catch (error) {
    console.error('Error signing up:', error)
    throw error
  }
}

export const signIn = async (email, password) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured')
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error signing in:', error)
    throw error
  }
}

export const signOut = async () => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured')
  }

  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    console.error('Error signing out:', error)
    throw error
  }
}

export const getCurrentUser = async () => {
  if (!isSupabaseConfigured()) {
    return null
  }

  try {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export const resetPassword = async (email) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured')
  }

  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error resetting password:', error)
    throw error
  }
}

// Upload file to Supabase Storage
export const uploadFile = async (file, bucket = 'media-files', folder = '') => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured')
  }

  try {
    const user = await getCurrentUser()
    if (!user) throw new Error('User not authenticated')

    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
    const filePath = folder ? `${user.id}/${folder}/${fileName}` : `${user.id}/${fileName}`

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
      .from('user_profiles_auth_2024')
      .insert([{
        id: userId,
        email: profileData.email,
        name: profileData.name,
        bio: profileData.bio || '',
        location: profileData.location || '',
        avatar_url: profileData.avatar_url || null
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
      .from('user_profiles_auth_2024')
      .update({
        name: profileData.name,
        bio: profileData.bio || '',
        location: profileData.location || '',
        avatar_url: profileData.avatar_url || null,
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
      .from('user_profiles_auth_2024')
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
    const user = await getCurrentUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('media_files_auth_2024')
      .insert([{
        user_id: user.id,
        name: fileData.name,
        file_type: fileData.file_type,
        file_size: fileData.file_size,
        file_url: fileData.file_url,
        file_path: fileData.file_path
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
      .from('media_files_auth_2024')
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
    const user = await getCurrentUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('competitions_auth_2024')
      .insert([{
        title: competitionData.title,
        description: competitionData.description,
        category: competitionData.category,
        rules: competitionData.rules || '',
        prize: competitionData.prize || '',
        end_date: competitionData.end_date || null,
        created_by: user.id,
        creator_name: competitionData.creator_name,
        status: 'active'
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
      .from('competitions_auth_2024')
      .select(`
        *,
        competition_entries_auth_2024 (
          id,
          user_id,
          media_file_id,
          votes,
          created_at,
          user_profiles_auth_2024 (name),
          media_files_auth_2024 (name, file_url, file_type)
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    
    // Transform data to match expected format
    return data.map(comp => ({
      ...comp,
      entries: comp.competition_entries_auth_2024 || []
    }))
  } catch (error) {
    console.error('Error fetching competitions:', error)
    throw error
  }
}

// Voting operations
export const addVote = async (competitionId, entryId) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured')
  }

  try {
    const user = await getCurrentUser()
    if (!user) throw new Error('User not authenticated')

    // Check if user already voted
    const { data: existingVote, error: checkError } = await supabase
      .from('votes_auth_2024')
      .select('id')
      .eq('competition_id', competitionId)
      .eq('entry_id', entryId)
      .eq('user_id', user.id)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError
    }

    if (existingVote) {
      return false // User already voted
    }

    // Add vote
    const { error: voteError } = await supabase
      .from('votes_auth_2024')
      .insert([{
        competition_id: competitionId,
        entry_id: entryId,
        user_id: user.id
      }])

    if (voteError) throw voteError

    // Update entry vote count
    const { error: updateError } = await supabase
      .from('competition_entries_auth_2024')
      .update({ votes: supabase.raw('votes + 1') })
      .eq('id', entryId)

    if (updateError) throw updateError

    return true
  } catch (error) {
    console.error('Error adding vote:', error)
    throw error
  }
}

export const hasUserVoted = async (competitionId, entryId, userId) => {
  if (!isSupabaseConfigured()) {
    return false
  }

  try {
    const { data, error } = await supabase
      .from('votes_auth_2024')
      .select('id')
      .eq('competition_id', competitionId)
      .eq('entry_id', entryId)
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    return !!data
  } catch (error) {
    console.error('Error checking vote:', error)
    return false
  }
}