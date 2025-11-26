import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Link as LinkIcon, Tag, BookOpen, ArrowLeft } from 'lucide-react';
import { obtenerRecurso, editarRecurso, listarMaterias } from '../services/api';
import { useAuth } from '../context/AuthContext';

function EditResource() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, usuario } = useAuth();

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Verificar autenticación y cargar recurso
  useEffect(() => {
    if (!isAuthenticated()) {
      alert('Debes iniciar sesión');
      navigate('/login');
      return;
    }
    cargarRecurso();
    cargarMaterias();
  }, [id]);

  const cargarRecurso = async () => {
    setLoading(true);
    try {
      const data = await obtenerRecurso(id);
      const recurso = data.recurso;
      
      // Verificar que el usuario sea el autor
      if (recurso.autor_id !== usuario.id) {
        alert('No tienes permiso para editar este recurso');
        navigate('/');
        return;
      }

      setFormData({
        titulo: recurso.titulo,
        descripcion: recurso.descripcion,
        link: recurso.link,
        materia: recurso.materia,
        materiaPersonalizada: '',
        nivel: recurso.nivel,
        etiquetas: recurso.etiquetas || ''
      });
    } catch (err) {
      setError('Error al cargar el recurso');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const cargarMaterias = async () => {
    try {
      const data = await listarMaterias();
      const nombresMaterias = data.materias.map(m => m.nombre);
      setMaterias([...nombresMaterias, 'Otra']);
    } catch (err) {
      console.error('Error al cargar materias:', err);
    }
  };

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
    setSaving(true);
    setError('');

    try {
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

      await editarRecurso(id, recursoData);
      
      alert('¡Recurso actualizado exitosamente!');
      navigate(`/recurso/${id}`);
      
    } catch (err) {
      console.error('Error al editar recurso:', err);
      setError(err.response?.data?.error || 'Error al actualizar el recurso');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando recurso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Botón volver */}
        <button
          onClick={() => navigate(`/recurso/${id}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Volver</span>
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              ✏️ Editar Recurso
            </h1>
            <p className="text-gray-600">
              Actualiza la información del recurso
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
              
              {mostrarOtraMateria && (
                <div className="mt-3">
                  <input
                    type="text"
                    name="materiaPersonalizada"
                    value={formData.materiaPersonalizada}
                    onChange={handleChange}
                    placeholder="Escribe el nombre de la materia"
                    required
                    maxLength="50"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
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
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Save size={20} />
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              
              <button
                type="button"
                onClick={() => navigate(`/recurso/${id}`)}
                disabled={saving}
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

export default EditResource;