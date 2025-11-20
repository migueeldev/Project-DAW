import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Plus, Search, User, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const navigate = useNavigate();
  const { usuario, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      setIsMenuOpen(false);
    }
  };

  const handleSubirRecurso = () => {
    if (isAuthenticated()) {
      navigate('/agregar');
    } else {
      alert('Debes iniciar sesión para subir recursos');
      navigate('/login');
    }
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo y Título */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <BookOpen className="text-blue-600" size={32} />
            <span className="text-xl font-bold text-gray-800 hidden sm:block">
              Biblioteca Digital
            </span>
          </Link>


          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar recursos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
          </form>
          
          {/* Menú desktop */}
<div className="hidden md:flex items-center gap-4">
  <button
    onClick={handleSubirRecurso}
    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
  >
    <Plus size={20} />
    <span>Subir Recurso</span>
  </button>
  
  {isAuthenticated() ? (
    <>
      <button
        onClick={() => navigate('/dashboard')} 
        className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <User size={18} />
        <span className="text-sm font-medium text-gray-700">
          {usuario?.nombre}
        </span>
      </button>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-red-600"
      >
        <LogOut size={20} />
        <span>Salir</span>
      </button>
    </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <User size={20} />
                <span>Iniciar Sesión</span>
              </Link>
            )}
          </div>

          {/* Botón menú móvil */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-3">
            {/* Búsqueda móvil */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Buscar recursos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </form>

            {isAuthenticated() && (
  <button
    onClick={() => {
      navigate('/dashboard');
      setIsMenuOpen(false);
    }}
    className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
  >
    <User size={18} />
    <span className="text-sm font-medium text-gray-700">
      {usuario?.nombre}
    </span>
  </button>
)}

            <button
              onClick={handleSubirRecurso}
              className="w-full flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              <span>Subir Recurso</span>
            </button>
            
            {isAuthenticated() ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-red-600"
              >
                <LogOut size={20} />
                <span>Cerrar Sesión</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <User size={20} />
                <span>Iniciar Sesión</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;