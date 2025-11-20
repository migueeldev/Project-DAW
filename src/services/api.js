import axios from 'axios';

// URL base de la API (cambia esto según tu configuración)
const API_URL = 'http://localhost:5000/api';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH ====================

export const registrarUsuario = async (datos) => {
  const response = await api.post('/auth/register', datos);
  return response.data;
};

export const iniciarSesion = async (datos) => {
  const response = await api.post('/auth/login', datos);
  return response.data;
};

export const obtenerPerfil = async () => {
  const response = await api.get('/auth/perfil');
  return response.data;
};

// ==================== RECURSOS ====================

export const listarRecursos = async (filtros = {}) => {
  const params = new URLSearchParams();
  
  if (filtros.materia && filtros.materia !== 'Todas') {
    params.append('materia', filtros.materia);
  }
  if (filtros.nivel && filtros.nivel !== 'Todos') {
    params.append('nivel', filtros.nivel);
  }
  if (filtros.search) {
    params.append('search', filtros.search);
  }
  if (filtros.sortBy) {
    params.append('sortBy', filtros.sortBy);
  }
  
  const response = await api.get(`/recursos?${params.toString()}`);
  return response.data;
};

export const obtenerRecurso = async (id) => {
  const response = await api.get(`/recursos/${id}`);
  return response.data;
};

export const crearRecurso = async (datos) => {
  const response = await api.post('/recursos', datos);
  return response.data;
};

export const editarRecurso = async (id, datos) => {
  const response = await api.put(`/recursos/${id}`, datos);
  return response.data;
};

export const eliminarRecurso = async (id) => {
  const response = await api.delete(`/recursos/${id}`);
  return response.data;
};

export const votarRecurso = async (id, tipo) => {
  const response = await api.post(`/recursos/${id}/votar`, { tipo });
  return response.data;
};

// ==================== MATERIAS ====================

export const listarMaterias = async () => {
  const response = await api.get('/materias');
  return response.data;
};

// ==================== COMENTARIOS ====================

export const listarComentarios = async (recursoId) => {
  const response = await api.get(`/recursos/${recursoId}/comentarios`);
  return response.data;
};

export const crearComentario = async (recursoId, contenido) => {
  const response = await api.post(`/recursos/${recursoId}/comentarios`, { contenido });
  return response.data;
};

export const eliminarComentario = async (id) => {
  const response = await api.delete(`/comentarios/${id}`);
  return response.data;
};

export default api;