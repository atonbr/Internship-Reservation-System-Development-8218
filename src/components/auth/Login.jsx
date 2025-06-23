import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../../context/AuthContext';

const { FiMail, FiLock, FiEye, FiEyeOff, FiBookOpen } = FiIcons;

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      const user = await login(formData.email, formData.password);
      toast.success('Login realizado com sucesso!');
      
      // Redirect based on user role
      switch (user.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'institution':
          navigate('/institution');
          break;
        case 'student':
          navigate('/student');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.error || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  // Quick login function for demo
  const handleQuickLogin = async (email, password) => {
    setFormData({ email, password });
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success('Login realizado com sucesso!');
      switch (user.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'institution':
          navigate('/institution');
          break;
        case 'student':
          navigate('/student');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      toast.error(error.error || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mx-auto h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center"
          >
            <SafeIcon icon={FiBookOpen} className="h-8 w-8 text-white" />
          </motion.div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Sistema de Estágios
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Acesse sua conta para continuar
          </p>
        </div>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-lg"
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiMail} className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiLock} className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <SafeIcon
                    icon={showPassword ? FiEyeOff : FiEye}
                    className="h-5 w-5 text-gray-400 hover:text-gray-600"
                  />
                </button>
              </div>
            </div>
          </div>

          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </motion.button>
          </div>

          <div className="text-center space-y-4">
            <div className="text-sm text-gray-600">
              Não tem uma conta?
            </div>
            <div className="flex flex-col space-y-2">
              <Link
                to="/register/student"
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
              >
                Cadastrar como Estudante
              </Link>
              <Link
                to="/register/institution"
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
              >
                Cadastrar como Instituição
              </Link>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center mb-3">
              <strong>Sistema de demonstração:</strong>
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('demo@student.com', 'demo123')}
                disabled={loading}
                className="w-full text-xs text-left px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors duration-200 disabled:opacity-50"
              >
                🎓 Estudante Demo: demo@student.com / demo123
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('demo@institution.com', 'demo123')}
                disabled={loading}
                className="w-full text-xs text-left px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors duration-200 disabled:opacity-50"
              >
                🏢 Instituição Demo: demo@institution.com / demo123
              </button>
            </div>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Login;