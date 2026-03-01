/**
 * RUTA ROUTES (Rutas Turísticas)
 */
const express = require('express');
const router = express.Router();
const rutaController = require('../controllers/rutaController');
const { verificarToken, verificarRol } = require('../middleware/authMiddleware');

// Rutas públicas (no requieren autenticación)
router.get('/activas', rutaController.obtenerActivas);
router.get('/buscar', rutaController.buscar);
router.get('/dificultad/:dificultad', rutaController.obtenerPorDificultad);

// Rutas protegidas
router.use(verificarToken);
router.get('/', rutaController.obtenerTodos);
router.get('/:id', rutaController.obtenerPorId);
router.post('/', verificarRol('Admin', 'Empleado'), rutaController.crear);
router.put('/:id', verificarRol('Admin', 'Empleado'), rutaController.actualizar);
router.delete('/:id', verificarRol('Admin'), rutaController.eliminar);

module.exports = router;
