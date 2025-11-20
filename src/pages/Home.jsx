import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ResourceCard from '../components/Resources/ResourceCard';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { listarRecursos, listarMaterias, votarRecurso } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  
  const [resources, setResources] = useState([]);
  const [materias, setMaterias] = useState(['Todas']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedMateria, setSelectedMateria] = useState('Todas');
  const [selectedNivel, setSelectedNivel] = useState('Todos');
  const [sortBy, setSortBy] = useState('recientes');
  const [showFilters, setShowFilters] = useState(false);

  const niveles = ['Todos', 'Principiante', 'Básico', 'Intermedio', 'Avanzado'];

  // Cargar materias al iniciar
  useEffect(() => {
    const cargarMaterias = async () => {
      try {
        const data = await listarMaterias();
        const nombresMaterias = data.materias.map(m => m.nombre);
        setMaterias(['Todas', ...nombresMaterias]);
      } catch (err) {
        console.error('Error al cargar materias:', err);
      }
    };
    cargarMaterias();
  }, []);

  // Cargar recursos cuando cambian los filtros
  useEffect(() => {
    cargarRecursos();
  }, [selectedMateria, selectedNivel, searchTerm, sortBy]);

  const cargarRecursos = async () => {
    setLoading(true);
    setError('');
    
    try {
      const filtros = {
        materia: selectedMateria,
        nivel: selectedNivel,
        search: searchTerm,
        sortBy: sortBy
      };
      
      const data = await listarRecursos(filtros);
      setResources(data.recursos);
    } catch (err) {
      setError('Error al cargar recursos. Verifica que el servidor esté corriendo.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (resourceId, voteType) => {
    if (!isAuthenticated()) {
      alert('Debes iniciar sesión para votar');
      return;
    }

    try {
      await votarRecurso(resourceId, voteType);
      // Recargar recursos para actualizar votos
      cargarRecursos();
    } catch (err) {
      alert('Error al procesar voto');
      console.error('Error:', err);
    }
  };

  const handleViewDetails = (resourceId) => {
    window.location.href = `/recurso/${resourceId}`;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedMateria('Todas');
    setSelectedNivel('Todos');
    setSortBy('recientes');
    setSearchParams({});
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // El useEffect se encargará de recargar
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📚 Biblioteca Digital Colaborativa
          </h1>
          <p className="text-gray-600">
            Recursos académicos compartidos por estudiantes
          </p>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Barra de búsqueda */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            
            {/* Input de búsqueda */}
            <form onSubmit={handleSearch} className="flex-1 relative">
              <input
                type="text"
                placeholder="Buscar por título, descripción o etiquetas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </form>

            {/* Botón de filtros (móvil) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <SlidersHorizontal size={20} />
              <span>Filtros</span>
            </button>
          </div>

          {/* Filtros (desktop siempre visible, móvil togglable) */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block mt-4 space-y-4`}>
            
            {/* Filtro por Materia */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Filter size={16} />
                Materia:
              </span>
              <div className="flex flex-wrap gap-2">
                {materias.map((materia) => (
                  <button
                    key={materia}
                    onClick={() => setSelectedMateria(materia)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedMateria === materia
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {materia}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtro por Nivel */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Nivel:</span>
              <div className="flex flex-wrap gap-2">
                {niveles.map((nivel) => (
                  <button
                    key={nivel}
                    onClick={() => setSelectedNivel(nivel)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedNivel === nivel
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {nivel}
                  </button>
                ))}
              </div>
            </div>

            {/* Ordenamiento */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Ordenar por:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="recientes">Más recientes</option>
                <option value="votos">Más votados</option>
                <option value="comentarios">Más comentados</option>
              </select>

              {/* Botón limpiar filtros */}
              {(searchTerm || selectedMateria !== 'Todas' || selectedNivel !== 'Todos') && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-700 underline"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Contador de resultados */}
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Cargando recursos...</p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-gray-600">
              {resources.length === 0 ? (
                <p className="text-center py-8">
                  ❌ No se encontraron recursos con los filtros seleccionados
                </p>
              ) : (
                <p>
                  Mostrando <span className="font-bold">{resources.length}</span> recursos
                </p>
              )}
            </div>

            {/* Grid de recursos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map(resource => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  onVote={handleVote}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;