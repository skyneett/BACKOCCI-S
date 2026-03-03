/**
 * PROPIETARIO ROUTES
 */
const express = require('express');
const router = express.Router();
const propietarioController = require('../controllers/propietarioController');
const { verificarToken, verificarRol } = require('../middleware/authMiddleware');

router.use(verificarToken);
router.get('/', propietarioController.obtenerTodos);
router.get('/:id', propietarioController.obtenerPorId);
router.get('/:id/fincas', propietarioController.obtenerFincas);
router.post('/', verificarRol('Administrador', 'Empleado'), propietarioController.crear);
router.put('/:id', verificarRol('Administrador', 'Empleado'), propietarioController.actualizar);
router.delete('/:id', verificarRol('Administrador'), propietarioController.eliminar);

module.exports = router;
