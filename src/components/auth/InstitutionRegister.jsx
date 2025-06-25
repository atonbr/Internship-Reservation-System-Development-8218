import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {motion} from 'framer-motion';
import toast from 'react-hot-toast';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import {useAuth} from '../../context/AuthContext';

const {FiMail, FiLock, FiUser, FiBuilding, FiMapPin, FiPhone, FiEye, FiEyeOff, FiAlertCircle, FiCheck} = FiIcons;

const InstitutionRegister = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    cnpj: '',
    address: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const {registerInstitution} = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (!formData.name || !formData.email || !formData.cnpj) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (!acceptedTerms) {
      toast.error('É necessário aceitar os termos para continuar');
      return;
    }

    setLoading(true);
    try {
      const user = await registerInstitution({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        cnpj: formData.cnpj,
        address: formData.address,
        phone: formData.phone
      });
      
      toast.success('Conta criada com sucesso! Aguarde a aprovação do administrador.');
      navigate('/institution');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.error || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  const TermsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{opacity: 0, scale: 0.95}}
        animate={{opacity: 1, scale: 1}}
        exit={{opacity: 0, scale: 0.95}}
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Termos de Aceite - Programa de Estágios
            </h3>
            <button
              onClick={() => setShowTermsModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <SafeIcon icon={FiIcons.FiX} className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] text-sm leading-relaxed">
          <p className="mb-4">
            Pelo presente instrumento particular, a Instituição que realiza seu cadastro no sistema de gerenciamento de vagas da pós-graduação "Fauna em Foco" ("Sistema"), declara ter lido, compreendido e aceito todas as cláusulas a seguir, obrigando-se a cumpri-las integralmente.
          </p>

          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">1. Objeto</h4>
              <p className="mb-2">1.1. Este Termo regula a relação entre a Instituição Concedente e EDUCAÇÃO DIGITAL CURSOS E TREINAMENTOS LTDA. – "Fauna em Foco", CNPJ 39.990.014/0001-35, no tocante ao Programa de Estágios oferecido aos alunos da pós-graduação.</p>
              <p>1.2. O cadastro no Sistema permite à Instituição ofertar vagas de estágio aos alunos da pós-graduação Fauna em Foco.</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">2. Responsabilidades da Instituição</h4>
              <ul className="list-disc ml-6">
                <li>2.1. Fornecer informações verdadeiras e atualizadas sobre as vagas oferecidas.</li>
                <li>2.2. Cumprir a legislação aplicável ao estágio (Lei 11.788/2008 e demais normas).</li>
                <li>2.3. Providenciar seguro de acidentes pessoais adequado para os estagiários.</li>
                <li>2.4. Designar supervisor qualificado para acompanhar as atividades.</li>
                <li>2.5. Respeitar os direitos e deveres dos estagiários conforme legislação vigente.</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">3. Processo Seletivo</h4>
              <p className="mb-2">3.1. A Instituição tem autonomia para estabelecer critérios de seleção dos candidatos.</p>
              <p>3.2. O processo seletivo deve ser conduzido de forma ética e transparente.</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">4. Documentação e Formalização</h4>
              <p className="mb-2">4.1. A formalização do estágio será realizada através de Termo de Compromisso de Estágio entre as partes envolvidas.</p>
              <p>4.2. A Instituição deve fornecer toda documentação necessária nos prazos estabelecidos.</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">5. Confidencialidade</h4>
              <p>5.1. A Instituição compromete-se a manter confidencialidade sobre informações dos alunos obtidas através do Sistema.</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">6. Vigência</h4>
              <p>6.1. Este Termo permanece válido enquanto a Instituição mantiver cadastro ativo no Sistema.</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">7. Foro</h4>
              <p>7.1. As partes elegem o Foro da Comarca de Brasília/DF para dirimir questões oriundas deste Termo.</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Declaração de Aceite</h4>
              <p className="text-blue-800 mb-2">Ao clicar em "Li e Aceito", a Instituição confirma que:</p>
              <ul className="list-disc ml-6 text-blue-800">
                <li>Leu e compreendeu integralmente este Termo;</li>
                <li>Compromete-se a cumprir a legislação de estágios;</li>
                <li>Aceita as responsabilidades estabelecidas;</li>
                <li>Aceita integralmente as condições acima, para todos os fins de direito.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center justify-end space-x-4">
            <button
              onClick={() => setShowTermsModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              Fechar
            </button>
            <button
              onClick={() => {
                setAcceptedTerms(true);
                setShowTermsModal(false);
                toast.success('Termos aceitos com sucesso!');
              }}
              className="px-6 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
            >
              Li e Aceito os Termos
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.5}}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <motion.div
            initial={{scale: 0}}
            animate={{scale: 1}}
            transition={{delay: 0.2, duration: 0.5}}
            className="mx-auto h-20 w-20 mb-6 flex items-center justify-center"
          >
            <img 
              src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1750816712038-Logo%20500%20x%20500%20Azul.png"
              alt="Logo Fauna em Foco"
              className="h-20 w-20 object-contain"
            />
          </motion.div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Cadastro de Instituição
          </h2>
          <h3 className="text-lg font-semibold text-primary-600">
            Prática Fauna em foco - Pós-Graduação
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Crie sua conta para oferecer vagas de estágio
          </p>
        </div>

        <motion.form
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{delay: 0.3, duration: 0.5}}
          className="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-lg"
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nome da Instituição
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiBuilding} className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  placeholder="Nome da sua instituição"
                />
              </div>
            </div>

            <div>
              <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">
                CNPJ
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiUser} className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="cnpj"
                  name="cnpj"
                  type="text"
                  required
                  value={formData.cnpj}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  placeholder="00.000.000/0000-00"
                />
              </div>
            </div>

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
                  placeholder="contato@instituicao.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Telefone
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiPhone} className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Endereço
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiMapPin} className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  placeholder="Endereço completo"
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar Senha
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiLock} className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          {/* Terms of Service Checkbox */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <input
                id="acceptTerms"
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <div className="flex-1">
                <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                  Li e aceito os{' '}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="text-primary-600 hover:text-primary-700 font-medium underline"
                  >
                    Termos de Aceite do Programa de Estágios
                  </button>
                  {' '}da Fauna em Foco *
                </label>
              </div>
            </div>
            
            {acceptedTerms && (
              <motion.div
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                className="flex items-center space-x-2 text-green-600"
              >
                <SafeIcon icon={FiCheck} className="w-4 h-4" />
                <span className="text-sm">Termos aceitos com sucesso!</span>
              </motion.div>
            )}
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <SafeIcon icon={FiAlertCircle} className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800 mb-1">
                  Aprovação Necessária
                </h3>
                <p className="text-sm text-yellow-700">
                  Sua conta será criada com status "pendente" e precisará ser aprovada por um administrador antes que você possa criar vagas de estágio.
                </p>
              </div>
            </div>
          </div>

          <div>
            <motion.button
              whileHover={{scale: 1.02}}
              whileTap={{scale: 0.98}}
              type="submit"
              disabled={loading || !acceptedTerms}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </motion.button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
              >
                Fazer login
              </Link>
            </p>
          </div>
        </motion.form>
      </motion.div>

      {/* Terms Modal */}
      {showTermsModal && <TermsModal />}
    </div>
  );
};

export default InstitutionRegister;