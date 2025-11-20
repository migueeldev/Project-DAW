const express = require('express');
const router = express.Router();
const { registrarUsuario, iniciarSesion, obtenerPerfil } = require('../controllers/authController');
const { verificarToken } = require('../middleware/auth');

// Rutas públicas (no requieren autenticación)
router.post('/register', registrarUsuario);
router.post('/login', iniciarSesion);

// Rutas protegidas (requieren autenticación)
router.get('/perfil', verificarToken, obtenerPerfil);

module.exports = router;