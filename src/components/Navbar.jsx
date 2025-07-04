import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import AuthModal from './AuthModal';
import * as FiIcons from 'react-icons/fi';

const { FiHome, FiUser, FiTrophy, FiImage, FiPlus, FiMenu, FiX, FiLogOut, FiLogIn, FiUserPlus } = FiIcons;

const Navbar = () => {
  const { profile, logout, isAuthenticated, isSupabaseAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const openAuthModal = (tab) => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Home', icon: FiHome },
    { path: '/competitions', label: 'Competitions', icon: FiTrophy },
    { path: '/media', label: 'Media', icon: FiImage, requireAuth: true },
    { path: '/profile', label: 'Profile', icon: FiUser, requireAuth: true },
  ];

  const filteredNavItems = navItems.filter(item => 
    !item.requireAuth || (item.requireAuth && isAuthenticated)
  );

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiTrophy} className="text-white text-lg" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              MediaComp
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {filteredNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-100'
                }`}
              >
                <SafeIcon icon={item.icon} className="text-lg" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}

            {isAuthenticated && (
              <Link
                to="/create-competition"
                className="flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-4 py-2 rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-200"
              >
                <SafeIcon icon={FiPlus} />
                <span>Create</span>
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center overflow-hidden">
                    {profile?.avatar_url || profile?.avatar ? (
                      <img
                        src={profile.avatar_url || profile.avatar}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-sm font-bold">
                        {profile?.name?.charAt(0) || 'U'}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-700 font-medium text-sm">{profile?.name}</span>
                    {isSupabaseAuth && (
                      <span className="text-xs text-green-600">Cloud Sync</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-500 transition-colors"
                >
                  <SafeIcon icon={FiLogOut} className="text-lg" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => openAuthModal('login')}
                  className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  <SafeIcon icon={FiLogIn} />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-4 py-2 rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-200 flex items-center space-x-2"
                >
                  <SafeIcon icon={FiUserPlus} />
                  <span>Sign Up</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-600 hover:text-primary-600"
          >
            <SafeIcon icon={isMobileMenuOpen ? FiX : FiMenu} className="text-2xl" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-gray-200"
          >
            <div className="flex flex-col space-y-2">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-100'
                  }`}
                >
                  <SafeIcon icon={item.icon} className="text-lg" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}

              {isAuthenticated && (
                <Link
                  to="/create-competition"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-4 py-3 rounded-lg mx-2"
                >
                  <SafeIcon icon={FiPlus} />
                  <span>Create Competition</span>
                </Link>
              )}

              {isAuthenticated ? (
                <div className="px-4 py-3 border-t border-gray-200 mt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center overflow-hidden">
                        {profile?.avatar_url || profile?.avatar ? (
                          <img
                            src={profile.avatar_url || profile.avatar}
                            alt={profile.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-white text-sm font-bold">
                            {profile?.name?.charAt(0) || 'U'}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-700 font-medium">{profile?.name}</span>
                        {isSupabaseAuth && (
                          <span className="text-xs text-green-600">Cloud Sync</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="text-red-500 hover:text-red-600"
                    >
                      <SafeIcon icon={FiLogOut} className="text-lg" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-4 py-3 border-t border-gray-200 mt-2 space-y-2">
                  <button
                    onClick={() => openAuthModal('login')}
                    className="w-full flex items-center justify-center space-x-2 text-primary-600 py-2 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                  >
                    <SafeIcon icon={FiLogIn} />
                    <span>Sign In</span>
                  </button>
                  <button
                    onClick={() => openAuthModal('register')}
                    className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white py-2 rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <SafeIcon icon={FiUserPlus} />
                    <span>Sign Up</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
    </nav>
  );
};

export default Navbar;