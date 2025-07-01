import React, { createContext, useContext, useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { 
  createMediaFile, 
  getUserMediaFiles as getSupabaseUserMediaFiles,
  createCompetition as createSupabaseCompetition,
  getCompetitions as getSupabaseCompetitions 
} from '../utils/supabaseService'
import { useSupabase } from '../hooks/useSupabase'

const DataContext = createContext()

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

export const DataProvider = ({ children }) => {
  const [competitions, setCompetitions] = useState([])
  const [mediaFiles, setMediaFiles] = useState([])
  const [votes, setVotes] = useState([])
  const [loading, setLoading] = useState(false)
  const { isConfigured } = useSupabase()

  useEffect(() => {
    loadInitialData()
  }, [isConfigured])

  const loadInitialData = async () => {
    setLoading(true)
    try {
      if (isConfigured) {
        // Load from Supabase
        const supabaseCompetitions = await getSupabaseCompetitions()
        setCompetitions(supabaseCompetitions || [])
      } else {
        // Load from localStorage
        const savedCompetitions = localStorage.getItem('competitions')
        const savedMediaFiles = localStorage.getItem('mediaFiles')
        const savedVotes = localStorage.getItem('votes')

        if (savedCompetitions) {
          setCompetitions(JSON.parse(savedCompetitions))
        }
        if (savedMediaFiles) {
          setMediaFiles(JSON.parse(savedMediaFiles))
        }
        if (savedVotes) {
          setVotes(JSON.parse(savedVotes))
        }
      }
    } catch (error) {
      console.error('Error loading initial data:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveToStorage = (key, data) => {
    if (!isConfigured) {
      localStorage.setItem(key, JSON.stringify(data))
    }
  }

  const addCompetition = async (competition) => {
    try {
      const newCompetition = {
        ...competition,
        id: uuidv4(),
        created_at: new Date().toISOString(),
        entries: [],
        status: 'active'
      }

      if (isConfigured) {
        const supabaseCompetition = await createSupabaseCompetition({
          id: newCompetition.id,
          title: competition.title,
          description: competition.description,
          category: competition.category,
          end_date: competition.endDate || null,
          rules: competition.rules || '',
          prize: competition.prize || '',
          created_by: competition.createdBy,
          creator_name: competition.creatorName,
          status: 'active'
        })
        
        const updatedCompetitions = [...competitions, { ...supabaseCompetition, entries: [] }]
        setCompetitions(updatedCompetitions)
        return supabaseCompetition
      } else {
        const updatedCompetitions = [...competitions, newCompetition]
        setCompetitions(updatedCompetitions)
        saveToStorage('competitions', updatedCompetitions)
        return newCompetition
      }
    } catch (error) {
      console.error('Error adding competition:', error)
      throw error
    }
  }

  const addMediaFile = async (file) => {
    try {
      const newFile = {
        ...file,
        id: uuidv4(),
        created_at: new Date().toISOString()
      }

      if (isConfigured) {
        await createMediaFile({
          id: newFile.id,
          name: file.name,
          file_type: file.type,
          file_size: file.size,
          file_url: file.url,
          user_id: file.userId
        })
      }

      const updatedFiles = [...mediaFiles, newFile]
      setMediaFiles(updatedFiles)
      saveToStorage('mediaFiles', updatedFiles)
      return newFile
    } catch (error) {
      console.error('Error adding media file:', error)
      throw error
    }
  }

  const addEntryToCompetition = (competitionId, entryData) => {
    const updatedCompetitions = competitions.map(comp => {
      if (comp.id === competitionId) {
        const newEntry = {
          ...entryData,
          id: uuidv4(),
          submittedAt: new Date().toISOString(),
          votes: 0
        }
        return { ...comp, entries: [...comp.entries, newEntry] }
      }
      return comp
    })

    setCompetitions(updatedCompetitions)
    saveToStorage('competitions', updatedCompetitions)
  }

  const addVote = (competitionId, entryId, userId) => {
    const voteKey = `${competitionId}-${entryId}-${userId}`
    
    // Check if user already voted for this entry
    if (votes.includes(voteKey)) {
      return false
    }

    // Add vote
    const updatedVotes = [...votes, voteKey]
    setVotes(updatedVotes)
    saveToStorage('votes', updatedVotes)

    // Update competition entry vote count
    const updatedCompetitions = competitions.map(comp => {
      if (comp.id === competitionId) {
        return {
          ...comp,
          entries: comp.entries.map(entry => {
            if (entry.id === entryId) {
              return { ...entry, votes: entry.votes + 1 }
            }
            return entry
          })
        }
      }
      return comp
    })

    setCompetitions(updatedCompetitions)
    saveToStorage('competitions', updatedCompetitions)
    return true
  }

  const hasUserVoted = (competitionId, entryId, userId) => {
    const voteKey = `${competitionId}-${entryId}-${userId}`
    return votes.includes(voteKey)
  }

  const getUserMediaFiles = async (userId) => {
    if (!userId) return []
    
    try {
      if (isConfigured) {
        return await getSupabaseUserMediaFiles(userId)
      } else {
        return mediaFiles.filter(file => file.userId === userId)
      }
    } catch (error) {
      console.error('Error getting user media files:', error)
      return mediaFiles.filter(file => file.userId === userId)
    }
  }

  const value = {
    competitions,
    mediaFiles,
    votes,
    loading,
    addCompetition,
    addMediaFile,
    addEntryToCompetition,
    addVote,
    hasUserVoted,
    getUserMediaFiles,
    isSupabaseConfigured: isConfigured
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}