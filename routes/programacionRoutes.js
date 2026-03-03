/**
 * PROGRAMACION ROUTES
 */
const express = require('express');
const router = express.Router();
const programacionController = require('../controllers/programacionController');
const { verificarToken, verificarRol } = require('../middleware/authMiddleware');

router.use(verificarToken);
router.get('/disponibles', programacionController.obtenerDisponibles);
router.get('/ruta/:id_ruta', programacionController.obtenerPorRuta);
router.get('/', programacionController.obtenerTodos);
router.get('/:id', programacionController.obtenerPorId);
router.post('/', verificarRol('Administrador', 'Empleado'), programacionController.crear);
router.put('/:id', verificarRol('Administrador', 'Empleado'), programacionController.actualizar);
router.delete('/:id', verificarRol('Administrador'), programacionController.eliminar);

module.exports = router;
