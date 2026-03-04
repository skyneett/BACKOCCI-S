# Scripts SQL - Occitours

Esta carpeta contiene los scripts SQL para la base de datos de Occitours.

## Archivos disponibles

### 📄 schema_completo.sql
**Versión:** 3.0  
**Fecha:** 4 de marzo de 2026  
**Descripción:** Script completo de la base de datos con todas las tablas, índices y triggers.

**Contenido:**
- ✅ **22 tablas** del sistema
- ✅ **Nuevos campos en usuarios:** verificación de email y recuperación de contraseña
- ✅ **Nueva tabla:** tipo_proveedor para categorización de proveedores
- ✅ **Módulos:** Autenticación, Usuarios, Proveedores, Productos, Programación, Reservas, Ventas y Pagos
- ✅ **Índices** para optimización de consultas
- ✅ **Triggers automáticos:**
  - Generación de código QR único en reservas
  - Actualización automática de estados de venta y reserva al aprobar pagos
- ✅ **Comentarios** descriptivos en tablas y columnas
- ✅ **Restricciones** (CHECK, UNIQUE, NOT NULL, etc.)

**Uso:**
```bash
# Desde terminal con psql
psql -U postgres -d occitours -f database/schema_completo.sql

# Desde terminal sin autenticación previa
psql -U tu_usuario -h localhost -p 5432 -d occitours -f database/schema_completo.sql
```

**⚠️ ADVERTENCIA:**
Este script crea todas las tablas desde cero. Si ya tienes datos en la base de datos, asegúrate de hacer un respaldo antes de ejecutarlo.

---

### 📄 schema_pagos.sql
**Descripción:** Script incremental para agregar el sistema de pagos con QR y comprobantes.

**Contenido:**
- ✅ Modificación de tabla `reserva` (código QR)
- ✅ Creación de tabla `pago` (registro de abonos con comprobantes)
- ✅ Trigger para generar código QR automáticamente
- ✅ Trigger para actualizar estados de pago y reserva

**Uso:**
```bash
psql -U postgres -d occitours -f database/schema_pagos.sql
```

**Cuándo usar:**
- Si ya tienes la base de datos creada y solo necesitas agregar el sistema de pagos
- Para actualizar una base de datos existente sin perder información

---

### 📄 migration_v3.sql
**Versión:** 3.0  
**Fecha:** 4 de marzo de 2026  
**Descripción:** Migración incremental de v2.0 a v3.0

**Contenido:**
- ✅ Agrega campos de verificación de email a tabla `usuarios`
- ✅ Agrega campos de recuperación de contraseña a tabla `usuarios`
- ✅ Crea tabla `tipo_proveedor`
- ✅ Migra datos de `tipo_servicio` a `id_tipo` en `proveedores`
- ✅ Inserta tipos de proveedor iniciales
- ✅ Scripts de verificación

**Uso:**
```bash
psql -U postgres -d occitours -f database/migration_v3.sql
```

**Cuándo usar:**
- Si tienes la versión 2.0 y quieres actualizar a 3.0 sin perder datos
- Migra automáticamente los datos existentes de proveedores

---

### 📄 seed_tipo_proveedor.sql
**Descripción:** Datos iniciales para la tabla tipo_proveedor

**Contenido:**
- Transporte
- Alimentación
- Guía
- Hospedaje
- Equipamiento
- Entretenimiento

**Uso:**
```bash
psql -U postgres -d occitours -f database/seed_tipo_proveedor.sql
```

**Cuándo usar:**
- Al instalar la base de datos por primera vez
- Si necesitas restaurar los tipos de proveedor básicos

---

## Flujo recomendado

### 🆕 Base de datos nueva (v3.0)
Si estás creando la base de datos por primera vez:

1. Ejecuta `schema_completo.sql` (contiene todo el sistema completo v3.0)
2. Ejecuta `seed_tipo_proveedor.sql` (opcional, inserta tipos de proveedor básicos)
3. Listo! Ya tienes todas las tablas, triggers e índices

### 🔄 Actualizar desde v2.0 a v3.0
Si ya tienes la base de datos v2.0:

1. **Haz un respaldo de tu base de datos** ⚠️
   ```bash
   pg_dump -U postgres -d occitours -F c -f backup_v2_$(date +%Y%m%d).backup
   ```
2. Ejecuta `migration_v3.sql` (migra datos automáticamente)
3. Verifica que todo funcionó correctamente

### 🔄 Solo agregar sistema de pagos (v2.0)
Si tienes una versión anterior y solo quieres el sistema de pagos:

1. Haz un respaldo de tu base de datos
2. Ejecuta `schema_pagos.sql` (solo agrega las mejoras de pago)

---

## Estructura de la base de datos

### Módulos

#### 1️⃣ Autenticación y Autorización
- `roles` - Catálogo de roles (Admin, Empleado, Cliente)
- `permisos` - Permisos disponibles
- `rol_permiso` - Relación roles-permisos

#### 2️⃣ Usuarios
- `usuarios` - Credenciales de login (correo + contraseña + verificación de email)
- `cliente` - Información de clientes
- `empleado` - Información de empleados

#### 3️⃣ Propietarios y Proveedores
- `propietario` - Dueños de fincas
- `tipo_proveedor` - Catálogo de tipos de proveedores (Transporte, Alimentación, etc.)
- `proveedores` - Proveedores de servicios
- `detalle_proveedor_servicio` - Servicios que ofrece cada proveedor

#### 4️⃣ Productos y Servicios
- `ruta` - Rutas turísticas
- `finca` - Fincas para hospedaje
- `servicio` - Servicios adicionales

#### 5️⃣ Programación
- `programacion` - Programación de rutas con fechas y cupos

#### 6️⃣ Reservas
- `reserva` - Reservas de clientes (incluye código QR)
- `detalle_reserva_programacion` - Rutas incluidas en la reserva
- `detalle_reserva_finca` - Fincas incluidas en la reserva
- `detalle_reserva_servicio` - Servicios adicionales
- `detalle_reserva_acompanante` - Acompañantes del cliente

#### 7️⃣ Ventas y Pagos
- `venta` - Resumen financiero de la reserva (monto total, pagado, saldo)
- `pago` - Registro individual de cada abono con comprobante
- `pago_proveedor` - Pagos a proveedores

---

## Triggers automáticos

### 🔄 trigger_generar_codigo_qr
**Tabla:** `reserva`  
**Evento:** BEFORE INSERT  
**Función:** Genera automáticamente un código QR único al crear una reserva

**Formato del código:**
```
QR-00000123-20260216154530
   └─ ID  └─ Timestamp
```

---

### 🔄 trigger_actualizar_estado_venta
**Tabla:** `pago`  
**Evento:** AFTER INSERT OR UPDATE OF estado  
**Función:** Cuando se aprueba un pago, actualiza automáticamente:

1. **Tabla venta:**
   - `monto_pagado` = suma de todos los pagos aprobados
   - `saldo_pendiente` = monto_total - monto_pagado
   - `estado_pago` = 'Pendiente' | 'Parcial' | 'Pagado'

2. **Tabla reserva:**
   - `estado` = 'Confirmada' (cuando hay al menos un pago aprobado)

**Estados de pago:**
- `Pendiente`: No se ha verificado el comprobante
- `Verificado`: Empleado revisó el comprobante
- `Aprobado`: Pago confirmado ✅ (activa el trigger)
- `Rechazado`: Comprobante inválido

---

## Nuevas funcionalidades v3.0

### 📧 Verificación de Email
La tabla `usuarios` ahora incluye campos para verificar el correo electrónico:

**Campos agregados:**
- `email_verified_at`: Fecha de verificación del correo
- `verification_token`: Token único para verificación
- `verification_token_expires_at`: Expiración del token

**Flujo de verificación:**
1. Usuario se registra → se genera `verification_token`
2. Sistema envía email con link de verificación
3. Usuario hace clic → se actualiza `email_verified_at`
4. Token expira después de cierto tiempo

### 🔐 Recuperación de Contraseña
Campos para resetear contraseña de forma segura:

**Campos agregados:**
- `password_reset_token`: Token único para resetear contraseña
- `password_reset_token_expires_at`: Expiración del token

**Flujo de recuperación:**
1. Usuario solicita resetear contraseña → se genera `password_reset_token`
2. Sistema envía email con link de recuperación
3. Usuario hace clic y establece nueva contraseña
4. Token se invalida después de usarse o expirar

### 🏷️ Tipos de Proveedor
Ahora los proveedores se categorizan mediante la tabla `tipo_proveedor`:

**Ventajas:**
- ✅ Categorización estandarizada
- ✅ Fácil agregar nuevos tipos
- ✅ Integridad referencial
- ✅ Mejor consultas y reportes

**Tipos incluidos por defecto:**
- Transporte
- Alimentación
- Guía
- Hospedaje
- Equipamiento
- Entretenimiento

---

## Respaldo de la base de datos

### Crear respaldo
```bash
# Respaldo completo
pg_dump -U postgres -d occitours -F c -f backup_occitours.backup

# Respaldo solo estructura
pg_dump -U postgres -d occitours -s -f backup_schema.sql

# Respaldo solo datos
pg_dump -U postgres -d occitours -a -f backup_data.sql
```

### Restaurar respaldo
```bash
# Desde archivo .backup
pg_restore -U postgres -d occitours backup_occitours.backup

# Desde archivo .sql
psql -U postgres -d occitours -f backup_schema.sql
```

---

## Verificación después de ejecutar

```sql
-- Ver todas las tablas creadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Ver triggers creados
SELECT trigger_name, event_object_table, action_timing, event_manipulation
FROM information_schema.triggers
WHERE trigger_schema = 'public';

-- Ver índices creados
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

---

## Soporte

Para más información sobre el flujo de pagos con QR, consulta:
- 📘 [FLUJO_PAGOS_QR.md](../FLUJO_PAGOS_QR.md)

Para ver todos los endpoints disponibles:
- 📗 [API_ENDPOINTS.md](../API_ENDPOINTS.md)
- 📙 [ENDPOINTS_GET.md](../ENDPOINTS_GET.md)
