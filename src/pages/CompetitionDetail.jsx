import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTrophy, FiUsers, FiCalendar, FiTag, FiImage, FiVideo, FiMusic, FiHeart, FiPlus, FiUpload, FiStar, FiClock, FiUser } = FiIcons;

const CompetitionDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { competitions, addEntryToCompetition, addVote, hasUserVoted, getUserMediaFiles } = useData();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const competition = competitions.find(comp => comp.id === id);
  const userMediaFiles = getUserMediaFiles(user?.id);

  if (!competition) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
          <SafeIcon icon={FiTrophy} className="text-3xl text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Competition not found
        </h3>
        <p className="text-gray-600 mb-6">
          The competition you're looking for doesn't exist.
        </p>
        <Link
          to="/competitions"
          className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-600 hover:to-accent-600 transition-all duration-300"
        >
          Browse Competitions
        </Link>
      </div>
    );
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'photo': return FiImage;
      case 'video': return FiVideo;
      case 'audio': return FiMusic;
      default: return FiTrophy;
    }
  };

  const handleVote = (entryId) => {
    if (!isAuthenticated) return;
    addVote(competition.id, entryId, user.id);
  };

  const handleSubmitEntry = () => {
    if (!selectedFile) return;
    
    const entryData = {
      userId: user.id,
      userName: user.name,
      fileId: selectedFile.id,
      fileName: selectedFile.name,
      fileUrl: selectedFile.url,
      fileType: selectedFile.type
    };
    
    addEntryToCompetition(competition.id, entryData);
    setShowSubmitModal(false);
    setSelectedFile(null);
  };

  const userHasSubmitted = competition.entries.some(entry => entry.userId === user?.id);
  const isExpired = competition.endDate && new Date(competition.endDate) < new Date();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Competition Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl shadow-xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-primary-500 to-accent-500 h-32"></div>
        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <div className="w-32 h-32 bg-white rounded-full p-4 shadow-lg">
                <div className="w-full h-full bg-gradient-to-r from-primary-100 to-accent-100 rounded-full flex items-center justify-center">
                  <SafeIcon 
                    icon={getCategoryIcon(competition.category)} 
                    className="text-4xl text-primary-500" 
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {competition.title}
                  </h1>
                  <p className="text-gray-600 mb-4">
                    {competition.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiUser} />
                      <span>by {competition.creatorName}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiUsers} />
                      <span>{competition.entries.length} entries</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiTag} />
                      <span className="capitalize">{competition.category}</span>
                    </div>
                    {competition.endDate && (
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiCalendar} />
                        <span>
                          {isExpired ? 'Ended' : 'Ends'}: {new Date(competition.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {isAuthenticated && !userHasSubmitted && !isExpired && (
                  <button
                    onClick={() => setShowSubmitModal(true)}
                    className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-600 hover:to-accent-600 transition-all duration-300 flex items-center space-x-2"
                  >
                    <SafeIcon icon={FiPlus} />
                    <span>Submit Entry</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Competition Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Rules */}
        {competition.rules && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Rules & Guidelines</h2>
            <p className="text-gray-600 whitespace-pre-wrap">{competition.rules}</p>
          </motion.div>
        )}

        {/* Prize */}
        {competition.prize && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Prize</h2>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-accent-500 to-primary-500 rounded-full flex items-center justify-center">
                <SafeIcon icon={FiStar} className="text-white text-xl" />
              </div>
              <p className="text-gray-600 text-lg">{competition.prize}</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Entries */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white rounded-2xl shadow-lg p-8"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Entries ({competition.entries.length})
        </h2>

        {competition.entries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competition.entries
              .sort((a, b) => b.votes - a.votes)
              .map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="bg-gray-50 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-square bg-gray-200 relative overflow-hidden">
                  {entry.fileType.startsWith('image/') ? (
                    <img 
                      src={entry.fileUrl} 
                      alt={entry.fileName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <SafeIcon 
                        icon={entry.fileType.startsWith('video/') ? FiVideo : FiMusic} 
                        className="text-4xl text-gray-400"
                      />
                    </div>
                  )}
                  
                  {index < 3 && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-accent-500 to-primary-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      #{index + 1}
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {entry.fileName}
                    </h3>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <SafeIcon icon={FiHeart} className="text-red-500" />
                      <span>{entry.votes}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">by {entry.userName}</p>
                  
                  {isAuthenticated && user.id !== entry.userId && !isExpired && (
                    <button
                      onClick={() => handleVote(entry.id)}
                      disabled={hasUserVoted(competition.id, entry.id, user.id)}
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                        hasUserVoted(competition.id, entry.id, user.id)
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:from-primary-600 hover:to-accent-600'
                      }`}
                    >
                      {hasUserVoted(competition.id, entry.id, user.id) ? 'Voted' : 'Vote'}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <SafeIcon icon={FiUpload} className="text-2xl text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No entries yet
            </h3>
            <p className="text-gray-600">
              Be the first to submit an entry to this competition!
            </p>
          </div>
        )}
      </motion.div>

      {/* Submit Entry Modal */}
      {showSubmitModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowSubmitModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Submit Your Entry
              </h3>
              
              {userMediaFiles.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Select a file from your media library to submit:
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                    {userMediaFiles.map((file) => (
                      <button
                        key={file.id}
                        onClick={() => setSelectedFile(file)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          selectedFile?.id === file.id
                            ? 'border-primary-500 ring-2 ring-primary-200'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {file.type.startsWith('image/') ? (
                          <img 
                            src={file.url} 
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <SafeIcon 
                              icon={file.type.startsWith('video/') ? FiVideo : FiMusic} 
                              className="text-2xl text-gray-400"
                            />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t">
                    <button
                      onClick={() => setShowSubmitModal(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitEntry}
                      disabled={!selectedFile}
                      className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-primary-600 hover:to-accent-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Submit Entry
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <SafeIcon icon={FiUpload} className="text-4xl text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    You need to upload media files first before submitting an entry.
                  </p>
                  <Link
                    to="/media"
                    className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-primary-600 hover:to-accent-600 transition-all duration-300"
                    onClick={() => setShowSubmitModal(false)}
                  >
                    Upload Media
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default CompetitionDetail;