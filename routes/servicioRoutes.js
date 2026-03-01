/**
 * SERVICIO ROUTES
 */
const express = require('express');
const router = express.Router();
const servicioController = require('../controllers/servicioController');
const { verificarToken, verificarRol } = require('../middleware/authMiddleware');

router.use(verificarToken);
router.get('/disponibles', servicioController.obtenerDisponibles);
router.get('/tipo/:tipo', servicioController.obtenerPorTipo);
router.get('/', servicioController.obtenerTodos);
router.get('/:id', servicioController.obtenerPorId);
router.post('/', verificarRol('Admin', 'Empleado'), servicioController.crear);
router.put('/:id', verificarRol('Admin', 'Empleado'), servicioController.actualizar);
router.delete('/:id', verificarRol('Admin'), servicioController.eliminar);

module.exports = router;
