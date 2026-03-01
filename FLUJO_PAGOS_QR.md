# 💰 SISTEMA DE PAGOS CON QR Y COMPROBANTES

## 📋 Estructura de Base de Datos

### 1. **Tabla `reserva`** (Modificada)
```sql
-- Campos agregados:
codigo_qr VARCHAR(100) UNIQUE        -- Código único para QR (generado automáticamente)
qr_generado BOOLEAN DEFAULT false    -- Indica si ya se generó el QR
fecha_generacion_qr TIMESTAMP        -- Fecha de generación del QR
```

### 2. **Tabla `venta`** (Existente)
Mantiene el total y resumen de pagos:
- `monto_total` - Total de la reserva
- `monto_pagado` - Suma de abonos aprobados
- `saldo_pendiente` - Diferencia
- `estado_pago` - 'Pendiente', 'Parcial', 'Pagado'

### 3. **Tabla `pago`** (Nueva)
Registra cada abono individual con comprobante:
```sql
id_pago SERIAL PRIMARY KEY
id_venta INTEGER           -- FK a venta
id_reserva INTEGER         -- FK a reserva
monto DECIMAL(10, 2)       -- Monto del abono
metodo_pago VARCHAR(50)    -- 'Transferencia', 'QR', 'PSE', etc.
numero_transaccion VARCHAR -- Número de referencia

-- Comprobante
comprobante_url TEXT       -- URL del archivo (imagen o PDF)
comprobante_nombre VARCHAR -- Nombre del archivo
comprobante_tipo VARCHAR   -- MIME type (image/jpeg, application/pdf)

-- Estado y verificación
estado VARCHAR(20)         -- 'Pendiente', 'Verificado', 'Aprobado', 'Rechazado'
verificado_por INTEGER     -- FK a empleado que verificó
fecha_verificacion TIMESTAMP
observaciones TEXT
motivo_rechazo TEXT        -- Si fue rechazado

fecha_pago TIMESTAMP
```

---

## 🔄 FLUJO COMPLETO DEL PROCESO

### PASO 1: Cliente hace la reserva
```http
POST /api/reservas
{
  "id_cliente": 1,
  "notas": "Reserva para 2 personas"
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id_reserva": 5,
    "codigo_qr": "QR-00000005-20260216194530",  // ✅ Generado automáticamente
    "estado": "Pendiente",
    "monto_total": 0
  }
}
```

### PASO 2: Se agregan servicios/programaciones a la reserva
```http
POST /api/reservas/5/programacion
{
  "id_programacion": 1,
  "cantidad_personas": 2,
  "precio_unitario": 150000
}
```

### PASO 3: Se calcula el total y se crea la venta
```http
POST /api/ventas
{
  "id_reserva": 5,
  "monto_total": 300000,
  "monto_pagado": 0,
  "metodo_pago": "Pendiente"
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id_venta": 10,
    "monto_total": 300000,
    "monto_pagado": 0,
    "saldo_pendiente": 300000,
    "estado_pago": "Pendiente"
  }
}
```

---

### PASO 4: Cliente visualiza el QR y hace el pago

**Frontend muestra:**
- Código QR generado con: `codigo_qr = "QR-00000005-20260216194530"`
- Monto total: $300,000
- Datos bancarios o método de pago

**Cliente:**
1. Escanea el QR o usa el código manualmente
2. Realiza transferencia/pago
3. Toma captura del comprobante

---

### PASO 5: Cliente sube el comprobante de pago

```http
POST /api/pagos
{
  "id_venta": 10,
  "id_reserva": 5,
  "monto": 150000,                           // Abono parcial
  "metodo_pago": "Transferencia",
  "numero_transaccion": "TRX123456789",
  "comprobante_url": "https://storage.../comprobante1.jpg",
  "comprobante_nombre": "comprobante_pago.jpg",
  "comprobante_tipo": "image/jpeg",
  "observaciones": "Primer abono del 50%"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Pago registrado correctamente. Pendiente de verificación.",
  "data": {
    "id_pago": 15,
    "estado": "Pendiente",
    "monto": 150000,
    "comprobante_url": "https://storage.../comprobante1.jpg"
  }
}
```

**Estado actual:**
- Pago: `estado = 'Pendiente'` ⏳
- Venta: `estado_pago = 'Pendiente'` (no cambia hasta aprobar)
- Reserva: `estado = 'Pendiente'`

---

### PASO 6: Empleado verifica y aprueba el comprobante

**Listar pagos pendientes:**
```http
GET /api/pagos/pendientes
```

**Revisar comprobante:**
```http
GET /api/pagos/15
```

**Aprobar pago:**
```http
PATCH /api/pagos/15/verificar
{
  "id_empleado": 3,
  "estado": "Aprobado",
  "observaciones": "Pago verificado correctamente"
}
```

**❗ AL APROBAR, EL TRIGGER ACTUALIZA AUTOMÁTICAMENTE:**

1. **Tabla `venta`:**
   ```sql
   monto_pagado = 150000         (suma de pagos aprobados)
   saldo_pendiente = 150000       (300000 - 150000)
   estado_pago = 'Parcial'        (porque falta saldo)
   ```

2. **Tabla `reserva`:**
   ```sql
   estado = 'Confirmada'          (cambió porque hay pago parcial/completo)
   ```

---

### PASO 7: Cliente hace segundo abono (completa el pago)

```http
POST /api/pagos
{
  "id_venta": 10,
  "id_reserva": 5,
  "monto": 150000,                          // Segundo abono
  "metodo_pago": "Transferencia",
  "numero_transaccion": "TRX987654321",
  "comprobante_url": "https://storage.../comprobante2.jpg",
  "comprobante_nombre": "segundo_abono.jpg",
  "comprobante_tipo": "image/jpeg"
}
```

### PASO 8: Empleado aprueba segundo pago

```http
PATCH /api/pagos/16/verificar
{
  "id_empleado": 3,
  "estado": "Aprobado"
}
```

**✅ RESULTADO FINAL:**

1. **Tabla `venta`:**
   ```sql
   monto_pagado = 300000         (150000 + 150000)
   saldo_pendiente = 0
   estado_pago = 'Pagado'        ✅
   ```

2. **Tabla `reserva`:**
   ```sql
   estado = 'Confirmada'         ✅
   ```

---

## 📊 CONSULTAS ÚTILES

### Ver todos los pagos de una reserva
```http
GET /api/pagos/reserva/5
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id_pago": 15,
      "monto": 150000,
      "estado": "Aprobado",
      "metodo_pago": "Transferencia",
      "comprobante_url": "...",
      "fecha_pago": "2026-02-16T10:30:00Z"
    },
    {
      "id_pago": 16,
      "monto": 150000,
      "estado": "Aprobado",
      "metodo_pago": "Transferencia",
      "comprobante_url": "...",
      "fecha_pago": "2026-02-17T15:45:00Z"
    }
  ]
}
```

### Ver resumen de pagos de una venta
```http
GET /api/pagos/venta/10/resumen
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "total_pagos": 2,
    "total_aprobado": 300000,
    "total_pendiente": 0,
    "total_rechazado": 0
  }
}
```

### Ver pagos pendientes de verificación
```http
GET /api/pagos/pendientes
```

---

## 🚫 RECHAZO DE COMPROBANTES

Si el comprobante es inválido:

```http
PATCH /api/pagos/15/verificar
{
  "id_empleado": 3,
  "estado": "Rechazado",
  "motivo_rechazo": "Comprobante ilegible. Por favor subir imagen más clara."
}
```

**Efecto:**
- El pago queda rechazado
- NO se actualiza la venta (monto_pagado no cambia)
- El cliente debe subir un nuevo comprobante

---

## 🔐 ESTADOS DEL SISTEMA

### Estados de Pago (`pago.estado`)
- ⏳ **Pendiente**: Esperando verificación
- 🔍 **Verificado**: Revisado pero no aprobado aún
- ✅ **Aprobado**: Confirmado y aplicado a la venta
- ❌ **Rechazado**: Comprobante inválido

### Estados de Venta (`venta.estado_pago`)
- ⏳ **Pendiente**: Sin pagos aprobados
- 💰 **Parcial**: Hay abonos pero falta saldo
- ✅ **Pagado**: Total pagado completo

### Estados de Reserva (`reserva.estado`)
- ⏳ **Pendiente**: Sin confirmar
- ✅ **Confirmada**: Con pago parcial o completo
- ✈️ **Completada**: Servicio realizado
- ❌ **Cancelada**: Reserva cancelada

---

## 💡 VENTAJAS DE ESTE SISTEMA

1. ✅ **Trazabilidad completa**: Cada abono queda registrado
2. ✅ **Comprobantes adjuntos**: Prueba de cada pago
3. ✅ **Verificación manual**: Control de calidad
4. ✅ **Pagos parciales**: Permite abonos
5. ✅ **QR único por reserva**: Fácil identificación
6. ✅ **Actualización automática**: Triggers mantienen consistencia
7. ✅ **Historial de pagos**: Auditoría completa

---

## 📱 INTEGRACIÓN EN FRONTEND

### Generar QR visual
```javascript
// Usar librería como qrcode.js
import QRCode from 'qrcode';

const codigoQR = reserva.codigo_qr; // "QR-00000005-20260216194530"
const qrDataURL = await QRCode.toDataURL(codigoQR);

// Mostrar imagen QR al cliente
<img src={qrDataURL} alt="QR de pago" />
```

### Subir comprobante
```javascript
const formData = new FormData();
formData.append('file', archivoComprobante);

// 1. Subir archivo a storage (S3, Cloudinary, etc.)
const uploadResponse = await uploadFile(formData);

// 2. Registrar pago con URL del comprobante
const pagoData = {
  id_venta: 10,
  id_reserva: 5,
  monto: 150000,
  metodo_pago: 'Transferencia',
  comprobante_url: uploadResponse.url,
  comprobante_nombre: archivoComprobante.name,
  comprobante_tipo: archivoComprobante.type
};

await fetch('/api/pagos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(pagoData)
});
```

---

## 🛠️ EJECUCIÓN DEL SCRIPT SQL

```bash
# Ejecutar el script de migraciones
psql -U postgres -d occitours -f database/schema_pagos.sql
```

O desde pgAdmin, ejecuta el contenido del archivo [database/schema_pagos.sql](../database/schema_pagos.sql)
