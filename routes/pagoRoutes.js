/**
 * =====================================================
 * PAGO ROUTES - Rutas de Pagos/Abonos
 * =====================================================
 */

const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoController');

// ========== CONSULTAS ==========
// GET - Todos los pagos
router.get('/', pagoController.obtenerTodos);

// GET - Pagos pendientes de verificación
router.get('/pendientes', pagoController.obtenerPendientes);

// GET - Estadísticas de pagos
router.get('/estadisticas', pagoController.obtenerEstadisticas);

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
router.patch('/:id/verificar', pagoController.verificar);

// PUT - Actualizar pago
router.put('/:id', pagoController.actualizar);

// DELETE - Eliminar pago
router.delete('/:id', pagoController.eliminar);

module.exports = router;
