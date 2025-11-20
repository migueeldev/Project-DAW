const express = require('express');
const router = express.Router();
const {
  listarRecursos,
  obtenerRecurso,
  crearRecurso,
  editarRecurso,
  eliminarRecurso,
  votarRecurso,
  listarMaterias
} = require('../controllers/recursosController');
const { verificarToken } = require('../middleware/auth');

// Rutas públicas
router.get('/recursos', listarRecursos);
router.get('/recursos/:id', obtenerRecurso);
router.get('/materias', listarMaterias);

// Rutas protegidas (requieren autenticación)
router.post('/recursos', verificarToken, crearRecurso);
router.put('/recursos/:id', verificarToken, editarRecurso);
router.delete('/recursos/:id', verificarToken, eliminarRecurso);
router.post('/recursos/:id/votar', verificarToken, votarRecurso);

module.exports = router;