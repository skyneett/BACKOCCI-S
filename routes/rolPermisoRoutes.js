/**
 * =============================================
 * ROL_PERMISO ROUTES
 * =============================================
 */

const express = require('express');
const router = express.Router();
const rolPermisoController = require('../controllers/rolPermisoController');

// GET - Obtener permisos de un rol
router.get('/rol/:idRol', rolPermisoController.obtenerPermisosPorRol);

// GET - Obtener roles que tienen un permiso
router.get('/permiso/:idPermiso', rolPermisoController.obtenerRolesPorPermiso);

// POST - Asignar permiso a rol
router.post('/', rolPermisoController.asignar);

// DELETE - Remover permiso de rol
router.delete('/rol/:idRol/permiso/:idPermiso', rolPermisoController.remover);

module.exports = router;
