/**
 * =============================================
 * VENTA MODEL - Modelo de Ventas y Pagos
 * =============================================
 * 
 * Gestiona las ventas asociadas a reservas
 * Tabla: venta
 */

const db = require('../config/database');

class Venta {
  /**
   * Obtener todas las ventas
   */
  static async obtenerTodos() {
    const query = `
      SELECT 
        v.id_venta, v.id_reserva, v.fecha_venta, v.monto_total,
        v.monto_pagado, v.saldo_pendiente, v.estado_pago,
        v.metodo_pago, v.fecha_creacion,
        r.fecha_reserva, r.estado as reserva_estado,
        c.nombre as cliente_nombre, c.apellido as cliente_apellido,
        c.telefono as cliente_telefono
      FROM venta v
      INNER JOIN reserva r ON v.id_reserva = r.id_reserva
      INNER JOIN cliente c ON r.id_cliente = c.id_cliente
      ORDER BY v.fecha_venta DESC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  /**
   * Obtener venta por ID
   */
  static async obtenerPorId(id) {
    const query = `
      SELECT 
        v.id_venta, v.id_reserva, v.fecha_venta, v.monto_total,
        v.monto_pagado, v.saldo_pendiente, v.estado_pago,
        v.metodo_pago, v.fecha_creacion,
        r.fecha_reserva, r.estado as reserva_estado, r.notas,
        c.id_cliente, c.nombre as cliente_nombre, c.apellido as cliente_apellido,
        c.telefono as cliente_telefono, c.numero_documento, c.email
      FROM venta v
      INNER JOIN reserva r ON v.id_reserva = r.id_reserva
      INNER JOIN cliente c ON r.id_cliente = c.id_cliente
      INNER JOIN usuarios u ON c.id_usuarios = u.id_usuarios
      WHERE v.id_venta = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Obtener venta por ID de reserva
   */
  static async obtenerPorReserva(idReserva) {
    const query = `
      SELECT 
        v.id_venta, v.id_reserva, v.fecha_venta, v.monto_total,
        v.monto_pagado, v.saldo_pendiente, v.estado_pago,
        v.metodo_pago, v.fecha_creacion
      FROM venta v
      WHERE v.id_reserva = $1
    `;
    const result = await db.query(query, [idReserva]);
    return result.rows[0];
  }

  /**
   * Crear nueva venta (asociada a una reserva)
   */
  static async crear(datos) {
    const {
      id_reserva, monto_total, monto_pagado, metodo_pago
    } = datos;
    
    const saldoPendiente = monto_total - (monto_pagado || 0);
    let estadoPago = 'Pendiente';
    
    if (monto_pagado >= monto_total) {
      estadoPago = 'Pagado';
    } else if (monto_pagado > 0) {
      estadoPago = 'Parcial';
    }
    
    const query = `
      INSERT INTO venta (
        id_reserva, monto_total, monto_pagado, saldo_pendiente,
        estado_pago, metodo_pago
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const result = await db.query(query, [
      id_reserva, monto_total, monto_pagado || 0, saldoPendiente,
      estadoPago, metodo_pago
    ]);
    
    return result.rows[0];
  }

  /**
   * Registrar pago (agregar al monto pagado)
   */
  static async registrarPago(id, datos) {
    const { monto_pago, metodo_pago } = datos;
    
    const query = `
      UPDATE venta
      SET 
        monto_pagado = monto_pagado + $1,
        saldo_pendiente = monto_total - (monto_pagado + $1),
        metodo_pago = COALESCE($2, metodo_pago),
        estado_pago = CASE
          WHEN (monto_pagado + $1) >= monto_total THEN 'Pagado'
          WHEN (monto_pagado + $1) > 0 THEN 'Parcial'
          ELSE 'Pendiente'
        END
      WHERE id_venta = $3
      RETURNING *
    `;
    
    const result = await db.query(query, [monto_pago, metodo_pago, id]);
    return result.rows[0];
  }

  /**
   * Actualizar venta
   */
  static async actualizar(id, datos) {
    const {
      monto_total, monto_pagado, estado_pago, metodo_pago
    } = datos;
    
    const query = `
      UPDATE venta
      SET 
        monto_total = COALESCE($1, monto_total),
        monto_pagado = COALESCE($2, monto_pagado),
        saldo_pendiente = COALESCE($1, monto_total) - COALESCE($2, monto_pagado),
        estado_pago = COALESCE($3, estado_pago),
        metodo_pago = COALESCE($4, metodo_pago)
      WHERE id_venta = $5
      RETURNING *
    `;
    
    const result = await db.query(query, [
      monto_total, monto_pagado, estado_pago, metodo_pago, id
    ]);
    
    return result.rows[0];
  }

  /**
   * Cancelar venta
   */
  static async cancelar(id) {
    const query = `
      UPDATE venta
      SET estado_pago = 'Cancelado'
      WHERE id_venta = $1
      RETURNING *
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Eliminar venta
   */
  static async eliminar(id) {
    const query = 'DELETE FROM venta WHERE id_venta = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Obtener ventas por estado de pago
   */
  static async obtenerPorEstadoPago(estadoPago) {
    const query = `
      SELECT 
        v.id_venta, v.id_reserva, v.fecha_venta, v.monto_total,
        v.monto_pagado, v.saldo_pendiente, v.metodo_pago,
        c.nombre as cliente_nombre, c.apellido as cliente_apellido,
        c.telefono as cliente_telefono
      FROM venta v
      INNER JOIN reserva r ON v.id_reserva = r.id_reserva
      INNER JOIN cliente c ON r.id_cliente = c.id_cliente
      WHERE v.estado_pago = $1
      ORDER BY v.fecha_venta DESC
    `;
    const result = await db.query(query, [estadoPago]);
    return result.rows;
  }

  /**
   * Obtener ventas por rango de fechas
   */
  static async obtenerPorFechas(fechaInicio, fechaFin) {
    const query = `
      SELECT 
        v.id_venta, v.id_reserva, v.fecha_venta, v.monto_total,
        v.monto_pagado, v.saldo_pendiente, v.estado_pago,
        c.nombre as cliente_nombre, c.apellido as cliente_apellido
      FROM venta v
      INNER JOIN reserva r ON v.id_reserva = r.id_reserva
      INNER JOIN cliente c ON r.id_cliente = c.id_cliente
      WHERE v.fecha_venta BETWEEN $1 AND $2
      ORDER BY v.fecha_venta DESC
    `;
    const result = await db.query(query, [fechaInicio, fechaFin]);
    return result.rows;
  }

  /**
   * Obtener estadísticas de ventas
   */
  static async obtenerEstadisticas() {
    const query = `
      SELECT 
        COUNT(*) as total_ventas,
        SUM(monto_total) as monto_total_vendido,
        SUM(monto_pagado) as monto_total_pagado,
        SUM(saldo_pendiente) as saldo_total_pendiente,
        SUM(CASE WHEN estado_pago = 'Pagado' THEN 1 ELSE 0 END) as ventas_pagadas,
        SUM(CASE WHEN estado_pago = 'Parcial' THEN 1 ELSE 0 END) as ventas_parciales,
        SUM(CASE WHEN estado_pago = 'Pendiente' THEN 1 ELSE 0 END) as ventas_pendientes
      FROM venta
    `;
    const result = await db.query(query);
    return result.rows[0];
  }

  /**
   * Obtener ventas por mes
   */
  static async obtenerPorMes(anio, mes) {
    const query = `
      SELECT 
        v.id_venta, v.fecha_venta, v.monto_total,
        v.monto_pagado, v.estado_pago,
        c.nombre as cliente_nombre, c.apellido as cliente_apellido
      FROM venta v
      INNER JOIN reserva r ON v.id_reserva = r.id_reserva
      INNER JOIN cliente c ON r.id_cliente = c.id_cliente
      WHERE EXTRACT(YEAR FROM v.fecha_venta) = $1
        AND EXTRACT(MONTH FROM v.fecha_venta) = $2
      ORDER BY v.fecha_venta DESC
    `;
    const result = await db.query(query, [anio, mes]);
    return result.rows;
  }

  /**
   * Buscar ventas
   */
  static async buscar(termino) {
    const query = `
      SELECT 
        v.id_venta, v.fecha_venta, v.monto_total,
        v.estado_pago, v.metodo_pago,
        c.nombre as cliente_nombre, c.apellido as cliente_apellido
      FROM venta v
      INNER JOIN reserva r ON v.id_reserva = r.id_reserva
      INNER JOIN cliente c ON r.id_cliente = c.id_cliente
      WHERE 
        CAST(v.id_venta AS TEXT) ILIKE $1 OR
        CAST(v.id_reserva AS TEXT) ILIKE $1 OR
        c.nombre ILIKE $1 OR
        c.apellido ILIKE $1 OR
        v.estado_pago ILIKE $1 OR
        v.metodo_pago ILIKE $1
      ORDER BY v.fecha_venta DESC
      LIMIT 20
    `;
    const result = await db.query(query, [`%${termino}%`]);
    return result.rows;
  }
}

module.exports = Venta;
