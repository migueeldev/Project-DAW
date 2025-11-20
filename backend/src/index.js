const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const recursosRoutes = require('./routes/recursosRoutes'); 
const comentariosRoutes = require('./routes/comentariosRoutes');

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 API de Biblioteca Digital funcionando',
    version: '1.0.0'
  });
});

// Ruta para verificar conexión a BD
app.get('/api/test-db', async (req, res) => {
  const pool = require('./config/database');
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      success: true, 
      timestamp: result.rows[0].now,
      message: '✅ Conexión a PostgreSQL exitosa'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api', recursosRoutes); 
app.use('/api', comentariosRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada' 
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV}`);
});