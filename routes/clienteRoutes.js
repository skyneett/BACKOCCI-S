/**
 * CLIENTE ROUTES
 */
const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const { verificarToken, verificarRol } = require('../middleware/authMiddleware');

router.use(verificarToken);
router.get('/', clienteController.obtenerTodos);
router.get('/buscar', clienteController.buscar);
router.get('/:id', clienteController.obtenerPorId);
router.post('/', verificarRol('Administrador', 'Empleado'), clienteController.crear);
router.put('/:id', verificarRol('Administrador', 'Empleado'), clienteController.actualizar);
router.delete('/:id', verificarRol('Administrador'), clienteController.eliminar);

module.exports = router;
