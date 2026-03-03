/**
 * =============================================
 * ROL ROUTES - Rutas de Roles
 * =============================================
 */

const express = require('express');
const router = express.Router();
const rolController = require('../controllers/rolController');
const { verificarToken, verificarRol } = require('../middleware/authMiddleware');

/**
 * Todas las rutas requieren autenticación y rol Admin
 */
router.use(verificarToken, verificarRol('Administrador'));

/**
 * GET /api/roles
 * Obtener todos los roles
 */
router.get('/', rolController.obtenerTodos);

/**
 * GET /api/roles/:id
 * Obtener rol por ID
 */
router.get('/:id', rolController.obtenerPorId);

/**
 * POST /api/roles
 * Crear nuevo rol
 */
router.post('/', rolController.crear);

/**
 * PUT /api/roles/:id
 * Actualizar rol
 */
router.put('/:id', rolController.actualizar);

/**
 * DELETE /api/roles/:id
 * Eliminar rol
 */
router.delete('/:id', rolController.eliminar);

/**
 * POST /api/roles/:id/permisos
 * Asignar permiso a rol
 */
router.post('/:id/permisos', rolController.asignarPermiso);

/**
 * DELETE /api/roles/:id/permisos/:idPermiso
 * Remover permiso de rol
 */
router.delete('/:id/permisos/:idPermiso', rolController.removerPermiso);

module.exports = router;
