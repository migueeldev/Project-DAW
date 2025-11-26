import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Link as LinkIcon, Tag, BookOpen } from 'lucide-react';
import { crearRecurso, listarMaterias } from '../services/api';
import { useAuth } from '../context/AuthContext';

function AddResource() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    link: '',
    materia: '',
    materiaPersonalizada: '',
    nivel: 'Básico',
    etiquetas: ''
  });

  const [materias, setMaterias] = useState([]);
  const [mostrarOtraMateria, setMostrarOtraMateria] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Verificar autenticación al cargar
  useEffect(() => {
    if (!isAuthenticated()) {
      alert('Debes iniciar sesión para subir recursos');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Cargar materias desde el backend
  useEffect(() => {
    const cargarMaterias = async () => {
      try {
        const data = await listarMaterias();
        const nombresMaterias = data.materias.map(m => m.nombre);
        setMaterias([...nombresMaterias, 'Otra']);
      } catch (err) {
        console.error('Error al cargar materias:', err);
        // Usar materias por defecto si falla
        setMaterias([
          'Cálculo Diferencial',
          'Cálculo Integral',
          'Cálculo Vectorial',
          'Álgebra Lineal',
          'Ecuaciones Diferenciales',
          'Física General',
          'Fundamentos de Programación',
          'Estructura de Datos',
          'Desarrollo de Aplicaciones Web',
          'Taller de Bases de Datos',
          'Redes de Computadoras',
          'Matemáticas Discretas',
          'Probabilidad y Estadística',
          'Química',
          'Programación Orientada a Objetos',
          'Programacion Web',
          'Tesis de Licenciatura',
          'Otra'
        ]);
      }
    };
    cargarMaterias();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleMateriaChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ 
      ...prev, 
      materia: value,
      materiaPersonalizada: value === 'Otra' ? prev.materiaPersonalizada : ''
    }));
    
    setMostrarOtraMateria(value === 'Otra');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Usar materiaPersonalizada si seleccionó "Otra"
      const materiaFinal = formData.materia === 'Otra' 
        ? formData.materiaPersonalizada 
        : formData.materia;

      const recursoData = {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        link: formData.link,
        materia: materiaFinal,
        nivel: formData.nivel,
        etiquetas: formData.etiquetas
      };

      await crearRecurso(recursoData);
      
      alert('¡Recurso subido exitosamente!');
      navigate('/');
      
    } catch (err) {
      console.error('Error al crear recurso:', err);
      setError(err.response?.data?.error || 'Error al subir el recurso. Verifica tu conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              📤 Subir Nuevo Recurso
            </h1>
            <p className="text-gray-600">
              Comparte recursos académicos con la comunidad estudiantil
            </p>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Título */}
            <div>
              <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-2">
                Título del Recurso *
              </label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                required
                placeholder="Ej: Guía rápida de Derivadas"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Describe el contenido, nivel de dificultad, y por qué es útil..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Link */}
            <div>
              <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">
                <LinkIcon size={16} className="inline mr-1" />
                Link al Recurso *
              </label>
              <input
                type="url"
                id="link"
                name="link"
                value={formData.link}
                onChange={handleChange}
                required
                placeholder="https://drive.google.com/..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Google Drive, YouTube, Dropbox, etc.
              </p>
            </div>

            {/* Materia */}
            <div>
              <label htmlFor="materia" className="block text-sm font-medium text-gray-700 mb-2">
                <BookOpen size={16} className="inline mr-1" />
                Categoría / Materia *
              </label>
              <select
                id="materia"
                name="materia"
                value={formData.materia}
                onChange={handleMateriaChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona una materia</option>
                {materias.map((materia) => (
                  <option key={materia} value={materia}>
                    {materia}
                  </option>
                ))}
              </select>
              
              {/* Campo de texto si selecciona "Otra" */}
              {mostrarOtraMateria && (
                <div className="mt-3">
                  <input
                    type="text"
                    name="materiaPersonalizada"
                    value={formData.materiaPersonalizada}
                    onChange={handleChange}
                    placeholder="Escribe el nombre de la categoría o materia"
                    required
                    maxLength="50"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Ejemplo: "Seminario de Tesis", "Metodología de la Investigación", etc.
                  </p>
                </div>
              )}
            </div>

            {/* Nivel */}
            <div>
              <label htmlFor="nivel" className="block text-sm font-medium text-gray-700 mb-2">
                Nivel de Dificultad *
              </label>
              <select
                id="nivel"
                name="nivel"
                value={formData.nivel}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Principiante">Principiante</option>
                <option value="Básico">Básico</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
              </select>
            </div>

            {/* Etiquetas */}
            <div>
              <label htmlFor="etiquetas" className="block text-sm font-medium text-gray-700 mb-2">
                <Tag size={16} className="inline mr-1" />
                Etiquetas
              </label>
              <input
                type="text"
                id="etiquetas"
                name="etiquetas"
                value={formData.etiquetas}
                onChange={handleChange}
                placeholder="derivadas, ejercicios, guía (separadas por comas)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separa las etiquetas con comas
              </p>
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Upload size={20} />
                {loading ? 'Subiendo...' : 'Subir Recurso'}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/')}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddResource;