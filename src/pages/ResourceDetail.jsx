import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ExternalLink, 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  Calendar, 
  User, 
  Tag,
  Send
} from 'lucide-react';

// Datos mock (los mismos de Home, en el futuro vendrán del backend)
const mockResources = [
  {
    id: 1,
    titulo: "Guía rápida de Derivadas con ejemplos resueltos",
    descripcion: "Apuntes en PDF con fórmulas básicas y 10 ejercicios resueltos, ideal para repasar antes de exámenes. Incluye teoría fundamental y casos prácticos.",
    link: "https://drive.google.com/example",
    materia: "Cálculo I",
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
    materia: "Desarrollo Web",
    nivel: "Básico",
    etiquetas: ["react", "tutorial", "hooks", "javascript"],
    votos: 89,
    votosNegativos: 2,
    autor: "Ana López",
    fecha: "2025-03-18",
    comentarios: 24
  },
];

const mockComments = [
  {
    id: 1,
    resourceId: 1,
    autor: "Juan Pérez",
    fecha: "2025-03-16",
    contenido: "Excelente material, me ayudó mucho para el examen final. Los ejercicios están muy bien explicados.",
    likes: 8
  },
  {
    id: 2,
    resourceId: 1,
    autor: "Andrea Silva",
    fecha: "2025-03-17",
    contenido: "Muy útil, aunque me hubiera gustado que incluyera más ejercicios de aplicación práctica.",
    likes: 3
  },
  {
    id: 3,
    resourceId: 1,
    autor: "Luis Torres",
    fecha: "2025-03-18",
    contenido: "¡Perfecto para repasar! Lo recomiendo 100%",
    likes: 12
  },
];

function ResourceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Buscar el recurso por ID
  const resource = mockResources.find(r => r.id === parseInt(id));
  
  const [comments, setComments] = useState(mockComments.filter(c => c.resourceId === parseInt(id)));
  const [newComment, setNewComment] = useState('');
  const [userVote, setUserVote] = useState(null);

  if (!resource) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recurso no encontrado</h2>
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const totalVotes = resource.votos - resource.votosNegativos;

  const nivelColors = {
    'Principiante': 'bg-green-100 text-green-800',
    'Básico': 'bg-green-100 text-green-800',
    'Intermedio': 'bg-yellow-100 text-yellow-800',
    'Avanzado': 'bg-red-100 text-red-800'
  };

  const handleVote = (type) => {
    if (userVote === type) {
      setUserVote(null);
    } else {
      setUserVote(type);
    }
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;

    const comment = {
      id: comments.length + 1,
      resourceId: resource.id,
      autor: "Usuario Actual", // En el futuro vendrá del login
      fecha: new Date().toISOString().split('T')[0],
      contenido: newComment,
      likes: 0
    };

    setComments([comment, ...comments]);
    setNewComment('');
    
    alert('Comentario agregado (aún no se guarda en backend)');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Botón volver */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Volver</span>
        </button>

        {/* Tarjeta principal del recurso */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {resource.materia}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${nivelColors[resource.nivel]}`}>
                  {resource.nivel}
                </span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                {resource.titulo}
              </h1>
            </div>
          </div>

          {/* Descripción completa */}
          <p className="text-gray-700 text-lg mb-6 leading-relaxed">
            {resource.descripcion}
          </p>

          {/* Etiquetas */}
          <div className="flex flex-wrap gap-2 mb-6">
            {resource.etiquetas.map((etiqueta, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                <Tag size={14} className="mr-1" />
                {etiqueta}
              </span>
            ))}
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-6 mb-6 text-gray-600 pb-6 border-b">
            <div className="flex items-center gap-2">
              <User size={18} />
              <span className="font-medium">{resource.autor}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{new Date(resource.fecha).toLocaleDateString('es-MX', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle size={18} />
              <span>{comments.length} comentarios</span>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center justify-between">
            
            {/* Votación */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleVote('up')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  userVote === 'up' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-green-100'
                }`}
              >
                <ThumbsUp size={20} />
                <span className="font-medium">{resource.votos}</span>
              </button>
              
              <button
                onClick={() => handleVote('down')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  userVote === 'down' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-red-100'
                }`}
              >
                <ThumbsDown size={20} />
                <span className="font-medium">{resource.votosNegativos}</span>
              </button>

              <div className={`px-3 py-2 rounded-lg font-bold text-lg ${
                totalVotes > 30 ? 'bg-green-100 text-green-700' : 
                totalVotes > 0 ? 'bg-gray-100 text-gray-700' : 
                'bg-red-100 text-red-700'
              }`}>
                {totalVotes > 0 ? '+' : ''}{totalVotes}
              </div>
            </div>

            {/* Botón abrir recurso */}
            <a
              href={resource.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <span>Abrir Recurso</span>
              <ExternalLink size={20} />
            </a>
          </div>
        </div>

        {/* Sección de comentarios */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            💬 Comentarios ({comments.length})
          </h2>

          {/* Formulario para nuevo comentario */}
          <form onSubmit={handleSubmitComment} className="mb-8">
            <div className="flex gap-3">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe tu comentario sobre este recurso..."
                rows="3"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send size={20} />
                <span className="hidden sm:inline">Enviar</span>
              </button>
            </div>
          </form>

          {/* Lista de comentarios */}
          {comments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <MessageCircle size={48} className="mx-auto mb-3 text-gray-300" />
              <p>No hay comentarios aún. ¡Sé el primero en comentar!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{comment.autor}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(comment.fecha).toLocaleDateString('es-MX')}
                        </p>
                      </div>
                    </div>
                    
                    <button className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <ThumbsUp size={16} />
                      <span>{comment.likes}</span>
                    </button>
                  </div>
                  
                  <p className="text-gray-700 ml-13">
                    {comment.contenido}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResourceDetail;