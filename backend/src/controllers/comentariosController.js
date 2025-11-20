const pool = require('../config/database');

// Listar comentarios de un recurso
const listarComentarios = async (req, res) => {
  try {
    const { recursoId } = req.params;
    
    // Verificar que el recurso existe
    const recursoExiste = await pool.query(
      'SELECT id FROM recursos WHERE id = $1',
      [recursoId]
    );
    
    if (recursoExiste.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Recurso no encontrado' 
      });
    }
    
    // Obtener comentarios
    const resultado = await pool.query(
      `SELECT 
        c.id,
        c.contenido,
        c.fecha,
        u.id as autor_id,
        u.nombre as autor
       FROM comentarios c
       INNER JOIN usuarios u ON c.autor_id = u.id
       WHERE c.recurso_id = $1
       ORDER BY c.fecha DESC`,
      [recursoId]
    );
    
    res.json({
      comentarios: resultado.rows,
      total: resultado.rows.length
    });
    
  } catch (error) {
    console.error('Error al listar comentarios:', error);
    res.status(500).json({ 
      error: 'Error al obtener comentarios' 
    });
  }
};

// Crear comentario (requiere autenticación)
const crearComentario = async (req, res) => {
  try {
    const { recursoId } = req.params;
    const { contenido } = req.body;
    const usuarioId = req.user.id;
    
    // Validaciones
    if (!contenido || contenido.trim().length === 0) {
      return res.status(400).json({ 
        error: 'El contenido del comentario es obligatorio' 
      });
    }
    
    if (contenido.length > 1000) {
      return res.status(400).json({ 
        error: 'El comentario no puede exceder los 1000 caracteres' 
      });
    }
    
    // Verificar que el recurso existe
    const recursoExiste = await pool.query(
      'SELECT id FROM recursos WHERE id = $1',
      [recursoId]
    );
    
    if (recursoExiste.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Recurso no encontrado' 
      });
    }
    
    // Crear comentario
    const resultado = await pool.query(
      `INSERT INTO comentarios (recurso_id, autor_id, contenido)
       VALUES ($1, $2, $3)
       RETURNING id, contenido, fecha`,
      [recursoId, usuarioId, contenido.trim()]
    );
    
    const nuevoComentario = resultado.rows[0];
    
    // Obtener info completa del comentario
    const comentarioCompleto = await pool.query(
      `SELECT 
        c.id,
        c.contenido,
        c.fecha,
        u.id as autor_id,
        u.nombre as autor
       FROM comentarios c
       INNER JOIN usuarios u ON c.autor_id = u.id
       WHERE c.id = $1`,
      [nuevoComentario.id]
    );
    
    res.status(201).json({
      message: 'Comentario creado exitosamente',
      comentario: comentarioCompleto.rows[0]
    });
    
  } catch (error) {
    console.error('Error al crear comentario:', error);
    res.status(500).json({ 
      error: 'Error al crear comentario' 
    });
  }
};

// Eliminar comentario (solo el autor)
const eliminarComentario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.user.id;
    
    // Verificar que el comentario existe y es del usuario
    const comentarioExiste = await pool.query(
      'SELECT autor_id FROM comentarios WHERE id = $1',
      [id]
    );
    
    if (comentarioExiste.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Comentario no encontrado' 
      });
    }
    
    if (comentarioExiste.rows[0].autor_id !== usuarioId) {
      return res.status(403).json({ 
        error: 'No tienes permiso para eliminar este comentario' 
      });
    }
    
    // Eliminar comentario
    await pool.query('DELETE FROM comentarios WHERE id = $1', [id]);
    
    res.json({
      message: 'Comentario eliminado exitosamente'
    });
    
  } catch (error) {
    console.error('Error al eliminar comentario:', error);
    res.status(500).json({ 
      error: 'Error al eliminar comentario' 
    });
  }
};

module.exports = {
  listarComentarios,
  crearComentario,
  eliminarComentario
};