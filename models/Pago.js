/**
 * =============================================
 * PAGO MODEL - Modelo de Pagos/Abonos
 * =============================================
 * 
 * Gestiona los pagos individuales con comprobantes
 * Tabla: pago
 */

const db = require('../config/database');

class Pago {
  /**
   * Obtener todos los pagos
   */
  static async obtenerTodos() {
    const query = `
      SELECT 
        p.id_pago, p.id_venta, p.id_reserva, p.monto, p.metodo_pago,
        p.numero_transaccion, p.comprobante_url, p.comprobante_nombre,
        p.estado, p.fecha_pago, p.observaciones,
        v.monto_total, v.monto_pagado, v.estado_pago,
        r.fecha_reserva, r.codigo_qr,
        c.nombre as cliente_nombre, c.apellido as cliente_apellido
      FROM pago p
      INNER JOIN venta v ON p.id_venta = v.id_venta
      INNER JOIN reserva r ON p.id_reserva = r.id_reserva
      INNER JOIN cliente c ON r.id_cliente = c.id_cliente
      ORDER BY p.fecha_pago DESC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  /**
   * Obtener pago por ID
   */
  static async obtenerPorId(id) {
    const query = `
      SELECT 
        p.id_pago, p.id_venta, p.id_reserva, p.monto, p.metodo_pago,
        p.numero_transaccion, p.comprobante_url, p.comprobante_nombre,
        p.comprobante_tipo, p.estado, p.fecha_pago, p.observaciones,
        p.motivo_rechazo, p.fecha_verificacion,
        e.nombre as verificado_por_nombre, e.apellido as verificado_por_apellido,
        v.monto_total, v.monto_pagado, v.saldo_pendiente, v.estado_pago,
        r.id_reserva, r.fecha_reserva, r.codigo_qr, r.estado as reserva_estado,
        c.nombre as cliente_nombre, c.apellido as cliente_apellido,
        c.telefono, c.numero_documento
      FROM pago p
      INNER JOIN venta v ON p.id_venta = v.id_venta
      INNER JOIN reserva r ON p.id_reserva = r.id_reserva
      INNER JOIN cliente c ON r.id_cliente = c.id_cliente
      LEFT JOIN empleado e ON p.verificado_por = e.id_empleado
      WHERE p.id_pago = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Obtener pagos de una venta
   */
  static async obtenerPorVenta(idVenta) {
    const query = `
      SELECT 
        p.id_pago, p.monto, p.metodo_pago, p.numero_transaccion,
        p.comprobante_url, p.comprobante_nombre, p.estado,
        p.fecha_pago, p.observaciones
      FROM pago p
      WHERE p.id_venta = $1
      ORDER BY p.fecha_pago ASC
    `;
    const result = await db.query(query, [idVenta]);
    return result.rows;
  }

  /**
   * Obtener pagos de una reserva
   */
  static async obtenerPorReserva(idReserva) {
    const query = `
      SELECT 
        p.id_pago, p.id_venta, p.monto, p.metodo_pago,
        p.numero_transaccion, p.comprobante_url, p.comprobante_nombre,
        p.estado, p.fecha_pago, p.observaciones
      FROM pago p
      WHERE p.id_reserva = $1
      ORDER BY p.fecha_pago ASC
    `;
    const result = await db.query(query, [idReserva]);
    return result.rows;
  }

  /**
   * Obtener pagos pendientes de verificación
   */
  static async obtenerPendientes() {
    const query = `
      SELECT 
        p.id_pago, p.id_venta, p.id_reserva, p.monto, p.metodo_pago,
        p.comprobante_url, p.comprobante_nombre, p.fecha_pago,
        r.codigo_qr, r.fecha_reserva,
        c.nombre as cliente_nombre, c.apellido as cliente_apellido,
        c.telefono
      FROM pago p
      INNER JOIN reserva r ON p.id_reserva = r.id_reserva
      INNER JOIN cliente c ON r.id_cliente = c.id_cliente
      WHERE p.estado = 'Pendiente'
      ORDER BY p.fecha_pago ASC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  /**
   * Crear nuevo pago/abono
   */
  static async crear(datos) {
    const {
      id_venta, id_reserva, monto, metodo_pago,
      numero_transaccion, comprobante_url, comprobante_nombre,
      comprobante_tipo, observaciones
    } = datos;
    
    const query = `
      INSERT INTO pago (
        id_venta, id_reserva, monto, metodo_pago, numero_transaccion,
        comprobante_url, comprobante_nombre, comprobante_tipo, observaciones
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id_pago, id_venta, id_reserva, monto, metodo_pago,
                estado, fecha_pago, comprobante_url
    `;
    
    const result = await db.query(query, [
      id_venta, id_reserva, monto, metodo_pago || null,
      numero_transaccion || null, comprobante_url || null,
      comprobante_nombre || null, comprobante_tipo || null,
      observaciones || null
    ]);
    
    return result.rows[0];
  }

  /**
   * Verificar/Aprobar pago
   */
  static async verificar(id, datos) {
    const { id_empleado, estado, observaciones, motivo_rechazo } = datos;
    
    const query = `
      UPDATE pago
      SET 
        estado = $2,
        verificado_por = $3,
        fecha_verificacion = CURRENT_TIMESTAMP,
        observaciones = COALESCE($4, observaciones),
        motivo_rechazo = $5,
        fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id_pago = $1
      RETURNING id_pago, id_venta, id_reserva, monto, estado,
                fecha_verificacion
    `;
    
    const result = await db.query(query, [
      id, estado, id_empleado, observaciones || null, motivo_rechazo || null
    ]);
    
    return result.rows[0];
  }

  /**
   * Actualizar pago
   */
  static async actualizar(id, datos) {
    const {
      monto, metodo_pago, numero_transaccion, comprobante_url,
      comprobante_nombre, comprobante_tipo, observaciones
    } = datos;
    
    const query = `
      UPDATE pago
      SET 
        monto = COALESCE($2, monto),
        metodo_pago = COALESCE($3, metodo_pago),
        numero_transaccion = COALESCE($4, numero_transaccion),
        comprobante_url = COALESCE($5, comprobante_url),
        comprobante_nombre = COALESCE($6, comprobante_nombre),
        comprobante_tipo = COALESCE($7, comprobante_tipo),
        observaciones = COALESCE($8, observaciones),
        fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id_pago = $1
      RETURNING *
    `;
    
    const result = await db.query(query, [
      id, monto, metodo_pago, numero_transaccion,
      comprobante_url, comprobante_nombre, comprobante_tipo, observaciones
    ]);
    
    return result.rows[0];
  }

  /**
   * Eliminar pago
   */
  static async eliminar(id) {
    const query = `
      DELETE FROM pago
      WHERE id_pago = $1
      RETURNING id_pago
    `;
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Obtener resumen de pagos de una venta
   */
  static async obtenerResumenVenta(idVenta) {
    const query = `
      SELECT 
        COUNT(*) as total_pagos,
        SUM(CASE WHEN estado = 'Aprobado' THEN monto ELSE 0 END) as total_aprobado,
        SUM(CASE WHEN estado = 'Pendiente' THEN monto ELSE 0 END) as total_pendiente,
        SUM(CASE WHEN estado = 'Rechazado' THEN monto ELSE 0 END) as total_rechazado
      FROM pago
      WHERE id_venta = $1
    `;
    const result = await db.query(query, [idVenta]);
    return result.rows[0];
  }

  /**
   * Obtener estadísticas de pagos
   */
  static async obtenerEstadisticas() {
    const query = `
      SELECT 
        COUNT(*) as total_pagos,
        SUM(CASE WHEN estado = 'Pendiente' THEN 1 ELSE 0 END) as pendientes,
        SUM(CASE WHEN estado = 'Aprobado' THEN 1 ELSE 0 END) as aprobados,
        SUM(CASE WHEN estado = 'Rechazado' THEN 1 ELSE 0 END) as rechazados,
        SUM(CASE WHEN estado = 'Aprobado' THEN monto ELSE 0 END) as monto_total_aprobado,
        SUM(CASE WHEN estado = 'Pendiente' THEN monto ELSE 0 END) as monto_total_pendiente
      FROM pago
    `;
    const result = await db.query(query);
    return result.rows[0];
  }
}

module.exports = Pago;
