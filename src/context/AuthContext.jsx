import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await loadUserProfile(session.user);
        }
      } catch (error) {
        console.error('Error getting session:', error);
        // Set demo user if there's an error
        setUser({
          id: 'demo-user',
          email: 'demo@student.com',
          name: 'Demo User',
          role: 'student'
        });
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const loadUserProfile = async (authUser) => {
    try {
      // For demo purposes, we'll create a simple profile
      const profile = {
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.name || authUser.email.split('@')[0],
        role: authUser.user_metadata?.role || 'student'
      };

      setUser(profile);
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
      // Fallback to basic user info
      setUser({
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.name || authUser.email.split('@')[0],
        role: 'student'
      });
    }
  };

  const login = async (email, password) => {
    try {
      // Demo login - simulate different user types
      let demoUser;
      
      if (email === 'demo@student.com' && password === 'demo123') {
        demoUser = {
          id: 'student-demo-id',
          email: 'demo@student.com',
          name: 'João Silva',
          role: 'student',
          course: 'Engenharia de Software',
          class_name: '2024.1'
        };
      } else if (email === 'demo@institution.com' && password === 'demo123') {
        demoUser = {
          id: 'institution-demo-id',
          email: 'demo@institution.com',
          name: 'Tech Corp',
          role: 'institution',
          cnpj: '12.345.678/0001-90',
          phone: '(11) 99999-9999'
        };
      } else if (email === 'admin@sistema.com' && password === 'admin123') {
        demoUser = {
          id: 'admin-demo-id',
          email: 'admin@sistema.com',
          name: 'Administrador',
          role: 'admin'
        };
      } else {
        throw new Error('Credenciais inválidas');
      }

      setUser(demoUser);
      return demoUser;
    } catch (error) {
      console.error('Login error:', error);
      throw { error: error.message || 'Erro ao fazer login' };
    }
  };

  const registerStudent = async (userData) => {
    try {
      const newUser = {
        id: 'new-student-' + Date.now(),
        email: userData.email,
        name: userData.name,
        role: 'student',
        course: userData.course,
        class_name: userData.className
      };

      setUser(newUser);
      return newUser;
    } catch (error) {
      console.error('Student registration error:', error);
      throw { error: error.message || 'Erro no cadastro' };
    }
  };

  const registerInstitution = async (userData) => {
    try {
      const newUser = {
        id: 'new-institution-' + Date.now(),
        email: userData.email,
        name: userData.name,
        role: 'institution',
        cnpj: userData.cnpj,
        address: userData.address,
        phone: userData.phone
      };

      setUser(newUser);
      return newUser;
    } catch (error) {
      console.error('Institution registration error:', error);
      throw { error: error.message || 'Erro no cadastro' };
    }
  };

  const logout = async () => {
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    registerStudent,
    registerInstitution,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};