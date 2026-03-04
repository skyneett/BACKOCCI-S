-- =====================================================
-- OCCITOURS - SCHEMA COMPLETO DE BASE DE DATOS
-- =====================================================
-- Versión: 3.0
-- Fecha: 4 de marzo de 2026
-- Base de datos: PostgreSQL 12+
-- Actualización: Nuevos campos en usuarios, tabla tipo_proveedor
-- =====================================================
-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

-- Eliminar base de datos si existe (CUIDADO EN PRODUCCIÓN)
-- DROP DATABASE IF EXISTS occitours;

-- Crear base de datos
-- CREATE DATABASE occitours WITH ENCODING 'UTF8';

-- Conectar a la base de datos
-- \c occitours;

-- =====================================================
-- MÓDULO DE AUTENTICACIÓN Y AUTORIZACIÓN
-- =====================================================

-- Tabla: roles
CREATE TABLE IF NOT EXISTS roles (
    id_roles SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    estado BOOLEAN DEFAULT true, -- true=activo, false=inactivo
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: permisos
CREATE TABLE IF NOT EXISTS permisos (
    id_permisos SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: rol_permiso (relación muchos a muchos)
CREATE TABLE IF NOT EXISTS rol_permiso (
    id_rol_permiso SERIAL PRIMARY KEY,
    id_roles INTEGER NOT NULL REFERENCES roles(id_roles) ON DELETE CASCADE,
    id_permisos INTEGER NOT NULL REFERENCES permisos(id_permisos) ON DELETE CASCADE,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_roles, id_permisos)
);

-- =====================================================
-- MÓDULO DE USUARIOS
-- =====================================================

-- Tabla: usuarios (autenticación - solo login)
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuarios SERIAL PRIMARY KEY,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL, -- hash bcrypt
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    email_verified_at TIMESTAMP,
    verification_token VARCHAR(255),
    verification_token_expires_at TIMESTAMP,
    password_reset_token VARCHAR(255),
    password_reset_token_expires_at TIMESTAMP
);

-- Tabla: cliente
CREATE TABLE IF NOT EXISTS cliente (
    id_cliente SERIAL PRIMARY KEY,
    id_usuarios INTEGER NOT NULL UNIQUE REFERENCES usuarios(id_usuarios) ON DELETE CASCADE,
    id_roles INTEGER REFERENCES roles(id_roles),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    tipo_documento VARCHAR(20), -- 'CC', 'TI', 'CE', 'Pasaporte'
    numero_documento VARCHAR(50) UNIQUE,
    telefono VARCHAR(20),
    direccion TEXT,
    fecha_nacimiento DATE,
    estado BOOLEAN DEFAULT true, -- true=activo, false=inactivo
    ultimo_acceso TIMESTAMP,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: empleado
CREATE TABLE IF NOT EXISTS empleado (
    id_empleado SERIAL PRIMARY KEY,
    id_usuarios INTEGER NOT NULL UNIQUE REFERENCES usuarios(id_usuarios) ON DELETE CASCADE,
    id_roles INTEGER REFERENCES roles(id_roles),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    tipo_documento VARCHAR(20),
    numero_documento VARCHAR(50) UNIQUE,
    telefono VARCHAR(20),
    cargo VARCHAR(50),
    fecha_contratacion DATE,
    estado BOOLEAN DEFAULT true, -- true=activo, false=inactivo
    ultimo_acceso TIMESTAMP,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- MÓDULO DE PROPIETARIOS Y PROVEEDORES
-- =====================================================

-- Tabla: propietario
CREATE TABLE IF NOT EXISTS propietario (
    id_propietario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100),
    tipo_documento VARCHAR(20),
    numero_documento VARCHAR(50) UNIQUE,
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion TEXT,
    estado BOOLEAN DEFAULT true, -- true=activo, false=inactivo
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: tipo_proveedor
CREATE TABLE IF NOT EXISTS tipo_proveedor (
    id_tipo SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE, -- 'Transporte', 'Alimentación', 'Guía', 'Hospedaje'
    descripcion TEXT,
    estado BOOLEAN DEFAULT true -- true=activo, false=inactivo
);

-- Tabla: proveedores
CREATE TABLE IF NOT EXISTS proveedores (
    id_proveedores SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    id_tipo INTEGER NOT NULL REFERENCES tipo_proveedor(id_tipo),
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion TEXT,
    estado BOOLEAN DEFAULT true, -- true=activo, false=inactivo
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- MÓDULO DE PRODUCTOS Y SERVICIOS
-- =====================================================

-- Tabla: ruta
CREATE TABLE IF NOT EXISTS ruta (
    id_ruta SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    duracion_dias INTEGER, -- duración en días
    precio_base DECIMAL(10, 2),
    dificultad VARCHAR(20), -- 'Fácil', 'Moderada', 'Difícil'
    imagen_url TEXT,
    estado BOOLEAN DEFAULT true, -- true=activo, false=inactivo
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: finca
CREATE TABLE IF NOT EXISTS finca (
    id_finca SERIAL PRIMARY KEY,
    id_propietario INTEGER REFERENCES propietario(id_propietario),
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    direccion TEXT,
    ubicacion VARCHAR(200), -- coordenadas o ciudad
    capacidad_personas INTEGER,
    precio_por_noche DECIMAL(10, 2),
    imagen_principal TEXT,
    estado BOOLEAN DEFAULT true, -- true=activo, false=inactivo
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: servicio
CREATE TABLE IF NOT EXISTS servicio (
    id_servicio SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2),
    imagen_url TEXT,
    estado BOOLEAN DEFAULT true, -- true=disponible, false=no disponible
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: detalle_proveedor_servicio
-- Relaciona proveedores con servicios (muchos a muchos)
CREATE TABLE IF NOT EXISTS detalle_proveedor_servicio (
    id_detalle_proveedor_servicio SERIAL PRIMARY KEY,
    id_proveedores INTEGER NOT NULL REFERENCES proveedores(id_proveedores) ON DELETE CASCADE,
    id_servicio INTEGER NOT NULL REFERENCES servicio(id_servicio) ON DELETE CASCADE,
    precio_proveedor DECIMAL(10, 2), -- Precio específico de este proveedor para el servicio
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_proveedores, id_servicio)
);

-- =====================================================
-- MÓDULO DE PROGRAMACIÓN
-- =====================================================

-- Tabla: programacion
CREATE TABLE IF NOT EXISTS programacion (
    id_programacion SERIAL PRIMARY KEY,
    id_ruta INTEGER NOT NULL REFERENCES ruta(id_ruta),
    id_empleado INTEGER REFERENCES empleado(id_empleado),
    fecha_salida DATE NOT NULL,
    fecha_regreso DATE NOT NULL,
    cupos_totales INTEGER NOT NULL,
    cupos_disponibles INTEGER NOT NULL,
    precio_programacion DECIMAL(10, 2), -- puede diferir del precio base
    estado VARCHAR(20) DEFAULT 'Programado', -- 'Programado', 'En progreso', 'Completado', 'Cancelado'
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (cupos_disponibles <= cupos_totales),
    CHECK (fecha_regreso >= fecha_salida)
);

-- =====================================================
-- MÓDULO DE RESERVAS (CON QR)
-- =====================================================

-- Tabla: reserva
CREATE TABLE IF NOT EXISTS reserva (
    id_reserva SERIAL PRIMARY KEY,
    id_cliente INTEGER NOT NULL REFERENCES cliente(id_cliente),
    fecha_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'Pendiente', -- 'Pendiente', 'Confirmada', 'Cancelada', 'Completada'
    monto_total DECIMAL(10, 2) DEFAULT 0,
    notas TEXT,
    cancelado_por VARCHAR(100),
    fecha_cancelacion TIMESTAMP,
    motivo_cancelacion TEXT,
    
    -- Campos para QR de pago
    codigo_qr VARCHAR(100) UNIQUE,
    qr_generado BOOLEAN DEFAULT false,
    fecha_generacion_qr TIMESTAMP,
    
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: detalle_reserva_programacion
-- Relaciona reserva con programación (ruta programada)
CREATE TABLE IF NOT EXISTS detalle_reserva_programacion (
    id_detalle_reserva_programacion SERIAL PRIMARY KEY,
    id_reserva INTEGER NOT NULL REFERENCES reserva(id_reserva) ON DELETE CASCADE,
    id_programacion INTEGER NOT NULL REFERENCES programacion(id_programacion),
    cantidad_personas INTEGER DEFAULT 1,
    precio_unitario DECIMAL(10, 2),
    subtotal DECIMAL(10, 2),
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: detalle_reserva_finca
-- Relaciona reserva con fincas (hospedaje)
CREATE TABLE IF NOT EXISTS detalle_reserva_finca (
    id_detalle_reserva_finca SERIAL PRIMARY KEY,
    id_reserva INTEGER NOT NULL REFERENCES reserva(id_reserva) ON DELETE CASCADE,
    id_finca INTEGER NOT NULL REFERENCES finca(id_finca),
    fecha_checkin DATE NOT NULL,
    fecha_checkout DATE NOT NULL,
    numero_noches INTEGER,
    precio_por_noche DECIMAL(10, 2),
    subtotal DECIMAL(10, 2),
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (fecha_checkout > fecha_checkin)
);

-- Tabla: detalle_reserva_servicio
-- Relaciona reserva con servicios adicionales
CREATE TABLE IF NOT EXISTS detalle_reserva_servicio (
    id_detalle_reserva_servicio SERIAL PRIMARY KEY,
    id_reserva INTEGER NOT NULL REFERENCES reserva(id_reserva) ON DELETE CASCADE,
    id_servicio INTEGER NOT NULL REFERENCES servicio(id_servicio),
    cantidad INTEGER DEFAULT 1,
    precio_unitario DECIMAL(10, 2),
    subtotal DECIMAL(10, 2),
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: detalle_reserva_acompanante
-- Personas adicionales en la reserva (además del cliente titular)
CREATE TABLE IF NOT EXISTS detalle_reserva_acompanante (
    id_detalle_reserva_acompanante SERIAL PRIMARY KEY,
    id_reserva INTEGER NOT NULL REFERENCES reserva(id_reserva) ON DELETE CASCADE,
    id_cliente INTEGER REFERENCES cliente(id_cliente), -- puede ser NULL si es invitado no registrado
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    tipo_documento VARCHAR(20),
    numero_documento VARCHAR(50),
    telefono VARCHAR(20),
    fecha_nacimiento DATE,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- MÓDULO DE VENTAS Y PAGOS
-- =====================================================

-- Tabla: venta (resumen de deuda)
CREATE TABLE IF NOT EXISTS venta (
    id_venta SERIAL PRIMARY KEY,
    id_reserva INTEGER NOT NULL UNIQUE REFERENCES reserva(id_reserva),
    fecha_venta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    monto_total DECIMAL(10, 2) NOT NULL,
    monto_pagado DECIMAL(10, 2) DEFAULT 0,
    saldo_pendiente DECIMAL(10, 2) DEFAULT 0,
    estado_pago VARCHAR(20) DEFAULT 'Pendiente', -- 'Pendiente', 'Parcial', 'Pagado', 'Cancelado'
    metodo_pago VARCHAR(50), -- 'Efectivo', 'Tarjeta', 'Transferencia', 'PSE'
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: pago (registro de cada abono con comprobante)
CREATE TABLE IF NOT EXISTS pago (
    id_pago SERIAL PRIMARY KEY,
    id_venta INTEGER NOT NULL REFERENCES venta(id_venta) ON DELETE CASCADE,
    id_reserva INTEGER NOT NULL REFERENCES reserva(id_reserva) ON DELETE CASCADE,
    
    -- Información del pago
    monto DECIMAL(10, 2) NOT NULL,
    metodo_pago VARCHAR(50), -- 'Efectivo', 'Tarjeta', 'Transferencia', 'PSE', 'QR'
    numero_transaccion VARCHAR(100),
    
    -- Comprobante de pago
    comprobante_url TEXT, -- URL o ruta del archivo del comprobante
    comprobante_nombre VARCHAR(255), -- Nombre original del archivo
    comprobante_tipo VARCHAR(50), -- 'image/jpeg', 'application/pdf', etc.
    
    -- Estado y validación
    estado VARCHAR(20) DEFAULT 'Pendiente', -- 'Pendiente', 'Verificado', 'Rechazado', 'Aprobado'
    verificado_por INTEGER REFERENCES empleado(id_empleado),
    fecha_verificacion TIMESTAMP,
    observaciones TEXT,
    motivo_rechazo TEXT,
    
    -- Auditoría
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CHECK (monto > 0),
    CHECK (estado IN ('Pendiente', 'Verificado', 'Rechazado', 'Aprobado'))
);

-- Tabla: pago_proveedor
CREATE TABLE IF NOT EXISTS pago_proveedor (
    id_pago_proveedor SERIAL PRIMARY KEY,
    id_proveedores INTEGER NOT NULL REFERENCES proveedores(id_proveedores),
    observaciones TEXT NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    fecha_pago DATE NOT NULL,
    metodo_pago VARCHAR(50),
    numero_transaccion VARCHAR(100),
    comprobante_pago TEXT, -- URL o referencia
    estado VARCHAR(20) DEFAULT 'Pagado', -- 'Pagado', 'Pendiente', 'Anulado'
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices de autenticación
CREATE INDEX IF NOT EXISTS idx_usuarios_correo ON usuarios(correo);

-- Índices de relaciones
CREATE INDEX IF NOT EXISTS idx_cliente_usuario ON cliente(id_usuarios);
CREATE INDEX IF NOT EXISTS idx_cliente_rol ON cliente(id_roles);
CREATE INDEX IF NOT EXISTS idx_empleado_usuario ON empleado(id_usuarios);
CREATE INDEX IF NOT EXISTS idx_empleado_rol ON empleado(id_roles);
CREATE INDEX IF NOT EXISTS idx_finca_propietario ON finca(id_propietario);
CREATE INDEX IF NOT EXISTS idx_detalle_prov_serv_proveedor ON detalle_proveedor_servicio(id_proveedores);
CREATE INDEX IF NOT EXISTS idx_detalle_prov_serv_servicio ON detalle_proveedor_servicio(id_servicio);
CREATE INDEX IF NOT EXISTS idx_programacion_ruta ON programacion(id_ruta);
CREATE INDEX IF NOT EXISTS idx_programacion_empleado ON programacion(id_empleado);

-- Índices de reservas
CREATE INDEX IF NOT EXISTS idx_reserva_cliente ON reserva(id_cliente);
CREATE INDEX IF NOT EXISTS idx_reserva_estado ON reserva(estado);
CREATE INDEX IF NOT EXISTS idx_reserva_fecha ON reserva(fecha_reserva);
CREATE INDEX IF NOT EXISTS idx_reserva_codigo_qr ON reserva(codigo_qr);

-- Índices de detalles
CREATE INDEX IF NOT EXISTS idx_detalle_prog_reserva ON detalle_reserva_programacion(id_reserva);
CREATE INDEX IF NOT EXISTS idx_detalle_finca_reserva ON detalle_reserva_finca(id_reserva);
CREATE INDEX IF NOT EXISTS idx_detalle_serv_reserva ON detalle_reserva_servicio(id_reserva);
CREATE INDEX IF NOT EXISTS idx_detalle_acomp_reserva ON detalle_reserva_acompanante(id_reserva);

-- Índices de ventas y pagos
CREATE INDEX IF NOT EXISTS idx_venta_reserva ON venta(id_reserva);
CREATE INDEX IF NOT EXISTS idx_pago_venta ON pago(id_venta);
CREATE INDEX IF NOT EXISTS idx_pago_reserva ON pago(id_reserva);
CREATE INDEX IF NOT EXISTS idx_pago_estado ON pago(estado);
CREATE INDEX IF NOT EXISTS idx_pago_fecha ON pago(fecha_pago);
CREATE INDEX IF NOT EXISTS idx_pago_prov_proveedor ON pago_proveedor(id_proveedores);
CREATE INDEX IF NOT EXISTS idx_pago_prov_fecha ON pago_proveedor(fecha_pago);

-- =====================================================
-- TRIGGERS Y FUNCIONES
-- =====================================================

-- Función para generar código QR único automáticamente
CREATE OR REPLACE FUNCTION generar_codigo_qr()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.codigo_qr IS NULL THEN
        NEW.codigo_qr := 'QR-' || LPAD(NEW.id_reserva::TEXT, 8, '0') || '-' || 
                         TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDDHH24MISS');
        NEW.qr_generado := true;
        NEW.fecha_generacion_qr := CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para generar QR automáticamente al crear reserva
DROP TRIGGER IF EXISTS trigger_generar_codigo_qr ON reserva;
CREATE TRIGGER trigger_generar_codigo_qr
    BEFORE INSERT ON reserva
    FOR EACH ROW
    EXECUTE FUNCTION generar_codigo_qr();

-- Función para actualizar estado de venta automáticamente cuando se aprueba un pago
CREATE OR REPLACE FUNCTION actualizar_estado_venta()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo actualizar si el pago fue aprobado
    IF NEW.estado = 'Aprobado' AND (OLD.estado IS NULL OR OLD.estado != 'Aprobado') THEN
        UPDATE venta
        SET 
            monto_pagado = (
                SELECT COALESCE(SUM(monto), 0)
                FROM pago
                WHERE id_venta = NEW.id_venta 
                AND estado = 'Aprobado'
            ),
            saldo_pendiente = monto_total - (
                SELECT COALESCE(SUM(monto), 0)
                FROM pago
                WHERE id_venta = NEW.id_venta 
                AND estado = 'Aprobado'
            ),
            estado_pago = CASE
                WHEN monto_total <= (
                    SELECT COALESCE(SUM(monto), 0)
                    FROM pago
                    WHERE id_venta = NEW.id_venta 
                    AND estado = 'Aprobado'
                ) THEN 'Pagado'
                WHEN (
                    SELECT COALESCE(SUM(monto), 0)
                    FROM pago
                    WHERE id_venta = NEW.id_venta 
                    AND estado = 'Aprobado'
                ) > 0 THEN 'Parcial'
                ELSE 'Pendiente'
            END
        WHERE id_venta = NEW.id_venta;
        
        -- Actualizar estado de reserva si el pago está completo o parcial
        UPDATE reserva r
        SET estado = CASE
            WHEN (
                SELECT estado_pago 
                FROM venta 
                WHERE id_venta = NEW.id_venta
            ) = 'Pagado' THEN 'Confirmada'
            WHEN (
                SELECT estado_pago 
                FROM venta 
                WHERE id_venta = NEW.id_venta
            ) = 'Parcial' THEN 'Confirmada'
            ELSE estado
        END
        WHERE r.id_reserva = NEW.id_reserva;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar estados automáticamente cuando se aprueba un pago
DROP TRIGGER IF EXISTS trigger_actualizar_estado_venta ON pago;
CREATE TRIGGER trigger_actualizar_estado_venta
    AFTER INSERT OR UPDATE OF estado
    ON pago
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_estado_venta();

-- =====================================================
-- COMENTARIOS DESCRIPTIVOS
-- =====================================================

COMMENT ON DATABASE occitours IS 'Sistema de gestión de reservas y ventas para Occitours';

COMMENT ON TABLE roles IS 'Catálogo de roles del sistema (Admin, Empleado, Cliente)';
COMMENT ON TABLE permisos IS 'Catálogo de permisos disponibles';
COMMENT ON TABLE rol_permiso IS 'Relación muchos a muchos entre roles y permisos';
COMMENT ON TABLE usuarios IS 'Credenciales de autenticación (correo y contraseña)';
COMMENT ON TABLE cliente IS 'Información completa de clientes';
COMMENT ON TABLE empleado IS 'Información completa de empleados';
COMMENT ON TABLE propietario IS 'Propietarios de fincas';
COMMENT ON TABLE tipo_proveedor IS 'Catálogo de tipos de proveedores (Transporte, Alimentación, Guía, Hospedaje)';
COMMENT ON TABLE proveedores IS 'Proveedores de servicios';
COMMENT ON TABLE ruta IS 'Rutas turísticas disponibles';
COMMENT ON TABLE finca IS 'Fincas disponibles para hospedaje';
COMMENT ON TABLE servicio IS 'Servicios adicionales (guía, alimentación, etc.)';
COMMENT ON TABLE detalle_proveedor_servicio IS 'Relación entre proveedores y servicios que ofrecen';
COMMENT ON TABLE programacion IS 'Programaciones de rutas con fechas específicas';
COMMENT ON TABLE reserva IS 'Reservas de clientes con código QR único';
COMMENT ON TABLE detalle_reserva_programacion IS 'Rutas programadas incluidas en la reserva';
COMMENT ON TABLE detalle_reserva_finca IS 'Fincas incluidas en la reserva';
COMMENT ON TABLE detalle_reserva_servicio IS 'Servicios adicionales incluidos en la reserva';
COMMENT ON TABLE detalle_reserva_acompanante IS 'Acompañantes del cliente en la reserva';
COMMENT ON TABLE venta IS 'Resumen financiero de la reserva (total, pagado, saldo)';
COMMENT ON TABLE pago IS 'Registro de cada pago/abono con comprobante';
COMMENT ON TABLE pago_proveedor IS 'Pagos realizados a proveedores';

COMMENT ON COLUMN reserva.codigo_qr IS 'Código único para generar QR de pago (generado automáticamente)';
COMMENT ON COLUMN pago.comprobante_url IS 'URL o ruta del archivo del comprobante de pago (imagen o PDF)';
COMMENT ON COLUMN pago.estado IS 'Pendiente: Esperando verificación, Verificado: Revisado, Aprobado: Pago confirmado, Rechazado: Comprobante inválido';
COMMENT ON FUNCTION generar_codigo_qr() IS 'Genera automáticamente código QR único al crear reserva';
COMMENT ON FUNCTION actualizar_estado_venta() IS 'Actualiza automáticamente estado de venta y reserva cuando se aprueba un pago';

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
-- Para ejecutar: psql -U postgres -d occitours -f schema_completo.sql
-- =====================================================
