import React, {useState, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import toast from 'react-hot-toast';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import LoadingSpinner from '../common/LoadingSpinner';
import CandidateDetailModal from './CandidateDetailModal';
import {useAuth} from '../../context/AuthContext';
import {format} from 'date-fns';
import {ptBR} from 'date-fns/locale';

const {FiUsers, FiEye, FiCheck, FiX, FiClock, FiMail, FiBookOpen, FiMapPin, FiRefreshCw, FiAlertCircle} = FiIcons;

const CandidateManagement = () => {
  const [candidates, setCandidates] = useState([]);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [filters, setFilters] = useState({
    internshipId: '',
    status: ''
  });
  const {user} = useAuth();

  // Get all reservations for institution's internships
  const getInstitutionCandidates = () => {
    if (!user) return [];
    
    // Get all internships from this institution
    const storedInternships = JSON.parse(localStorage.getItem('internships') || '[]');
    const institutionInternships = storedInternships.filter(
      internship => internship.institution_id === user.id
    );
    
    // Get all users (candidates)
    const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const pendingUsers = JSON.parse(localStorage.getItem('pending_users') || '[]');
    const allUsers = [...registeredUsers, ...pendingUsers];
    
    // Get all candidates for institution's internships
    const allCandidates = [];
    
    institutionInternships.forEach(internship => {
      // For each internship, check all users' reservations
      allUsers.forEach(candidateUser => {
        const userReservations = JSON.parse(
          localStorage.getItem(`reservations_${candidateUser.id}`) || '[]'
        );
        
        const reservation = userReservations.find(r => r.internship_id === internship.id);
        if (reservation) {
          allCandidates.push({
            ...reservation,
            candidate: candidateUser,
            internship: internship
          });
        }
      });
    });
    
    return allCandidates;
  };

  const getInstitutionInternships = () => {
    if (!user) return [];
    const storedInternships = JSON.parse(localStorage.getItem('internships') || '[]');
    return storedInternships.filter(internship => internship.institution_id === user.id);
  };

  useEffect(() => {
    fetchCandidates();
  }, [user]);

  const fetchCandidates = async () => {
    try {
      if (!user) return;

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const institutionCandidates = getInstitutionCandidates();
      const institutionInternships = getInstitutionInternships();
      
      setCandidates(institutionCandidates);
      setInternships(institutionInternships);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      toast.error('Erro ao carregar candidaturas');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (candidateId, newStatus, rejectionReason = null) => {
    const statusText = newStatus === 'approved' ? 'aprovar' : 'rejeitar';
    
    if (!window.confirm(`Tem certeza que deseja ${statusText} esta candidatura?`)) {
      return;
    }

    setProcessing(candidateId);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const candidate = candidates.find(c => c.id === candidateId);
      if (!candidate) return;

      // Update reservation status
      const updatedReservation = {
        ...candidate,
        status: newStatus,
        institution_approved_at: newStatus === 'approved' ? new Date().toISOString() : null,
        institution_approved_by: user.email,
        rejection_reason: rejectionReason,
        updated_at: new Date().toISOString()
      };

      // Update in user's reservations
      const userReservations = JSON.parse(
        localStorage.getItem(`reservations_${candidate.candidate.id}`) || '[]'
      );
      
      const updatedUserReservations = userReservations.map(r => 
        r.id === candidateId ? updatedReservation : r
      );
      
      localStorage.setItem(
        `reservations_${candidate.candidate.id}`, 
        JSON.stringify(updatedUserReservations)
      );

      // Update local state
      setCandidates(prev => prev.map(c => 
        c.id === candidateId ? updatedReservation : c
      ));

      toast.success(`Candidatura ${newStatus === 'approved' ? 'aprovada' : 'rejeitada'} com sucesso!`);
    } catch (error) {
      console.error('Error updating candidate status:', error);
      toast.error(`Erro ao ${statusText} candidatura`);
    } finally {
      setProcessing(null);
    }
  };

  const handleApprove = (candidateId) => {
    handleStatusChange(candidateId, 'approved');
  };

  const handleReject = (candidateId) => {
    // Show rejection reason modal or simple reason
    const reason = window.prompt('Motivo da rejeição (opcional):');
    handleStatusChange(candidateId, 'rejected', reason);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        color: 'bg-yellow-100 text-yellow-800',
        icon: FiClock,
        text: 'Pendente'
      },
      approved: {
        color: 'bg-green-100 text-green-800',
        icon: FiCheck,
        text: 'Aprovada'
      },
      rejected: {
        color: 'bg-red-100 text-red-800',
        icon: FiX,
        text: 'Rejeitada'
      },
      cancelled: {
        color: 'bg-gray-100 text-gray-800',
        icon: FiX,
        text: 'Cancelada'
      },
      completed: {
        color: 'bg-purple-100 text-purple-800',
        icon: FiCheck,
        text: 'Concluída'
      }
    };

    const config = statusConfig[status] || statusConfig.active;

    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        <SafeIcon icon={config.icon} className="w-3 h-3" />
        <span>{config.text}</span>
      </span>
    );
  };

  const filteredCandidates = candidates.filter(candidate => {
    if (filters.internshipId && candidate.internship_id !== filters.internshipId) {
      return false;
    }
    if (filters.status && candidate.status !== filters.status) {
      return false;
    }
    return true;
  });

  const pendingCount = candidates.filter(c => c.status === 'active').length;
  const approvedCount = candidates.filter(c => c.status === 'approved').length;
  const rejectedCount = candidates.filter(c => c.status === 'rejected').length;

  if (loading) {
    return <LoadingSpinner text="Carregando candidaturas..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Gerenciar Candidaturas</h2>
          <button
            onClick={fetchCandidates}
            className="flex items-center space-x-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
          >
            <SafeIcon icon={FiRefreshCw} className="w-4 h-4" />
            <span>Atualizar</span>
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <div className="text-sm text-gray-600">Pendentes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
            <div className="text-sm text-gray-600">Aprovadas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
            <div className="text-sm text-gray-600">Rejeitadas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{candidates.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filtrar por vaga
            </label>
            <select
              value={filters.internshipId}
              onChange={(e) => setFilters(prev => ({...prev, internshipId: e.target.value}))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Todas as vagas</option>
              {internships.map((internship) => (
                <option key={internship.id} value={internship.id}>
                  {internship.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filtrar por status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({...prev, status: e.target.value}))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Todos os status</option>
              <option value="active">Pendente</option>
              <option value="approved">Aprovada</option>
              <option value="rejected">Rejeitada</option>
              <option value="cancelled">Cancelada</option>
              <option value="completed">Concluída</option>
            </select>
          </div>
        </div>
      </div>

      {/* Candidates List */}
      {filteredCandidates.length > 0 ? (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredCandidates.map((candidate) => (
              <motion.div
                key={candidate.id}
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -20}}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <SafeIcon icon={FiUsers} className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {candidate.candidate.name}
                          </h3>
                          <p className="text-sm text-gray-600">{candidate.candidate.email}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <SafeIcon icon={FiBookOpen} className="w-4 h-4" />
                          <span>{candidate.candidate.course}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <SafeIcon icon={FiUsers} className="w-4 h-4" />
                          <span>{candidate.candidate.class_name}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <SafeIcon icon={FiClock} className="w-4 h-4" />
                          <span>
                            Candidatura em {format(new Date(candidate.reserved_at), 'dd/MM/yyyy', {locale: ptBR})}
                          </span>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Vaga:</h4>
                        <p className="text-sm text-gray-700">{candidate.internship.title}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-600">
                          <span>{candidate.internship.city}</span>
                          <span>{candidate.internship.period}</span>
                          <span>{candidate.internship.month_year}</span>
                        </div>
                      </div>

                      {candidate.rejection_reason && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                          <h4 className="text-sm font-medium text-red-900 mb-1">Motivo da rejeição:</h4>
                          <p className="text-sm text-red-700">{candidate.rejection_reason}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end space-y-3">
                      {getStatusBadge(candidate.status)}
                      
                      {candidate.status === 'approved' && (
                        <div className="text-xs text-green-600 text-right">
                          <div>Aprovada em:</div>
                          <div>{format(new Date(candidate.institution_approved_at), 'dd/MM/yyyy HH:mm', {locale: ptBR})}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setSelectedCandidate(candidate)}
                      className="flex items-center space-x-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    >
                      <SafeIcon icon={FiEye} className="w-4 h-4" />
                      <span>Ver detalhes</span>
                    </button>

                    {candidate.status === 'active' && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleReject(candidate.id)}
                          disabled={processing === candidate.id}
                          className="flex items-center space-x-1 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                        >
                          <SafeIcon icon={FiX} className="w-4 h-4" />
                          <span>{processing === candidate.id ? 'Processando...' : 'Rejeitar'}</span>
                        </button>
                        
                        <button
                          onClick={() => handleApprove(candidate.id)}
                          disabled={processing === candidate.id}
                          className="flex items-center space-x-1 px-3 py-1 text-sm text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200 disabled:opacity-50"
                        >
                          <SafeIcon icon={FiCheck} className="w-4 h-4" />
                          <span>{processing === candidate.id ? 'Processando...' : 'Aprovar'}</span>
                        </button>
                      </div>
                    )}

                    {candidate.status === 'approved' && (
                      <div className="text-xs text-gray-500">
                        Candidatura aprovada - estudante não pode mais cancelar
                      </div>
                    )}
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
            Nenhuma candidatura encontrada
          </h3>
          <p className="text-gray-600">
            {Object.values(filters).some(filter => filter !== '') 
              ? 'Nenhuma candidatura corresponde aos filtros aplicados.'
              : 'Ainda não há candidaturas para suas vagas de estágio.'
            }
          </p>
        </div>
      )}

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <CandidateDetailModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          processing={processing}
        />
      )}
    </div>
  );
};

export default CandidateManagement;