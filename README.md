# Biblioteca Digital Colaborativa

Aplicación web para compartir y gestionar recursos académicos entre estudiantes.

## Objetivo

Crear una aplicación web donde estudiantes puedan compartir recursos académicos (apuntes, guías, videos, etc.) organizados por materias, con sistema de votación y comentarios para validar la calidad del contenido.

## Características Principales

### Funcionalidades Implementadas:
- **Autenticación de usuarios** (Registro y Login con JWT)
- **CRUD completo de recursos** académicos
- **Sistema de votación** (👍 likes / 👎 dislikes)
- **Sistema de comentarios** en cada recurso
- **Filtros avanzados** (por materia, nivel, búsqueda)
- **Dashboard personal** para gestionar tus recursos
- **Materias dinámicas** (crea nuevas categorías)

### Tecnologías Utilizadas:

**Frontend:**
- React 18 (librería de UI)
- Vite (bundler)
- React Router (navegación)
- Tailwind CSS (estilos)
- Axios (peticiones HTTP)
- Lucide Icons (iconografía)

**Backend:**
- Node.js v18
- Express.js (framework web)
- PostgreSQL 15 (base de datos)
- JWT (autenticación)
- bcryptjs (encriptación de contraseñas)

**Tecnologias DevOps:**
- Docker & Docker Compose
- Nginx (servidor web)
- Multi-stage builds

## Instalación y Ejecución

### Requisitos Previos:
- **Docker Desktop** instalado
- **Docker Compose** (incluido en Docker Desktop)

### Pasos para ejecutar:

1. **Clonar o descargar el proyecto:**
```bash

git clone https://github.com/migueeldev/Project-DAW

cd biblioteca-digital
```

2. **Levantar todos los servicios con Docker Compose (primera vez):**
```bash
docker-compose up --build
```

3. **Acceder a la aplicación:**
- **Frontend (App web):** http://localhost
- **Backend (API):** http://localhost:5000
- **Base de datos (anteriormente):** localhost:5432
- **Actualmente base de datos en la Nube utilizando el serivicio de Neon**

### Comandos de docker que fueron útiles:
```bash
# Detener todos los servicios
docker-compose down

#Levantar Docker nuevamente(sin haber hecho cambios en el codigo)
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f
#Ejemplo:
docker-compose logs -f backend

# Reiniciar un servicio específico
docker-compose restart backend

# Eliminar todo (incluyendo datos de BD)
docker-compose down -v

# Reconstruir después de cambios en el código
docker-compose up --build
```

## Base de Datos

### Tablas implementadas:
- **usuarios** - Información de usuarios registrados
- **materias** - Catálogo de materias/categorías
- **recursos** - Recursos académicos publicados
- **comentarios** - Comentarios en cada recurso
- **votos** - Sistema de votación


## Casos de Uso Implementados

1. **Usuario Visitante (sin login):**
   - Ver todos los recursos
   - Filtrar y buscar recursos
   - Leer comentarios
   - NO puede: votar, comentar, subir recursos

2. **Usuario Registrado:**
   - Todo lo anterior +
   - Subir nuevos recursos
   - Votar recursos (like/dislike)
   - Comentar en recursos
   - Editar sus propios recursos
   - Eliminar sus propios recursos
   - Ver dashboard personal con estadísticas

## Mejoras Futuras (No implementadas actualmente)

- Sistema de reportes de enlaces rotos con notificación por email posiblmente con nodeemailer
- Crear funcionalidad de uploads(al menos localmente)
- Sistema de favoritos/guardados
- Integración con Google Drive API o algun otro servicio externo