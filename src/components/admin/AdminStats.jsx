import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import LoadingSpinner from '../common/LoadingSpinner';

const { FiUsers, FiBuilding, FiBriefcase, FiBookmark } = FiIcons;

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get real data from localStorage
      const pendingUsers = JSON.parse(localStorage.getItem('pending_users') || '[]');
      const processedUsers = JSON.parse(localStorage.getItem('processed_users') || '[]');
      const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      
      const allUsers = [...pendingUsers, ...processedUsers, ...registeredUsers];
      const students = allUsers.filter(u => u.role === 'student');
      const institutions = allUsers.filter(u => u.role === 'institution');
      const approvedStudents = students.filter(u => u.status === 'approved');
      
      // Get internships (would come from database in production)
      const internships = []; // Empty for now since no real internships exist yet
      
      setStats({
        totalStudents: students.length,
        totalInstitutions: institutions.length,
        activeInternships: internships.filter(i => i?.status === 'active').length,
        activeReservations: 0, // No reservations yet
        totalSpots: 0, // No spots yet
        availableSpots: 0, // No available spots yet
        occupiedSpots: 0, // No occupied spots yet
        pendingApprovals: pendingUsers.length
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      toast.error('Erro ao carregar estatísticas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Carregando estatísticas..." />;
  }

  const statCards = [
    {
      title: 'Total de Estudantes',
      value: stats?.totalStudents || 0,
      icon: FiUsers,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total de Instituições',
      value: stats?.totalInstitutions || 0,
      icon: FiBuilding,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Vagas Ativas',
      value: stats?.activeInternships || 0,
      icon: FiBriefcase,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    },
    {
      title: 'Aprovações Pendentes',
      value: stats?.pendingApprovals || 0,
      icon: FiBookmark,
      color: 'bg-orange-500',
      textColor: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Visão Geral do Sistema</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative overflow-hidden bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <SafeIcon icon={card.icon} className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className={`text-2xl font-semibold ${card.textColor}`}>
                    {card.value}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {stats?.pendingApprovals > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiBookmark} className="w-6 h-6 text-yellow-600" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-900">
                Ação Necessária
              </h3>
              <p className="text-yellow-700 mt-1">
                Você tem {stats.pendingApprovals} usuário{stats.pendingApprovals !== 1 ? 's' : ''} aguardando aprovação. 
                Vá para a aba "Aprovações" para revisar.
              </p>
            </div>
          </div>
        </div>
      )}

      {stats?.totalStudents === 0 && stats?.totalInstitutions === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <SafeIcon icon={FiUsers} className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Sistema Inicializado
          </h3>
          <p className="text-gray-600">
            O sistema está pronto para receber os primeiros usuários.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminStats;