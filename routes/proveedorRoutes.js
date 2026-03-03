/**
 * PROVEEDOR ROUTES
 */
const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedorController');
const { verificarToken, verificarRol } = require('../middleware/authMiddleware');

router.use(verificarToken);
router.get('/', proveedorController.obtenerTodos);
router.get('/:id', proveedorController.obtenerPorId);
router.get('/:id/servicios', proveedorController.obtenerServicios);
router.post('/', verificarRol('Administrador', 'Empleado'), proveedorController.crear);
router.put('/:id', verificarRol('Administrador', 'Empleado'), proveedorController.actualizar);
router.delete('/:id', verificarRol('Administrador'), proveedorController.eliminar);

module.exports = router;
