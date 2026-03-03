/**
 * =====================================================
 * PAGO ROUTES - Rutas de Pagos/Abonos
 * =====================================================
 */

const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoController');
const { verificarToken, verificarRol } = require('../middleware/authMiddleware');

// Proteger todas las rutas
router.use(verificarToken);

// ========== CONSULTAS ==========
// GET - Todos los pagos
router.get('/', verificarRol('Administrador', 'Empleado'), pagoController.obtenerTodos);

// GET - Pagos pendientes de verificación
router.get('/pendientes', verificarRol('Administrador', 'Empleado'), pagoController.obtenerPendientes);

// GET - Estadísticas de pagos
router.get('/estadisticas', verificarRol('Administrador', 'Empleado'), pagoController.obtenerEstadisticas);

// GET - Pago por ID
router.get('/:id', pagoController.obtenerPorId);

// GET - Pagos de una venta
router.get('/venta/:idVenta', pagoController.obtenerPorVenta);

// GET - Pagos de una reserva
router.get('/reserva/:idReserva', pagoController.obtenerPorReserva);

// GET - Resumen de pagos de una venta
router.get('/venta/:idVenta/resumen', pagoController.obtenerResumenVenta);

// ========== OPERACIONES ==========
// POST - Crear nuevo pago/abono
router.post('/', pagoController.crear);

// PATCH - Verificar/Aprobar/Rechazar pago
router.patch('/:id/verificar', verificarRol('Administrador', 'Empleado'), pagoController.verificar);

// PUT - Actualizar pago
router.put('/:id', verificarRol('Administrador', 'Empleado'), pagoController.actualizar);

// DELETE - Eliminar pago
router.delete('/:id', verificarRol('Administrador'), pagoController.eliminar);

module.exports = router;
