import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import Layout from '../common/Layout';
import InternshipList from './InternshipList';
import MyReservations from './MyReservations';
import StudentStats from './StudentStats';

const { FiSearch, FiBookmark, FiBarChart3 } = FiIcons;

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('internships');

  const tabs = [
    { id: 'internships', label: 'Vagas Disponíveis', icon: FiSearch },
    { id: 'reservations', label: 'Minhas Reservas', icon: FiBookmark },
    { id: 'stats', label: 'Estatísticas', icon: FiBarChart3 }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'internships':
        return <InternshipList />;
      case 'reservations':
        return <MyReservations />;
      case 'stats':
        return <StudentStats />;
      default:
        return <InternshipList />;
    }
  };

  return (
    <Layout title="Painel do Estudante" subtitle="Encontre e reserve vagas de estágio">
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

export default StudentDashboard;