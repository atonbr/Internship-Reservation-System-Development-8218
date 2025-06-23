import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import LoadingSpinner from '../common/LoadingSpinner';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const { FiBriefcase, FiCheck, FiUsers, FiTarget } = FiIcons;

const InstitutionStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      if (!user) return;

      // Get internships stats
      const { data: internships, error: internshipsError } = await supabase
        .from('internships_sys_2024')
        .select('total_spots, available_spots, status')
        .eq('institution_id', user.id);

      if (internshipsError) throw internshipsError;

      // Get reservations stats
      const { data: reservations, error: reservationsError } = await supabase
        .from('reservations_sys_2024')
        .select('status')
        .in('internship_id', internships.map(i => i.id));

      if (reservationsError) throw reservationsError;

      const statsData = {
        totalInternships: internships.length,
        activeInternships: internships.filter(i => i.status === 'active').length,
        totalReservations: reservations.filter(r => r.status === 'active').length,
        totalSpots: internships.reduce((sum, i) => sum + i.total_spots, 0),
        availableSpots: internships.reduce((sum, i) => sum + i.available_spots, 0),
        occupiedSpots: internships.reduce((sum, i) => sum + (i.total_spots - i.available_spots), 0)
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
      title: 'Total de Vagas',
      value: stats?.totalInternships || 0,
      icon: FiBriefcase,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Vagas Ativas',
      value: stats?.activeInternships || 0,
      icon: FiCheck,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Total de Reservas',
      value: stats?.totalReservations || 0,
      icon: FiUsers,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    },
    {
      title: 'Vagas Ocupadas',
      value: stats?.occupiedSpots || 0,
      icon: FiTarget,
      color: 'bg-orange-500',
      textColor: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Estatísticas da Instituição</h2>
        
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

      {stats?.totalInternships > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo da Atividade</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Taxa de Ocupação</span>
              <span className="text-sm font-medium text-gray-900">
                {stats.totalSpots > 0 ? Math.round((stats.occupiedSpots / stats.totalSpots) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${stats.totalSpots > 0 ? (stats.occupiedSpots / stats.totalSpots) * 100 : 0}%`
                }}
              />
            </div>
          </div>
        </div>
      )}

      {stats?.totalInternships === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <SafeIcon icon={FiBriefcase} className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma vaga criada ainda
          </h3>
          <p className="text-gray-600">
            Crie sua primeira vaga para ver as estatísticas aqui.
          </p>
        </div>
      )}
    </div>
  );
};

export default InstitutionStats;