import React from 'react';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import {useAuth} from '../../context/AuthContext';

const {FiLogOut, FiUser} = FiIcons;

const Layout = ({children, title, subtitle}) => {
  const {user, logout} = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
              {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
              <p className="text-xs text-primary-600 font-medium">Prática Fauna em foco - Pós-Graduação</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiUser} className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
              >
                <SafeIcon icon={FiLogOut} className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.5}}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;