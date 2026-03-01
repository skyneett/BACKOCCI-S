# 🧪 Testing de Endpoints - Guía Rápida

## ✅ 3 Formas de Verificar los Endpoints

### 1️⃣ **Navegador** (Más fácil - Recomendado)

Inicia el servidor y abre el navegador:

```bash
npm run dev
```

Luego ve a estas URLs:

#### Endpoints de Testing (SIN autenticación):
```
http://localhost:3000/api/test
http://localhost:3000/api/test/clientes
http://localhost:3000/api/test/empleados
http://localhost:3000/api/test/rutas
http://localhost:3000/api/test/fincas
http://localhost:3000/api/test/servicios
http://localhost:3000/api/test/programaciones
http://localhost:3000/api/test/reservas
http://localhost:3000/api/test/ventas
http://localhost:3000/api/test/pagos
http://localhost:3000/api/test/proveedores
http://localhost:3000/api/test/propietarios
http://localhost:3000/api/test/roles
http://localhost:3000/api/test/permisos
http://localhost:3000/api/test/dashboard
```

#### Descargar diccionario Excel:
```
http://localhost:3000/api/diccionario/descargar
```

---

### 2️⃣ **Script PowerShell** (Automático)

Ejecuta el script incluido:

```powershell
.\test-endpoints.ps1
```

**Antes de ejecutar:**
1. Abre `test-endpoints.ps1`
2. Edita las líneas 11-12 con tus credenciales:
```powershell
$EMAIL = "admin@occitours.com"
$PASSWORD = "admin123"
```
3. Guarda y ejecuta

El script probará automáticamente todos los endpoints y te mostrará un resumen.

---

### 3️⃣ **PowerShell Manual**

```powershell
# Probar endpoint público
Invoke-RestMethod -Uri "http://localhost:3000/api/test/clientes" | ConvertTo-Json

# O ver en tabla
Invoke-RestMethod -Uri "http://localhost:3000/api/test/clientes" | Format-Table

# Descargar Excel
Invoke-WebRequest -Uri "http://localhost:3000/api/test/diccionario/descargar" -OutFile "diccionario.xlsx"
```

---

## 📋 Verificación Rápida

### ¿El servidor está corriendo?
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/test"
```

Deberías ver:
```json
{
  "mensaje": "🧪 Rutas de Testing - Solo Desarrollo",
  "endpoints_disponibles": [...]
}
```

### ¿Hay datos en las tablas?
```powershell
# Ver clientes
Invoke-RestMethod -Uri "http://localhost:3000/api/test/clientes"

# Ver rutas
Invoke-RestMethod -Uri "http://localhost:3000/api/test/rutas"

# Ver reservas
Invoke-RestMethod -Uri "http://localhost:3000/api/test/reservas"
```

---

## ⚠️ Importante

### Rutas de Testing vs. Rutas Normales

**Rutas de Testing** (`/api/test/*`):
- ✅ NO requieren autenticación
- ✅ Solo para verificar que la base de datos responde
- ✅ Solo en desarrollo
- ⚠️ DEBEN comentarse o eliminarse en producción

**Rutas Normales** (`/api/*`):
- 🔒 Requieren token de autenticación
- 🔒 Protegidas con middleware
- ✅ Usar en producción

---

## 🔐 Rutas con Autenticación

Si quieres probar las rutas con autenticación:

### 1. Hacer login:
```powershell
$login = @{
    correo = "admin@occitours.com"
    contrasena = "admin123"
} | ConvertTo-Json

$auth = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -Body $login -ContentType "application/json"
$token = $auth.token
```

### 2. Usar el token:
```powershell
$headers = @{ "Authorization" = "Bearer $token" }
Invoke-RestMethod -Uri "http://localhost:3000/api/clientes" -Headers $headers
```

---

## 📊 Endpoints Disponibles

| Módulo | Endpoint Testing | Endpoint Normal |
|--------|-----------------|-----------------|
| Roles | `/api/test/roles` | `/api/roles` 🔒 |
| Permisos | `/api/test/permisos` | `/api/permisos` 🔒 |
| Clientes | `/api/test/clientes` | `/api/clientes` 🔒 |
| Empleados | `/api/test/empleados` | `/api/empleados` 🔒 |
| Proveedores | `/api/test/proveedores` | `/api/proveedores` 🔒 |
| Propietarios | `/api/test/propietarios` | `/api/propietarios` 🔒 |
| Rutas | `/api/test/rutas` | `/api/rutas` 🔒 |
| Fincas | `/api/test/fincas` | `/api/fincas` 🔒 |
| Servicios | `/api/test/servicios` | `/api/servicios` 🔒 |
| Programaciones | `/api/test/programaciones` | `/api/programaciones` 🔒 |
| Reservas | `/api/test/reservas` | `/api/reservas` 🔒 |
| Ventas | `/api/test/ventas` | `/api/ventas` 🔒 |
| Pagos | `/api/test/pagos` | `/api/pagos` 🔒 |
| Dashboard | `/api/test/dashboard` | `/api/dashboard` 🔒 |

🔒 = Requiere token de autenticación

---

## 🚀 Inicio Rápido

**Solo 2 pasos:**

```bash
# 1. Iniciar servidor
npm run dev

# 2. Abrir navegador
http://localhost:3000/api/test
```

¡Listo! Ya puedes ver todos los endpoints disponibles y probarlos.

---

## 📝 Notas

- Las rutas de testing se deshabilitan automáticamente si `NODE_ENV=production`
- En el navegador verás JSON formateado
- Si una tabla está vacía, verás `[]`
- Si hay error de conexión, verifica que PostgreSQL esté corriendo

---

## 🔧 Solución de Problemas

### "Cannot connect"
```bash
# Verificar que el servidor esté corriendo
npm run dev
```

### "Cannot find module"
```bash
# Reinstalar dependencias
npm install
```

### "No se puede conectar a la base de datos"
```bash
# Verificar que PostgreSQL esté corriendo
# Verificar credenciales en .env
```

### "[]" (Array vacío)
```
Es normal. La tabla no tiene datos aún.
Inserta datos de prueba en la base de datos.
```

---

Para más detalles, consulta: [TESTING_ENDPOINTS.md](TESTING_ENDPOINTS.md)
