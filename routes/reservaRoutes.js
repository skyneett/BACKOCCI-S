/**
 * RESERVA ROUTES
 */
const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');
const { verificarToken, verificarRol } = require('../middleware/authMiddleware');

router.use(verificarToken);

router.get('/', reservaController.obtenerTodos);
router.get('/buscar', reservaController.buscar);
router.get('/cliente/:idCliente', reservaController.obtenerPorCliente);
router.get('/:id', reservaController.obtenerPorId);
router.post('/', verificarRol('Administrador', 'Empleado', 'Cliente'), reservaController.crear);
router.put('/:id', verificarRol('Administrador', 'Empleado'), reservaController.actualizar);
router.post('/:id/cancelar', verificarRol('Administrador', 'Empleado', 'Cliente'), reservaController.cancelar);
router.delete('/:id', verificarRol('Administrador'), reservaController.eliminar);

// Agregar detalles a reserva
router.post('/:id/programacion', verificarRol('Administrador', 'Empleado'), reservaController.agregarProgramacion);
router.post('/:id/finca', verificarRol('Administrador', 'Empleado'), reservaController.agregarFinca);
router.post('/:id/servicio', verificarRol('Administrador', 'Empleado'), reservaController.agregarServicio);
router.post('/:id/acompanante', verificarRol('Administrador', 'Empleado', 'Cliente'), reservaController.agregarAcompanante);

module.exports = router;
