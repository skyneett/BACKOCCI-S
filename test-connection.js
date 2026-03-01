// Script de prueba de conexión a Supabase
const { Client } = require('pg');
require('dotenv').config();

console.log('\n🔍 Probando conexión a Supabase...\n');

// Configuración de conexión
const connectionString = process.env.DATABASE_URL;
console.log('📝 URL de conexión:', connectionString.replace(/:[^:]*@/, ':****@'));

// Configuraciones a probar
const configs = [
  {
    name: 'Con SSL y DATABASE_URL',
    config: {
      connectionString,
      ssl: { rejectUnauthorized: false }
    }
  },
  {
    name: 'Sin SSL',
    config: {
      connectionString: connectionString.replace('postgresql://', 'postgres://'),
      ssl: false
    }
  },
  {
    name: 'Variables individuales con SSL',
    config: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false }
    }
  }
];

// Probar cada configuración
async function probarConexiones() {
  for (const { name, config } of configs) {
    console.log(`\n⏳ Probando: ${name}...`);
    const client = new Client(config);
    
    try {
      await client.connect();
      console.log(`✅ ${name}: CONEXIÓN EXITOSA`);
      
      // Probar una query simple
      const result = await client.query('SELECT NOW() as tiempo, version() as version');
      console.log(`   Tiempo servidor: ${result.rows[0].tiempo}`);
      console.log(`   Versión: ${result.rows[0].version.substring(0, 50)}...`);
      
      await client.end();
      console.log(`\n🎉 ¡CONEXIÓN FUNCIONAL CON: ${name}!`);
      break; // Si funciona, salimos
    } catch (error) {
      console.log(`❌ ${name}: FALLÓ`);
      console.log(`   Error: ${error.message}`);
      try { await client.end(); } catch(e) {}
    }
  }
}

probarConexiones().then(() => {
  console.log('\n✅ Prueba completada\n');
}).catch(err => {
  console.error('\n❌ Error en la prueba:', err);
});
