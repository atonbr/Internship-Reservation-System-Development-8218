import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const { FiX, FiMail, FiUser, FiBuilding, FiPhone, FiMapPin, FiBookOpen, FiUsers, FiGlobe, FiLinkedin, FiCalendar, FiEdit3 } = FiIcons;

const UserDetailModal = ({ user, onClose, onEdit }) => {
  if (!user) return null;

  const getRoleIcon = (role) => {
    switch (role) {
      case 'student':
        return FiUser;
      case 'institution':
        return FiBuilding;
      case 'admin':
        return FiIcons.FiShield;
      default:
        return FiUser;
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'student':
        return 'Estudante';
      case 'institution':
        return 'Instituição';
      case 'admin':
        return 'Administrador';
      default:
        return 'Usuário';
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pendente' },
      approved: { color: 'bg-green-100 text-green-800', text: 'Aprovado' },
      rejected: { color: 'bg-red-100 text-red-800', text: 'Rejeitado' },
      suspended: { color: 'bg-red-100 text-red-800', text: 'Suspenso' }
    };

    const config = statusConfig[status] || statusConfig.approved;
    return (
      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Detalhes do Usuário
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(user)}
                className="flex items-center space-x-2 px-3 py-1 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors duration-200"
              >
                <SafeIcon icon={FiEdit3} className="w-4 h-4" />
                <span>Editar</span>
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <SafeIcon icon={FiX} className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            
            {/* Profile Header */}
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {user.profile_image ? (
                  <img
                    src={user.profile_image}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <SafeIcon icon={getRoleIcon(user.role)} className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="inline-flex items-center space-x-1 px-2 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                    <SafeIcon icon={getRoleIcon(user.role)} className="w-3 h-3" />
                    <span>{getRoleText(user.role)}</span>
                  </span>
                  {getStatusBadge(user.status)}
                </div>
              </div>
            </div>

            {/* Bio */}
            {user.bio && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Biografia</h3>
                <p className="text-gray-700">{user.bio}</p>
              </div>
            )}

            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Informações Básicas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiMail} className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiCalendar} className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Cadastro</p>
                    <p className="text-gray-900">
                      {user.created_at ? format(new Date(user.created_at), 'dd/MM/yyyy', { locale: ptBR }) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Role-specific Information */}
            {user.role === 'student' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Informações Acadêmicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <SafeIcon icon={FiBookOpen} className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Curso</p>
                      <p className="text-gray-900">{user.course || 'Não informado'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <SafeIcon icon={FiUsers} className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Turma</p>
                      <p className="text-gray-900">{user.class_name || 'Não informado'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {user.role === 'institution' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Informações da Instituição</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <SafeIcon icon={FiBuilding} className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">CNPJ</p>
                      <p className="text-gray-900">{user.cnpj || 'Não informado'}</p>
                    </div>
                  </div>

                  {user.phone && (
                    <div className="flex items-center space-x-3">
                      <SafeIcon icon={FiPhone} className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Telefone</p>
                        <p className="text-gray-900">{user.phone}</p>
                      </div>
                    </div>
                  )}

                  {user.address && (
                    <div className="flex items-start space-x-3 md:col-span-2">
                      <SafeIcon icon={FiMapPin} className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Endereço</p>
                        <p className="text-gray-900">{user.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Social Links */}
            {(user.website || user.linkedin) && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Links e Redes Sociais</h3>
                <div className="space-y-3">
                  {user.website && (
                    <div className="flex items-center space-x-3">
                      <SafeIcon icon={FiGlobe} className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Website</p>
                        <a
                          href={user.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 underline"
                        >
                          {user.website}
                        </a>
                      </div>
                    </div>
                  )}

                  {user.linkedin && (
                    <div className="flex items-center space-x-3">
                      <SafeIcon icon={FiLinkedin} className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">LinkedIn</p>
                        <a
                          href={user.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 underline"
                        >
                          {user.linkedin}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Histórico</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">
                    Cadastrado em {user.created_at ? format(new Date(user.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : 'N/A'}
                  </span>
                </div>
                
                {user.processed_at && (
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">
                      Processado em {format(new Date(user.processed_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      {user.processed_by && ` por ${user.processed_by}`}
                    </span>
                  </div>
                )}

                {user.updated_at && user.updated_at !== user.created_at && (
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-600">
                      Última atualização em {format(new Date(user.updated_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserDetailModal;