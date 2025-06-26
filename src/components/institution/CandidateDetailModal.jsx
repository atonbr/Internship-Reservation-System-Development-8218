import React from 'react';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import {format} from 'date-fns';
import {ptBR} from 'date-fns/locale';

const {FiX, FiUser, FiMail, FiBookOpen, FiUsers, FiCalendar, FiMapPin, FiClock, FiCheck, FiAlertCircle} = FiIcons;

const CandidateDetailModal = ({candidate, onClose, onApprove, onReject, processing}) => {
  if (!candidate) return null;

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        color: 'bg-yellow-100 text-yellow-800',
        text: 'Pendente de Aprovação'
      },
      approved: {
        color: 'bg-green-100 text-green-800',
        text: 'Candidatura Aprovada'
      },
      rejected: {
        color: 'bg-red-100 text-red-800',
        text: 'Candidatura Rejeitada'
      },
      cancelled: {
        color: 'bg-gray-100 text-gray-800',
        text: 'Cancelada pelo Estudante'
      },
      completed: {
        color: 'bg-purple-100 text-purple-800',
        text: 'Estágio Concluído'
      }
    };

    const config = statusConfig[status] || statusConfig.active;

    return (
      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{opacity: 0, scale: 0.95}}
        animate={{opacity: 1, scale: 1}}
        exit={{opacity: 0, scale: 0.95}}
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Detalhes da Candidatura
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <SafeIcon icon={FiX} className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            {/* Status */}
            <div className="flex items-center justify-center">
              {getStatusBadge(candidate.status)}
            </div>

            {/* Candidate Information */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <SafeIcon icon={FiUser} className="w-5 h-5 mr-2 text-blue-600" />
                Informações do Candidato
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  <p className="text-gray-900 font-medium">{candidate.candidate.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiMail} className="w-4 h-4 text-gray-500" />
                    <p className="text-gray-900">{candidate.candidate.email}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Curso
                  </label>
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiBookOpen} className="w-4 h-4 text-gray-500" />
                    <p className="text-gray-900">{candidate.candidate.course}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Turma
                  </label>
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiUsers} className="w-4 h-4 text-gray-500" />
                    <p className="text-gray-900">{candidate.candidate.class_name}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Cadastro
                  </label>
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiCalendar} className="w-4 h-4 text-gray-500" />
                    <p className="text-gray-900">
                      {format(new Date(candidate.candidate.created_at), 'dd/MM/yyyy', {locale: ptBR})}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status da Conta
                  </label>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    candidate.candidate.status === 'approved' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {candidate.candidate.status === 'approved' ? 'Aprovada' : 'Pendente'}
                  </span>
                </div>
              </div>
            </div>

            {/* Internship Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Vaga de Interesse
              </h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título da Vaga
                  </label>
                  <p className="text-gray-900 font-medium">{candidate.internship.title}</p>
                </div>

                {candidate.internship.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição
                    </label>
                    <p className="text-gray-700 text-sm">{candidate.internship.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cidade
                    </label>
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiMapPin} className="w-3 h-3 text-gray-500" />
                      <p className="text-gray-900 text-sm">{candidate.internship.city}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Período
                    </label>
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiClock} className="w-3 h-3 text-gray-500" />
                      <p className="text-gray-900 text-sm capitalize">{candidate.internship.period}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mês/Ano
                    </label>
                    <p className="text-gray-900 text-sm">{candidate.internship.month_year}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Área
                    </label>
                    <p className="text-gray-900 text-sm">{candidate.internship.area}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Details */}
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Detalhes da Candidatura
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data da Candidatura
                  </label>
                  <p className="text-gray-900">
                    {format(new Date(candidate.reserved_at), 'dd/MM/yyyy HH:mm', {locale: ptBR})}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status Atual
                  </label>
                  <p className="text-gray-900 capitalize">{candidate.status}</p>
                </div>

                {candidate.institution_approved_at && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data da Aprovação
                      </label>
                      <p className="text-gray-900">
                        {format(new Date(candidate.institution_approved_at), 'dd/MM/yyyy HH:mm', {locale: ptBR})}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Aprovado por
                      </label>
                      <p className="text-gray-900">{candidate.institution_approved_by}</p>
                    </div>
                  </>
                )}

                {candidate.rejection_reason && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Motivo da Rejeição
                    </label>
                    <p className="text-red-700 bg-red-50 p-2 rounded border border-red-200">
                      {candidate.rejection_reason}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Important Notice */}
            {candidate.status === 'approved' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-green-900 mb-1">
                      Candidatura Aprovada
                    </h4>
                    <p className="text-sm text-green-700">
                      Esta candidatura foi aprovada. O estudante não pode mais cancelar sua inscrição 
                      sem que a instituição cancele primeiro.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {candidate.status === 'active' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <SafeIcon icon={FiAlertCircle} className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 mb-1">
                      Aguardando Sua Decisão
                    </h4>
                    <p className="text-sm text-blue-700">
                      Este candidato está aguardando sua aprovação ou rejeição. 
                      Revise as informações e tome uma decisão.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {candidate.status === 'active' && (
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-end space-x-4">
              <button
                onClick={() => onReject(candidate.id)}
                disabled={processing === candidate.id}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
              >
                <SafeIcon icon={FiX} className="w-4 h-4" />
                <span>{processing === candidate.id ? 'Processando...' : 'Rejeitar Candidatura'}</span>
              </button>
              
              <button
                onClick={() => onApprove(candidate.id)}
                disabled={processing === candidate.id}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
              >
                <SafeIcon icon={FiCheck} className="w-4 h-4" />
                <span>{processing === candidate.id ? 'Processando...' : 'Aprovar Candidatura'}</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CandidateDetailModal;