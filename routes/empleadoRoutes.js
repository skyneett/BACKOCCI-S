/**
 * EMPLEADO ROUTES
 */
const express = require('express');
const router = express.Router();
const empleadoController = require('../controllers/empleadoController');
const { verificarToken, verificarRol } = require('../middleware/authMiddleware');

router.use(verificarToken, verificarRol('Admin'));
router.get('/buscar', empleadoController.buscar);
router.get('/', empleadoController.obtenerTodos);
router.get('/:id', empleadoController.obtenerPorId);
router.post('/', empleadoController.crear);
router.put('/:id', empleadoController.actualizar);
router.delete('/:id', empleadoController.eliminar);

module.exports = router;
