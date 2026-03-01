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
router.post('/', verificarRol('Admin', 'Empleado'), clienteController.crear);
router.put('/:id', verificarRol('Admin', 'Empleado'), clienteController.actualizar);
router.delete('/:id', verificarRol('Admin'), clienteController.eliminar);

module.exports = router;
