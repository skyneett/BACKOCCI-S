-- =====================================================
-- DATOS INICIALES - Tipos de Proveedor
-- =====================================================
-- Fecha: 4 de marzo de 2026
-- Descripción: Datos iniciales para la tabla tipo_proveedor
-- =====================================================

-- Insertar tipos de proveedor básicos
INSERT INTO tipo_proveedor (nombre, descripcion, estado) VALUES
('Transporte', 'Proveedores de servicios de transporte turístico terrestre, aéreo o acuático', true),
('Alimentación', 'Proveedores de servicios de alimentación, restaurantes, catering y servicios de comida', true),
('Guía', 'Guías turísticos profesionales certificados para diferentes tipos de rutas', true),
('Hospedaje', 'Proveedores de servicios de alojamiento, hoteles, hostales y hospedajes', true),
('Equipamiento', 'Proveedores de equipamiento y material especializado para actividades turísticas', true),
('Entretenimiento', 'Proveedores de actividades recreativas, culturales y de entretenimiento', true)
ON CONFLICT (nombre) DO NOTHING;

-- Verificar inserción
SELECT * FROM tipo_proveedor ORDER BY id_tipo;
