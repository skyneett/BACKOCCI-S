/**
 * =============================================
 * DATABASE.JS - CONFIGURACIÓN DE PostgreSQL
 * =============================================
 * 
 * Configuración de pool de conexiones a PostgreSQL usando pg.
 * Pool permite reutilizar conexiones y manejar múltiples peticiones
 * concurrentes de manera eficiente.
 * 
 * VARIABLES DE ENTORNO REQUERIDAS (.env):
 * - DB_HOST: Host de PostgreSQL (ej: localhost)
 * - DB_PORT: Puerto (default: 5432)
 * - DB_USER: Usuario de la base de datos
 * - DB_PASSWORD: Contraseña del usuario
 * - DB_NAME: Nombre de la base de datos
 */

const { Pool } = require('pg');
require('dotenv').config();

// =============================================
// CONFIGURACIÓN DEL POOL DE CONEXIONES
// =============================================
// Soporta tanto DATABASE_URL (Supabase) como variables individuales
const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false // Necesario para Supabase
        },
        // Configuración del pool
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'occitours',
        // Configuración del pool
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      }
);

// =============================================
// VERIFICAR CONEXIÓN AL INICIAR
// =============================================
console.log('🔄 Intentando conectar a la base de datos...');
console.log(`   Modo: ${process.env.DATABASE_URL ? 'DATABASE_URL' : 'Variables individuales'}`);
if (process.env.DATABASE_URL) {
  console.log(`   URL: ${process.env.DATABASE_URL.replace(/:[^:]*@/, ':****@')}`);
} else {
  console.log(`   Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
  console.log(`   Database: ${process.env.DB_NAME}`);
}

pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error conectando a PostgreSQL:', err.message);
    console.error('   Verifica tu archivo .env y la conectividad a Supabase');
    console.error('   Error completo:', err.stack);
    return;
  }
  console.log('✅ Conectado a PostgreSQL correctamente');
  console.log(`   📊 Base de datos: ${process.env.DB_NAME || 'postgres'}`);
  console.log(`   🖥️  Host: ${process.env.DB_HOST || 'via DATABASE_URL'}`);
  release();
});

// =============================================
// MANEJO DE ERRORES DEL POOL
// =============================================
pool.on('error', (err, client) => {
  console.error('❌ Error inesperado en cliente de PostgreSQL:', err);
  process.exit(-1);
});

// =============================================
// EXPORTAR POOL PARA USO EN MODELOS
// =============================================
module.exports = pool;
