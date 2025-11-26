import React, { createContext, useState, useContext, useEffect } from 'react';
import { iniciarSesion as loginAPI, registrarUsuario as registerAPI, obtenerPerfil } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario del localStorage al iniciar
  useEffect(() => {
    const tokenGuardado = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('usuario');

    if (tokenGuardado && usuarioGuardado) {
      setToken(tokenGuardado);
      setUsuario(JSON.parse(usuarioGuardado));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await loginAPI({ email, password });
      
      setToken(data.token);
      setUsuario(data.usuario);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error al iniciar sesión' 
      };
    }
  };

  const register = async (nombre, email, password) => {
    try {
      const data = await registerAPI({ nombre, email, password });
      
      setToken(data.token);
      setUsuario(data.usuario);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error al registrar usuario' 
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  };

  const isAuthenticated = () => {
    return !!token;
  };

  const value = {
    usuario,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};