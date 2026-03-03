/**
 * VENTA ROUTES
 */
const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventaController');
const { verificarToken, verificarRol } = require('../middleware/authMiddleware');

router.use(verificarToken, verificarRol('Administrador', 'Empleado'));

router.get('/', ventaController.obtenerTodos);
router.get('/estadisticas', ventaController.obtenerEstadisticas);
router.get('/buscar', ventaController.buscar);
router.get('/estado/:estadoPago', ventaController.obtenerPorEstadoPago);
router.get('/:id', ventaController.obtenerPorId);
router.post('/', ventaController.crear);
router.post('/:id/pago', ventaController.registrarPago);
router.put('/:id', ventaController.actualizar);
router.post('/:id/cancelar', ventaController.cancelar);

module.exports = router;
