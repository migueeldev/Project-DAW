const express = require('express');
const router = express.Router();
const {
  listarComentarios,
  crearComentario,
  eliminarComentario
} = require('../controllers/comentariosController');
const { verificarToken } = require('../middleware/auth');

// Rutas públicas
router.get('/recursos/:recursoId/comentarios', listarComentarios);

// Rutas protegidas (requieren autenticación)
router.post('/recursos/:recursoId/comentarios', verificarToken, crearComentario);
router.delete('/comentarios/:id', verificarToken, eliminarComentario);

module.exports = router;