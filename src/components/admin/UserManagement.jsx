import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import LoadingSpinner from '../common/LoadingSpinner';
import EditUserModal from './EditUserModal';
import UserDetailModal from './UserDetailModal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const { FiSearch, FiFilter, FiUser, FiBuilding, FiShield, FiMoreVertical, FiEye, FiEdit3, FiTrash2 } = FiIcons;

const UserManagement = ({ onUserStatusChange }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: ''
  });

  useEffect(() => {
    fetchUsers();
    
    // Listen for storage changes to sync between tabs
    const handleStorageChange = (e) => {
      if (e.key === 'pending_users' || e.key === 'registered_users' || e.key === 'processed_users') {
        fetchUsers();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Custom event listener for same-tab updates
    const handleCustomUpdate = () => {
      fetchUsers();
    };
    
    window.addEventListener('userDataUpdated', handleCustomUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userDataUpdated', handleCustomUpdate);
    };
  }, [filters]);

  const fetchUsers = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Get real data from localStorage
      const pendingUsers = JSON.parse(localStorage.getItem('pending_users') || '[]');
      const processedUsers = JSON.parse(localStorage.getItem('processed_users') || '[]');
      const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');

      let allUsers = [...pendingUsers, ...processedUsers, ...registeredUsers];

      // Apply filters
      if (filters.role) {
        allUsers = allUsers.filter(user => user.role === filters.role);
      }

      if (filters.status) {
        allUsers = allUsers.filter(user => user.status === filters.status);
      }

      if (filters.search) {
        allUsers = allUsers.filter(user =>
          user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          user.email.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      setUsers(allUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const updateUserInStorage = (updatedUser) => {
    // Find and update user in appropriate storage
    const pendingUsers = JSON.parse(localStorage.getItem('pending_users') || '[]');
    const processedUsers = JSON.parse(localStorage.getItem('processed_users') || '[]');
    const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');

    // Update in pending users
    const pendingIndex = pendingUsers.findIndex(u => u.id === updatedUser.id);
    if (pendingIndex !== -1) {
      pendingUsers[pendingIndex] = updatedUser;
      localStorage.setItem('pending_users', JSON.stringify(pendingUsers));
    }

    // Update in processed users
    const processedIndex = processedUsers.findIndex(u => u.id === updatedUser.id);
    if (processedIndex !== -1) {
      processedUsers[processedIndex] = updatedUser;
      localStorage.setItem('processed_users', JSON.stringify(processedUsers));
    }

    // Update in registered users
    const registeredIndex = registeredUsers.findIndex(u => u.id === updatedUser.id);
    if (registeredIndex !== -1) {
      registeredUsers[registeredIndex] = updatedUser;
      localStorage.setItem('registered_users', JSON.stringify(registeredUsers));
    }
  };

  const updateUserStatus = (userId, newStatus) => {
    // Find user in all storage locations
    let userFound = null;
    let sourceStorage = null;

    const pendingUsers = JSON.parse(localStorage.getItem('pending_users') || '[]');
    const processedUsers = JSON.parse(localStorage.getItem('processed_users') || '[]');
    const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');

    // Find user and determine source
    userFound = pendingUsers.find(u => u.id === userId);
    if (userFound) sourceStorage = 'pending_users';

    if (!userFound) {
      userFound = processedUsers.find(u => u.id === userId);
      if (userFound) sourceStorage = 'processed_users';
    }

    if (!userFound) {
      userFound = registeredUsers.find(u => u.id === userId);
      if (userFound) sourceStorage = 'registered_users';
    }

    if (!userFound || !sourceStorage) return;

    // Remove from source storage
    let updatedSourceArray;
    switch (sourceStorage) {
      case 'pending_users':
        updatedSourceArray = pendingUsers.filter(u => u.id !== userId);
        localStorage.setItem('pending_users', JSON.stringify(updatedSourceArray));
        break;
      case 'processed_users':
        updatedSourceArray = processedUsers.filter(u => u.id !== userId);
        localStorage.setItem('processed_users', JSON.stringify(updatedSourceArray));
        break;
      case 'registered_users':
        updatedSourceArray = registeredUsers.filter(u => u.id !== userId);
        localStorage.setItem('registered_users', JSON.stringify(updatedSourceArray));
        break;
    }

    // Add to appropriate new storage based on status
    const updatedUser = {
      ...userFound,
      status: newStatus,
      updated_at: new Date().toISOString(),
      processed_by: 'contato@posfaunaemfoco.com'
    };

    if (newStatus === 'pending') {
      const currentPending = JSON.parse(localStorage.getItem('pending_users') || '[]');
      currentPending.push(updatedUser);
      localStorage.setItem('pending_users', JSON.stringify(currentPending));
    } else if (newStatus === 'approved') {
      const currentRegistered = JSON.parse(localStorage.getItem('registered_users') || '[]');
      currentRegistered.push(updatedUser);
      localStorage.setItem('registered_users', JSON.stringify(currentRegistered));
    } else if (newStatus === 'rejected') {
      const currentProcessed = JSON.parse(localStorage.getItem('processed_users') || '[]');
      currentProcessed.push(updatedUser);
      localStorage.setItem('processed_users', JSON.stringify(currentProcessed));
    }

    // Update local state immediately
    setUsers(prev => prev.map(user => 
      user.id === userId ? updatedUser : user
    ));

    // Notify other components about the change
    if (onUserStatusChange) {
      onUserStatusChange();
    }

    // Dispatch custom event to update other tabs/components
    window.dispatchEvent(new CustomEvent('userDataUpdated'));
  };

  const handleStatusChange = async (userId, newStatus) => {
    const statusMessages = {
      pending: 'colocado em pendência',
      approved: 'aprovado',
      rejected: 'rejeitado',
      active: 'ativado',
      inactive: 'desativado',
      suspended: 'suspenso'
    };

    const actionText = statusMessages[newStatus];
    if (!window.confirm(`Tem certeza que deseja deixar este usuário como "${actionText}"?`)) {
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      updateUserStatus(userId, newStatus);
      toast.success(`Usuário ${actionText} com sucesso!`);
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  const handleEditUser = async (formData) => {
    try {
      // Add updated timestamp
      const updatedUser = {
        ...editingUser,
        ...formData,
        updated_at: new Date().toISOString()
      };

      // Update in storage
      updateUserInStorage(updatedUser);

      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === editingUser.id ? updatedUser : user
      ));

      // Close modal
      setEditingUser(null);

      // Notify other components
      if (onUserStatusChange) {
        onUserStatusChange();
      }

      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('userDataUpdated'));

      toast.success('Usuário atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      // Remove from all storage locations
      const pendingUsers = JSON.parse(localStorage.getItem('pending_users') || '[]');
      const processedUsers = JSON.parse(localStorage.getItem('processed_users') || '[]');
      const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');

      const updatedPending = pendingUsers.filter(u => u.id !== userId);
      const updatedProcessed = processedUsers.filter(u => u.id !== userId);
      const updatedRegistered = registeredUsers.filter(u => u.id !== userId);

      localStorage.setItem('pending_users', JSON.stringify(updatedPending));
      localStorage.setItem('processed_users', JSON.stringify(updatedProcessed));
      localStorage.setItem('registered_users', JSON.stringify(updatedRegistered));

      // Update local state
      setUsers(prev => prev.filter(user => user.id !== userId));

      // Notify other components
      if (onUserStatusChange) {
        onUserStatusChange();
      }

      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('userDataUpdated'));

      toast.success('Usuário excluído com sucesso!');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Erro ao excluir usuário');
    }
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      student: { color: 'bg-blue-100 text-blue-800', text: 'Estudante', icon: FiUser },
      institution: { color: 'bg-green-100 text-green-800', text: 'Instituição', icon: FiBuilding },
      admin: { color: 'bg-purple-100 text-purple-800', text: 'Administrador', icon: FiShield }
    };

    const config = roleConfig[role] || roleConfig.student;
    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        <SafeIcon icon={config.icon} className="w-3 h-3" />
        <span>{config.text}</span>
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', text: 'Ativo' },
      inactive: { color: 'bg-gray-100 text-gray-800', text: 'Inativo' },
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pendente' },
      suspended: { color: 'bg-red-100 text-red-800', text: 'Suspenso' },
      approved: { color: 'bg-green-100 text-green-800', text: 'Aprovado' },
      rejected: { color: 'bg-red-100 text-red-800', text: 'Rejeitado' }
    };

    const config = statusConfig[status] || statusConfig.active;
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return <LoadingSpinner text="Carregando usuários..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Gerenciamento de Usuários</h2>
            <p className="text-sm text-gray-600">
              {users.length} usuário{users.length !== 1 ? 's' : ''} cadastrado{users.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SafeIcon icon={FiSearch} className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <select
            value={filters.role}
            onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Todos os perfis</option>
            <option value="student">Estudantes</option>
            <option value="institution">Instituições</option>
            <option value="admin">Administradores</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Todos os status</option>
            <option value="pending">Pendente</option>
            <option value="approved">Aprovado</option>
            <option value="rejected">Rejeitado</option>
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
            <option value="suspended">Suspenso</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Perfil
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data de Cadastro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Informações
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <AnimatePresence>
                  {users.map((user) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                              {user.profile_image ? (
                                <img
                                  src={user.profile_image}
                                  alt="Profile"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <SafeIcon icon={FiUser} className="h-5 w-5 text-gray-500" />
                              )}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(user.status)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.created_at ? (
                          format(new Date(user.created_at), 'dd/MM/yyyy', { locale: ptBR })
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.role === 'student' && (
                          <div>
                            <div>{user.course}</div>
                            {user.class_name && <div className="text-xs">{user.class_name}</div>}
                          </div>
                        )}
                        {user.role === 'institution' && (
                          <div>
                            <div>CNPJ: {user.cnpj}</div>
                            {user.phone && <div className="text-xs">{user.phone}</div>}
                          </div>
                        )}
                        {user.role === 'admin' && (
                          <span className="text-xs text-purple-600">Acesso total</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => setViewingUser(user)}
                            className="text-blue-600 hover:text-blue-700 text-xs px-2 py-1 border border-blue-300 rounded hover:bg-blue-50"
                            title="Ver detalhes"
                          >
                            <SafeIcon icon={FiEye} className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setEditingUser(user)}
                            className="text-green-600 hover:text-green-700 text-xs px-2 py-1 border border-green-300 rounded hover:bg-green-50"
                            title="Editar usuário"
                          >
                            <SafeIcon icon={FiEdit3} className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-700 text-xs px-2 py-1 border border-red-300 rounded hover:bg-red-50"
                            title="Excluir usuário"
                          >
                            <SafeIcon icon={FiTrash2} className="w-3 h-3" />
                          </button>
                          {user.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(user.id, 'approved')}
                                className="text-green-600 hover:text-green-700 text-xs px-2 py-1 border border-green-300 rounded hover:bg-green-50"
                                title="Aprovar usuário"
                              >
                                Aprovar
                              </button>
                              <button
                                onClick={() => handleStatusChange(user.id, 'rejected')}
                                className="text-red-600 hover:text-red-700 text-xs px-2 py-1 border border-red-300 rounded hover:bg-red-50"
                                title="Rejeitar usuário"
                              >
                                Rejeitar
                              </button>
                            </>
                          )}
                          {(user.status === 'approved' || user.status === 'rejected') && (
                            <button
                              onClick={() => handleStatusChange(user.id, 'pending')}
                              className="text-yellow-600 hover:text-yellow-700 text-xs px-2 py-1 border border-yellow-300 rounded hover:bg-yellow-50"
                              title="Colocar em pendência"
                            >
                              Pendente
                            </button>
                          )}
                          {user.status === 'approved' && (
                            <button
                              onClick={() => handleStatusChange(user.id, 'suspended')}
                              className="text-red-600 hover:text-red-700 text-xs px-2 py-1 border border-red-300 rounded hover:bg-red-50"
                              title="Suspender usuário"
                            >
                              Suspender
                            </button>
                          )}
                          {user.status === 'suspended' && (
                            <button
                              onClick={() => handleStatusChange(user.id, 'approved')}
                              className="text-green-600 hover:text-green-700 text-xs px-2 py-1 border border-green-300 rounded hover:bg-green-50"
                              title="Reativar usuário"
                            >
                              Reativar
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <SafeIcon icon={FiUser} className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">Nenhum usuário encontrado.</p>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSubmit={handleEditUser}
        />
      )}

      {/* User Detail Modal */}
      {viewingUser && (
        <UserDetailModal
          user={viewingUser}
          onClose={() => setViewingUser(null)}
          onEdit={(user) => {
            setViewingUser(null);
            setEditingUser(user);
          }}
        />
      )}
    </div>
  );
};

export default UserManagement;