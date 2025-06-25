import React, {useState} from 'react';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import Layout from '../common/Layout';
import InternshipList from './InternshipList';
import MyReservations from './MyReservations';
import StudentStats from './StudentStats';
import PendingApprovalScreen from './PendingApprovalScreen';
import {useAuth} from '../../context/AuthContext';

const {FiSearch, FiBookmark, FiBarChart3} = FiIcons;

const StudentDashboard = () => {
  const {user} = useAuth();
  const [activeTab, setActiveTab] = useState('internships');

  // Debug: Log user data
  console.log('StudentDashboard - User data:', user);

  // If no user, show loading
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Check if user is pending approval
  if (user?.status === 'pending') {
    return <PendingApprovalScreen />;
  }

  // Check if user is rejected
  if (user?.status === 'rejected') {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <SafeIcon icon={FiIcons.FiX} className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Conta Rejeitada</h1>
          <p className="text-gray-600 mb-4">
            Sua solicitação de cadastro foi rejeitada. Entre em contato com o suporte para mais informações.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2 text-blue-800">
              <SafeIcon icon={FiIcons.FiMail} className="w-4 h-4" />
              <span className="text-sm font-medium">Entre em contato:</span>
            </div>
            <p className="text-sm text-blue-700 mt-1">
              contato@posfaunaemfoco.com
            </p>
          </div>
          <button
            onClick={() => user?.logout?.()}
            className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Sair
          </button>
        </div>
      </div>
    );
  }

  // Check if user is blocked
  if (user?.status === 'blocked') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <SafeIcon icon={FiIcons.FiLock} className="h-8 w-8 text-gray-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Conta Bloqueada</h1>
          <p className="text-gray-600 mb-4">
            Sua conta foi temporariamente bloqueada. Entre em contato com o administrador.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2 text-blue-800">
              <SafeIcon icon={FiIcons.FiMail} className="w-4 h-4" />
              <span className="text-sm font-medium">Entre em contato:</span>
            </div>
            <p className="text-sm text-blue-700 mt-1">
              contato@posfaunaemfoco.com
            </p>
          </div>
          <button
            onClick={() => user?.logout?.()}
            className="w-full py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Sair
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    {id: 'internships', label: 'Vagas Disponíveis', icon: FiSearch},
    {id: 'reservations', label: 'Minhas Reservas', icon: FiBookmark},
    {id: 'stats', label: 'Estatísticas', icon: FiBarChart3}
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'internships':
        return <InternshipList />;
      case 'reservations':
        return <MyReservations />;
      case 'stats':
        return <StudentStats />;
      default:
        return <InternshipList />;
    }
  };

  return (
    <Layout title="Painel do Estudante" subtitle="Encontre e reserve vagas de estágio">
      <div className="space-y-6">
        {/* Welcome Message */}
        <motion.div
          initial={{opacity: 0, y: -20}}
          animate={{opacity: 1, y: 0}}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
                <SafeIcon icon={FiIcons.FiUser} className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Bem-vindo, {user.name}!
              </h2>
              <p className="text-sm text-gray-600">
                {user.course && `Curso: ${user.course}`}
                {user.class_name && ` - Turma: ${user.class_name}`}
              </p>
            </div>
          </div>
        </motion.div>

        {/* User Status Alert */}
        {(user?.status === 'approved' || !user?.status) && (
          <motion.div
            initial={{opacity: 0, y: -20}}
            animate={{opacity: 1, y: 0}}
            className="bg-green-50 border border-green-200 rounded-lg p-4"
          >
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiIcons.FiCheckCircle} className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Conta ativa! Você pode navegar por todas as vagas disponíveis.
              </span>
            </div>
          </motion.div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex space-x-1 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <SafeIcon icon={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.3}}
        >
          {renderContent()}
        </motion.div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;