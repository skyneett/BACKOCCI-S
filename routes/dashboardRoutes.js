/**
 * DASHBOARD ROUTES
 */
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verificarToken, verificarRol } = require('../middleware/authMiddleware');

router.use(verificarToken, verificarRol('Admin', 'Empleado'));

router.get('/estadisticas', dashboardController.obtenerEstadisticasGenerales);
router.get('/reservas-mes', dashboardController.obtenerReservasPorMes);
router.get('/ventas-mes', dashboardController.obtenerVentasPorMes);
router.get('/rutas-top', dashboardController.obtenerRutasMasVendidas);
router.get('/servicios-top', dashboardController.obtenerServiciosMasSolicitados);
router.get('/clientes-top', dashboardController.obtenerClientesTop);
router.get('/ocupacion', dashboardController.obtenerOcupacionProgramaciones);

module.exports = router;
