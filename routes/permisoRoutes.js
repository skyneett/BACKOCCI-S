/**
 * PERMISO ROUTES
 */
const express = require('express');
const router = express.Router();
const permisoController = require('../controllers/permisoController');
const { verificarToken, verificarRol } = require('../middleware/authMiddleware');

router.use(verificarToken, verificarRol('Administrador'));
router.get('/', permisoController.obtenerTodos);
router.get('/:id', permisoController.obtenerPorId);
router.post('/', permisoController.crear);
router.put('/:id', permisoController.actualizar);
router.delete('/:id', permisoController.eliminar);

module.exports = router;
