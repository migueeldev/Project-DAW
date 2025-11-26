import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Limpiar error al escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      
      if (isRegistering) {
        // Registro
        result = await register(formData.nombre, formData.email, formData.password);
      } else {
        // Login
        result = await login(formData.email, formData.password);
      }

      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error de conexión. Verifica que el servidor esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isRegistering ? '📝 Crear Cuenta' : '🔐 Iniciar Sesión'}
          </h1>
          <p className="text-gray-600">
            {isRegistering 
              ? 'Únete a la comunidad estudiantil' 
              : 'Accede a tu biblioteca digital'}
          </p>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Nombre (solo en registro) */}
          {isRegistering && (
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                <User size={16} className="inline mr-1" />
                Nombre Completo
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                placeholder="Juan Pérez"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              <Mail size={16} className="inline mr-1" />
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="tu@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              <Lock size={16} className="inline mr-1" />
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {isRegistering && (
              <p className="text-xs text-gray-500 mt-1">
                Mínimo 6 caracteres
              </p>
            )}
          </div>

          {/* Botón Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium mt-6 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading 
              ? 'Procesando...' 
              : (isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión')
            }
          </button>
        </form>

        {/* Toggle Login/Register */}
        <div className="text-center mt-6">
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
              setFormData({ nombre: '', email: '', password: '' });
            }}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            {isRegistering 
              ? '¿Ya tienes cuenta? Inicia sesión' 
              : '¿No tienes cuenta? Regístrate'}
          </button>
        </div>

        {/* Volver a Home */}
        <div className="text-center mt-4">
          <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;