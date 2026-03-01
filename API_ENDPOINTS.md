# 📚 API ENDPOINTS - Occitours Backend MVC

## 🔐 Autenticación

### **POST** `/api/auth/login`
Iniciar sesión
```json
{
  "correo": "admin@occitours.com",
  "contrasena": "password123"
}
```

### **POST** `/api/auth/register`
Registrar nuevo cliente
```json
{
  "correo": "cliente@email.com",
  "contrasena": "password123",
  "nombre": "Juan",
  "apellido": "Pérez",
  "tipo_documento": "CC",
  "numero_documento": "1234567890",
  "telefono": "3001234567"
}
```

### **GET** `/api/auth/profile`
Obtener perfil del usuario autenticado
- Requiere: Token JWT

### **PUT** `/api/auth/cambiar-contrasena`
Cambiar contraseña
- Requiere: Token JWT

---

## 👥 Roles y Permisos

### Roles
- **GET** `/api/roles` - Listar todos
- **GET** `/api/roles/:id` - Obtener por ID
- **POST** `/api/roles` - Crear
- **PUT** `/api/roles/:id` - Actualizar
- **DELETE** `/api/roles/:id` - Eliminar

### Permisos
- **GET** `/api/permisos` - Listar todos
- **GET** `/api/permisos/:id` - Obtener por ID
- **POST** `/api/permisos` - Crear
- **PUT** `/api/permisos/:id` - Actualizar
- **DELETE** `/api/permisos/:id` - Eliminar

### Rol-Permisos (Relación)
- **GET** `/api/rol-permisos/rol/:idRol` - Permisos de un rol
- **GET** `/api/rol-permisos/permiso/:idPermiso` - Roles con un permiso
- **POST** `/api/rol-permisos` - Asignar permiso a rol
- **DELETE** `/api/rol-permisos/rol/:idRol/permiso/:idPermiso` - Remover permiso de rol

---

## 👨‍💼 Clientes

- **GET** `/api/clientes` - Listar todos
- **GET** `/api/clientes/buscar?q=termino` - Buscar clientes
- **GET** `/api/clientes/:id` - Obtener por ID
- **POST** `/api/clientes` - Crear
- **PUT** `/api/clientes/:id` - Actualizar
- **DELETE** `/api/clientes/:id` - Eliminar

---

## 👔 Empleados

- **GET** `/api/empleados` - Listar todos
- **GET** `/api/empleados/:id` - Obtener por ID
- **POST** `/api/empleados` - Crear
- **PUT** `/api/empleados/:id` - Actualizar
- **DELETE** `/api/empleados/:id` - Eliminar

---

## 🏠 Propietarios

- **GET** `/api/propietarios` - Listar todos
- **GET** `/api/propietarios/:id` - Obtener por ID
- **POST** `/api/propietarios` - Crear
- **PUT** `/api/propietarios/:id` - Actualizar
- **DELETE** `/api/propietarios/:id` - Eliminar

---

## 🚚 Proveedores

- **GET** `/api/proveedores` - Listar todos
- **GET** `/api/proveedores/:id` - Obtener por ID
- **POST** `/api/proveedores` - Crear
- **PUT** `/api/proveedores/:id` - Actualizar
- **DELETE** `/api/proveedores/:id` - Eliminar

### Proveedor-Servicios (Relación)
- **GET** `/api/proveedor-servicios/proveedor/:idProveedor` - Servicios de un proveedor
- **GET** `/api/proveedor-servicios/servicio/:idServicio` - Proveedores de un servicio
- **GET** `/api/proveedor-servicios/:id` - Detalle específico
- **POST** `/api/proveedor-servicios` - Asignar servicio a proveedor

---

## 🗺️ Rutas Turísticas

- **GET** `/api/rutas` - Listar todas
- **GET** `/api/rutas/activas` - Listar activas (público)
- **GET** `/api/rutas/buscar?q=termino` - Buscar
- **GET** `/api/rutas/dificultad/:dificultad` - Por dificultad
- **GET** `/api/rutas/:id` - Obtener por ID
- **POST** `/api/rutas` - Crear
- **PUT** `/api/rutas/:id` - Actualizar
- **DELETE** `/api/rutas/:id` - Eliminar

---

## 🏡 Fincas

- **GET** `/api/fincas` - Listar todas
- **GET** `/api/fincas/:id` - Obtener por ID
- **POST** `/api/fincas` - Crear
- **PUT** `/api/fincas/:id` - Actualizar
- **DELETE** `/api/fincas/:id` - Eliminar

---

## 🛎️ Servicios

- **GET** `/api/servicios` - Listar todos
- **GET** `/api/servicios/:id` - Obtener por ID
- **POST** `/api/servicios` - Crear
- **PUT** `/api/servicios/:id` - Actualizar
- **DELETE** `/api/servicios/:id` - Eliminar

---

## 📅 Programaciones

- **GET** `/api/programaciones` - Listar todas
- **GET** `/api/programaciones/:id` - Obtener por ID
- **POST** `/api/programaciones` - Crear
- **PUT** `/api/programaciones/:id` - Actualizar
- **DELETE** `/api/programaciones/:id` - Eliminar

---

## 📝 Reservas

### Operaciones Básicas
- **GET** `/api/reservas` - Listar todas
- **GET** `/api/reservas/buscar?q=termino` - Buscar
- **GET** `/api/reservas/cliente/:idCliente` - Por cliente
- **GET** `/api/reservas/:id` - Obtener por ID (con detalles completos)
- **POST** `/api/reservas` - Crear
- **PUT** `/api/reservas/:id` - Actualizar
- **POST** `/api/reservas/:id/cancelar` - Cancelar
- **DELETE** `/api/reservas/:id` - Eliminar

### Agregar Detalles
- **POST** `/api/reservas/:id/programacion` - Agregar programación
```json
{
  "id_programacion": 1,
  "cantidad_personas": 2,
  "precio_unitario": 150000
}
```

- **POST** `/api/reservas/:id/finca` - Agregar finca
```json
{
  "id_finca": 1,
  "fecha_checkin": "2024-03-01",
  "fecha_checkout": "2024-03-03",
  "numero_noches": 2,
  "precio_por_noche": 100000
}
```

- **POST** `/api/reservas/:id/servicio` - Agregar servicio
```json
{
  "id_servicio": 1,
  "cantidad": 2,
  "precio_unitario": 50000
}
```

- **POST** `/api/reservas/:id/acompanante` - Agregar acompañante
```json
{
  "nombre": "María",
  "apellido": "González",
  "tipo_documento": "CC",
  "numero_documento": "9876543210",
  "telefono": "3009876543"
}
```

---

## � Detalles de Reservas

### Programaciones
- **GET** `/api/detalle-reservas/programaciones/reserva/:idReserva` - Programaciones de una reserva
- **GET** `/api/detalle-reservas/programaciones/:idProgramacion/reservas` - Reservas de una programación

### Fincas
- **GET** `/api/detalle-reservas/fincas/reserva/:idReserva` - Fincas de una reserva
- **GET** `/api/detalle-reservas/fincas/:idFinca/disponibilidad?fecha_checkin=2024-03-01&fecha_checkout=2024-03-03` - Verificar disponibilidad

### Servicios
- **GET** `/api/detalle-reservas/servicios/reserva/:idReserva` - Servicios de una reserva
- **GET** `/api/detalle-reservas/servicios/mas-solicitados?limit=10` - Servicios más solicitados

### Acompañantes
- **GET** `/api/detalle-reservas/acompanantes/reserva/:idReserva` - Acompañantes de una reserva
- **GET** `/api/detalle-reservas/acompanantes/estadisticas` - Estadísticas por edad

---

## 💰 Ventas

- **GET** `/api/ventas` - Listar todas
- **GET** `/api/ventas/estadisticas` - Estadísticas generales
- **GET** `/api/ventas/buscar?q=termino` - Buscar
- **GET** `/api/ventas/estado/:estadoPago` - Por estado (Pendiente, Parcial, Pagado)
- **GET** `/api/ventas/:id` - Obtener por ID
- **POST** `/api/ventas` - Crear
- **POST** `/api/ventas/:id/pago` - Registrar pago
```json
{
  "monto_pago": 100000,
  "metodo_pago": "Tarjeta"
}
```
- **PUT** `/api/ventas/:id` - Actualizar
- **POST** `/api/ventas/:id/cancelar` - Cancelar

---

## 💸 Pagos a Proveedores

- **GET** `/api/pago-proveedores` - Listar todos los pagos
- **GET** `/api/pago-proveedores/pendientes` - Pagos pendientes
- **GET** `/api/pago-proveedores/:id` - Obtener pago por ID
- **GET** `/api/pago-proveedores/proveedor/:idProveedor` - Pagos de un proveedor
- **POST** `/api/pago-proveedores` - Crear pago
```json
{
  "id_proveedores": 1,
  "observaciones": "Pago servicios enero 2024",
  "monto": 500000,
  "fecha_pago": "2024-01-31",
  "metodo_pago": "Transferencia",
  "numero_transaccion": "TRX123456"
}
```
- **GET** `/api/ventas/buscar?q=termino` - Buscar
- **GET** `/api/ventas/estado/:estadoPago` - Por estado (Pendiente, Parcial, Pagado)
- **GET** `/api/ventas/:id` - Obtener por ID
- **POST** `/api/ventas` - Crear
- **POST** `/api/ventas/:id/pago` - Registrar pago
```json
{
  "monto_pago": 100000,
  "metodo_pago": "Tarjeta"
}
```
- **PUT** `/api/ventas/:id` - Actualizar
- **POST** `/api/ventas/:id/cancelar` - Cancelar

---

## 📊 Dashboard

- **GET** `/api/dashboard/estadisticas` - Estadísticas generales
```json
{
  "reservas_confirmadas": 45,
  "reservas_pendientes": 12,
  "clientes_activos": 150,
  "programaciones_activas": 20,
  "ingresos_totales": 15000000,
  "saldo_pendiente_total": 2500000
}
```

- **GET** `/api/dashboard/reservas-mes?anio=2024` - Reservas por mes
- **GET** `/api/dashboard/ventas-mes?anio=2024` - Ventas por mes
- **GET** `/api/dashboard/rutas-top?limit=10` - Rutas más vendidas
- **GET** `/api/dashboard/servicios-top?limit=10` - Servicios más solicitados
- **GET** `/api/dashboard/clientes-top?limit=10` - Clientes top
- **GET** `/api/dashboard/ocupacion` - Ocupación de programaciones

---

## 🔑 Autenticación de Endpoints

### Público (sin token)
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/rutas/activas`
- `GET /api/rutas/buscar`
- `GET /api/rutas/dificultad/:dificultad`

### Requiere Token JWT
Todas las demás rutas requieren incluir el token en el header:
```
Authorization: Bearer <token>
```

### Roles Requeridos

**Solo Admin:**
- Roles CRUD completo
- Permisos CRUD completo
- Empleados CRUD completo
- Eliminar cualquier recurso

**Admin y Empleado:**
- Crear y actualizar: Clientes, Propietarios, Proveedores, Rutas, Fincas, Servicios, Programaciones
- Gestión completa de Reservas y Ventas

**Admin, Empleado y Cliente:**
- Crear reservas
- Cancelar sus propias reservas
- Agregar acompañantes

---

## 📝 Notas de Uso

1. **Tokens JWT**: Expiran según configuración (default: 5 minutos)
2. **Paginación**: No implementada en esta versión (agregar con `LIMIT` y `OFFSET` si es necesario)
3. **Validaciones**: Implementadas en controladores
4. **Transacciones**: Implementar para operaciones críticas (crear reserva con detalles)
5. **Logs**: Registrar en archivo para auditoría

---

## 🚀 Flujo de Uso Común

### 1. Registro y Login
```
POST /api/auth/register → Obtener token
POST /api/auth/login → Renovar token
```

### 2. Crear Reserva Completa
```
POST /api/reservas → Crear reserva base
POST /api/reservas/:id/programacion → Agregar ruta
POST /api/reservas/:id/finca → Agregar hospedaje
POST /api/reservas/:id/servicio → Agregar servicios
POST /api/reservas/:id/acompanante → Agregar acompañantes
```

### 3. Gestión de Venta
```
POST /api/ventas → Crear venta (asociada a reserva)
POST /api/ventas/:id/pago → Registrar pago inicial
POST /api/ventas/:id/pago → Registrar abono
```

### 4. Consulta de Estadísticas
```
GET /api/dashboard/estadisticas → Vista general
GET /api/dashboard/ventas-mes → Análisis mensual
GET /api/dashboard/rutas-top → Más populares
```
