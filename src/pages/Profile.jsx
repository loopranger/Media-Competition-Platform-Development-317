import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import SafeIcon from '../common/SafeIcon'
import ProfileImageUpload from '../components/ProfileImageUpload'
import * as FiIcons from 'react-icons/fi'

const { FiUser, FiMapPin, FiCalendar, FiTrophy, FiImage, FiEdit3, FiSave, FiX, FiCheck, FiDatabase } = FiIcons

const Profile = () => {
  const { user, updateUser } = useAuth()
  const { getUserMediaFiles, isSupabaseConfigured } = useData()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editData, setEditData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    avatar: user?.avatar || null
  })
  const [userMediaFiles, setUserMediaFiles] = useState([])
  const [loadingMedia, setLoadingMedia] = useState(false)

  // Load user media files
  React.useEffect(() => {
    if (user?.id) {
      loadUserMedia()
    }
  }, [user?.id])

  const loadUserMedia = async () => {
    setLoadingMedia(true)
    try {
      const files = await getUserMediaFiles(user.id)
      setUserMediaFiles(files)
    } catch (error) {
      console.error('Error loading user media:', error)
    } finally {
      setLoadingMedia(false)
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      await updateUser(editData)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditData(prev => ({ ...prev, [name]: value }))
  }

  const handleAvatarUpdate = (avatarUrl) => {
    setEditData(prev => ({ ...prev, avatar: avatarUrl }))
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please create a profile to view this page.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Supabase Status Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-lg flex items-center space-x-2 ${
          isSupabaseConfigured 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
        }`}
      >
        <SafeIcon icon={FiDatabase} />
        <span className="font-medium">
          {isSupabaseConfigured 
            ? 'Connected to Supabase - Data synced to cloud' 
            : 'Using Local Storage - Connect Supabase for cloud sync'}
        </span>
      </motion.div>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl shadow-xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-primary-500 to-accent-500 h-32"></div>
        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 space-y-4 md:space-y-0 md:space-x-6">
            
            {/* Profile Image */}
            <div className="relative">
              {isEditing ? (
                <ProfileImageUpload
                  currentAvatar={editData.avatar}
                  onAvatarUpdate={handleAvatarUpdate}
                />
              ) : (
                <div className="w-32 h-32 bg-white rounded-full p-2 shadow-lg">
                  <div className="w-full h-full bg-gradient-to-r from-primary-100 to-accent-100 rounded-full flex items-center justify-center overflow-hidden">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <SafeIcon icon={FiUser} className="text-4xl text-primary-400" />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleInputChange}
                    required
                    className="text-2xl font-bold text-gray-800 bg-transparent border-b-2 border-primary-300 focus:border-primary-500 outline-none w-full"
                    placeholder="Your name"
                  />
                  <textarea
                    name="bio"
                    value={editData.bio}
                    onChange={handleInputChange}
                    rows={2}
                    className="text-gray-600 bg-gray-50 border border-gray-300 rounded-lg p-3 w-full resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Tell us about yourself..."
                  />
                  <input
                    type="text"
                    name="location"
                    value={editData.location}
                    onChange={handleInputChange}
                    className="text-gray-500 bg-transparent border-b border-gray-300 focus:border-primary-500 outline-none w-full"
                    placeholder="Your location"
                  />
                  <div className="flex space-x-3">
                    <motion.button
                      type="submit"
                      disabled={isSaving}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center space-x-2 bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <SafeIcon icon={FiSave} />
                      )}
                      <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                    </motion.button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false)
                        setEditData({
                          name: user.name || '',
                          bio: user.bio || '',
                          location: user.location || '',
                          avatar: user.avatar || null
                        })
                      }}
                      className="flex items-center space-x-2 bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <SafeIcon icon={FiX} />
                      <span>Cancel</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center space-x-4">
                    <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-primary-500 hover:text-primary-600 transition-colors p-2 hover:bg-primary-50 rounded-lg"
                    >
                      <SafeIcon icon={FiEdit3} className="text-xl" />
                    </button>
                  </div>
                  {user.bio && (
                    <p className="text-gray-600 leading-relaxed">{user.bio}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    {user.location && (
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiMapPin} />
                        <span>{user.location}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiCalendar} />
                      <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4">
            <SafeIcon icon={FiImage} className="text-white text-xl" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">
            {loadingMedia ? '...' : userMediaFiles.length}
          </h3>
          <p className="text-gray-600">Media Files</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full mb-4">
            <SafeIcon icon={FiTrophy} className="text-white text-xl" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">0</h3>
          <p className="text-gray-600">Competitions Joined</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4">
            <SafeIcon icon={FiTrophy} className="text-white text-xl" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">0</h3>
          <p className="text-gray-600">Wins</p>
        </div>
      </motion.div>

      {/* Recent Media */}
      {userMediaFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Media</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {userMediaFiles.slice(0, 8).map((file) => (
              <div key={file.id} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {file.file_type?.startsWith('image/') || file.type?.startsWith('image/') ? (
                  <img
                    src={file.file_url || file.url}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <SafeIcon icon={FiImage} className="text-2xl text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Profile