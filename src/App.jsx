import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

// Components
import Login from './components/auth/Login';
import StudentRegister from './components/auth/StudentRegister';
import InstitutionRegister from './components/auth/InstitutionRegister';
import StudentDashboard from './components/student/StudentDashboard';
import InstitutionDashboard from './components/institution/InstitutionDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import LoadingSpinner from './components/common/LoadingSpinner';
import NetworkStatus from './components/common/NetworkStatus';

import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={!user ? <Login /> : <Navigate to={getDashboardRoute(user.role)} replace />} 
      />
      <Route 
        path="/register/student" 
        element={!user ? <StudentRegister /> : <Navigate to={getDashboardRoute(user.role)} replace />} 
      />
      <Route 
        path="/register/institution" 
        element={!user ? <InstitutionRegister /> : <Navigate to={getDashboardRoute(user.role)} replace />} 
      />
      <Route 
        path="/student/*" 
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/institution/*" 
        element={
          <ProtectedRoute allowedRoles={['institution']}>
            <InstitutionDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/unauthorized" 
        element={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Acesso Negado</h1>
              <p className="text-gray-600 mb-4">Você não tem permissão para acessar esta página.</p>
              <button 
                onClick={() => window.history.back()} 
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Voltar
              </button>
            </div>
          </div>
        } 
      />
      <Route 
        path="/" 
        element={
          user ? (
            <Navigate to={getDashboardRoute(user.role)} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
    </Routes>
  );
};

const getDashboardRoute = (role) => {
  switch (role) {
    case 'student':
      return '/student';
    case 'institution':
      return '/institution';
    case 'admin':
      return '/admin';
    default:
      return '/login';
  }
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <SocketProvider>
            <div className="min-h-screen bg-gray-50">
              <NetworkStatus />
              <AppRoutes />
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    style: {
                      background: '#10b981',
                      color: '#fff',
                    },
                  },
                  error: {
                    style: {
                      background: '#ef4444',
                      color: '#fff',
                    },
                  },
                }}
              />
            </div>
          </SocketProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;