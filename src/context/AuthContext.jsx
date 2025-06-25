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
      const profile = {
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.name || authUser.email.split('@')[0],
        role: authUser.user_metadata?.role || 'student',
        status: authUser.user_metadata?.status || 'approved'
      };
      setUser(profile);
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
      setUser({
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.name || authUser.email.split('@')[0],
        role: 'student',
        status: 'approved'
      });
    }
  };

  const login = async (email, password) => {
    try {
      // Only allow specific admin login
      if (email === 'contato@posfaunaemfoco.com' && password === 'Faunalivre2020$$') {
        const adminUser = {
          id: 'admin-real-id',
          email: 'contato@posfaunaemfoco.com',
          name: 'Administrador',
          role: 'admin',
          status: 'approved'
        };
        setUser(adminUser);
        return adminUser;
      } else {
        // Check if it's a registered user from localStorage
        const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
        const foundUser = registeredUsers.find(u => u.email === email && u.password === password);
        
        if (foundUser) {
          const { password: _, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword);
          return userWithoutPassword;
        }
        
        throw new Error('Email ou senha inválidos');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw { error: error.message || 'Erro ao fazer login' };
    }
  };

  const registerStudent = async (userData) => {
    try {
      const newUser = {
        id: 'student-' + Date.now(),
        email: userData.email,
        password: userData.password, // In production, this should be hashed
        name: userData.name,
        role: 'student',
        status: 'pending',
        course: userData.course,
        class_name: userData.className,
        created_at: new Date().toISOString()
      };

      // Save to pending users for admin approval
      const existingPendingUsers = JSON.parse(localStorage.getItem('pending_users') || '[]');
      existingPendingUsers.push(newUser);
      localStorage.setItem('pending_users', JSON.stringify(existingPendingUsers));

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
        id: 'institution-' + Date.now(),
        email: userData.email,
        password: userData.password, // In production, this should be hashed
        name: userData.name,
        role: 'institution',
        status: 'pending', // Changed to pending - institutions also need approval
        cnpj: userData.cnpj,
        address: userData.address,
        phone: userData.phone,
        created_at: new Date().toISOString()
      };

      // Save to pending users for admin approval (same as students)
      const existingPendingUsers = JSON.parse(localStorage.getItem('pending_users') || '[]');
      existingPendingUsers.push(newUser);
      localStorage.setItem('pending_users', JSON.stringify(existingPendingUsers));

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