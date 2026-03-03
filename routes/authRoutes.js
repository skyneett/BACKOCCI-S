/**
 * =============================================
 * AUTH ROUTES - Rutas de Autenticación
 * =============================================
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verificarToken } = require('../middleware/authMiddleware');

/**
 * POST /api/auth/login
 * Iniciar sesión
 * Público
 */
router.post('/login', authController.login);

/**
 * POST /api/auth/register
 * Registrar nuevo cliente
 * Público
 */
router.post('/register', authController.register);

/**
 * GET /api/auth/profile
 * Obtener perfil del usuario autenticado
 * Requiere: Token JWT
 */
router.get('/profile', verificarToken, authController.obtenerPerfil);

/**
 * PUT /api/auth/cambiar-contrasena
 * Cambiar contraseña del usuario autenticado
 * Requiere: Token JWT
 */
router.put('/cambiar-contrasena', verificarToken, authController.cambiarContrasena);

/**
 * GET /api/auth/reset-admin
 * RUTA TEMPORAL: Resetear contraseña del admin
 * Público (solo para desarrollo)
 */
router.get('/reset-admin', authController.resetAdmin);

module.exports = router;
