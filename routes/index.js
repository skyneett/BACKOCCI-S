/**
 * =============================================
 * ROUTES INDEX - Registro Central de Rutas
 * =============================================
 * 
 * Importa y registra todas las rutas del sistema
 */

const express = require('express');
const router = express.Router();

// Importar todas las rutas
const authRoutes = require('./authRoutes');
const rolRoutes = require('./rolRoutes');
const permisoRoutes = require('./permisoRoutes');
const rolPermisoRoutes = require('./rolPermisoRoutes');
const clienteRoutes = require('./clienteRoutes');
const empleadoRoutes = require('./empleadoRoutes');
const propietarioRoutes = require('./propietarioRoutes');
const proveedorRoutes = require('./proveedorRoutes');
const detalleProveedorServicioRoutes = require('./detalleProveedorServicioRoutes');
const rutaRoutes = require('./rutaRoutes');
const fincaRoutes = require('./fincaRoutes');
const servicioRoutes = require('./servicioRoutes');
const programacionRoutes = require('./programacionRoutes');
const reservaRoutes = require('./reservaRoutes');
const detalleReservaRoutes = require('./detalleReservaRoutes');
const ventaRoutes = require('./ventaRoutes');
const pagoRoutes = require('./pagoRoutes');
const pagoProveedorRoutes = require('./pagoProveedorRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const diccionarioRoutes = require('./diccionarioRoutes');

// Registrar rutas
router.use('/auth', authRoutes);
router.use('/roles', rolRoutes);
router.use('/permisos', permisoRoutes);
router.use('/rol-permisos', rolPermisoRoutes);
router.use('/clientes', clienteRoutes);
router.use('/empleados', empleadoRoutes);
router.use('/propietarios', propietarioRoutes);
router.use('/proveedores', proveedorRoutes);
router.use('/proveedor-servicios', detalleProveedorServicioRoutes);
router.use('/rutas', rutaRoutes);
router.use('/fincas', fincaRoutes);
router.use('/servicios', servicioRoutes);
router.use('/programaciones', programacionRoutes);
router.use('/reservas', reservaRoutes);
router.use('/detalle-reservas', detalleReservaRoutes);
router.use('/ventas', ventaRoutes);
router.use('/pagos', pagoRoutes);
router.use('/pago-proveedores', pagoProveedorRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/diccionario', diccionarioRoutes);

// =====================================================
// RUTAS DE TESTING - SOLO EN DESARROLLO
// =====================================================
// ⚠️ Estas rutas NO tienen autenticación
// ⚠️ Solo para verificar que los endpoints funcionan
// ⚠️ Comentar o eliminar en producción
if (process.env.NODE_ENV !== 'production') {
    const testRoutes = require('./testRoutes');
    router.use('/test', testRoutes);
    console.log('🧪 Rutas de testing habilitadas: /api/test');
}

module.exports = router;
