import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import LoadingSpinner from '../common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const { FiMapPin, FiClock, FiCalendar, FiBuilding, FiX, FiCheck, FiAlertCircle, FiRefreshCw } = FiIcons;

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const { user } = useAuth();

  // Get user reservations from localStorage
  const getUserReservations = () => {
    if (!user) return [];
    const storedReservations = localStorage.getItem(`reservations_${user.id}`) || '[]';
    return JSON.parse(storedReservations);
  };

  const saveUserReservations = (reservations) => {
    if (!user) return;
    localStorage.setItem(`reservations_${user.id}`, JSON.stringify(reservations));
  };

  useEffect(() => {
    fetchReservations();
  }, [user]);

  const fetchReservations = async () => {
    try {
      if (!user) return;

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userReservations = getUserReservations();
      setReservations(userReservations);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      toast.error('Erro ao carregar reservas');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId) => {
    if (!window.confirm('Tem certeza que deseja cancelar esta reserva?')) {
      return;
    }

    setCancelling(reservationId);
    try {
      const reservation = reservations.find(r => r.id === reservationId);
      if (!reservation || (reservation.status !== 'active' && reservation.status !== 'pending')) {
        toast.error('Reserva não encontrada ou já processada');
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update local state
      const updatedReservations = reservations.map(res =>
        res.id === reservationId
          ? { ...res, status: 'cancelled', cancelled_at: new Date().toISOString() }
          : res
      );
      
      setReservations(updatedReservations);
      saveUserReservations(updatedReservations);

      toast.success('Reserva cancelada com sucesso! Agora você pode reservar outra vaga.');
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      toast.error('Erro ao cancelar reserva');
    } finally {
      setCancelling(null);
    }
  };

  // Simulate institution actions (for demo purposes)
  const simulateStatusChange = async (reservationId, newStatus) => {
    const statusMessages = {
      approved: 'Reserva aprovada! Parabéns!',
      rejected: 'Reserva rejeitada. Você pode reservar outra vaga agora.',
      completed: 'Estágio concluído com sucesso!'
    };

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedReservations = reservations.map(res =>
        res.id === reservationId
          ? { 
              ...res, 
              status: newStatus,
              [`${newStatus}_at`]: new Date().toISOString()
            }
          : res
      );
      
      setReservations(updatedReservations);
      saveUserReservations(updatedReservations);

      toast.success(statusMessages[newStatus]);
    } catch (error) {
      toast.error('Erro ao atualizar status');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: FiCheck, text: 'Ativa' },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: FiClock, text: 'Pendente' },
      approved: { color: 'bg-blue-100 text-blue-800', icon: FiCheck, text: 'Aprovada' },
      rejected: { color: 'bg-red-100 text-red-800', icon: FiX, text: 'Rejeitada' },
      completed: { color: 'bg-purple-100 text-purple-800', icon: FiCheck, text: 'Concluída' },
      cancelled: { color: 'bg-gray-100 text-gray-800', icon: FiX, text: 'Cancelada' }
    };

    const config = statusConfig[status] || statusConfig.active;

    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        <SafeIcon icon={config.icon} className="w-3 h-3" />
        <span>{config.text}</span>
      </span>
    );
  };

  const canCancelReservation = (status) => {
    return status === 'active' || status === 'pending';
  };

  const canReserveNewVaga = () => {
    return !reservations.some(r => r.status === 'active' || r.status === 'pending' || r.status === 'approved');
  };

  if (loading) {
    return <LoadingSpinner text="Carregando suas reservas..." />;
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Minhas Reservas</h2>
          <button
            onClick={fetchReservations}
            className="flex items-center space-x-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
          >
            <SafeIcon icon={FiRefreshCw} className="w-4 h-4" />
            <span>Atualizar</span>
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {reservations.filter(r => r.status === 'active' || r.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Ativas/Pendentes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {reservations.filter(r => r.status === 'approved' || r.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Aprovadas/Concluídas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {reservations.filter(r => r.status === 'rejected').length}
            </div>
            <div className="text-sm text-gray-600">Rejeitadas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {reservations.filter(r => r.status === 'cancelled').length}
            </div>
            <div className="text-sm text-gray-600">Canceladas</div>
          </div>
        </div>

        {/* Status Message */}
        {canReserveNewVaga() ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-800">
                Você pode reservar uma nova vaga de estágio!
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiAlertCircle} className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">
                Você possui uma reserva ativa. Cancele-a para poder reservar outra vaga.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Reservations List */}
      {reservations.length > 0 ? (
        <div className="space-y-4">
          <AnimatePresence>
            {reservations.map((reservation) => (
              <motion.div
                key={reservation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {reservation.title}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <SafeIcon icon={FiBuilding} className="w-4 h-4" />
                        <span>{reservation.institution_name}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(reservation.status)}
                      {canCancelReservation(reservation.status) && (
                        <button
                          onClick={() => handleCancelReservation(reservation.id)}
                          disabled={cancelling === reservation.id}
                          className="flex items-center space-x-1 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                          <SafeIcon icon={FiX} className="w-4 h-4" />
                          <span>
                            {cancelling === reservation.id ? 'Cancelando...' : 'Cancelar'}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <SafeIcon icon={FiMapPin} className="w-4 h-4" />
                      <span>{reservation.city}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <SafeIcon icon={FiClock} className="w-4 h-4" />
                      <span className="capitalize">{reservation.period}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                      <span>{reservation.month_year}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <SafeIcon icon={FiBuilding} className="w-4 h-4" />
                      <span>{reservation.area}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                      Reservado em {format(new Date(reservation.reserved_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </span>
                    {reservation.cancelled_at && (
                      <span className="text-red-600">
                        Cancelado em {format(new Date(reservation.cancelled_at), 'dd/MM/yyyy', { locale: ptBR })}
                      </span>
                    )}
                    {reservation.approved_at && (
                      <span className="text-blue-600">
                        Aprovado em {format(new Date(reservation.approved_at), 'dd/MM/yyyy', { locale: ptBR })}
                      </span>
                    )}
                    {reservation.rejected_at && (
                      <span className="text-red-600">
                        Rejeitado em {format(new Date(reservation.rejected_at), 'dd/MM/yyyy', { locale: ptBR })}
                      </span>
                    )}
                  </div>

                  {reservation.address && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <SafeIcon icon={FiMapPin} className="w-4 h-4 text-gray-500 mt-0.5" />
                        <span className="text-sm text-gray-600">{reservation.address}</span>
                      </div>
                    </div>
                  )}

                  {/* Demo buttons for testing status changes */}
                  {reservation.status === 'active' && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-2">Demo: Simular ações da instituição</p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => simulateStatusChange(reservation.id, 'approved')}
                          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                        >
                          Aprovar
                        </button>
                        <button
                          onClick={() => simulateStatusChange(reservation.id, 'rejected')}
                          className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                        >
                          Rejeitar
                        </button>
                      </div>
                    </div>
                  )}

                  {reservation.status === 'approved' && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-2">Demo: Simular conclusão do estágio</p>
                      <button
                        onClick={() => simulateStatusChange(reservation.id, 'completed')}
                        className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                      >
                        Concluir Estágio
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <SafeIcon icon={FiAlertCircle} className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma reserva encontrada
          </h3>
          <p className="text-gray-600">
            Você ainda não reservou nenhuma vaga de estágio.
          </p>
        </div>
      )}
    </div>
  );
};

export default MyReservations;