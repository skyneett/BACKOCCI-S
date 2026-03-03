/**
 * =============================================
 * PAGO_PROVEEDOR ROUTES
 * =============================================
 */

const express = require('express');
const router = express.Router();
const pagoProveedorController = require('../controllers/pagoProveedorController');
const { verificarToken, verificarRol } = require('../middleware/authMiddleware');

// Proteger todas las rutas (solo Admin y Empleado)
router.use(verificarToken, verificarRol('Administrador', 'Empleado'));

// GET - Todos los pagos
router.get('/', pagoProveedorController.obtenerTodos);

// GET - Pagos pendientes
router.get('/pendientes', pagoProveedorController.obtenerPendientes);

// GET - Pago por ID
router.get('/:id', pagoProveedorController.obtenerPorId);

// GET - Pagos de un proveedor
router.get('/proveedor/:idProveedor', pagoProveedorController.obtenerPorProveedor);

// POST - Crear pago
router.post('/', pagoProveedorController.crear);

// PUT - Actualizar pago
router.put('/:id', pagoProveedorController.actualizar);

// PATCH - Cambiar estado
router.patch('/:id/estado', pagoProveedorController.cambiarEstado);

// DELETE - Eliminar (anular) pago
router.delete('/:id', pagoProveedorController.eliminar);

module.exports = router;
