import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Check Supabase connection
      const checkConnection = async () => {
        try {
          const { error } = await supabase
            .from('profiles_internship_sys')
            .select('id')
            .limit(1);
          setConnected(!error);
        } catch (error) {
          setConnected(false);
        }
      };

      checkConnection();

      // Set up periodic health check
      const interval = setInterval(checkConnection, 30000); // Check every 30 seconds

      return () => clearInterval(interval);
    } else {
      setConnected(false);
    }
  }, [user]);

  const value = {
    socket: null, // No longer using socket.io
    connected
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};