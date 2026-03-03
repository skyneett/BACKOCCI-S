/**
 * =============================================
 * RUTAS GENÉRICAS CRUD
 * =============================================
 */

const express = require('express');
const { verificarToken, verificarRol } = require('../middleware/authMiddleware');

// Helper para crear rutas CRUD genéricas
const crearRutasCRUD = (controller, soloAdmin = false) => {
  const router = express.Router();
  
  // Todas las rutas requieren autenticación
  router.use(verificarToken);
  
  // Si soloAdmin es true, requiere rol Admin
  if (soloAdmin) {
    router.use(verificarRol('Administrador'));
  }
  
  router.get('/', controller.obtenerTodos);
  router.get('/:id', controller.obtenerPorId);
  router.post('/', verificarRol('Administrador', 'Empleado'), controller.crear);
  router.put('/:id', verificarRol('Administrador', 'Empleado'), controller.actualizar);
  router.delete('/:id', verificarRol('Administrador'), controller.eliminar);
  
  return router;
};

// Importar controladores genéricos
const {
  permisoController,
  empleadoController,
  propietarioController,
  proveedorController,
  fincaController,
  servicioController,
  programacionController
} = require('../controllers/genericControllers');

// Crear y exportar rutas
module.exports = {
  permisoRoutes: crearRutasCRUD(permisoController, true),
  empleadoRoutes: crearRutasCRUD(empleadoController, true),
  propietarioRoutes: crearRutasCRUD(propietarioController, false),
  proveedorRoutes: crearRutasCRUD(proveedorController, false),
  fincaRoutes: crearRutasCRUD(fincaController, false),
  servicioRoutes: crearRutasCRUD(servicioController, false),
  programacionRoutes: crearRutasCRUD(programacionController, false)
};
