-- =====================================================
-- MIGRACIÓN VERSIÓN 3.0 - Occitours
-- =====================================================
-- Fecha: 4 de marzo de 2026
-- Descripción: Agrega campos de verificación de email y 
--              recuperación de contraseña a usuarios,
--              y nueva tabla tipo_proveedor
-- =====================================================

-- =====================================================
-- PASO 1: Agregar campos a tabla usuarios
-- =====================================================

-- Agregar campos de verificación de email
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS verification_token_expires_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS password_reset_token_expires_at TIMESTAMP;

COMMENT ON COLUMN usuarios.email_verified_at IS 'Fecha y hora de verificación del correo electrónico';
COMMENT ON COLUMN usuarios.verification_token IS 'Token único para verificación de correo';
COMMENT ON COLUMN usuarios.verification_token_expires_at IS 'Fecha de expiración del token de verificación';
COMMENT ON COLUMN usuarios.password_reset_token IS 'Token único para recuperación de contraseña';
COMMENT ON COLUMN usuarios.password_reset_token_expires_at IS 'Fecha de expiración del token de recuperación';

-- =====================================================
-- PASO 2: Crear tabla tipo_proveedor
-- =====================================================

CREATE TABLE IF NOT EXISTS tipo_proveedor (
    id_tipo SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    estado BOOLEAN DEFAULT true
);

COMMENT ON TABLE tipo_proveedor IS 'Catálogo de tipos de proveedores (Transporte, Alimentación, Guía, Hospedaje)';
COMMENT ON COLUMN tipo_proveedor.nombre IS 'Nombre del tipo de proveedor';
COMMENT ON COLUMN tipo_proveedor.descripcion IS 'Descripción del tipo de servicio que proporciona';
COMMENT ON COLUMN tipo_proveedor.estado IS 'Estado activo/inactivo del tipo';

-- =====================================================
-- PASO 3: Insertar tipos de proveedor iniciales
-- =====================================================

INSERT INTO tipo_proveedor (nombre, descripcion, estado) VALUES
('Transporte', 'Proveedores de servicios de transporte turístico', true),
('Alimentación', 'Proveedores de servicios de alimentación y catering', true),
('Guía', 'Guías turísticos profesionales', true),
('Hospedaje', 'Proveedores de servicios de alojamiento', true),
('Equipamiento', 'Proveedores de equipamiento y material para actividades', true),
('Entretenimiento', 'Proveedores de actividades recreativas y de entretenimiento', true)
ON CONFLICT (nombre) DO NOTHING;

-- =====================================================
-- PASO 4: Agregar columna id_tipo a proveedores
-- =====================================================

-- Agregar nueva columna id_tipo (permitir NULL temporalmente)
ALTER TABLE proveedores 
ADD COLUMN IF NOT EXISTS id_tipo INTEGER;

-- =====================================================
-- PASO 5: Migrar datos existentes
-- =====================================================
-- Mapear tipo_servicio actual a id_tipo

-- Actualizar proveedores existentes según su tipo_servicio
UPDATE proveedores 
SET id_tipo = (SELECT id_tipo FROM tipo_proveedor WHERE nombre = 'Transporte')
WHERE tipo_servicio ILIKE '%transporte%';

UPDATE proveedores 
SET id_tipo = (SELECT id_tipo FROM tipo_proveedor WHERE nombre = 'Alimentación')
WHERE tipo_servicio ILIKE '%alimentaci%' OR tipo_servicio ILIKE '%comida%' OR tipo_servicio ILIKE '%catering%';

UPDATE proveedores 
SET id_tipo = (SELECT id_tipo FROM tipo_proveedor WHERE nombre = 'Guía')
WHERE tipo_servicio ILIKE '%gu%' OR tipo_servicio ILIKE '%gu%';

UPDATE proveedores 
SET id_tipo = (SELECT id_tipo FROM tipo_proveedor WHERE nombre = 'Hospedaje')
WHERE tipo_servicio ILIKE '%hospedaje%' OR tipo_servicio ILIKE '%hotel%' OR tipo_servicio ILIKE '%alojamiento%';

-- Por defecto, los que no coincidan con ninguno, asignar a 'Entretenimiento'
UPDATE proveedores 
SET id_tipo = (SELECT id_tipo FROM tipo_proveedor WHERE nombre = 'Entretenimiento')
WHERE id_tipo IS NULL;

-- =====================================================
-- PASO 6: Hacer id_tipo obligatorio y crear foreign key
-- =====================================================

-- Hacer la columna NOT NULL
ALTER TABLE proveedores 
ALTER COLUMN id_tipo SET NOT NULL;

-- Agregar foreign key constraint
ALTER TABLE proveedores 
ADD CONSTRAINT fk_tipo_proveedor 
FOREIGN KEY (id_tipo) REFERENCES tipo_proveedor(id_tipo);

-- Crear índice para mejor performance
CREATE INDEX IF NOT EXISTS idx_proveedores_id_tipo ON proveedores(id_tipo);

-- =====================================================
-- PASO 7: Eliminar columna tipo_servicio antigua
-- =====================================================
-- PRECAUCIÓN: Comentar esta línea si quieres mantener backup del campo antiguo

-- ALTER TABLE proveedores DROP COLUMN IF EXISTS tipo_servicio;

-- =====================================================
-- PASO 8: Actualizar comentarios
-- =====================================================

COMMENT ON COLUMN proveedores.id_tipo IS 'Referencia al tipo de proveedor';
COMMENT ON TABLE proveedores IS 'Proveedores de servicios (usa tipo_proveedor para categorización)';

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

-- Verificar que todos los proveedores tienen tipo asignado
SELECT COUNT(*) as proveedores_sin_tipo 
FROM proveedores 
WHERE id_tipo IS NULL;

-- Ver distribución de proveedores por tipo
SELECT 
    tp.nombre as tipo,
    COUNT(p.id_proveedores) as cantidad
FROM tipo_proveedor tp
LEFT JOIN proveedores p ON tp.id_tipo = p.id_tipo
GROUP BY tp.id_tipo, tp.nombre
ORDER BY cantidad DESC;

-- =====================================================
-- FIN DE MIGRACIÓN
-- =====================================================

SELECT 'Migración v3.0 completada exitosamente' as resultado;
