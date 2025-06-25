import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../../context/AuthContext';

const { FiBriefcase, FiMapPin, FiClock, FiCalendar, FiUsers, FiFileText } = FiIcons;

const CreateInternship = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    totalSpots: '',
    period: '',
    shift: '',
    monthYear: '',
    address: '',
    city: '',
    area: ''
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.totalSpots || !formData.period || !formData.shift || !formData.monthYear || !formData.address || !formData.city || !formData.area) {
      toast.error('Todos os campos obrigatórios devem ser preenchidos');
      return;
    }

    if (parseInt(formData.totalSpots) <= 0) {
      toast.error('O número de vagas deve ser maior que zero');
      return;
    }

    setLoading(true);
    try {
      // Create new internship
      const newInternship = {
        id: 'internship-' + Date.now(),
        institution_id: user.id,
        institution_name: user.name,
        title: formData.title,
        description: formData.description,
        total_spots: parseInt(formData.totalSpots),
        available_spots: parseInt(formData.totalSpots),
        period: formData.period,
        shift: formData.shift,
        month_year: formData.monthYear,
        address: formData.address,
        city: formData.city,
        area: formData.area,
        status: 'active',
        created_at: new Date().toISOString()
      };

      // Save to localStorage
      const existingInternships = JSON.parse(localStorage.getItem('internships') || '[]');
      existingInternships.push(newInternship);
      localStorage.setItem('internships', JSON.stringify(existingInternships));

      toast.success('Vaga criada com sucesso!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        totalSpots: '',
        period: '',
        shift: '',
        monthYear: '',
        address: '',
        city: '',
        area: ''
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating internship:', error);
      toast.error('Erro ao criar vaga');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Nova Vaga de Estágio</h2>
        <p className="text-sm text-gray-600 mt-1">
          Preencha os dados para criar uma nova vaga
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Título */}
          <div className="lg:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Título da Vaga *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SafeIcon icon={FiBriefcase} className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ex: Estágio em Desenvolvimento Web"
              />
            </div>
          </div>

          {/* Descrição */}
          <div className="lg:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <SafeIcon icon={FiFileText} className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Descreva as atividades, requisitos e benefícios do estágio..."
              />
            </div>
          </div>

          {/* Número de Vagas */}
          <div>
            <label htmlFor="totalSpots" className="block text-sm font-medium text-gray-700 mb-2">
              Número de Vagas *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SafeIcon icon={FiUsers} className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                id="totalSpots"
                name="totalSpots"
                required
                min="1"
                value={formData.totalSpots}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ex: 5"
              />
            </div>
          </div>

          {/* Período */}
          <div>
            <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-2">
              Período *
            </label>
            <select
              id="period"
              name="period"
              required
              value={formData.period}
              onChange={handleChange}
              className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Selecione o período</option>
              <option value="matutino">Matutino</option>
              <option value="vespertino">Vespertino</option>
              <option value="noturno">Noturno</option>
              <option value="integral">Integral</option>
            </select>
          </div>

          {/* Turno */}
          <div>
            <label htmlFor="shift" className="block text-sm font-medium text-gray-700 mb-2">
              Turno *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SafeIcon icon={FiClock} className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="shift"
                name="shift"
                required
                value={formData.shift}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ex: 8h às 12h"
              />
            </div>
          </div>

          {/* Mês/Ano */}
          <div>
            <label htmlFor="monthYear" className="block text-sm font-medium text-gray-700 mb-2">
              Mês/Ano *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SafeIcon icon={FiCalendar} className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="monthYear"
                name="monthYear"
                required
                value={formData.monthYear}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ex: 2024-01"
              />
            </div>
          </div>

          {/* Cidade */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
              Cidade *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SafeIcon icon={FiMapPin} className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="city"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ex: São Paulo"
              />
            </div>
          </div>

          {/* Área */}
          <div>
            <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
              Área *
            </label>
            <input
              type="text"
              id="area"
              name="area"
              required
              value={formData.area}
              onChange={handleChange}
              className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Ex: Tecnologia, Saúde, Educação"
            />
          </div>

          {/* Endereço */}
          <div className="lg:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Endereço Completo *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SafeIcon icon={FiMapPin} className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="address"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Rua, número, bairro, CEP"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setFormData({
              title: '',
              description: '',
              totalSpots: '',
              period: '',
              shift: '',
              monthYear: '',
              address: '',
              city: '',
              area: ''
            })}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
          >
            Limpar
          </button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="px-6 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? 'Criando...' : 'Criar Vaga'}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default CreateInternship;