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

      // Demo stats
      setStats({
        totalStudents: 150,
        totalInstitutions: 25,
        activeInternships: 45,
        activeReservations: 89,
        totalSpots: 180,
        availableSpots: 91,
        occupiedSpots: 89
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
      title: 'Reservas Ativas',
      value: stats?.activeReservations || 0,
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ocupação de Vagas</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total de Vagas</span>
              <span className="text-sm font-medium text-gray-900">
                {stats?.totalSpots || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Vagas Ocupadas</span>
              <span className="text-sm font-medium text-gray-900">
                {stats?.occupiedSpots || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Vagas Disponíveis</span>
              <span className="text-sm font-medium text-gray-900">
                {stats?.availableSpots || 0}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${stats?.totalSpots > 0 ? (stats.occupiedSpots / stats.totalSpots) * 100 : 0}%`
                }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo de Atividade</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Taxa de Ocupação</span>
              <span className="text-sm font-medium text-gray-900">
                {stats?.totalSpots > 0 ? Math.round((stats.occupiedSpots / stats.totalSpots) * 100) : 0}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Média de Vagas por Instituição</span>
              <span className="text-sm font-medium text-gray-900">
                {stats?.totalInstitutions > 0 ? Math.round(stats.activeInternships / stats.totalInstitutions) : 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Estudantes com Reservas</span>
              <span className="text-sm font-medium text-gray-900">
                {stats?.activeReservations || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;