/**
 * ====================================================
 * RUTAS DE TESTING - SOLO DESARROLLO
 * ====================================================
 * 
 * ⚠️  ADVERTENCIA: Estas rutas NO tienen autenticación
 * ⚠️  ELIMINAR o COMENTAR en producción
 * ⚠️  Solo para verificar que los endpoints funcionan
 * 
 * Uso desde navegador:
 * http://localhost:3000/api/test/clientes
 * http://localhost:3000/api/test/rutas
 * etc.
 * ====================================================
 */

const express = require('express');
const router = express.Router();

// Importar todos los controladores
const rolController = require('../controllers/rolController');
const permisoController = require('../controllers/permisoController');
const clienteController = require('../controllers/clienteController');
const empleadoController = require('../controllers/empleadoController');
const propietarioController = require('../controllers/propietarioController');
const proveedorController = require('../controllers/proveedorController');
const rutaController = require('../controllers/rutaController');
const fincaController = require('../controllers/fincaController');
const servicioController = require('../controllers/servicioController');
const programacionController = require('../controllers/programacionController');
const reservaController = require('../controllers/reservaController');
const ventaController = require('../controllers/ventaController');
const pagoController = require('../controllers/pagoController');
const dashboardController = require('../controllers/dashboardController');

// =====================================================
// ENDPOINTS GET SIN AUTENTICACIÓN (SOLO TESTING)
// =====================================================

// Módulo: Autenticación y Autorización
router.get('/roles', rolController.obtenerTodos);
router.get('/permisos', permisoController.obtenerTodos);

// Módulo: Usuarios
router.get('/clientes', clienteController.obtenerTodos);
router.get('/empleados', empleadoController.obtenerTodos);

// Módulo: Propietarios y Proveedores
router.get('/propietarios', propietarioController.obtenerTodos);
router.get('/proveedores', proveedorController.obtenerTodos);

// Módulo: Productos y Servicios
router.get('/rutas', rutaController.obtenerTodos);
router.get('/fincas', fincaController.obtenerTodos);
router.get('/servicios', servicioController.obtenerTodos);

// Módulo: Programación
router.get('/programaciones', programacionController.obtenerTodos);

// Módulo: Reservas
router.get('/reservas', reservaController.obtenerTodos);

// Módulo: Ventas y Pagos
router.get('/ventas', ventaController.obtenerTodos);
router.get('/pagos', pagoController.obtenerTodos);

// Dashboard
router.get('/dashboard', dashboardController.obtenerEstadisticasGenerales);

// Ruta de información
router.get('/', (req, res) => {
    res.json({
        mensaje: '🧪 Rutas de Testing - Solo Desarrollo',
        advertencia: '⚠️  Estas rutas NO tienen autenticación',
        uso: 'http://localhost:3000/api/test/{endpoint}',
        endpoints_disponibles: [
            '/roles',
            '/permisos',
            '/clientes',
            '/empleados',
            '/propietarios',
            '/proveedores',
            '/rutas',
            '/fincas',
            '/servicios',
            '/programaciones',
            '/reservas',
            '/ventas',
            '/pagos',
            '/dashboard'
        ],
        ejemplo: 'http://localhost:3000/api/test/clientes',
        nota: 'Eliminar o comentar en producción'
    });
});

module.exports = router;
