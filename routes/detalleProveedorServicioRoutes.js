/**
 * =============================================
 * DETALLE_PROVEEDOR_SERVICIO ROUTES
 * =============================================
 */

const express = require('express');
const router = express.Router();
const detalleProveedorServicioController = require('../controllers/detalleProveedorServicioController');

// GET - Servicios de un proveedor
router.get('/proveedor/:idProveedor', detalleProveedorServicioController.obtenerServiciosPorProveedor);

// GET - Proveedores de un servicio
router.get('/servicio/:idServicio', detalleProveedorServicioController.obtenerProveedoresPorServicio);

// GET - Detalle por ID
router.get('/:id', detalleProveedorServicioController.obtenerPorId);

// POST - Asignar servicio a proveedor
router.post('/', detalleProveedorServicioController.asignar);

// PUT - Actualizar precio
router.put('/:id', detalleProveedorServicioController.actualizarPrecio);

// DELETE - Eliminar asignación
router.delete('/:id', detalleProveedorServicioController.eliminar);

module.exports = router;
