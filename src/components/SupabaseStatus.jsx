import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import SafeIcon from '../common/SafeIcon'
import { useSupabase } from '../hooks/useSupabase'
import { useAuth } from '../contexts/AuthContext'
import * as FiIcons from 'react-icons/fi'

const { FiCheck, FiCloud, FiDatabase, FiUsers, FiShield } = FiIcons

const SupabaseStatus = () => {
  const { isConfigured } = useSupabase()
  const { isSupabaseAuth } = useAuth()
  const [dbStatus, setDbStatus] = useState('checking')

  useEffect(() => {
    if (isConfigured) {
      setDbStatus('connected')
    } else {
      setDbStatus('disconnected')
    }
  }, [isConfigured])

  if (!isConfigured) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg"
      >
        <div className="flex items-center space-x-2">
          <SafeIcon icon={FiDatabase} />
          <span className="font-medium">Local Storage Mode</span>
        </div>
        <p className="text-sm mt-1">
          Connect to Supabase for cloud sync and authentication
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg"
    >
      <div className="flex items-center space-x-2 mb-2">
        <SafeIcon icon={FiCloud} />
        <span className="font-medium">Supabase Connected</span>
        <SafeIcon icon={FiCheck} className="text-green-600" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <SafeIcon icon={FiDatabase} />
          <span>Database: Ready</span>
        </div>
        <div className="flex items-center space-x-2">
          <SafeIcon icon={FiUsers} />
          <span>Auth: {isSupabaseAuth ? 'Active' : 'Ready'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <SafeIcon icon={FiShield} />
          <span>Storage: Ready</span>
        </div>
      </div>
    </motion.div>
  )
}

export default SupabaseStatus