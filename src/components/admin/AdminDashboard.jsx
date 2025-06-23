import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import Layout from '../common/Layout';
import AdminStats from './AdminStats';
import UserManagement from './UserManagement';
import AdminReports from './AdminReports';

const { FiBarChart3, FiUsers, FiFileText } = FiIcons;

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');

  const tabs = [
    { id: 'stats', label: 'Dashboard', icon: FiBarChart3 },
    { id: 'users', label: 'Usuários', icon: FiUsers },
    { id: 'reports', label: 'Relatórios', icon: FiFileText }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'stats':
        return <AdminStats />;
      case 'users':
        return <UserManagement />;
      case 'reports':
        return <AdminReports />;
      default:
        return <AdminStats />;
    }
  };

  return (
    <Layout title="Painel Administrativo" subtitle="Gerencie o sistema de estágios">
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex space-x-1 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <SafeIcon icon={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;