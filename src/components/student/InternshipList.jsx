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

  // Demo data
  const demoInternships = [
    {
      id: 'internship-1',
      title: 'Estágio em Desenvolvimento Web',
      description: 'Oportunidade para desenvolver habilidades em React, Node.js e bancos de dados.',
      total_spots: 5,
      available_spots: 3,
      period: 'matutino',
      shift: '8h às 12h',
      month_year: '2024-01',
      address: 'Av. Paulista, 1000 - Bela Vista',
      city: 'São Paulo',
      area: 'Tecnologia',
      status: 'active',
      institution_name: 'Tech Corp',
      institution_address: 'Av. Paulista, 1000',
      institution_phone: '(11) 99999-9999',
      created_at: new Date().toISOString()
    },
    {
      id: 'internship-2',
      title: 'Estágio em UX/UI Design',
      description: 'Trabalhe com design de interfaces e experiência do usuário.',
      total_spots: 3,
      available_spots: 2,
      period: 'vespertino',
      shift: '14h às 18h',
      month_year: '2024-02',
      address: 'Rua Augusta, 500 - Consolação',
      city: 'São Paulo',
      area: 'Design',
      status: 'active',
      institution_name: 'Design Studio',
      institution_address: 'Rua Augusta, 500',
      institution_phone: '(11) 88888-8888',
      created_at: new Date().toISOString()
    },
    {
      id: 'internship-3',
      title: 'Estágio em Marketing Digital',
      description: 'Aprenda sobre estratégias de marketing digital e redes sociais.',
      total_spots: 4,
      available_spots: 1,
      period: 'integral',
      shift: '8h às 17h',
      month_year: '2024-03',
      address: 'Rua Oscar Freire, 200 - Jardins',
      city: 'São Paulo',
      area: 'Marketing',
      status: 'active',
      institution_name: 'Marketing Pro',
      institution_address: 'Rua Oscar Freire, 200',
      institution_phone: '(11) 77777-7777',
      created_at: new Date().toISOString()
    },
    {
      id: 'internship-4',
      title: 'Estágio em Análise de Dados',
      description: 'Trabalhe com Python, SQL e ferramentas de análise de dados.',
      total_spots: 2,
      available_spots: 2,
      period: 'noturno',
      shift: '19h às 23h',
      month_year: '2024-01',
      address: 'Av. Faria Lima, 3000 - Itaim Bibi',
      city: 'São Paulo',
      area: 'Tecnologia',
      status: 'active',
      institution_name: 'Data Analytics Corp',
      institution_address: 'Av. Faria Lima, 3000',
      institution_phone: '(11) 66666-6666',
      created_at: new Date().toISOString()
    }
  ];

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
      setInternships(demoInternships);
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

  // Check if user has an active reservation
  const hasActiveReservation = () => {
    return userReservations.some(reservation => 
      reservation.status === 'active' || reservation.status === 'pending'
    );
  };

  // Get user's active reservation
  const getActiveReservation = () => {
    return userReservations.find(reservation => 
      reservation.status === 'active' || reservation.status === 'pending'
    );
  };

  // Check if user already reserved this specific internship
  const hasReservedInternship = (internshipId) => {
    return userReservations.some(reservation => 
      reservation.internship_id === internshipId && 
      (reservation.status === 'active' || reservation.status === 'pending')
    );
  };

  const handleReserve = async (internshipId) => {
    if (!user) {
      toast.error('Você precisa estar logado para reservar uma vaga');
      return;
    }

    // Check if user already has an active reservation
    if (hasActiveReservation()) {
      const activeReservation = getActiveReservation();
      toast.error(
        `Você já possui uma reserva ativa para "${activeReservation.title}". ` +
        'Cancele sua reserva atual para poder reservar outra vaga.',
        { duration: 6000 }
      );
      return;
    }

    // Check if user already reserved this specific internship
    if (hasReservedInternship(internshipId)) {
      toast.error('Você já reservou esta vaga');
      return;
    }

    setReserving(internshipId);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const internship = internships.find(int => int.id === internshipId);
      if (internship.available_spots <= 0) {
        toast.error('Esta vaga não está mais disponível');
        return;
      }

      // Create new reservation
      const newReservation = {
        id: 'reservation-' + Date.now(),
        internship_id: internshipId,
        student_id: user.id,
        status: 'active', // Can be 'active', 'pending', 'approved', 'rejected', 'cancelled', 'completed'
        reserved_at: new Date().toISOString(),
        title: internship.title,
        period: internship.period,
        shift: internship.shift,
        month_year: internship.month_year,
        address: internship.address,
        city: internship.city,
        area: internship.area,
        institution_name: internship.institution_name
      };

      // Update user reservations
      const updatedReservations = [...userReservations, newReservation];
      setUserReservations(updatedReservations);
      saveUserReservations(updatedReservations);

      // Update local internship state
      setInternships(prev =>
        prev.map(int =>
          int.id === internshipId
            ? { ...int, available_spots: int.available_spots - 1 }
            : int
        )
      );

      toast.success('Vaga reservada com sucesso!');
    } catch (error) {
      console.error('Error reserving internship:', error);
      toast.error('Erro ao reservar vaga');
    } finally {
      setReserving(null);
    }
  };

  // Get button state for internship
  const getButtonState = (internship) => {
    if (internship.available_spots === 0) {
      return { disabled: true, text: 'Esgotado', className: 'bg-gray-100 text-gray-400 cursor-not-allowed' };
    }

    if (reserving === internship.id) {
      return { disabled: true, text: 'Reservando...', className: 'bg-primary-100 text-primary-600 cursor-not-allowed' };
    }

    if (hasReservedInternship(internship.id)) {
      return { disabled: true, text: 'Já Reservada', className: 'bg-green-100 text-green-600 cursor-not-allowed' };
    }

    if (hasActiveReservation()) {
      return { disabled: true, text: 'Reserva Ativa', className: 'bg-yellow-100 text-yellow-600 cursor-not-allowed' };
    }

    return { disabled: false, text: 'Reservar', className: 'bg-primary-600 text-white hover:bg-primary-700 hover:scale-105' };
  };

  if (loading) {
    return <LoadingSpinner text="Carregando vagas..." />;
  }

  const activeReservation = getActiveReservation();

  return (
    <div className="space-y-6">
      {/* Active Reservation Alert */}
      {activeReservation && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <div className="flex items-start space-x-3">
            <SafeIcon icon={FiInfo} className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-blue-900">
                Você possui uma reserva ativa
              </h4>
              <p className="text-sm text-blue-700 mt-1">
                <strong>{activeReservation.title}</strong> - {activeReservation.institution_name}
              </p>
              <p className="text-xs text-blue-600 mt-2">
                Para reservar outra vaga, você deve primeiro cancelar sua reserva atual na aba "Minhas Reservas".
              </p>
            </div>
          </div>
        </motion.div>
      )}

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {filteredInternships.map((internship) => {
            const buttonState = getButtonState(internship);
            
            return (
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
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        internship.available_spots > 5
                          ? 'bg-green-100 text-green-800'
                          : internship.available_spots > 0
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {internship.available_spots} vaga{internship.available_spots !== 1 ? 's' : ''}
                      </span>
                      {hasReservedInternship(internship.id) && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          ✓ Reservada
                        </span>
                      )}
                    </div>
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
                    <button
                      onClick={() => handleReserve(internship.id)}
                      disabled={buttonState.disabled}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${buttonState.className}`}
                      title={buttonState.disabled && hasActiveReservation() ? 'Você já possui uma reserva ativa' : ''}
                    >
                      <SafeIcon icon={FiCheck} className="w-4 h-4" />
                      <span>{buttonState.text}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredInternships.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <SafeIcon icon={FiSearch} className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma vaga encontrada
          </h3>
          <p className="text-gray-600 mb-4">
            Tente ajustar os filtros ou aguarde novas vagas serem publicadas.
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
      )}
    </div>
  );
};

export default InternshipList;