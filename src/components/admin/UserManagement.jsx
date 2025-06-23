import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import LoadingSpinner from '../common/LoadingSpinner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const { FiSearch, FiFilter, FiPlus, FiEdit3, FiTrash2, FiKey, FiUser, FiBuilding } = FiIcons;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', role: '' });

  // Demo data
  const demoUsers = [
    {
      id: 'user-1',
      email: 'demo@student.com',
      name: 'João Silva',
      role: 'student',
      course: 'Engenharia de Software',
      class_name: '2024.1',
      created_at: new Date().toISOString()
    },
    {
      id: 'user-2',
      email: 'demo@institution.com',
      name: 'Tech Corp',
      role: 'institution',
      cnpj: '12.345.678/0001-90',
      phone: '(11) 99999-9999',
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'user-3',
      email: 'admin@sistema.com',
      name: 'Administrador',
      role: 'admin',
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let filtered = demoUsers;

      if (filters.role) {
        filtered = filtered.filter(user => user.role === filters.role);
      }

      if (filters.search) {
        filtered = filtered.filter(user =>
          user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          user.email.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      setUsers(filtered);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) {
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUsers(prev => prev.filter(user => user.id !== userId));
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
      admin: { color: 'bg-purple-100 text-purple-800', text: 'Administrador', icon: FiKey }
    };

    const config = roleConfig[role] || roleConfig.student;

    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        <SafeIcon icon={config.icon} className="w-3 h-3" />
        <span>{config.text}</span>
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
          <button
            onClick={() => toast.info('Funcionalidade disponível em breve')}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4" />
            <span>Novo Usuário</span>
          </button>
        </div>

        {/* Filters */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
      </div>

      {/* Users List */}
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
                    Informações Adicionais
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cadastrado em
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
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.role === 'student' && user.course && (
                          <div>
                            <div>{user.course}</div>
                            {user.class_name && <div className="text-xs">{user.class_name}</div>}
                          </div>
                        )}
                        {user.role === 'institution' && user.cnpj && (
                          <div>
                            <div>CNPJ: {user.cnpj}</div>
                            {user.phone && <div className="text-xs">{user.phone}</div>}
                          </div>
                        )}
                        {user.role === 'admin' && (
                          <span className="text-xs text-purple-600">Acesso total</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(user.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => toast.info('Funcionalidade disponível em breve')}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <SafeIcon icon={FiEdit3} className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toast.info('Funcionalidade disponível em breve')}
                            className="text-orange-600 hover:text-orange-700"
                          >
                            <SafeIcon icon={FiKey} className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                          </button>
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
    </div>
  );
};

export default UserManagement;