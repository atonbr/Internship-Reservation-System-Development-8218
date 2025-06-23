import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from './SafeIcon';
import { supabase } from '../../lib/supabase';

const { FiWifi, FiWifiOff, FiCheck } = FiIcons;

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [supabaseStatus, setSupabaseStatus] = useState('checking');
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      checkSupabaseHealth();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSupabaseStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check Supabase health on mount
    checkSupabaseHealth();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkSupabaseHealth = async () => {
    try {
      // Simple health check - try to access auth
      const { data, error } = await supabase.auth.getSession();
      
      if (error && error.message.includes('Failed to fetch')) {
        setSupabaseStatus('offline');
        setShowStatus(true);
      } else {
        setSupabaseStatus('online');
        setShowStatus(false);
      }
    } catch (error) {
      console.error('Supabase health check failed:', error);
      setSupabaseStatus('offline');
      setShowStatus(true);
    }
  };

  useEffect(() => {
    if (!isOnline || supabaseStatus === 'offline' || supabaseStatus === 'error') {
      setShowStatus(true);
    } else {
      // Hide status after 3 seconds if everything is working
      const timer = setTimeout(() => {
        setShowStatus(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, supabaseStatus]);

  const getStatusConfig = () => {
    if (!isOnline) {
      return {
        icon: FiWifiOff,
        color: 'bg-red-500',
        textColor: 'text-red-800',
        bgColor: 'bg-red-100',
        message: 'Sem conexão com a internet'
      };
    }

    if (supabaseStatus === 'offline') {
      return {
        icon: FiWifiOff,
        color: 'bg-orange-500',
        textColor: 'text-orange-800',
        bgColor: 'bg-orange-100',
        message: 'Erro de conexão com o Supabase'
      };
    }

    if (supabaseStatus === 'error') {
      return {
        icon: FiWifiOff,
        color: 'bg-yellow-500',
        textColor: 'text-yellow-800',
        bgColor: 'bg-yellow-100',
        message: 'Problema de conexão com o banco de dados'
      };
    }

    return {
      icon: FiCheck,
      color: 'bg-green-500',
      textColor: 'text-green-800',
      bgColor: 'bg-green-100',
      message: 'Sistema online e funcionando'
    };
  };

  const config = getStatusConfig();

  return (
    <AnimatePresence>
      {showStatus && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 z-50"
        >
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg shadow-lg ${config.bgColor} ${config.textColor} border`}>
            <SafeIcon icon={config.icon} className="w-4 h-4" />
            <span className="text-sm font-medium">{config.message}</span>
            <button
              onClick={() => setShowStatus(false)}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NetworkStatus;