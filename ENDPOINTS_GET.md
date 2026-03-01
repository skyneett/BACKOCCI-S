# 🔍 ENDPOINTS GET - VERIFICACIÓN DE TABLAS

## Endpoints para verificar datos en todas las tablas

### 📋 AUTENTICACIÓN Y USUARIOS
```
GET http://localhost:3000/api/auth/profile
```

### 👥 ROLES Y PERMISOS
```
GET http://localhost:3000/api/roles
GET http://localhost:3000/api/permisos
GET http://localhost:3000/api/rol-permisos/rol/:idRol
GET http://localhost:3000/api/rol-permisos/permiso/:idPermiso
```

### 👨‍💼 CLIENTES
```
GET http://localhost:3000/api/clientes
GET http://localhost:3000/api/clientes/:id
GET http://localhost:3000/api/clientes/buscar?q=termino
```

### 👔 EMPLEADOS
```
GET http://localhost:3000/api/empleados
GET http://localhost:3000/api/empleados/:id
```

### 🏠 PROPIETARIOS
```
GET http://localhost:3000/api/propietarios
GET http://localhost:3000/api/propietarios/:id
```

### 🚚 PROVEEDORES
```
GET http://localhost:3000/api/proveedores
GET http://localhost:3000/api/proveedores/:id
GET http://localhost:3000/api/proveedor-servicios/proveedor/:idProveedor
GET http://localhost:3000/api/proveedor-servicios/servicio/:idServicio
```

### 🗺️ RUTAS TURÍSTICAS
```
GET http://localhost:3000/api/rutas
GET http://localhost:3000/api/rutas/:id
GET http://localhost:3000/api/rutas/activas
GET http://localhost:3000/api/rutas/buscar?q=termino
GET http://localhost:3000/api/rutas/dificultad/:dificultad
```

### 🏡 FINCAS
```
GET http://localhost:3000/api/fincas
GET http://localhost:3000/api/fincas/:id
```

### 🛎️ SERVICIOS
```
GET http://localhost:3000/api/servicios
GET http://localhost:3000/api/servicios/:id
```

### 📅 PROGRAMACIONES
```
GET http://localhost:3000/api/programaciones
GET http://localhost:3000/api/programaciones/:id
```

### 📝 RESERVAS
```
GET http://localhost:3000/api/reservas
GET http://localhost:3000/api/reservas/:id
GET http://localhost:3000/api/reservas/cliente/:idCliente
GET http://localhost:3000/api/reservas/buscar?q=termino
```

### 📋 DETALLES DE RESERVAS
```
# Programaciones
GET http://localhost:3000/api/detalle-reservas/programaciones/reserva/:idReserva
GET http://localhost:3000/api/detalle-reservas/programaciones/:idProgramacion/reservas

# Fincas
GET http://localhost:3000/api/detalle-reservas/fincas/reserva/:idReserva
GET http://localhost:3000/api/detalle-reservas/fincas/:idFinca/disponibilidad?fecha_checkin=2024-03-01&fecha_checkout=2024-03-03

# Servicios
GET http://localhost:3000/api/detalle-reservas/servicios/reserva/:idReserva
GET http://localhost:3000/api/detalle-reservas/servicios/mas-solicitados?limit=10

# Acompañantes
GET http://localhost:3000/api/detalle-reservas/acompanantes/reserva/:idReserva
GET http://localhost:3000/api/detalle-reservas/acompanantes/estadisticas
```

### 💰 VENTAS
```
GET http://localhost:3000/api/ventas
GET http://localhost:3000/api/ventas/:id
GET http://localhost:3000/api/ventas/buscar?q=termino
GET http://localhost:3000/api/ventas/estado/:estadoPago
GET http://localhost:3000/api/ventas/estadisticas
```

### 💸 PAGOS A PROVEEDORES
```
GET http://localhost:3000/api/pago-proveedores
GET http://localhost:3000/api/pago-proveedores/:id
GET http://localhost:3000/api/pago-proveedores/proveedor/:idProveedor
GET http://localhost:3000/api/pago-proveedores/pendientes
```

### 📊 DASHBOARD
```
GET http://localhost:3000/api/dashboard/estadisticas
GET http://localhost:3000/api/dashboard/reservas-mes?anio=2024
GET http://localhost:3000/api/dashboard/ventas-mes?anio=2024
GET http://localhost:3000/api/dashboard/rutas-top?limit=10
GET http://localhost:3000/api/dashboard/servicios-top?limit=10
GET http://localhost:3000/api/dashboard/clientes-top?limit=10
GET http://localhost:3000/api/dashboard/ocupacion
```

---

## 🧪 PRUEBAS RÁPIDAS EN POSTMAN/THUNDER CLIENT

### 1. Listar todas las tablas principales:
```
GET http://localhost:3000/api/roles
GET http://localhost:3000/api/permisos
GET http://localhost:3000/api/clientes
GET http://localhost:3000/api/empleados
GET http://localhost:3000/api/propietarios
GET http://localhost:3000/api/proveedores
GET http://localhost:3000/api/rutas
GET http://localhost:3000/api/fincas
GET http://localhost:3000/api/servicios
GET http://localhost:3000/api/programaciones
GET http://localhost:3000/api/reservas
GET http://localhost:3000/api/ventas
GET http://localhost:3000/api/pago-proveedores
```

### 2. Tablas intermedias y detalles:
```
GET http://localhost:3000/api/rol-permisos/rol/1
GET http://localhost:3000/api/proveedor-servicios/proveedor/1
GET http://localhost:3000/api/detalle-reservas/programaciones/reserva/1
GET http://localhost:3000/api/detalle-reservas/fincas/reserva/1
GET http://localhost:3000/api/detalle-reservas/servicios/reserva/1
GET http://localhost:3000/api/detalle-reservas/acompanantes/reserva/1
```

### 3. Estadísticas y reportes:
```
GET http://localhost:3000/api/dashboard/estadisticas
GET http://localhost:3000/api/detalle-reservas/servicios/mas-solicitados?limit=5
GET http://localhost:3000/api/detalle-reservas/acompanantes/estadisticas
GET http://localhost:3000/api/ventas/estadisticas
```

---

## 📝 NOTAS:
- Reemplaza `:id`, `:idRol`, `:idReserva`, etc. con IDs reales de tu base de datos
- Algunos endpoints requieren autenticación JWT (header: `Authorization: Bearer <token>`)
- Para obtener token: `POST http://localhost:3000/api/auth/login`
