/**
 * =============================================
 * SERVER.JS - SERVIDOR PRINCIPAL
 * =============================================
 * 
 * Punto de entrada del backend Occitours con arquitectura MVC.
 * Configura Express, middlewares, rutas y manejo de errores.
 * 
 * ARQUITECTURA:
 * - Modelo: Define estructura de datos y consultas SQL
 * - Vista: Respuestas JSON (API REST)
 * - Controlador: Lógica de negocio
 * 
 * PUERTO: 3000 (configurable en .env)
 * HOST: 0.0.0.0 (permite conexiones desde red local y emuladores)
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar configuración de base de datos con Sequelize
const { sequelize, validarConexion } = require('./config/db');

// Importar todas las rutas
const routes = require('./routes');

// =============================================
// INICIALIZACIÓN DE EXPRESS
// =============================================
const app = express();
const PORT = process.env.PORT || 3000;

// =============================================
// MIDDLEWARES GLOBALES
// =============================================

// CORS: Permite peticiones desde cualquier origen (necesario para Flutter/React)
app.use(cors({
  origin: '*', // En producción, especifica dominios permitidos
  credentials: true
}));

// Body Parsers: Procesar JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger simple de peticiones
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// =============================================
// RUTA RAÍZ - INFO DE LA API
// =============================================
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Occitours API - Arquitectura MVC',
    version: '2.0.0',
    status: 'online',
    endpoints: {
      auth: '/api/auth',
      roles: '/api/roles',
      permisos: '/api/permisos',
      usuarios: '/api/usuarios',
      clientes: '/api/clientes',
      empleados: '/api/empleados',
      propietarios: '/api/propietarios',
      proveedores: '/api/proveedores',
      rutas: '/api/rutas',
      fincas: '/api/fincas',
      servicios: '/api/servicios',
      programaciones: '/api/programaciones',
      reservas: '/api/reservas',
      ventas: '/api/ventas',
      dashboard: '/api/dashboard'
    },
    documentation: '/api/docs'
  });
});

// =============================================
// REGISTRO DE TODAS LAS RUTAS
// =============================================
app.use('/api', routes);

// =============================================
// MANEJO DE ERRORES
// =============================================

// 404 - Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    message: `La ruta ${req.method} ${req.url} no existe`,
    availableEndpoints: 'Visita / para ver los endpoints disponibles'
  });
});

// 500 - Error interno del servidor
app.use((err, req, res, next) => {
  console.error('❌ Error interno:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Ha ocurrido un error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// =============================================
// INICIAR SERVIDOR CON VALIDACIÓN DE BD
// =============================================
const iniciarServidor = async () => {
  try {
    // Validar conexión a la base de datos
    const conexionExitosa = await validarConexion();
    
    if (!conexionExitosa) {
      console.error('❌ No se pudo conectar a la base de datos. El servidor no se iniciará.');
      process.exit(1);
    }
    
    // Iniciar servidor Express
    app.listen(PORT, '0.0.0.0', () => {
      const baseUrl = `http://localhost:${PORT}`;
      
      console.log('\n╔════════════════════════════════════════╗');
      console.log('║   🚀 OCCITOURS API - MVC BACKEND      ║');
      console.log('╚════════════════════════════════════════╝');
      console.log(`\n✅ Servidor escuchando en:`);
      console.log(`   🌐 http://localhost:${PORT}`);
      console.log(`   🌐 http://0.0.0.0:${PORT}\n`);
      console.log(`📝 Modo: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Base de datos: ${process.env.DB_NAME || 'postgres'}\n`);
      
      console.log('╔════════════════════════════════════════════════════════════════╗');
      console.log('║          📋 ENDPOINTS GET - VERIFICACIÓN DE TABLAS            ║');
      console.log('╚════════════════════════════════════════════════════════════════╝\n');
      
      console.log('👥 ROLES Y PERMISOS:');
  console.log(`   ${baseUrl}/api/roles`);
  console.log(`   ${baseUrl}/api/permisos`);
  console.log(`   ${baseUrl}/api/rol-permisos/rol/:idRol`);
  console.log(`   ${baseUrl}/api/rol-permisos/permiso/:idPermiso\n`);
  
  console.log('👨‍💼 CLIENTES:');
  console.log(`   ${baseUrl}/api/clientes`);
  console.log(`   ${baseUrl}/api/clientes/:id`);
  console.log(`   ${baseUrl}/api/clientes/buscar?q=termino\n`);
  
  console.log('👔 EMPLEADOS:');
  console.log(`   ${baseUrl}/api/empleados`);
  console.log(`   ${baseUrl}/api/empleados/:id\n`);
  
  console.log('🏠 PROPIETARIOS:');
  console.log(`   ${baseUrl}/api/propietarios`);
  console.log(`   ${baseUrl}/api/propietarios/:id\n`);
  
  console.log('🚚 PROVEEDORES:');
  console.log(`   ${baseUrl}/api/proveedores`);
  console.log(`   ${baseUrl}/api/proveedores/:id`);
  console.log(`   ${baseUrl}/api/proveedor-servicios/proveedor/:idProveedor`);
  console.log(`   ${baseUrl}/api/proveedor-servicios/servicio/:idServicio\n`);
  
  console.log('🗺️ RUTAS TURÍSTICAS:');
  console.log(`   ${baseUrl}/api/rutas`);
  console.log(`   ${baseUrl}/api/rutas/:id`);
  console.log(`   ${baseUrl}/api/rutas/activas\n`);
  
  console.log('🏡 FINCAS:');
  console.log(`   ${baseUrl}/api/fincas`);
  console.log(`   ${baseUrl}/api/fincas/:id\n`);
  
  console.log('🛎️ SERVICIOS:');
  console.log(`   ${baseUrl}/api/servicios`);
  console.log(`   ${baseUrl}/api/servicios/:id\n`);
  
  console.log('📅 PROGRAMACIONES:');
  console.log(`   ${baseUrl}/api/programaciones`);
  console.log(`   ${baseUrl}/api/programaciones/:id\n`);
  
  console.log('📝 RESERVAS:');
  console.log(`   ${baseUrl}/api/reservas`);
  console.log(`   ${baseUrl}/api/reservas/:id`);
  console.log(`   ${baseUrl}/api/reservas/cliente/:idCliente\n`);
  
  console.log('📋 DETALLES DE RESERVAS:');
  console.log(`   ${baseUrl}/api/detalle-reservas/programaciones/reserva/:idReserva`);
  console.log(`   ${baseUrl}/api/detalle-reservas/fincas/reserva/:idReserva`);
  console.log(`   ${baseUrl}/api/detalle-reservas/servicios/reserva/:idReserva`);
  console.log(`   ${baseUrl}/api/detalle-reservas/acompanantes/reserva/:idReserva`);
  console.log(`   ${baseUrl}/api/detalle-reservas/servicios/mas-solicitados`);
  console.log(`   ${baseUrl}/api/detalle-reservas/acompanantes/estadisticas\n`);
  
  console.log('💰 VENTAS:');
  console.log(`   ${baseUrl}/api/ventas`);
  console.log(`   ${baseUrl}/api/ventas/:id`);
  console.log(`   ${baseUrl}/api/ventas/estadisticas\n`);
  
  console.log('� PAGOS/ABONOS (con comprobantes):');
  console.log(`   ${baseUrl}/api/pagos`);
  console.log(`   ${baseUrl}/api/pagos/:id`);
  console.log(`   ${baseUrl}/api/pagos/reserva/:idReserva`);
  console.log(`   ${baseUrl}/api/pagos/venta/:idVenta`);
  console.log(`   ${baseUrl}/api/pagos/pendientes`);
  console.log(`   ${baseUrl}/api/pagos/estadisticas\n`);
  
  console.log('�💸 PAGOS A PROVEEDORES:');
  console.log(`   ${baseUrl}/api/pago-proveedores`);
  console.log(`   ${baseUrl}/api/pago-proveedores/:id`);
  console.log(`   ${baseUrl}/api/pago-proveedores/proveedor/:idProveedor`);
  console.log(`   ${baseUrl}/api/pago-proveedores/pendientes\n`);
  
  console.log('📊 DASHBOARD:');
  console.log(`   ${baseUrl}/api/dashboard/estadisticas`);
  console.log(`   ${baseUrl}/api/dashboard/reservas-mes`);
  console.log(`   ${baseUrl}/api/dashboard/ventas-mes`);
  console.log(`   ${baseUrl}/api/dashboard/rutas-top\n`);
  
  console.log('╚════════════════════════════════════════════════════════════════╝\n');
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Iniciar el servidor
iniciarServidor();

// =============================================
// MANEJO DE CIERRE GRACEFUL
// =============================================
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM recibido. Cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n👋 SIGINT recibido. Cerrando servidor...');
  process.exit(0);
});
