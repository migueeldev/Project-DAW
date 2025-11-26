import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Calendar, 
  FileText, 
  ThumbsUp, 
  MessageCircle, 
  Edit, 
  Trash2,
  ExternalLink,
  Plus
} from 'lucide-react';
import { listarRecursos, eliminarRecurso } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const navigate = useNavigate();
  const { usuario, isAuthenticated } = useAuth();
  
  const [misRecursos, setMisRecursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      alert('Debes iniciar sesión');
      navigate('/login');
      return;
    }
    cargarMisRecursos();
  }, []);

  const cargarMisRecursos = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await listarRecursos();
      // Filtrar solo los recursos del usuario actual
      const recursosDelUsuario = data.recursos.filter(r => r.autor_id === usuario.id);
      setMisRecursos(recursosDelUsuario);
    } catch (err) {
      setError('Error al cargar tus recursos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, titulo) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar "${titulo}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      await eliminarRecurso(id);
      alert('Recurso eliminado exitosamente');
      cargarMisRecursos(); // Recargar lista
    } catch (err) {
      alert('Error al eliminar recurso');
      console.error('Error:', err);
    }
  };

  const calcularEstadisticas = () => {
    const totalVotos = misRecursos.reduce((sum, r) => sum + (r.votos - r.votos_negativos), 0);
    const totalComentarios = misRecursos.reduce((sum, r) => sum + (r.comentarios || 0), 0);
    return {
      totalRecursos: misRecursos.length,
      totalVotos,
      totalComentarios
    };
  };

  const stats = calcularEstadisticas();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header con información del usuario */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <User size={40} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {usuario?.nombre}
                </h1>
                <p className="text-gray-600">{usuario?.email}</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/agregar')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              <span>Nuevo Recurso</span>
            </button>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FileText size={24} className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Recursos Publicados</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalRecursos}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <ThumbsUp size={24} className="text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Votos Totales</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stats.totalVotos > 0 ? `+${stats.totalVotos}` : stats.totalVotos}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <MessageCircle size={24} className="text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Comentarios Recibidos</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalComentarios}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de recursos */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            📚 Mis Recursos
          </h2>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Cargando tus recursos...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          ) : misRecursos.length === 0 ? (
            <div className="text-center py-12">
              <FileText size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 mb-4">Aún no has publicado ningún recurso</p>
              <button
                onClick={() => navigate('/agregar')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                Subir mi primer recurso
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {misRecursos.map((recurso) => (
                <div 
                  key={recurso.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    {/* Información del recurso */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {recurso.materia}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          {recurso.nivel}
                        </span>
                      </div>

                      <h3 
                        className="text-xl font-bold text-gray-800 mb-2 hover:text-blue-600 cursor-pointer"
                        onClick={() => navigate(`/recurso/${recurso.id}`)}
                      >
                        {recurso.titulo}
                      </h3>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {recurso.descripcion}
                      </p>

                      {/* Estadísticas del recurso */}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <ThumbsUp size={16} />
                          <span>{recurso.votos - recurso.votos_negativos}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle size={16} />
                          <span>{recurso.comentarios || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          <span>{new Date(recurso.fecha_creacion).toLocaleDateString('es-MX')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-col gap-2 ml-4">
                      <button
                        onClick={() => navigate(`/recurso/${recurso.id}`)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        <ExternalLink size={16} />
                        Ver
                      </button>
                      
                      <button
                        onClick={() => navigate(`/editar/${recurso.id}`)}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                      >
                        <Edit size={16} />
                        Editar
                      </button>
                      
                      <button
                        onClick={() => handleDelete(recurso.id, recurso.titulo)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                      >
                        <Trash2 size={16} />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;