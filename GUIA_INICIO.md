# 🚀 GUÍA DE INICIO RÁPIDO - Occitours Backend MVC

## ⚡ Inicio Rápido (5 minutos)

### 1️⃣ **Instalar Dependencias**
```powershell
cd C:\Users\luis1\Desktop\occitours-backend-mvc
npm install
```

### 2️⃣ **Configurar Variables de Entorno**
```powershell
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus credenciales de PostgreSQL
notepad .env
```

**Configuración mínima necesaria en .env:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_password_aqui
DB_NAME=occitours

JWT_SECRET=cambiar_por_secreto_seguro_aleatorio
JWT_EXPIRES_IN=5m

PORT=3000
NODE_ENV=development
```

### 3️⃣ **Crear Base de Datos**
```powershell
# Abrir PostgreSQL
psql -U postgres

# Dentro de psql:
CREATE DATABASE occitours;
\c occitours
\i C:/Users/luis1/Desktop/Quinto trimestre/app2-occitours/database/02_schema.sql
\q
```

### 4️⃣ **Iniciar Servidor**
```powershell
# Modo desarrollo (con auto-reload)
npm run dev

# Modo producción
npm start
```

### 5️⃣ **Probar la API**
Abre tu navegador o Postman:
```
http://localhost:3000
```

Deberías ver:
```json
{
  "message": "🚀 Occitours API - Arquitectura MVC",
  "version": "2.0.0",
  "status": "online",
  "endpoints": { ... }
}
```

---

## 🧪 Prueba Rápida con CURL

### Login
```powershell
curl -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"correo\":\"admin@occitours.com\",\"contrasena\":\"admin123\"}'
```

### Obtener Rutas Activas (público)
```powershell
curl http://localhost:3000/api/rutas/activas
```

### Obtener Perfil (requiere token)
```powershell
curl http://localhost:3000/api/auth/profile `
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

---

## 📁 Estructura del Proyecto

```
occitours-backend-mvc/
│
├── 📄 server.js                 # Punto de entrada
├── 📄 package.json              # Dependencias
├── 📄 .env                      # Variables de entorno (no versionado)
├── 📄 .env.example              # Ejemplo de configuración
├── 📄 README.md                 # Documentación principal
├── 📄 API_ENDPOINTS.md          # Documentación de endpoints
├── 📄 GUIA_INICIO.md            # Esta guía
│
├── 📂 config/
│   └── database.js              # Conexión PostgreSQL
│
├── 📂 models/                   # 13 modelos
│   ├── Rol.js
│   ├── Permiso.js
│   ├── Usuario.js
│   ├── Cliente.js
│   ├── Empleado.js
│   ├── Propietario.js
│   ├── Proveedor.js
│   ├── Ruta.js
│   ├── Finca.js
│   ├── Servicio.js
│   ├── Programacion.js
│   ├── Reserva.js
│   └── Venta.js
│
├── 📂 controllers/              # 9 controladores
│   ├── authController.js
│   ├── rolController.js
│   ├── clienteController.js
│   ├── rutaController.js
│   ├── reservaController.js
│   ├── ventaController.js
│   ├── dashboardController.js
│   └── genericControllers.js   # Controladores genéricos
│
├── 📂 routes/                   # 14 archivos de rutas
│   ├── index.js                # Registro central
│   ├── authRoutes.js
│   ├── rolRoutes.js
│   ├── permisoRoutes.js
│   ├── clienteRoutes.js
│   ├── empleadoRoutes.js
│   ├── propietarioRoutes.js
│   ├── proveedorRoutes.js
│   ├── rutaRoutes.js
│   ├── fincaRoutes.js
│   ├── servicioRoutes.js
│   ├── programacionRoutes.js
│   ├── reservaRoutes.js
│   ├── ventaRoutes.js
│   └── dashboardRoutes.js
│
├── 📂 middleware/
│   └── authMiddleware.js       # Autenticación JWT
│
└── 📂 utils/
    └── validators.js            # Validaciones y helpers
```

---

## 🔧 Configuración Avanzada

### Cambiar Puerto
En `.env`:
```env
PORT=4000
```

### Cambiar Tiempo de Expiración del Token
En `.env`:
```env
JWT_EXPIRES_IN=1h    # 1 hora
JWT_EXPIRES_IN=30m   # 30 minutos
JWT_EXPIRES_IN=7d    # 7 días
```

### Habilitar CORS para Dominios Específicos
En `server.js`, modificar:
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'https://miapp.com'],
  credentials: true
}));
```

---

## 🐛 Solución de Problemas Comunes

### ❌ Error: "Cannot find module..."
```powershell
# Reinstalar dependencias
rm -r node_modules
npm install
```

### ❌ Error: "Error conectando a PostgreSQL"
1. Verifica que PostgreSQL esté ejecutándose
2. Revisa las credenciales en `.env`
3. Asegúrate de que la base de datos `occitours` exista

```powershell
# Verificar si PostgreSQL está activo (Windows)
Get-Service postgresql*

# Iniciar servicio si está detenido
Start-Service postgresql-x64-16  # Ajustar según tu versión
```

### ❌ Error: "Token inválido"
1. Verifica que el token no haya expirado
2. Asegúrate de incluir "Bearer " antes del token
3. Verifica que `JWT_SECRET` sea el mismo en `.env`

### ❌ Error: "Puerto 3000 en uso"
```powershell
# Ver qué proceso usa el puerto
netstat -ano | findstr :3000

# Terminar proceso (reemplazar PID)
taskkill /PID <numero_pid> /F

# O cambiar el puerto en .env
```

---

## 📊 Herramientas Recomendadas

### Para Probar la API
- **Postman**: https://www.postman.com/
- **Thunder Client** (extensión VS Code)
- **REST Client** (extensión VS Code)
- **Insomnia**: https://insomnia.rest/

### Para Gestionar PostgreSQL
- **pgAdmin**: https://www.pgadmin.org/
- **DBeaver**: https://dbeaver.io/
- **Azure Data Studio** con extensión PostgreSQL

### Para Desarrollo
- **Nodemon**: Ya incluido como devDependency
  ```powershell
  npm run dev  # Auto-reload al guardar cambios
  ```

---

## 🔐 Credenciales por Defecto

Según el schema `02_schema.sql`:

### Usuario Admin
- **Correo**: `admin@occitours.com`
- **Contraseña**: Definida en el schema (hash bcrypt)
- **Rol**: Admin

### Usuario Empleado
- **Correo**: `empleado@occitours.com`
- **Contraseña**: Definida en el schema (hash bcrypt)
- **Rol**: Empleado

**⚠️ IMPORTANTE**: Cambia estas contraseñas en producción.

---

## 📚 Próximos Pasos

1. ✅ **Leer** `API_ENDPOINTS.md` para ver todos los endpoints disponibles
2. ✅ **Probar** endpoints con Postman o Thunder Client
3. ✅ **Conectar** tu aplicación Flutter/React al backend
4. ✅ **Personalizar** según tus necesidades
5. ✅ **Implementar** validaciones adicionales
6. ✅ **Agregar** logs y auditoría
7. ✅ **Configurar** para producción

---

## 🆘 Soporte

- Documentación completa: `README.md`
- Endpoints: `API_ENDPOINTS.md`
- Esta guía: `GUIA_INICIO.md`

---

**¡Listo para desarrollar! 🚀**
