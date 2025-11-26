-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  fecha_registro TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de materias
CREATE TABLE IF NOT EXISTS materias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) UNIQUE NOT NULL,
  tipo VARCHAR(50) DEFAULT 'materia',
  fecha_creacion TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de recursos
CREATE TABLE IF NOT EXISTS recursos (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT NOT NULL,
  link VARCHAR(500) NOT NULL,
  materia_id INTEGER REFERENCES materias(id),
  nivel VARCHAR(50) NOT NULL,
  etiquetas TEXT,
  autor_id INTEGER REFERENCES usuarios(id),
  votos INTEGER DEFAULT 0,
  votos_negativos INTEGER DEFAULT 0,
  fecha_creacion TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de comentarios
CREATE TABLE IF NOT EXISTS comentarios (
  id SERIAL PRIMARY KEY,
  recurso_id INTEGER REFERENCES recursos(id) ON DELETE CASCADE,
  autor_id INTEGER REFERENCES usuarios(id),
  contenido TEXT NOT NULL,
  fecha TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de votos
CREATE TABLE IF NOT EXISTS votos (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id),
  recurso_id INTEGER REFERENCES recursos(id) ON DELETE CASCADE,
  tipo VARCHAR(10) CHECK (tipo IN ('up', 'down')),
  fecha TIMESTAMP DEFAULT NOW(),
  UNIQUE(usuario_id, recurso_id)
);

-- Insertar materias iniciales
INSERT INTO materias (nombre, tipo) VALUES
  ('Cálculo Diferencial', 'materia'),
  ('Cálculo Integral', 'materia'),
  ('Cálculo Vectorial', 'materia'),
  ('Álgebra Lineal', 'materia'),
  ('Ecuaciones Diferenciales', 'materia'),
  ('Física General', 'materia'),
  ('Fundamentos de Programación', 'materia'),
  ('Estructura de Datos', 'materia'),
  ('Desarrollo de Aplicaciones Web', 'materia'),
  ('Taller de Bases de Datos', 'materia'),
  ('Redes de Computadoras', 'materia'),
  ('Matemáticas Discretas', 'materia'),
  ('Probabilidad y Estadística', 'materia'),
  ('Química', 'materia'),
  ('Programación Orientada a Objetos', 'materia'),
  ('Programacion Web', 'materia'),
  ('Tesis de Licenciatura', 'tesis')
ON CONFLICT (nombre) DO NOTHING;