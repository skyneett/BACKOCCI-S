/**
 * =============================================
 * DB.JS - CONFIGURACIÓN DE SEQUELIZE
 * =============================================
 * 
 * Configuración de Sequelize para PostgreSQL (Supabase).
 * Maneja la conexión a la base de datos y valida la conectividad.
 * 
 * VARIABLES DE ENTORNO REQUERIDAS (.env):
 * - DATABASE_URL: URL completa de conexión a PostgreSQL
 *   O bien:
 * - DB_HOST: Host de PostgreSQL
 * - DB_PORT: Puerto (default: 5432, Supabase: 4000)
 * - DB_USER: Usuario de la base de datos
 * - DB_PASSWORD: Contraseña del usuario
 * - DB_NAME: Nombre de la base de datos
 */

const { Sequelize } = require('sequelize');
require('dotenv').config();

// =============================================
// CONFIGURACIÓN DE SEQUELIZE
// =============================================
let sequelize;

if (process.env.DATABASE_URL) {
  // Configuración con DATABASE_URL (recomendado para Supabase)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Necesario para Supabase
      }
    },
    logging: false, // Cambiar a console.log para ver queries SQL
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  // Configuración con variables individuales
  sequelize = new Sequelize(
    process.env.DB_NAME || 'postgres',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      logging: false,
      pool: {
        max: 20,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
}

// =============================================
// VALIDAR CONEXIÓN A LA BASE DE DATOS
// =============================================
const validarConexion = async () => {
  try {
    console.log('🔄 Validando conexión a la base de datos...');
    console.log(`   Modo: ${process.env.DATABASE_URL ? 'DATABASE_URL' : 'Variables individuales'}`);
    
    if (process.env.DATABASE_URL) {
      console.log(`   URL: ${process.env.DATABASE_URL.replace(/:[^:]*@/, ':****@')}`);
    } else {
      console.log(`   Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
      console.log(`   Database: ${process.env.DB_NAME}`);
    }
    
    await sequelize.authenticate();
    
    console.log('✅ Conexión a PostgreSQL establecida correctamente');
    console.log(`   📊 Base de datos: ${sequelize.config.database}`);
    console.log(`   🖥️  Host: ${sequelize.config.host || 'via DATABASE_URL'}`);
    console.log(`   🔌 Puerto: ${sequelize.config.port || 'via DATABASE_URL'}`);
    console.log(`   📦 Dialect: ${sequelize.getDialect()}`);
    
    return true;
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error.message);
    console.error('   Verifica tu archivo .env y la conectividad a Supabase');
    console.error('   Error completo:', error.stack);
    return false;
  }
};

// =============================================
// EXPORTAR SEQUELIZE Y FUNCIÓN DE VALIDACIÓN
// =============================================
module.exports = {
  sequelize,
  validarConexion
};
