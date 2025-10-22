import React, { useState, useMemo } from 'react';
import ResourceCard from '../components/Resources/ResourceCard';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

// Datos simulados de recursos
const mockResources = [
  {
    id: 1,
    titulo: "Guía rápida de Derivadas con ejemplos resueltos",
    descripcion: "Apuntes en PDF con fórmulas básicas y 10 ejercicios resueltos, ideal para repasar antes de exámenes. Incluye teoría fundamental y casos prácticos.",
    link: "https://drive.google.com/example",
    materia: "Cálculo Diferencial",
    nivel: "Principiante",
    etiquetas: ["derivadas", "ejercicios", "guía rápida"],
    votos: 45,
    votosNegativos: 3,
    autor: "María González",
    fecha: "2025-03-15",
    comentarios: 12
  },
  {
    id: 2,
    titulo: "Resumen de Álgebra Lineal – Capítulo 1 al 3",
    descripcion: "Conceptos clave de vectores, matrices y sistemas de ecuaciones lineales. Perfecto para preparar el primer parcial.",
    link: "https://drive.google.com/example2",
    materia: "Álgebra Lineal",
    nivel: "Intermedio",
    etiquetas: ["resumen", "matrices", "vectores"],
    votos: 67,
    votosNegativos: 5,
    autor: "Carlos Ramírez",
    fecha: "2025-03-10",
    comentarios: 8
  },
  {
    id: 3,
    titulo: "Tutorial de React Hooks - useState y useEffect",
    descripcion: "Video tutorial explicando los hooks más importantes de React con ejemplos prácticos y casos de uso reales.",
    link: "https://youtube.com/example",
    materia: "Desarrollo de Aplicaciones Web",
    nivel: "Básico",
    etiquetas: ["react", "tutorial", "hooks", "javascript"],
    votos: 89,
    votosNegativos: 2,
    autor: "Ana López",
    fecha: "2025-03-18",
    comentarios: 24
  },
  {
    id: 4,
    titulo: "Ejercicios resueltos de Integrales",
    descripcion: "Colección de 50 ejercicios de integrales definidas e indefinidas con solución paso a paso.",
    link: "https://drive.google.com/example3",
    materia: "Cálculo Integral",
    nivel: "Intermedio",
    etiquetas: ["integrales", "ejercicios", "soluciones"],
    votos: 73,
    votosNegativos: 4,
    autor: "Pedro Sánchez",
    fecha: "2025-03-12",
    comentarios: 15
  },
  {
    id: 5,
    titulo: "Introducción a Python para principiantes",
    descripcion: "Curso completo de Python desde cero con ejemplos prácticos y proyectos finales.",
    link: "https://youtube.com/example2",
    materia: "Programación Orientada a Objetos",
    nivel: "Principiante",
    etiquetas: ["python", "tutorial", "principiantes"],
    votos: 120,
    votosNegativos: 6,
    autor: "Laura Martínez",
    fecha: "2025-03-20",
    comentarios: 32
  },
  {
    id: 6,
    titulo: "Transformadas de Laplace - Formulario",
    descripcion: "Formulario completo con todas las transformadas de Laplace más comunes y propiedades.",
    link: "https://drive.google.com/example4",
    materia: "Ecuaciones Diferenciales",
    nivel: "Avanzado",
    etiquetas: ["laplace", "formulario", "transformadas"],
    votos: 54,
    votosNegativos: 2,
    autor: "Roberto López",
    fecha: "2025-03-08",
    comentarios: 9
  }
];

function Home() {
  const [resources, setResources] = useState(mockResources);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMateria, setSelectedMateria] = useState('Todas');
  const [selectedNivel, setSelectedNivel] = useState('Todos');
  const [sortBy, setSortBy] = useState('recientes');
  const [showFilters, setShowFilters] = useState(false);

  // Obtener lista única de materias
  const materias = ['Todas', ...new Set(mockResources.map(r => r.materia))];
  const niveles = ['Todos', 'Principiante', 'Básico', 'Intermedio', 'Avanzado'];

  // Filtrar y ordenar recursos
  const filteredResources = useMemo(() => {
    let filtered = [...resources];

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.etiquetas.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtrar por materia
    if (selectedMateria !== 'Todas') {
      filtered = filtered.filter(resource => resource.materia === selectedMateria);
    }

    // Filtrar por nivel
    if (selectedNivel !== 'Todos') {
      filtered = filtered.filter(resource => resource.nivel === selectedNivel);
    }

    // Ordenar
    if (sortBy === 'votos') {
      filtered.sort((a, b) => (b.votos - b.votosNegativos) - (a.votos - a.votosNegativos));
    } else if (sortBy === 'recientes') {
      filtered.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    } else if (sortBy === 'comentarios') {
      filtered.sort((a, b) => b.comentarios - a.comentarios);
    }

    return filtered;
  }, [resources, searchTerm, selectedMateria, selectedNivel, sortBy]);

  const handleVote = (resourceId, voteType) => {
    setResources(prev => prev.map(resource => {
      if (resource.id === resourceId) {
        if (voteType === 'up') {
          return { ...resource, votos: resource.votos + 1 };
        } else if (voteType === 'down') {
          return { ...resource, votosNegativos: resource.votosNegativos + 1 };
        }
      }
      return resource;
    }));
  };

  const handleViewDetails = (resourceId) => {
    alert(`Ver detalles del recurso ${resourceId}\n(Próximamente: página de detalle)`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedMateria('Todas');
    setSelectedNivel('Todos');
    setSortBy('recientes');
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

        {/* Barra de búsqueda */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            
            {/* Input de búsqueda */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Buscar por título, descripción o etiquetas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>

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
        <div className="mb-4 text-gray-600">
          {filteredResources.length === 0 ? (
            <p className="text-center py-8">
              ❌ No se encontraron recursos con los filtros seleccionados
            </p>
          ) : (
            <p>
              Mostrando <span className="font-bold">{filteredResources.length}</span> recursos
              {filteredResources.length !== resources.length && (
                <span className="text-gray-500"> de {resources.length} totales</span>
              )}
            </p>
          )}
        </div>

        {/* Grid de recursos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map(resource => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onVote={handleVote}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;