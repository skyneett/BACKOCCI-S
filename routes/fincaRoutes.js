/**
 * FINCA ROUTES
 */
const express = require('express');
const router = express.Router();
const fincaController = require('../controllers/fincaController');
const { verificarToken, verificarRol } = require('../middleware/authMiddleware');

router.use(verificarToken);
router.get('/disponibles', fincaController.obtenerDisponibles);
router.get('/buscar', fincaController.buscar);
router.get('/', fincaController.obtenerTodos);
router.get('/:id', fincaController.obtenerPorId);
router.post('/', verificarRol('Administrador', 'Empleado'), fincaController.crear);
router.put('/:id', verificarRol('Administrador', 'Empleado'), fincaController.actualizar);
router.delete('/:id', verificarRol('Administrador'), fincaController.eliminar);

module.exports = router;
