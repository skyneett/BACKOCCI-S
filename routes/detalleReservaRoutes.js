/**
 * =============================================
 * DETALLE_RESERVA ROUTES
 * =============================================
 */

const express = require('express');
const router = express.Router();
const detalleReservaController = require('../controllers/detalleReservaController');
const { verificarToken, verificarRol } = require('../middleware/authMiddleware');

// Proteger todas las rutas
router.use(verificarToken);

// ========== PROGRAMACIONES ==========
// GET - Programaciones de una reserva
router.get('/programaciones/reserva/:idReserva', detalleReservaController.obtenerProgramaciones);

// GET - Reservas de una programación
router.get('/programaciones/:idProgramacion/reservas', detalleReservaController.obtenerReservasPorProgramacion);

// ========== FINCAS ==========
// GET - Fincas de una reserva
router.get('/fincas/reserva/:idReserva', detalleReservaController.obtenerFincas);

// GET - Verificar disponibilidad de finca
router.get('/fincas/:idFinca/disponibilidad', detalleReservaController.verificarDisponibilidadFinca);

// ========== SERVICIOS ==========
// GET - Servicios de una reserva
router.get('/servicios/reserva/:idReserva', detalleReservaController.obtenerServicios);

// GET - Servicios más solicitados
router.get('/servicios/mas-solicitados', detalleReservaController.obtenerServiciosMasSolicitados);

// ========== ACOMPAÑANTES ==========
// GET - Acompañantes de una reserva
router.get('/acompanantes/reserva/:idReserva', detalleReservaController.obtenerAcompanantes);

// GET - Estadísticas de acompañantes
router.get('/acompanantes/estadisticas', detalleReservaController.obtenerEstadisticasAcompanantes);

module.exports = router;
