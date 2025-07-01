import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTrophy, FiUsers, FiImage, FiVideo, FiMusic, FiArrowRight, FiStar } = FiIcons;

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { competitions } = useData();

  const features = [
    {
      icon: FiImage,
      title: 'Photo Competitions',
      description: 'Showcase your photography skills and compete with others',
      color: 'from-blue-500 to-purple-500'
    },
    {
      icon: FiVideo,
      title: 'Video Contests',
      description: 'Create stunning videos and let the community vote',
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: FiMusic,
      title: 'Audio Battles',
      description: 'Share your music, podcasts, and audio creations',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: FiUsers,
      title: 'Community Voting',
      description: 'Fair and transparent community-driven competitions',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const recentCompetitions = competitions.slice(0, 3);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-20"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mb-6">
              <SafeIcon icon={FiTrophy} className="text-white text-3xl" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary-600 via-accent-600 to-primary-800 bg-clip-text text-transparent mb-6">
              MediaComp
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Compete, Create, and Win with your multimedia content
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {isAuthenticated ? (
              <>
                <Link
                  to="/competitions"
                  className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Browse Competitions
                </Link>
                <Link
                  to="/create-competition"
                  className="border-2 border-primary-500 text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-50 transition-all duration-300"
                >
                  Create Competition
                </Link>
              </>
            ) : (
              <Link
                to="/create-profile"
                className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Get Started
              </Link>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="py-16"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            What You Can Do
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your creative content and participate in exciting competitions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl mb-6`}>
                <SafeIcon icon={feature.icon} className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Recent Competitions */}
      {recentCompetitions.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="py-16"
        >
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Recent Competitions
              </h2>
              <p className="text-xl text-gray-600">
                Join the latest competitions and showcase your talent
              </p>
            </div>
            <Link
              to="/competitions"
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-semibold"
            >
              <span>View All</span>
              <SafeIcon icon={FiArrowRight} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentCompetitions.map((competition, index) => (
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
                  <div className="h-48 bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                    <SafeIcon icon={FiTrophy} className="text-6xl text-primary-400" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {competition.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {competition.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <SafeIcon icon={FiUsers} className="text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {competition.entries.length} entries
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiStar} className="text-accent-500" />
                        <span className="text-sm font-medium text-gray-700">
                          {competition.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="py-20 bg-gradient-to-r from-primary-500 to-accent-500 rounded-3xl text-white text-center"
      >
        <div className="max-w-3xl mx-auto px-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Compete?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of creators showcasing their talent and competing for recognition
          </p>
          {!isAuthenticated && (
            <Link
              to="/create-profile"
              className="inline-flex items-center space-x-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
              <span>Create Your Profile</span>
              <SafeIcon icon={FiArrowRight} />
            </Link>
          )}
        </div>
      </motion.section>
    </div>
  );
};

export default Home;