-- =====================================================
-- SISTEMA DE PAGOS Y ABONOS CON COMPROBANTES
-- =====================================================

-- 1. Agregar campos a la tabla RESERVA para QR y seguimiento
ALTER TABLE reserva 
ADD COLUMN IF NOT EXISTS codigo_qr VARCHAR(100) UNIQUE,
ADD COLUMN IF NOT EXISTS qr_generado BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS fecha_generacion_qr TIMESTAMP;

-- 2. Crear tabla PAGO para registrar cada abono/pago individual
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

-- 3. Índices para optimización
CREATE INDEX IF NOT EXISTS idx_pago_venta ON pago(id_venta);
CREATE INDEX IF NOT EXISTS idx_pago_reserva ON pago(id_reserva);
CREATE INDEX IF NOT EXISTS idx_pago_estado ON pago(estado);
CREATE INDEX IF NOT EXISTS idx_pago_fecha ON pago(fecha_pago);
CREATE INDEX IF NOT EXISTS idx_reserva_codigo_qr ON reserva(codigo_qr);

-- 4. Función para actualizar estado de venta automáticamente
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
        
        -- Actualizar estado de reserva si el pago está completo
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

-- 5. Trigger para actualizar estados automáticamente
DROP TRIGGER IF EXISTS trigger_actualizar_estado_venta ON pago;
CREATE TRIGGER trigger_actualizar_estado_venta
    AFTER INSERT OR UPDATE OF estado
    ON pago
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_estado_venta();

-- 6. Función para generar código QR único
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

-- 7. Trigger para generar QR automáticamente al crear reserva
DROP TRIGGER IF EXISTS trigger_generar_codigo_qr ON reserva;
CREATE TRIGGER trigger_generar_codigo_qr
    BEFORE INSERT ON reserva
    FOR EACH ROW
    EXECUTE FUNCTION generar_codigo_qr();

-- =====================================================
-- COMENTARIOS Y DOCUMENTACIÓN
-- =====================================================

COMMENT ON TABLE pago IS 'Registra cada pago/abono individual con su comprobante';
COMMENT ON COLUMN pago.comprobante_url IS 'URL o ruta del archivo del comprobante de pago (imagen o PDF)';
COMMENT ON COLUMN pago.estado IS 'Pendiente: Esperando verificación, Verificado: Revisado, Aprobado: Pago confirmado, Rechazado: Comprobante inválido';
COMMENT ON COLUMN reserva.codigo_qr IS 'Código único para generar QR de pago de la reserva';
COMMENT ON FUNCTION actualizar_estado_venta() IS 'Actualiza automáticamente el estado de venta y reserva cuando se aprueba un pago';
