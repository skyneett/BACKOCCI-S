/**
 * TIPO PROVEEDOR ROUTES
 */
const express = require('express');
const router = express.Router();
const tipoProveedorController = require('../controllers/tipoProveedorController');
const { verificarToken, verificarRol } = require('../middleware/authMiddleware');

router.use(verificarToken);

// Rutas públicas (requieren autenticación)
router.get('/', tipoProveedorController.obtenerTodos);
router.get('/activos', tipoProveedorController.obtenerActivos);
router.get('/buscar', tipoProveedorController.buscar);
router.get('/:id', tipoProveedorController.obtenerPorId);
router.get('/:id/proveedores', tipoProveedorController.obtenerProveedores);

// Rutas protegidas (requieren rol Admin o Empleado)
router.post('/', verificarRol('Admin', 'Empleado'), tipoProveedorController.crear);
router.put('/:id', verificarRol('Admin', 'Empleado'), tipoProveedorController.actualizar);
router.patch('/:id/estado', verificarRol('Admin', 'Empleado'), tipoProveedorController.cambiarEstado);
router.delete('/:id', verificarRol('Admin'), tipoProveedorController.eliminar);

module.exports = router;
