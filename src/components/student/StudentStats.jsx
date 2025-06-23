import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import LoadingSpinner from '../common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

const { FiBookmark, FiCheck, FiX, FiBarChart3, FiClock, FiRefreshCw } = FiIcons;

const StudentStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Get user reservations from localStorage
  const getUserReservations = () => {
    if (!user) return [];
    const storedReservations = localStorage.getItem(`reservations_${user.id}`) || '[]';
    return JSON.parse(storedReservations);
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      if (!user) return;

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const reservations = getUserReservations();
      
      const statsData = {
        activeReservations: reservations.filter(r => r.status === 'active' || r.status === 'pending').length,
        approvedReservations: reservations.filter(r => r.status === 'approved').length,
        completedReservations: reservations.filter(r => r.status === 'completed').length,
        rejectedReservations: reservations.filter(r => r.status === 'rejected').length,
        cancelledReservations: reservations.filter(r => r.status === 'cancelled').length,
        totalReservations: reservations.length
      };

      setStats(statsData);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Carregando estatísticas..." />;
  }

  const statCards = [
    {
      title: 'Reservas Ativas',
      value: stats?.activeReservations || 0,
      icon: FiBookmark,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      description: 'Vagas reservadas aguardando aprovação'
    },
    {
      title: 'Reservas Aprovadas',
      value: stats?.approvedReservations || 0,
      icon: FiCheck,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      description: 'Vagas aprovadas pela instituição'
    },
    {
      title: 'Estágios Concluídos',
      value: stats?.completedReservations || 0,
      icon: FiBarChart3,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      description: 'Estágios finalizados com sucesso'
    },
    {
      title: 'Reservas Rejeitadas',
      value: stats?.rejectedReservations || 0,
      icon: FiX,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      description: 'Vagas não aprovadas pela instituição'
    }
  ];

  const canReserveNewVaga = () => {
    const reservations = getUserReservations();
    return !reservations.some(r => r.status === 'active' || r.status === 'pending' || r.status === 'approved');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Suas Estatísticas</h2>
          <button
            onClick={fetchStats}
            className="flex items-center space-x-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
          >
            <SafeIcon icon={FiRefreshCw} className="w-4 h-4" />
            <span>Atualizar</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative overflow-hidden bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center mb-3">
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
              <p className="text-xs text-gray-500">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Status da Conta */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Status da Conta</h3>
        
        {canReserveNewVaga() ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiCheck} className="w-6 h-6 text-green-600" />
              <div>
                <h4 className="text-sm font-medium text-green-900">
                  Disponível para Reserva
                </h4>
                <p className="text-sm text-green-700 mt-1">
                  Você pode reservar uma nova vaga de estágio. Explore as vagas disponíveis!
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiClock} className="w-6 h-6 text-yellow-600" />
              <div>
                <h4 className="text-sm font-medium text-yellow-900">
                  Reserva em Andamento
                </h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Você possui uma reserva ativa. Cancele-a ou aguarde sua conclusão para reservar outra vaga.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {stats?.totalReservations > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo da Atividade</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Taxa de Aprovação</span>
              <span className="text-sm font-medium text-gray-900">
                {stats.totalReservations > 0 
                  ? Math.round(((stats.approvedReservations + stats.completedReservations) / stats.totalReservations) * 100) 
                  : 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${stats.totalReservations > 0 
                    ? ((stats.approvedReservations + stats.completedReservations) / stats.totalReservations) * 100 
                    : 0}%`
                }}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {stats.totalReservations}
                </div>
                <div className="text-sm text-gray-600">Total de Tentativas</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {stats.approvedReservations + stats.completedReservations}
                </div>
                <div className="text-sm text-gray-600">Sucessos</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {stats?.totalReservations === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <SafeIcon icon={FiBarChart3} className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma atividade ainda
          </h3>
          <p className="text-gray-600">
            Reserve sua primeira vaga para ver as estatísticas aqui.
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentStats;