import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import LoadingSpinner from '../common/LoadingSpinner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const { FiClock, FiCheck, FiX, FiUser, FiMail, FiBookOpen, FiUsers, FiEye, FiBuilding, FiPhone, FiMapPin } = FiIcons;

const UserApprovalManagement = ({ onUserStatusChange }) => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchPendingUsers();
    
    // Listen for storage changes to sync between tabs
    const handleStorageChange = (e) => {
      if (e.key === 'pending_users' || e.key === 'registered_users' || e.key === 'processed_users') {
        fetchPendingUsers();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Custom event listener for same-tab updates
    const handleCustomUpdate = () => {
      fetchPendingUsers();
    };
    
    window.addEventListener('userDataUpdated', handleCustomUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userDataUpdated', handleCustomUpdate);
    };
  }, []);

  const fetchPendingUsers = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get pending users from localStorage (demo)
      const pending = JSON.parse(localStorage.getItem('pending_users') || '[]');
      setPendingUsers(pending);
    } catch (error) {
      console.error('Error fetching pending users:', error);
      toast.error('Erro ao carregar usuários pendentes');
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = (userId, newStatus) => {
    // Find user in pending list
    const user = pendingUsers.find(u => u.id === userId);
    if (!user) return;

    // Remove from pending
    const updatedPendingUsers = pendingUsers.filter(u => u.id !== userId);
    localStorage.setItem('pending_users', JSON.stringify(updatedPendingUsers));

    // Add to appropriate list based on status
    const processedUser = {
      ...user,
      status: newStatus,
      processed_at: new Date().toISOString(),
      processed_by: 'contato@posfaunaemfoco.com'
    };

    if (newStatus === 'approved') {
      const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      registeredUsers.push(processedUser);
      localStorage.setItem('registered_users', JSON.stringify(registeredUsers));
    } else if (newStatus === 'rejected') {
      const processedUsers = JSON.parse(localStorage.getItem('processed_users') || '[]');
      processedUsers.push(processedUser);
      localStorage.setItem('processed_users', JSON.stringify(processedUsers));
    }

    // Update local state
    setPendingUsers(updatedPendingUsers);

    // Notify other components about the change
    if (onUserStatusChange) {
      onUserStatusChange();
    }

    // Dispatch custom event to update other tabs/components
    window.dispatchEvent(new CustomEvent('userDataUpdated'));
  };

  const handleApproval = async (userId, action) => {
    const actionText = action === 'approve' ? 'aprovar' : 'rejeitar';
    if (!window.confirm(`Tem certeza que deseja ${actionText} este usuário?`)) {
      return;
    }

    setProcessing(userId);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newStatus = action === 'approve' ? 'approved' : 'rejected';
      updateUserStatus(userId, newStatus);

      toast.success(`Usuário ${action === 'approve' ? 'aprovado' : 'rejeitado'} com sucesso!`);
    } catch (error) {
      console.error('Error processing user:', error);
      toast.error(`Erro ao ${actionText} usuário`);
    } finally {
      setProcessing(null);
    }
  };

  const handleBulkAction = async (action) => {
    if (pendingUsers.length === 0) {
      toast.error('Nenhum usuário pendente para processar');
      return;
    }

    const actionText = action === 'approve' ? 'aprovar todos' : 'rejeitar todos';
    if (!window.confirm(`Tem certeza que deseja ${actionText} os usuários pendentes?`)) {
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newStatus = action === 'approve' ? 'approved' : 'rejected';
      
      // Process all pending users
      pendingUsers.forEach(user => {
        const processedUser = {
          ...user,
          status: newStatus,
          processed_at: new Date().toISOString(),
          processed_by: 'contato@posfaunaemfoco.com'
        };

        if (newStatus === 'approved') {
          const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
          registeredUsers.push(processedUser);
          localStorage.setItem('registered_users', JSON.stringify(registeredUsers));
        } else {
          const processedUsers = JSON.parse(localStorage.getItem('processed_users') || '[]');
          processedUsers.push(processedUser);
          localStorage.setItem('processed_users', JSON.stringify(processedUsers));
        }
      });

      // Clear pending users
      localStorage.setItem('pending_users', JSON.stringify([]));
      setPendingUsers([]);

      // Notify other components
      if (onUserStatusChange) {
        onUserStatusChange();
      }

      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('userDataUpdated'));

      toast.success(`Todos os usuários foram ${action === 'approve' ? 'aprovados' : 'rejeitados'}!`);
    } catch (error) {
      console.error('Error processing bulk action:', error);
      toast.error('Erro ao processar usuários');
    }
  };

  const getUserTypeIcon = (role) => {
    switch (role) {
      case 'student':
        return FiUser;
      case 'institution':
        return FiBuilding;
      default:
        return FiUser;
    }
  };

  const getUserTypeColor = (role) => {
    switch (role) {
      case 'student':
        return 'text-blue-600';
      case 'institution':
        return 'text-green-600';
      default:
        return 'text-blue-600';
    }
  };

  const getUserTypeText = (role) => {
    switch (role) {
      case 'student':
        return 'Estudante';
      case 'institution':
        return 'Instituição';
      default:
        return 'Usuário';
    }
  };

  if (loading) {
    return <LoadingSpinner text="Carregando usuários pendentes..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Aprovação de Usuários</h2>
            <p className="text-sm text-gray-600 mt-1">
              {pendingUsers.length} usuário{pendingUsers.length !== 1 ? 's' : ''} aguardando aprovação
            </p>
          </div>
          {pendingUsers.length > 0 && (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleBulkAction('approve')}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                <SafeIcon icon={FiCheck} className="w-4 h-4" />
                <span>Aprovar Todos</span>
              </button>
              <button
                onClick={() => handleBulkAction('reject')}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                <SafeIcon icon={FiX} className="w-4 h-4" />
                <span>Rejeitar Todos</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Pending Users List */}
      {pendingUsers.length > 0 ? (
        <div className="space-y-4">
          <AnimatePresence>
            {pendingUsers.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className={`flex-shrink-0 h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center`}>
                        <SafeIcon icon={getUserTypeIcon(user.role)} className={`h-6 w-6 ${getUserTypeColor(user.role)}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {user.name}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                          <SafeIcon icon={FiMail} className="w-4 h-4" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                          <SafeIcon icon={FiClock} className="w-4 h-4" />
                          <span>
                            Cadastrado em {format(new Date(user.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                          </span>
                        </div>
                        <span className="inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 mt-2">
                          <span>{getUserTypeText(user.role)}</span>
                        </span>
                      </div>
                    </div>
                    <span className="inline-flex items-center space-x-1 px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                      <SafeIcon icon={FiClock} className="w-3 h-3" />
                      <span>Pendente</span>
                    </span>
                  </div>

                  {/* User Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    {user.role === 'student' && (
                      <>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <SafeIcon icon={FiBookOpen} className="w-4 h-4" />
                          <span><strong>Curso:</strong> {user.course}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <SafeIcon icon={FiUsers} className="w-4 h-4" />
                          <span><strong>Turma:</strong> {user.class_name}</span>
                        </div>
                      </>
                    )}
                    {user.role === 'institution' && (
                      <>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <SafeIcon icon={FiBuilding} className="w-4 h-4" />
                          <span><strong>CNPJ:</strong> {user.cnpj}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <SafeIcon icon={FiPhone} className="w-4 h-4" />
                            <span><strong>Telefone:</strong> {user.phone}</span>
                          </div>
                        )}
                        {user.address && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600 md:col-span-2">
                            <SafeIcon icon={FiMapPin} className="w-4 h-4" />
                            <span><strong>Endereço:</strong> {user.address}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end space-x-3">
                    <button
                      onClick={() => handleApproval(user.id, 'reject')}
                      disabled={processing === user.id}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                    >
                      <SafeIcon icon={FiX} className="w-4 h-4" />
                      <span>{processing === user.id ? 'Processando...' : 'Rejeitar'}</span>
                    </button>
                    <button
                      onClick={() => handleApproval(user.id, 'approve')}
                      disabled={processing === user.id}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200 disabled:opacity-50"
                    >
                      <SafeIcon icon={FiCheck} className="w-4 h-4" />
                      <span>{processing === user.id ? 'Processando...' : 'Aprovar'}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <SafeIcon icon={FiCheck} className="h-12 w-12 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum usuário pendente
          </h3>
          <p className="text-gray-600">
            Todos os usuários foram processados. Novos cadastros aparecerão aqui.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserApprovalManagement;