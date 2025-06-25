import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../../context/AuthContext';

const { FiClock, FiMail, FiCheckCircle, FiAlertCircle, FiLogOut } = FiIcons;

const PendingApprovalScreen = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const getRoleText = () => {
    switch (user?.role) {
      case 'student':
        return {
          title: 'Aguardando Aprovação - Estudante',
          subtitle: 'acessar o sistema de vagas de estágio',
          features: ['• Um administrador irá revisar sua conta', '• Você receberá um email quando for aprovado', '• Após aprovação, poderá acessar todas as vagas']
        };
      case 'institution':
        return {
          title: 'Aguardando Aprovação - Instituição',
          subtitle: 'criar e gerenciar vagas de estágio',
          features: ['• Um administrador irá revisar sua conta', '• Você receberá um email quando for aprovado', '• Após aprovação, poderá criar vagas de estágio']
        };
      default:
        return {
          title: 'Aguardando Aprovação',
          subtitle: 'acessar o sistema',
          features: ['• Um administrador irá revisar sua conta', '• Você receberá um email quando for aprovado', '• Após aprovação, poderá acessar o sistema']
        };
    }
  };

  const roleInfo = getRoleText();

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {/* Status Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mx-auto h-20 w-20 bg-yellow-100 rounded-full flex items-center justify-center mb-6"
          >
            <SafeIcon icon={FiClock} className="h-10 w-10 text-yellow-600" />
          </motion.div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {roleInfo.title}
          </h1>

          {/* Message */}
          <div className="space-y-4 mb-8">
            <p className="text-gray-600">
              Olá, <strong>{user?.name}</strong>!
            </p>
            <p className="text-gray-600">
              Sua conta foi criada com sucesso, mas precisa ser aprovada por um administrador antes que você possa {roleInfo.subtitle}.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <SafeIcon icon={FiAlertCircle} className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="text-left">
                  <h3 className="text-sm font-medium text-yellow-800 mb-1">
                    O que acontece agora?
                  </h3>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {roleInfo.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 text-blue-800">
              <SafeIcon icon={FiMail} className="w-4 h-4" />
              <span className="text-sm font-medium">Dúvidas? Entre em contato:</span>
            </div>
            <p className="text-sm text-blue-700 mt-1">
              contato@posfaunaemfoco.com
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.reload()}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              <SafeIcon icon={FiCheckCircle} className="w-4 h-4" />
              <span>Verificar Status</span>
            </motion.button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <SafeIcon icon={FiLogOut} className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Sistema de Estágios - Tempo médio de aprovação: 24-48h
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PendingApprovalScreen;