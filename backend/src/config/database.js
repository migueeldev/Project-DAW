  const { Pool } = require('pg');
require('dotenv').config();

// Configuración para Neon (producción y desarrollo en nube)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' || process.env.DATABASE_URL 
    ? { rejectUnauthorized: false } 
    : false,
  // Configuración de pool para optimizar conexiones
  max: 20, // máximo de conexiones
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Probar conexión a la base de datos
pool.on('connect', () => {
  console.log('✅ Conectado a PostgreSQL (Neon)');
});

pool.on('error', (err) => {
  console.error('❌ Error en la conexión a PostgreSQL:', err);
  process.exit(-1);
});

// Función helper para verificar la conexión al inicio
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('🔗 Test de conexión exitoso:', result.rows[0].now);
    client.release();
  } catch (err) {
    console.error('❌ Error al probar la conexión:', err.message);
    throw err;
  }
};

// Ejecutar test de conexión al cargar el módulo
testConnection().catch(console.error);

module.exports = pool;