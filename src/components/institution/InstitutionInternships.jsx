import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import LoadingSpinner from '../common/LoadingSpinner';
import EditInternshipModal from './EditInternshipModal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '../../context/AuthContext';

const { FiMapPin, FiClock, FiCalendar, FiUsers, FiEdit3, FiTrash2, FiDownload, FiEye, FiPause, FiPlay, FiAlertCircle, FiX } = FiIcons;

const InstitutionInternships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingInternship, setEditingInternship] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      if (!user) return;

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get internships from localStorage for this institution
      const storedInternships = JSON.parse(localStorage.getItem('internships') || '[]');
      const institutionInternships = storedInternships.filter(
        internship => internship.institution_id === user.id
      );
      
      setInternships(institutionInternships);
    } catch (error) {
      console.error('Error fetching internships:', error);
      toast.error('Erro ao carregar vagas');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (internshipId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'closed' : 'active';
    const action = newStatus === 'active' ? 'reabrir' : 'encerrar';

    if (!window.confirm(`Tem certeza que deseja ${action} esta vaga?`)) {
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update in localStorage
      const storedInternships = JSON.parse(localStorage.getItem('internships') || '[]');
      const updatedInternships = storedInternships.map(internship =>
        internship.id === internshipId
          ? { ...internship, status: newStatus }
          : internship
      );
      localStorage.setItem('internships', JSON.stringify(updatedInternships));

      setInternships(prev =>
        prev.map(internship =>
          internship.id === internshipId
            ? { ...internship, status: newStatus }
            : internship
        )
      );

      toast.success(`Vaga ${newStatus === 'active' ? 'reaberta' : 'encerrada'} com sucesso!`);
    } catch (error) {
      console.error('Error updating internship status:', error);
      toast.error(`Erro ao ${action} vaga`);
    }
  };

  const handleDelete = async (internshipId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta vaga? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Remove from localStorage
      const storedInternships = JSON.parse(localStorage.getItem('internships') || '[]');
      const updatedInternships = storedInternships.filter(
        internship => internship.id !== internshipId
      );
      localStorage.setItem('internships', JSON.stringify(updatedInternships));

      setInternships(prev => prev.filter(internship => internship.id !== internshipId));
      toast.success('Vaga excluída com sucesso!');
    } catch (error) {
      console.error('Error deleting internship:', error);
      toast.error('Erro ao excluir vaga');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', text: 'Ativa' },
      closed: { color: 'bg-red-100 text-red-800', text: 'Encerrada' },
      cancelled: { color: 'bg-gray-100 text-gray-800', text: 'Cancelada' }
    };

    const config = statusConfig[status] || statusConfig.active;

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return <LoadingSpinner text="Carregando suas vagas..." />;
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Minhas Vagas</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {internships.length}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {internships.filter(i => i.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">Ativas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {internships.reduce((sum, i) => sum + (i.total_spots - i.available_spots), 0)}
            </div>
            <div className="text-sm text-gray-600">Reservas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {internships.reduce((sum, i) => sum + i.available_spots, 0)}
            </div>
            <div className="text-sm text-gray-600">Disponíveis</div>
          </div>
        </div>
      </div>

      {/* Internships List */}
      {internships.length > 0 ? (
        <div className="space-y-4">
          <AnimatePresence>
            {internships.map((internship) => (
              <motion.div
                key={internship.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {internship.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Criada em {format(new Date(internship.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(internship.status)}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        internship.available_spots > 5
                          ? 'bg-green-100 text-green-800'
                          : internship.available_spots > 0
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {internship.available_spots}/{internship.total_spots} disponíveis
                      </span>
                    </div>
                  </div>

                  {internship.description && (
                    <p className="text-gray-600 text-sm mb-4">
                      {internship.description}
                    </p>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <SafeIcon icon={FiMapPin} className="w-4 h-4" />
                      <span>{internship.city}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <SafeIcon icon={FiClock} className="w-4 h-4" />
                      <span className="capitalize">{internship.period}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                      <span>{internship.month_year}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <SafeIcon icon={FiUsers} className="w-4 h-4" />
                      <span>{internship.area}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">{internship.total_spots - internship.available_spots}</span> estudantes inscritos
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingInternship(internship)}
                        className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                      >
                        <SafeIcon icon={FiEdit3} className="w-4 h-4" />
                        <span>Editar</span>
                      </button>

                      <button
                        onClick={() => handleStatusToggle(internship.id, internship.status)}
                        className={`flex items-center space-x-1 px-3 py-1 text-sm rounded-lg transition-colors duration-200 ${
                          internship.status === 'active'
                            ? 'text-red-600 hover:text-red-700 hover:bg-red-50'
                            : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                        }`}
                      >
                        <SafeIcon icon={internship.status === 'active' ? FiPause : FiPlay} className="w-4 h-4" />
                        <span>{internship.status === 'active' ? 'Encerrar' : 'Reabrir'}</span>
                      </button>

                      <button
                        onClick={() => handleDelete(internship.id)}
                        className="flex items-center space-x-1 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                        <span>Excluir</span>
                      </button>
                    </div>
                  </div>
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
            Nenhuma vaga cadastrada
          </h3>
          <p className="text-gray-600">
            Comece criando sua primeira vaga de estágio.
          </p>
        </div>
      )}

      {/* Edit Modal */}
      {editingInternship && (
        <EditInternshipModal
          internship={editingInternship}
          onClose={() => setEditingInternship(null)}
          onSuccess={() => {
            setEditingInternship(null);
            fetchInternships();
          }}
        />
      )}
    </div>
  );
};

export default InstitutionInternships;