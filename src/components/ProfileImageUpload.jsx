import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import SafeIcon from '../common/SafeIcon'
import { uploadFile, deleteFile } from '../utils/supabaseService'
import { useSupabase } from '../hooks/useSupabase'
import * as FiIcons from 'react-icons/fi'

const { FiUser, FiCamera, FiUpload, FiX, FiCheck } = FiIcons

const ProfileImageUpload = ({ currentAvatar, onAvatarUpdate, className = '' }) => {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState(currentAvatar)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)
  const { isConfigured } = useSupabase()

  const handleFileSelect = async (file) => {
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    setIsUploading(true)

    try {
      let avatarUrl

      if (isConfigured) {
        // Upload to Supabase Storage
        const uploadResult = await uploadFile(file, 'avatars', 'profiles')
        avatarUrl = uploadResult.publicUrl
      } else {
        // Convert to base64 for localStorage
        const reader = new FileReader()
        avatarUrl = await new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target.result)
          reader.readAsDataURL(file)
        })
      }

      setPreview(avatarUrl)
      onAvatarUpdate(avatarUrl)
    } catch (error) {
      console.error('Error uploading avatar:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  const removeAvatar = () => {
    setPreview(null)
    onAvatarUpdate(null)
  }

  return (
    <div className={`relative ${className}`}>
      <div
        className={`relative group cursor-pointer transition-all duration-200 ${
          dragActive ? 'scale-105' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {/* Avatar Display */}
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-r from-primary-100 to-accent-100 flex items-center justify-center relative">
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <SafeIcon icon={FiUser} className="text-4xl text-primary-400" />
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {isUploading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <SafeIcon icon={FiCamera} className="text-white text-2xl" />
              )}
            </div>
          </div>
        </div>

        {/* Upload Indicator */}
        {dragActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-primary-500 bg-opacity-90 rounded-full flex items-center justify-center"
          >
            <SafeIcon icon={FiUpload} className="text-white text-3xl" />
          </motion.div>
        )}
      </div>

      {/* Action Buttons */}
      {preview && (
        <div className="absolute -bottom-2 -right-2 flex space-x-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              fileInputRef.current?.click()
            }}
            disabled={isUploading}
            className="bg-primary-500 hover:bg-primary-600 text-white p-2 rounded-full shadow-lg transition-colors duration-200 disabled:opacity-50"
          >
            <SafeIcon icon={FiCamera} className="text-sm" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              removeAvatar()
            }}
            disabled={isUploading}
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors duration-200 disabled:opacity-50"
          >
            <SafeIcon icon={FiX} className="text-sm" />
          </button>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Upload Instructions */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Click or drag image to upload
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Supports JPG, PNG (max 5MB)
        </p>
        {isConfigured && (
          <p className="text-xs text-green-600 mt-1 flex items-center justify-center space-x-1">
            <SafeIcon icon={FiCheck} />
            <span>Supabase Storage Active</span>
          </p>
        )}
      </div>
    </div>
  )
}

export default ProfileImageUpload