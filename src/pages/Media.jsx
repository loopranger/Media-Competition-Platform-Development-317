import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import SafeIcon from '../common/SafeIcon'
import { uploadFile } from '../utils/supabaseService'
import { useSupabase } from '../hooks/useSupabase'
import * as FiIcons from 'react-icons/fi'

const { FiUpload, FiImage, FiVideo, FiMusic, FiFile, FiEye, FiX, FiCheck, FiDatabase, FiCloud } = FiIcons

const Media = () => {
  const { user } = useAuth()
  const { addMediaFile, getUserMediaFiles, isSupabaseConfigured } = useData()
  const [isDragging, setIsDragging] = useState(false)
  const [previewFile, setPreviewFile] = useState(null)
  const [userMediaFiles, setUserMediaFiles] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef(null)
  const { isConfigured } = useSupabase()

  useEffect(() => {
    if (user?.id) {
      loadUserMedia()
    }
  }, [user?.id])

  const loadUserMedia = async () => {
    try {
      const files = await getUserMediaFiles(user.id)
      setUserMediaFiles(files)
    } catch (error) {
      console.error('Error loading user media:', error)
    }
  }

  const handleFileSelect = async (files) => {
    if (!files || files.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Validate file size (max 50MB)
        if (file.size > 50 * 1024 * 1024) {
          alert(`File ${file.name} is too large. Maximum size is 50MB.`)
          continue
        }

        let fileUrl
        let filePath = null

        if (isConfigured) {
          // Upload to Supabase Storage
          const uploadResult = await uploadFile(file, 'media-files', `user-${user.id}`)
          fileUrl = uploadResult.publicUrl
          filePath = uploadResult.path
        } else {
          // Convert to base64 for localStorage
          fileUrl = await new Promise((resolve) => {
            const reader = new FileReader()
            reader.onload = (e) => resolve(e.target.result)
            reader.readAsDataURL(file)
          })
        }

        const mediaFile = {
          name: file.name,
          type: file.type,
          size: file.size,
          url: fileUrl,
          userId: user.id,
          filePath: filePath
        }

        await addMediaFile(mediaFile)
        setUploadProgress(((i + 1) / files.length) * 100)
      }

      // Reload media files
      await loadUserMedia()
    } catch (error) {
      console.error('Error uploading files:', error)
      alert('Failed to upload some files. Please try again.')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files)
    }
  }

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      handleFileSelect(files)
    }
  }

  const getFileIcon = (type) => {
    if (type?.startsWith('image/')) return FiImage
    if (type?.startsWith('video/')) return FiVideo
    if (type?.startsWith('audio/')) return FiMusic
    return FiFile
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please create a profile to access media management.</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-4">My Media</h1>
        <p className="text-xl text-gray-600">
          Upload and manage your photos, videos, and audio files
        </p>
      </motion.div>

      {/* Storage Status */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-lg flex items-center justify-between ${
          isConfigured 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
        }`}
      >
        <div className="flex items-center space-x-2">
          <SafeIcon icon={isConfigured ? FiCloud : FiDatabase} />
          <span className="font-medium">
            {isConfigured 
              ? 'Files stored in Supabase Cloud Storage' 
              : 'Files stored locally - Connect Supabase for cloud storage'}
          </span>
        </div>
        {isConfigured && (
          <div className="flex items-center space-x-1 text-sm">
            <SafeIcon icon={FiCheck} />
            <span>Cloud Sync Active</span>
          </div>
        )}
      </motion.div>

      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-3xl shadow-xl p-8"
      >
        <div
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
            isDragging 
              ? 'border-primary-500 bg-primary-50 scale-105' 
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full">
              {isUploading ? (
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <SafeIcon icon={FiUpload} className="text-white text-3xl" />
              )}
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {isUploading ? 'Uploading Files...' : 'Upload Your Media'}
              </h3>
              
              {isUploading ? (
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 rounded-full h-2 max-w-md mx-auto">
                    <div 
                      className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">{Math.round(uploadProgress)}% complete</p>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 mb-6">
                    Drag and drop files here, or click to browse
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-primary-600 hover:to-accent-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Choose Files
                  </button>
                </>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*,audio/*"
                onChange={handleFileInputChange}
                disabled={isUploading}
                className="hidden"
              />
            </div>
            
            <div className="text-sm text-gray-500 space-y-1">
              <p>Supports: Images, Videos, Audio files</p>
              <p>Maximum file size: 50MB each</p>
              {isConfigured && (
                <p className="text-green-600 font-medium">✓ Cloud storage enabled</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Media Grid */}
      {userMediaFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              Your Media Files ({userMediaFiles.length})
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {userMediaFiles.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-50 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-square bg-gray-200 relative overflow-hidden">
                  {(file.file_type?.startsWith('image/') || file.type?.startsWith('image/')) ? (
                    <img
                      src={file.file_url || file.url}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <SafeIcon 
                        icon={getFileIcon(file.file_type || file.type)} 
                        className="text-4xl text-gray-400" 
                      />
                    </div>
                  )}
                  
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <button
                      onClick={() => setPreviewFile(file)}
                      className="bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-md transition-all duration-200"
                    >
                      <SafeIcon icon={FiEye} className="text-gray-600" />
                    </button>
                  </div>

                  {isConfigured && (
                    <div className="absolute top-2 left-2">
                      <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                        <SafeIcon icon={FiCloud} className="text-xs" />
                        <span>Cloud</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 truncate mb-1">
                    {file.name}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{formatFileSize(file.file_size || file.size)}</span>
                    <span className="capitalize">
                      {(file.file_type || file.type)?.split('/')[0]}
                    </span>
                  </div>
                  {file.created_at && (
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(file.created_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Preview Modal */}
      {previewFile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewFile(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-white rounded-2xl max-w-4xl max-h-full overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-gray-800">{previewFile.name}</h3>
              <button
                onClick={() => setPreviewFile(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <SafeIcon icon={FiX} className="text-xl" />
              </button>
            </div>
            
            <div className="p-4">
              {(previewFile.file_type?.startsWith('image/') || previewFile.type?.startsWith('image/')) && (
                <img
                  src={previewFile.file_url || previewFile.url}
                  alt={previewFile.name}
                  className="max-w-full max-h-96 mx-auto"
                />
              )}
              
              {(previewFile.file_type?.startsWith('video/') || previewFile.type?.startsWith('video/')) && (
                <video
                  src={previewFile.file_url || previewFile.url}
                  controls
                  className="max-w-full max-h-96 mx-auto"
                />
              )}
              
              {(previewFile.file_type?.startsWith('audio/') || previewFile.type?.startsWith('audio/')) && (
                <div className="text-center py-8">
                  <SafeIcon icon={FiMusic} className="text-6xl text-gray-400 mx-auto mb-4" />
                  <audio
                    src={previewFile.file_url || previewFile.url}
                    controls
                    className="mx-auto"
                  />
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default Media