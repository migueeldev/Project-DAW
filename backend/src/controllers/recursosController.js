const pool = require('../config/database');

// Listar todos los recursos (con filtros opcionales)
const listarRecursos = async (req, res) => {
  try {
    const { materia, nivel, search, sortBy } = req.query;
    
    let query = `
      SELECT 
        r.id, 
        r.titulo, 
        r.descripcion, 
        r.link, 
        r.nivel, 
        r.etiquetas, 
        r.votos, 
        r.votos_negativos,
        r.fecha_creacion,
        m.nombre as materia,
        u.nombre as autor,
        u.id as autor_id,
        (SELECT COUNT(*) FROM comentarios WHERE recurso_id = r.id) as comentarios
      FROM recursos r
      INNER JOIN materias m ON r.materia_id = m.id
      INNER JOIN usuarios u ON r.autor_id = u.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 1;
    
    // Filtro por materia
    if (materia && materia !== 'Todas') {
      query += ` AND m.nombre = $${paramCount}`;
      params.push(materia);
      paramCount++;
    }
    
    // Filtro por nivel
    if (nivel && nivel !== 'Todos') {
      query += ` AND r.nivel = $${paramCount}`;
      params.push(nivel);
      paramCount++;
    }
    
    // Búsqueda por texto
    if (search) {
      query += ` AND (
        r.titulo ILIKE $${paramCount} OR 
        r.descripcion ILIKE $${paramCount} OR 
        r.etiquetas ILIKE $${paramCount}
      )`;
      params.push(`%${search}%`);
      paramCount++;
    }
    
    // Ordenamiento
    if (sortBy === 'votos') {
      query += ' ORDER BY (r.votos - r.votos_negativos) DESC';
    } else if (sortBy === 'comentarios') {
      query += ' ORDER BY comentarios DESC';
    } else {
      query += ' ORDER BY r.fecha_creacion DESC'; // Por defecto: más recientes muestros primero los recursos mas nuevos
    }
    
    const resultado = await pool.query(query, params);
    
    res.json({
      recursos: resultado.rows,
      total: resultado.rows.length
    });
    
  } catch (error) {
    console.error('Error al listar recursos:', error);
    res.status(500).json({ 
      error: 'Error al obtener recursos' 
    });
  }
};

// Obtener un recurso específico por ID
const obtenerRecurso = async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        r.id, 
        r.titulo, 
        r.descripcion, 
        r.link, 
        r.nivel, 
        r.etiquetas, 
        r.votos, 
        r.votos_negativos,
        r.fecha_creacion,
        m.nombre as materia,
        m.id as materia_id,
        u.nombre as autor,
        u.id as autor_id,
        (SELECT COUNT(*) FROM comentarios WHERE recurso_id = r.id) as comentarios
      FROM recursos r
      INNER JOIN materias m ON r.materia_id = m.id
      INNER JOIN usuarios u ON r.autor_id = u.id
      WHERE r.id = $1
    `;
    
    const resultado = await pool.query(query, [id]);
    
    if (resultado.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Recurso no encontrado' 
      });
    }
    
    res.json({
      recurso: resultado.rows[0]
    });
    
  } catch (error) {
    console.error('Error al obtener recurso:', error);
    res.status(500).json({ 
      error: 'Error al obtener recurso' 
    });
  }
};

// Crear nuevo recurso (requiere autenticación)
const crearRecurso = async (req, res) => {
  try {
    const { titulo, descripcion, link, materia, nivel, etiquetas } = req.body;
    const autorId = req.user.id; // Del token JWT
    
    // Validaciones
    if (!titulo || !descripcion || !link || !materia || !nivel) {
      return res.status(400).json({ 
        error: 'Todos los campos son obligatorios' 
      });
    }
    
    // Validar URL
    try {
      new URL(link);
    } catch (e) {
      return res.status(400).json({ 
        error: 'El link no es una URL válida' 
      });
    }
    
    // Buscar o crear materia
    let materiaId;
    const materiaExiste = await pool.query(
      'SELECT id FROM materias WHERE nombre = $1',
      [materia]
    );
    
    if (materiaExiste.rows.length > 0) {
      materiaId = materiaExiste.rows[0].id;
    } else {
      // Crear nueva materia si no existe
      const nuevaMateria = await pool.query(
        'INSERT INTO materias (nombre, tipo) VALUES ($1, $2) RETURNING id',
        [materia, 'otro']
      );
      materiaId = nuevaMateria.rows[0].id;
    }
    
    // Crear recurso
    const resultado = await pool.query(
      `INSERT INTO recursos (titulo, descripcion, link, materia_id, nivel, etiquetas, autor_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, titulo, descripcion, link, nivel, etiquetas, votos, votos_negativos, fecha_creacion`,
      [titulo, descripcion, link, materiaId, nivel, etiquetas || '', autorId]
    );
    
    const nuevoRecurso = resultado.rows[0];
    
    // Obtener info completa del recurso creado
    const recursoCompleto = await pool.query(
      `SELECT 
        r.*, 
        m.nombre as materia,
        u.nombre as autor
       FROM recursos r
       INNER JOIN materias m ON r.materia_id = m.id
       INNER JOIN usuarios u ON r.autor_id = u.id
       WHERE r.id = $1`,
      [nuevoRecurso.id]
    );
    
    res.status(201).json({
      message: 'Recurso creado exitosamente',
      recurso: recursoCompleto.rows[0]
    });
    
  } catch (error) {
    console.error('Error al crear recurso:', error);
    res.status(500).json({ 
      error: 'Error al crear recurso' 
    });
  }
};

// Editar recurso (solo el autor)
const editarRecurso = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, link, materia, nivel, etiquetas } = req.body;
    const usuarioId = req.user.id;
    
    // Verificar que el recurso existe y es del usuario
    const recursoExiste = await pool.query(
      'SELECT autor_id FROM recursos WHERE id = $1',
      [id]
    );
    
    if (recursoExiste.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Recurso no encontrado' 
      });
    }
    
    if (recursoExiste.rows[0].autor_id !== usuarioId) {
      return res.status(403).json({ 
        error: 'No tienes permiso para editar este recurso' 
      });
    }
    
    // Buscar o crear materia
    let materiaId;
    const materiaExiste = await pool.query(
      'SELECT id FROM materias WHERE nombre = $1',
      [materia]
    );
    
    if (materiaExiste.rows.length > 0) {
      materiaId = materiaExiste.rows[0].id;
    } else {
      const nuevaMateria = await pool.query(
        'INSERT INTO materias (nombre, tipo) VALUES ($1, $2) RETURNING id',
        [materia, 'otro']
      );
      materiaId = nuevaMateria.rows[0].id;
    }
    
    // Actualizar recurso
    const resultado = await pool.query(
      `UPDATE recursos 
       SET titulo = $1, descripcion = $2, link = $3, materia_id = $4, nivel = $5, etiquetas = $6
       WHERE id = $7
       RETURNING *`,
      [titulo, descripcion, link, materiaId, nivel, etiquetas || '', id]
    );
    
    res.json({
      message: 'Recurso actualizado exitosamente',
      recurso: resultado.rows[0]
    });
    
  } catch (error) {
    console.error('Error al editar recurso:', error);
    res.status(500).json({ 
      error: 'Error al editar recurso' 
    });
  }
};

// Eliminar recurso (solo el autor)
const eliminarRecurso = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.user.id;
    
    // Verificar que el recurso existe y es del usuario
    const recursoExiste = await pool.query(
      'SELECT autor_id FROM recursos WHERE id = $1',
      [id]
    );
    
    if (recursoExiste.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Recurso no encontrado' 
      });
    }
    
    if (recursoExiste.rows[0].autor_id !== usuarioId) {
      return res.status(403).json({ 
        error: 'No tienes permiso para eliminar este recurso' 
      });
    }
    
    // Eliminar recurso (los comentarios y votos se eliminan automáticamente por CASCADE)
    await pool.query('DELETE FROM recursos WHERE id = $1', [id]);
    
    res.json({
      message: 'Recurso eliminado exitosamente'
    });
    
  } catch (error) {
    console.error('Error al eliminar recurso:', error);
    res.status(500).json({ 
      error: 'Error al eliminar recurso' 
    });
  }
};

// Votar recurso (requiere autenticación)
const votarRecurso = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo } = req.body; // 'up' o 'down' like o dislike
    const usuarioId = req.user.id;
    
    // Validar tipo de voto
    if (!tipo || !['up', 'down'].includes(tipo)) {
      return res.status(400).json({ 
        error: 'Tipo de voto inválido. Debe ser "up" o "down"' 
      });
    }
    
    // Verificar que el recurso existe
    const recursoExiste = await pool.query(
      'SELECT id FROM recursos WHERE id = $1',
      [id]
    );
    
    if (recursoExiste.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Recurso no encontrado' 
      });
    }
    
    // Verificar si el usuario ya votó
    const votoExiste = await pool.query(
      'SELECT tipo FROM votos WHERE usuario_id = $1 AND recurso_id = $2',
      [usuarioId, id]
    );
    
    if (votoExiste.rows.length > 0) {
      const votoAnterior = votoExiste.rows[0].tipo;
      
      // Si es el mismo voto, lo eliminamos (toggle)
      if (votoAnterior === tipo) {
        await pool.query(
          'DELETE FROM votos WHERE usuario_id = $1 AND recurso_id = $2',
          [usuarioId, id]
        );
        
        // Actualizar contador en recursos
        if (tipo === 'up') {
          await pool.query(
            'UPDATE recursos SET votos = votos - 1 WHERE id = $1',
            [id]
          );
        } else {
          await pool.query(
            'UPDATE recursos SET votos_negativos = votos_negativos - 1 WHERE id = $1',
            [id]
          );
        }
        
        return res.json({ 
          message: 'Voto eliminado',
          accion: 'eliminado'
        });
      }
      
      // Si es diferente, actualizamos el voto
      await pool.query(
        'UPDATE votos SET tipo = $1 WHERE usuario_id = $2 AND recurso_id = $3',
        [tipo, usuarioId, id]
      );
      
      // Actualizar contadores
      if (tipo === 'up') {
        await pool.query(
          'UPDATE recursos SET votos = votos + 1, votos_negativos = votos_negativos - 1 WHERE id = $1',
          [id]
        );
      } else {
        await pool.query(
          'UPDATE recursos SET votos = votos - 1, votos_negativos = votos_negativos + 1 WHERE id = $1',
          [id]
        );
      }
      
      return res.json({ 
        message: 'Voto actualizado',
        accion: 'actualizado',
        tipo
      });
    }
    
    // Crear nuevo voto
    await pool.query(
      'INSERT INTO votos (usuario_id, recurso_id, tipo) VALUES ($1, $2, $3)',
      [usuarioId, id, tipo]
    );
    
    // Actualizar contador en recursos
    if (tipo === 'up') {
      await pool.query(
        'UPDATE recursos SET votos = votos + 1 WHERE id = $1',
        [id]
      );
    } else {
      await pool.query(
        'UPDATE recursos SET votos_negativos = votos_negativos + 1 WHERE id = $1',
        [id]
      );
    }
    
    res.json({ 
      message: 'Voto registrado',
      accion: 'creado',
      tipo
    });
    
  } catch (error) {
    console.error('Error al votar recurso:', error);
    res.status(500).json({ 
      error: 'Error al procesar voto' 
    });
  }
};

// Obtener materias disponibles
const listarMaterias = async (req, res) => {
  try {
    const resultado = await pool.query(
      'SELECT id, nombre, tipo FROM materias ORDER BY nombre ASC'
    );
    
    res.json({
      materias: resultado.rows
    });
    
  } catch (error) {
    console.error('Error al listar materias:', error);
    res.status(500).json({ 
      error: 'Error al obtener materias' 
    });
  }
};

module.exports = {
  listarRecursos,
  obtenerRecurso,
  crearRecurso,
  editarRecurso,
  eliminarRecurso,
  votarRecurso,
  listarMaterias
};