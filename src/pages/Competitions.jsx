import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTrophy, FiUsers, FiClock, FiFilter, FiPlus, FiImage, FiVideo, FiMusic } = FiIcons;

const Competitions = () => {
  const { competitions } = useData();
  const { isAuthenticated } = useAuth();
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const categories = [
    { value: 'all', label: 'All Categories', icon: FiTrophy },
    { value: 'photo', label: 'Photo', icon: FiImage },
    { value: 'video', label: 'Video', icon: FiVideo },
    { value: 'audio', label: 'Audio', icon: FiMusic },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'ended', label: 'Ended' },
  ];

  const filteredCompetitions = competitions.filter(comp => {
    const categoryMatch = filterCategory === 'all' || comp.category === filterCategory;
    const statusMatch = filterStatus === 'all' || comp.status === filterStatus;
    return categoryMatch && statusMatch;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'photo': return FiImage;
      case 'video': return FiVideo;
      case 'audio': return FiMusic;
      default: return FiTrophy;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'ended': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Competitions</h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover exciting competitions and showcase your talent
        </p>
        
        {isAuthenticated && (
          <Link
            to="/create-competition"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-600 hover:to-accent-600 transition-all duration-300"
          >
            <SafeIcon icon={FiPlus} />
            <span>Create Competition</span>
          </Link>
        )}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <div className="flex items-center space-x-4 mb-6">
          <SafeIcon icon={FiFilter} className="text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-800">Filter Competitions</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setFilterCategory(category.value)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    filterCategory === category.value
                      ? 'bg-primary-100 text-primary-700 border-2 border-primary-300'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <SafeIcon icon={category.icon} />
                  <span className="font-medium">{category.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Status
            </label>
            <div className="space-y-2">
              {statusOptions.map((status) => (
                <button
                  key={status.value}
                  onClick={() => setFilterStatus(status.value)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ${
                    filterStatus === status.value
                      ? 'bg-primary-100 text-primary-700 border-2 border-primary-300'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Competitions Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {filteredCompetitions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCompetitions.map((competition, index) => (
              <motion.div
                key={competition.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Link
                  to={`/competition/${competition.id}`}
                  className="block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="h-48 bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center relative">
                    <SafeIcon 
                      icon={getCategoryIcon(competition.category)} 
                      className="text-6xl text-primary-400" 
                    />
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(competition.status)}`}>
                      {competition.status}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {competition.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {competition.description}
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <SafeIcon icon={FiUsers} className="text-gray-400" />
                          <span className="text-gray-600">
                            {competition.entries.length} entries
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <SafeIcon icon={FiTrophy} className="text-accent-500" />
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {competition.category}
                          </span>
                        </div>
                      </div>
                      
                      {competition.endDate && (
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <SafeIcon icon={FiClock} />
                          <span>
                            Ends: {new Date(competition.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <SafeIcon icon={FiTrophy} className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No competitions found
            </h3>
            <p className="text-gray-600 mb-6">
              {competitions.length === 0 
                ? "No competitions have been created yet."
                : "Try adjusting your filters to see more results."
              }
            </p>
            {isAuthenticated && competitions.length === 0 && (
              <Link
                to="/create-competition"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-600 hover:to-accent-600 transition-all duration-300"
              >
                <SafeIcon icon={FiPlus} />
                <span>Create First Competition</span>
              </Link>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Competitions;