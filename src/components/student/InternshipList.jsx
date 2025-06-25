import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import LoadingSpinner from '../common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

const { FiSearch, FiFilter, FiMapPin, FiClock, FiCalendar, FiUsers, FiBuilding, FiCheck, FiAlertCircle, FiInfo } = FiIcons;

const InternshipList = () => {
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(null);
  const [userReservations, setUserReservations] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    area: '',
    period: '',
    monthYear: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useAuth();

  // Start with empty internships array - real data will come from institutions
  const demoInternships = [];

  // Demo user reservations - simulating user's current reservations
  const getUserReservations = () => {
    const storedReservations = localStorage.getItem(`reservations_${user?.id}`) || '[]';
    return JSON.parse(storedReservations);
  };

  const saveUserReservations = (reservations) => {
    localStorage.setItem(`reservations_${user?.id}`, JSON.stringify(reservations));
  };

  useEffect(() => {
    fetchInternships();
    if (user) {
      setUserReservations(getUserReservations());
    }
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [internships, filters]);

  const fetchInternships = async () => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get internships from localStorage (created by institutions)
      const storedInternships = JSON.parse(localStorage.getItem('internships') || '[]');
      setInternships(storedInternships);
    } catch (error) {
      console.error('Error fetching internships:', error);
      toast.error('Erro ao carregar vagas');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = internships;

    if (filters.search) {
      filtered = filtered.filter(internship =>
        internship.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        internship.institution_name.toLowerCase().includes(filters.search.toLowerCase()) ||
        internship.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    if (filters.city) {
      filtered = filtered.filter(internship =>
        internship.city.toLowerCase().includes(filters.city.toLowerCase())
      );
    }
    if (filters.area) {
      filtered = filtered.filter(internship =>
        internship.area.toLowerCase().includes(filters.area.toLowerCase())
      );
    }
    if (filters.period) {
      filtered = filtered.filter(internship => internship.period === filters.period);
    }
    if (filters.monthYear) {
      filtered = filtered.filter(internship => internship.month_year === filters.monthYear);
    }

    setFilteredInternships(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      city: '',
      area: '',
      period: '',
      monthYear: ''
    });
  };

  if (loading) {
    return <LoadingSpinner text="Carregando vagas..." />;
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SafeIcon icon={FiSearch} className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar vagas, instituições..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <SafeIcon icon={FiFilter} className="w-4 h-4" />
              <span>Filtros</span>
            </button>
            {Object.values(filters).some(filter => filter !== '') && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: São Paulo"
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Área
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Tecnologia"
                    value={filters.area}
                    onChange={(e) => handleFilterChange('area', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Período
                  </label>
                  <select
                    value={filters.period}
                    onChange={(e) => handleFilterChange('period', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Todos</option>
                    <option value="matutino">Matutino</option>
                    <option value="vespertino">Vespertino</option>
                    <option value="noturno">Noturno</option>
                    <option value="integral">Integral</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mês/Ano
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 2024-01"
                    value={filters.monthYear}
                    onChange={(e) => handleFilterChange('monthYear', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {filteredInternships.length} vaga{filteredInternships.length !== 1 ? 's' : ''} encontrada{filteredInternships.length !== 1 ? 's' : ''}
        </p>
        <div className="flex items-center space-x-2 text-sm text-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Sistema funcionando</span>
        </div>
      </div>

      {/* Internships Grid */}
      {filteredInternships.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <SafeIcon icon={FiBriefcase} className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma vaga disponível
          </h3>
          <p className="text-gray-600 mb-4">
            Ainda não há vagas de estágio publicadas. Aguarde novas oportunidades serem criadas pelas instituições.
          </p>
          {Object.values(filters).some(filter => filter !== '') && (
            <button
              onClick={clearFilters}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Limpar filtros
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence>
            {filteredInternships.map((internship) => (
              <motion.div
                key={internship.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {internship.title}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <SafeIcon icon={FiBuilding} className="w-4 h-4" />
                        <span>{internship.institution_name}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      internship.available_spots > 5 
                        ? 'bg-green-100 text-green-800' 
                        : internship.available_spots > 0 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {internship.available_spots} vaga{internship.available_spots !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {internship.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {internship.description}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <SafeIcon icon={FiMapPin} className="w-4 h-4" />
                      <span>{internship.city}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <SafeIcon icon={FiClock} className="w-4 h-4" />
                      <span className="capitalize">{internship.period}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                      <span>{internship.month_year}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <SafeIcon icon={FiUsers} className="w-4 h-4" />
                      <span>{internship.area}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">{internship.total_spots - internship.available_spots}</span>
                      /{internship.total_spots} reservadas
                    </div>
                    {/* Reservation button would go here */}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default InternshipList;