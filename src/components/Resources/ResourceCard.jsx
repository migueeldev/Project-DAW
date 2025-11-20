import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, ExternalLink, MessageCircle, Calendar, User, Tag } from 'lucide-react';

const ResourceCard = ({ resource, onVote, onViewDetails }) => {
  const navigate = useNavigate();
  const [userVote, setUserVote] = useState(null);
  
  const handleVote = (type) => {
    if (userVote === type) {
      setUserVote(null);
      onVote(resource.id, null);
    } else {
      setUserVote(type);
      onVote(resource.id, type);
    }
  };

  const totalVotes = resource.votos - resource.votos_negativos;

  const nivelColors = {
    'Principiante': 'bg-green-100 text-green-800',
    'Básico': 'bg-green-100 text-green-800',
    'Intermedio': 'bg-yellow-100 text-yellow-800',
    'Avanzado': 'bg-red-100 text-red-800'
  };

  // Convertir etiquetas de string a array
  const etiquetasArray = resource.etiquetas 
    ? resource.etiquetas.split(',').map(e => e.trim()).filter(e => e.length > 0)
    : [];

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200">
      {/* Header con materia y nivel */}
      <div className="flex items-center justify-between mb-3">
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          {resource.materia}
        </span>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${nivelColors[resource.nivel]}`}>
          {resource.nivel}
        </span>
      </div>

      {/* Título */}
      <h3 
        className="text-xl font-bold text-gray-800 mb-2 hover:text-blue-600 cursor-pointer line-clamp-2"
        onClick={() => navigate(`/recurso/${resource.id}`)}
      >
        {resource.titulo}
      </h3>

      {/* Descripción */}
      <p className="text-gray-600 mb-4 text-sm line-clamp-3">
        {resource.descripcion}
      </p>

      {/* Etiquetas */}
      {etiquetasArray.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {etiquetasArray.map((etiqueta, index) => (
            <span 
              key={index}
              className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 cursor-pointer"
            >
              <Tag size={12} className="mr-1" />
              {etiqueta}
            </span>
          ))}
        </div>
      )}

      {/* Metadata: Autor y Fecha */}
      <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <User size={14} />
          <span>{resource.autor}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar size={14} />
          <span>{new Date(resource.fecha_creacion).toLocaleDateString('es-MX')}</span>
        </div>
      </div>

      {/* Footer: Acciones */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        {/* Sistema de votación */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleVote('up')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
              userVote === 'up' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-green-100'
            }`}
          >
            <ThumbsUp size={16} />
            <span className="font-medium">{resource.votos}</span>
          </button>
          
          <button
            onClick={() => handleVote('down')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
              userVote === 'down' 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-red-100'
            }`}
          >
            <ThumbsDown size={16} />
            <span className="font-medium">{resource.votos_negativos}</span>
          </button>

          <div className={`ml-2 px-2 py-1 rounded font-bold ${
            totalVotes > 30 ? 'text-green-600' : totalVotes > 0 ? 'text-gray-600' : 'text-red-600'
          }`}>
            {totalVotes > 0 ? '+' : ''}{totalVotes}
          </div>
        </div>

        {/* Botones de acción */}
<div className="flex items-center gap-2">
  <button
    onClick={() => navigate(`/recurso/${resource.id}`)}
    className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
  >
    <MessageCircle size={16} />
    <span className="text-sm">{resource.comentarios || 0}</span>
  </button>

  <a
    href={resource.link}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-1 px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
  >
    <span className="text-sm font-medium">Abrir</span>
    <ExternalLink size={16} />
  </a>
</div>

      </div>
    </div>
  );
};

export default ResourceCard;