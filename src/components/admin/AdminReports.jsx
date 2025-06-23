import React from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiFileText, FiDownload } = FiIcons;

const AdminReports = () => {
  const reports = [
    {
      title: 'Relatório de Ocupação de Vagas',
      description: 'Dados sobre vagas disponíveis, ocupadas e taxa de ocupação por período',
      type: 'occupancy'
    },
    {
      title: 'Relatório de Instituições Ativas',
      description: 'Lista de instituições mais ativas com número de vagas criadas',
      type: 'institutions'
    },
    {
      title: 'Relatório de Estudantes',
      description: 'Dados completos de estudantes cadastrados e suas reservas',
      type: 'students'
    },
    {
      title: 'Relatório Geral do Sistema',
      description: 'Visão completa com todas as estatísticas e métricas importantes',
      type: 'general'
    }
  ];

  const handleExport = (type) => {
    // Implementar exportação de relatórios
    console.log('Exportando relatório:', type);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Relatórios do Sistema</h2>
        <p className="text-sm text-gray-600">
          Gere e baixe relatórios detalhados sobre o uso do sistema
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report) => (
          <div key={report.type} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <SafeIcon icon={FiFileText} className="w-5 h-5 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900">
                    {report.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {report.description}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => handleExport(report.type)}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <SafeIcon icon={FiDownload} className="w-4 h-4" />
              <span>Exportar CSV</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReports;