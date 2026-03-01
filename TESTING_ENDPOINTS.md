# 🧪 Guía de Testing de Endpoints

Esta guía te muestra cómo probar todos los endpoints GET sin necesidad de Postman.

## 📋 Tabla de Contenidos
- [Método 1: PowerShell (Recomendado)](#método-1-powershell-recomendado)
- [Método 2: Navegador](#método-2-navegador)
- [Método 3: Crear rutas públicas temporales](#método-3-crear-rutas-públicas-temporales)

---

## Método 1: PowerShell (Recomendado)

### Paso 1: Iniciar el servidor

```powershell
npm run dev
```

### Paso 2: Probar endpoints públicos (sin autenticación)

Abre otra terminal PowerShell y ejecuta:

```powershell
# Rutas activas
Invoke-RestMethod -Uri "http://localhost:3000/api/rutas/activas" -Method Get | ConvertTo-Json

# Buscar rutas
Invoke-RestMethod -Uri "http://localhost:3000/api/rutas/buscar?nombre=montaña" -Method Get | ConvertTo-Json

# Diccionario de datos (descargar Excel)
Invoke-WebRequest -Uri "http://localhost:3000/api/diccionario/descargar" -OutFile "diccionario.xlsx"
```

### Paso 3: Obtener token de autenticación

Primero necesitas crear un usuario o usar uno existente:

```powershell
# 1. Registrar un usuario (si no tienes uno)
$registro = @{
    correo = "test@occitours.com"
    contrasena = "Test123!"
    nombre = "Usuario"
    apellido = "Prueba"
    tipo = "Cliente"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/registro" `
    -Method Post `
    -Body $registro `
    -ContentType "application/json"

# 2. Hacer login y obtener token
$login = @{
    correo = "test@occitours.com"
    contrasena = "Test123!"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" `
    -Method Post `
    -Body $login `
    -ContentType "application/json"

# 3. Guardar el token en una variable
$token = $response.token
Write-Host "Token obtenido: $token" -ForegroundColor Green
```

### Paso 4: Usar el token para endpoints protegidos

```powershell
# Configurar headers con el token
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Ahora puedes hacer peticiones a endpoints protegidos
# GET Clientes
Invoke-RestMethod -Uri "http://localhost:3000/api/clientes" -Method Get -Headers $headers | ConvertTo-Json

# GET Empleados
Invoke-RestMethod -Uri "http://localhost:3000/api/empleados" -Method Get -Headers $headers | ConvertTo-Json

# GET Reservas
Invoke-RestMethod -Uri "http://localhost:3000/api/reservas" -Method Get -Headers $headers | ConvertTo-Json

# GET Rutas (todas)
Invoke-RestMethod -Uri "http://localhost:3000/api/rutas" -Method Get -Headers $headers | ConvertTo-Json

# GET Fincas
Invoke-RestMethod -Uri "http://localhost:3000/api/fincas" -Method Get -Headers $headers | ConvertTo-Json

# GET Servicios
Invoke-RestMethod -Uri "http://localhost:3000/api/servicios" -Method Get -Headers $headers | ConvertTo-Json

# GET Programaciones
Invoke-RestMethod -Uri "http://localhost:3000/api/programaciones" -Method Get -Headers $headers | ConvertTo-Json

# GET Ventas
Invoke-RestMethod -Uri "http://localhost:3000/api/ventas" -Method Get -Headers $headers | ConvertTo-Json

# GET Pagos
Invoke-RestMethod -Uri "http://localhost:3000/api/pagos" -Method Get -Headers $headers | ConvertTo-Json

# GET Proveedores
Invoke-RestMethod -Uri "http://localhost:3000/api/proveedores" -Method Get -Headers $headers | ConvertTo-Json

# GET Propietarios
Invoke-RestMethod -Uri "http://localhost:3000/api/propietarios" -Method Get -Headers $headers | ConvertTo-Json

# GET Roles
Invoke-RestMethod -Uri "http://localhost:3000/api/roles" -Method Get -Headers $headers | ConvertTo-Json

# GET Permisos
Invoke-RestMethod -Uri "http://localhost:3000/api/permisos" -Method Get -Headers $headers | ConvertTo-Json

# GET Dashboard
Invoke-RestMethod -Uri "http://localhost:3000/api/dashboard" -Method Get -Headers $headers | ConvertTo-Json
```

### Script completo de prueba (Copia y pega)

```powershell
# === SCRIPT COMPLETO DE PRUEBA ===

# Función para imprimir con colores
function Write-Success { param($msg) Write-Host "✅ $msg" -ForegroundColor Green }
function Write-Info { param($msg) Write-Host "ℹ️  $msg" -ForegroundColor Cyan }
function Write-Error { param($msg) Write-Host "❌ $msg" -ForegroundColor Red }

Write-Info "Iniciando pruebas de endpoints..."

# 1. Hacer login
Write-Info "Obteniendo token de autenticación..."
try {
    $loginData = @{
        correo = "test@occitours.com"
        contrasena = "Test123!"
    } | ConvertTo-Json

    $auth = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" `
        -Method Post `
        -Body $loginData `
        -ContentType "application/json"

    $token = $auth.token
    Write-Success "Token obtenido exitosamente"
} catch {
    Write-Error "Error al hacer login. Asegúrate de tener un usuario registrado."
    exit
}

# 2. Configurar headers
$headers = @{
    "Authorization" = "Bearer $token"
}

# 3. Probar todos los endpoints GET
$endpoints = @(
    @{Nombre="Clientes"; Url="/api/clientes"},
    @{Nombre="Empleados"; Url="/api/empleados"},
    @{Nombre="Reservas"; Url="/api/reservas"},
    @{Nombre="Rutas"; Url="/api/rutas"},
    @{Nombre="Fincas"; Url="/api/fincas"},
    @{Nombre="Servicios"; Url="/api/servicios"},
    @{Nombre="Programaciones"; Url="/api/programaciones"},
    @{Nombre="Ventas"; Url="/api/ventas"},
    @{Nombre="Pagos"; Url="/api/pagos"},
    @{Nombre="Proveedores"; Url="/api/proveedores"},
    @{Nombre="Propietarios"; Url="/api/propietarios"},
    @{Nombre="Roles"; Url="/api/roles"},
    @{Nombre="Permisos"; Url="/api/permisos"},
    @{Nombre="Dashboard"; Url="/api/dashboard"}
)

Write-Info "`nProbando endpoints GET...`n"

foreach ($endpoint in $endpoints) {
    try {
        $url = "http://localhost:3000$($endpoint.Url)"
        $response = Invoke-RestMethod -Uri $url -Method Get -Headers $headers
        
        if ($response) {
            $count = if ($response -is [Array]) { $response.Count } else { 1 }
            Write-Success "$($endpoint.Nombre): $count registro(s) encontrado(s)"
        } else {
            Write-Info "$($endpoint.Nombre): Sin datos"
        }
    } catch {
        Write-Error "$($endpoint.Nombre): Error - $($_.Exception.Message)"
    }
}

Write-Info "`n✨ Pruebas completadas!"
```

---

## Método 2: Navegador

### Endpoints públicos (sin autenticación):

Simplemente abre tu navegador y visita:

```
http://localhost:3000/api/rutas/activas
http://localhost:3000/api/rutas/buscar?nombre=montaña
http://localhost:3000/api/rutas/dificultad/Fácil
http://localhost:3000/api/diccionario/descargar  (descarga el Excel)
```

### Para endpoints protegidos:

Necesitas una extensión del navegador como:
- **RESTClient** (Firefox)
- **Advanced REST Client** (Chrome)
- O usar **Thunder Client** en VS Code

---

## Método 3: Crear rutas públicas temporales

Si quieres probar TODOS los endpoints GET sin autenticación (solo para desarrollo), puedo crear un archivo de rutas públicas temporales.

### Crear archivo: `routes/testRoutes.js`

```javascript
/**
 * RUTAS DE TESTING - SOLO DESARROLLO
 * ⚠️ ELIMINAR EN PRODUCCIÓN
 */
const express = require('express');
const router = express.Router();

// Importar controladores
const clienteController = require('../controllers/clienteController');
const empleadoController = require('../controllers/empleadoController');
const reservaController = require('../controllers/reservaController');
const rutaController = require('../controllers/rutaController');
const fincaController = require('../controllers/fincaController');
const servicioController = require('../controllers/servicioController');
const programacionController = require('../controllers/programacionController');
const ventaController = require('../controllers/ventaController');
const pagoController = require('../controllers/pagoController');
const proveedorController = require('../controllers/proveedorController');
const propietarioController = require('../controllers/propietarioController');
const rolController = require('../controllers/rolController');
const permisoController = require('../controllers/permisoController');

// ⚠️ SOLO PARA TESTING - SIN AUTENTICACIÓN
router.get('/clientes', clienteController.obtenerTodos);
router.get('/empleados', empleadoController.obtenerTodos);
router.get('/reservas', reservaController.obtenerTodos);
router.get('/rutas', rutaController.obtenerTodos);
router.get('/fincas', fincaController.obtenerTodos);
router.get('/servicios', servicioController.obtenerTodos);
router.get('/programaciones', programacionController.obtenerTodos);
router.get('/ventas', ventaController.obtenerTodos);
router.get('/pagos', pagoController.obtenerTodos);
router.get('/proveedores', proveedorController.obtenerTodos);
router.get('/propietarios', propietarioController.obtenerTodos);
router.get('/roles', rolController.obtenerTodos);
router.get('/permisos', permisoController.obtenerTodos);

module.exports = router;
```

### Registrar en `routes/index.js`:

```javascript
// Solo en desarrollo
if (process.env.NODE_ENV === 'development') {
    const testRoutes = require('./testRoutes');
    router.use('/test', testRoutes);
}
```

### Usar desde navegador:

```
http://localhost:3000/api/test/clientes
http://localhost:3000/api/test/empleados
http://localhost:3000/api/test/reservas
http://localhost:3000/api/test/rutas
etc...
```

---

## 📊 Verificar respuestas

### Respuesta exitosa con datos:
```json
[
    {
        "id_cliente": 1,
        "nombre": "Juan",
        "apellido": "Pérez",
        ...
    }
]
```

### Respuesta exitosa sin datos:
```json
[]
```

### Error de autenticación:
```json
{
    "error": "Token no proporcionado"
}
```

### Error del servidor:
```json
{
    "error": "Error al obtener clientes",
    "detalle": "..."
}
```

---

## 🔧 Solución de problemas

### Error: "No se puede conectar"
- ✅ Verifica que el servidor esté corriendo (`npm run dev`)
- ✅ Verifica el puerto correcto (3000)

### Error: "Token no proporcionado"
- ✅ El endpoint requiere autenticación
- ✅ Usa el script de PowerShell con token

### Error: "Token expirado"
- ✅ Los tokens expiran en 5 minutos
- ✅ Vuelve a hacer login para obtener uno nuevo

### Error: "No hay registros"
- ✅ La tabla está vacía
- ✅ Inserta datos de prueba en la base de datos

---

## 💡 Recomendaciones

1. **Para desarrollo:** Usa el script de PowerShell (Método 1)
2. **Para endpoints públicos:** Usa el navegador (Método 2)
3. **Para pruebas extensivas:** Crea las rutas de test (Método 3)
4. **Para producción:** Usa herramientas como Postman o Thunder Client

---

## 🚀 Próximos pasos

Una vez verificado que los endpoints funcionan:
1. Inserta datos de prueba en la base de datos
2. Prueba las operaciones CREATE, UPDATE, DELETE
3. Verifica el sistema de pagos con QR
4. Descarga el diccionario de datos Excel

---

**Nota:** Recuerda que los endpoints protegidos son importantes para la seguridad. Las rutas de test solo deben usarse en desarrollo.
