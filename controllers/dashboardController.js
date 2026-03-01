/**
 * =============================================
 * DASHBOARD CONTROLLER
 * =============================================
 */

const db = require('../config/database');
const { formatearError } = require('../utils/validators');

exports.obtenerEstadisticasGenerales = async (req, res) => {
  try {
    const query = `
      SELECT 
        (SELECT COUNT(*) FROM reserva WHERE estado = 'Confirmada') as reservas_confirmadas,
        (SELECT COUNT(*) FROM reserva WHERE estado = 'Pendiente') as reservas_pendientes,
        (SELECT COUNT(*) FROM cliente WHERE estado = true) as clientes_activos,
        (SELECT COUNT(*) FROM programacion WHERE estado = 'Programado' AND fecha_salida >= CURRENT_DATE) as programaciones_activas,
        (SELECT COALESCE(SUM(monto_total), 0) FROM venta WHERE estado_pago = 'Pagado') as ingresos_totales,
        (SELECT COALESCE(SUM(saldo_pendiente), 0) FROM venta WHERE estado_pago IN ('Pendiente', 'Parcial')) as saldo_pendiente_total
    `;
    
    const result = await db.query(query);
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener estadísticas'));
  }
};

exports.obtenerReservasPorMes = async (req, res) => {
  try {
    const { anio } = req.query;
    const anioActual = anio || new Date().getFullYear();
    
    const query = `
      SELECT 
        EXTRACT(MONTH FROM fecha_reserva) as mes,
        COUNT(*) as total_reservas,
        SUM(CASE WHEN estado = 'Confirmada' THEN 1 ELSE 0 END) as confirmadas,
        SUM(CASE WHEN estado = 'Cancelada' THEN 1 ELSE 0 END) as canceladas,
        COALESCE(SUM(monto_total), 0) as monto_total
      FROM reserva
      WHERE EXTRACT(YEAR FROM fecha_reserva) = $1
      GROUP BY EXTRACT(MONTH FROM fecha_reserva)
      ORDER BY mes
    `;
    
    const result = await db.query(query, [anioActual]);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener reservas por mes'));
  }
};

exports.obtenerVentasPorMes = async (req, res) => {
  try {
    const { anio } = req.query;
    const anioActual = anio || new Date().getFullYear();
    
    const query = `
      SELECT 
        EXTRACT(MONTH FROM fecha_venta) as mes,
        COUNT(*) as total_ventas,
        COALESCE(SUM(monto_total), 0) as monto_total,
        COALESCE(SUM(monto_pagado), 0) as monto_pagado,
        COALESCE(SUM(saldo_pendiente), 0) as saldo_pendiente
      FROM venta
      WHERE EXTRACT(YEAR FROM fecha_venta) = $1
      GROUP BY EXTRACT(MONTH FROM fecha_venta)
      ORDER BY mes
    `;
    
    const result = await db.query(query, [anioActual]);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener ventas por mes'));
  }
};

exports.obtenerRutasMasVendidas = async (req, res) => {
  try {
    const { limit } = req.query;
    const limite = limit || 10;
    
    const query = `
      SELECT 
        r.id_ruta,
        r.nombre,
        r.precio_base,
        COUNT(DISTINCT drp.id_reserva) as total_reservas,
        SUM(drp.cantidad_personas) as total_personas,
        COALESCE(SUM(drp.subtotal), 0) as ingresos_totales
      FROM ruta r
      INNER JOIN programacion p ON r.id_ruta = p.id_ruta
      INNER JOIN detalle_reserva_programacion drp ON p.id_programacion = drp.id_programacion
      GROUP BY r.id_ruta, r.nombre, r.precio_base
      ORDER BY total_reservas DESC
      LIMIT $1
    `;
    
    const result = await db.query(query, [limite]);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener rutas más vendidas'));
  }
};

exports.obtenerServiciosMasSolicitados = async (req, res) => {
  try {
    const { limit } = req.query;
    const limite = limit || 10;
    
    const query = `
      SELECT 
        s.id_servicio,
        s.nombre,
        s.precio,
        COUNT(drs.id_detalle_reserva_servicio) as veces_solicitado,
        SUM(drs.cantidad) as cantidad_total,
        COALESCE(SUM(drs.subtotal), 0) as ingresos_totales
      FROM servicio s
      INNER JOIN detalle_reserva_servicio drs ON s.id_servicio = drs.id_servicio
      GROUP BY s.id_servicio, s.nombre, s.precio
      ORDER BY veces_solicitado DESC
      LIMIT $1
    `;
    
    const result = await db.query(query, [limite]);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener servicios más solicitados'));
  }
};

exports.obtenerClientesTop = async (req, res) => {
  try {
    const { limit } = req.query;
    const limite = limit || 10;
    
    const query = `
      SELECT 
        c.id_cliente,
        c.nombre,
        c.apellido,
        c.telefono,
        COUNT(r.id_reserva) as total_reservas,
        COALESCE(SUM(r.monto_total), 0) as monto_total_gastado
      FROM cliente c
      INNER JOIN reserva r ON c.id_cliente = r.id_cliente
      WHERE r.estado IN ('Confirmada', 'Completada')
      GROUP BY c.id_cliente, c.nombre, c.apellido, c.telefono
      ORDER BY monto_total_gastado DESC
      LIMIT $1
    `;
    
    const result = await db.query(query, [limite]);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener clientes top'));
  }
};

exports.obtenerOcupacionProgramaciones = async (req, res) => {
  try {
    const query = `
      SELECT 
        p.id_programacion,
        p.fecha_salida,
        p.fecha_regreso,
        p.cupos_totales,
        p.cupos_disponibles,
        (p.cupos_totales - p.cupos_disponibles) as cupos_ocupados,
        ROUND(((p.cupos_totales - p.cupos_disponibles)::numeric / p.cupos_totales::numeric) * 100, 2) as porcentaje_ocupacion,
        r.nombre as ruta_nombre
      FROM programacion p
      INNER JOIN ruta r ON p.id_ruta = r.id_ruta
      WHERE p.estado = 'Programado' AND p.fecha_salida >= CURRENT_DATE
      ORDER BY p.fecha_salida ASC
    `;
    
    const result = await db.query(query);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener ocupación de programaciones'));
  }
};
