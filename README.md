# 📚 Biblioteca Digital Colaborativa

Sistema web para compartir y gestionar recursos académicos entre estudiantes.

## 🎯 Objetivo

Crear una plataforma colaborativa donde estudiantes puedan compartir recursos académicos (apuntes, guías, videos, etc.) organizados por materias, con sistema de votación y comentarios para validar la calidad del contenido.

## ✨ Características Principales

### Funcionalidades Implementadas:
- ✅ **Autenticación de usuarios** (Registro y Login con JWT)
- ✅ **CRUD completo de recursos** académicos
- ✅ **Sistema de votación** (👍 likes / 👎 dislikes)
- ✅ **Sistema de comentarios** en cada recurso
- ✅ **Filtros avanzados** (por materia, nivel, búsqueda)
- ✅ **Dashboard personal** para gestionar tus recursos
- ✅ **Materias dinámicas** (crea nuevas categorías)

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

## 🚀 Instalación y Ejecución

### Requisitos Previos:
- **Docker Desktop** instalado
- **Docker Compose** (incluido en Docker Desktop)

### Pasos para ejecutar:

1. **Clonar o descargar el proyecto:**
```bash
cd biblioteca-digital
```

2. **Levantar todos los servicios con Docker Compose:**
```bash
docker-compose up --build
```

3. **Acceder a la aplicación:**
- **Frontend (App web):** http://localhost
- **Backend (API):** http://localhost:5000
- **Base de datos:** localhost:5432

### Comandos de docker que fueron útiles:
```bash
# Detener todos los servicios
docker-compose down

# Ver logs en tiempo real
docker-compose logs -f

# Reiniciar un servicio específico
docker-compose restart backend

# Eliminar todo (incluyendo datos de BD)
docker-compose down -v

# Reconstruir después de cambios en el código
docker-compose up --build
```

## 🗄️ Base de Datos

### Tablas implementadas:
- **usuarios** - Información de usuarios registrados
- **materias** - Catálogo de materias/categorías
- **recursos** - Recursos académicos publicados
- **comentarios** - Comentarios en cada recurso
- **votos** - Sistema de votación


## 🧪 Casos de Uso Implementados

1. **Usuario Visitante (sin login):**
   - ✅ Ver todos los recursos
   - ✅ Filtrar y buscar recursos
   - ✅ Leer comentarios
   - ❌ NO puede: votar, comentar, subir recursos

2. **Usuario Registrado:**
   - ✅ Todo lo anterior +
   - ✅ Subir nuevos recursos
   - ✅ Votar recursos (like/dislike)
   - ✅ Comentar en recursos
   - ✅ Editar sus propios recursos
   - ✅ Eliminar sus propios recursos
   - ✅ Ver dashboard personal con estadísticas

## 🔮 Mejoras Futuras (No implementadas actualmente)

- [ ] Sistema de reportes de enlaces rotos con notificación por email posiblmente con nodeemailer
- [ ] Crear funcionalidad de uploads(al menos localmente)
- [ ] Sistema de favoritos/guardados
- [ ] Integración con Google Drive API o algun otro servicio externo