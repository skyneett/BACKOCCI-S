/**
 * =============================================
 * PAGO_PROVEEDOR MODEL
 * =============================================
 * 
 * Gestiona los pagos realizados a proveedores
 * Tabla: pago_proveedor
 */

const db = require('../config/database');

class PagoProveedor {
  /**
   * Obtener todos los pagos
   */
  static async obtenerTodos() {
    const query = `
      SELECT 
        pp.id_pago_proveedor, pp.id_proveedores, pp.observaciones,
        pp.monto, pp.fecha_pago, pp.metodo_pago, pp.numero_transaccion,
        pp.comprobante_pago, pp.estado, pp.fecha_registro,
        p.nombre as proveedor_nombre, p.tipo_servicio, p.telefono, p.email
      FROM pago_proveedor pp
      INNER JOIN proveedores p ON pp.id_proveedores = p.id_proveedores
      ORDER BY pp.fecha_pago DESC
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
        pp.id_pago_proveedor, pp.id_proveedores, pp.observaciones,
        pp.monto, pp.fecha_pago, pp.metodo_pago, pp.numero_transaccion,
        pp.comprobante_pago, pp.estado, pp.fecha_registro,
        p.nombre as proveedor_nombre, p.tipo_servicio, p.telefono, p.email,
        p.direccion
      FROM pago_proveedor pp
      INNER JOIN proveedores p ON pp.id_proveedores = p.id_proveedores
      WHERE pp.id_pago_proveedor = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Obtener pagos de un proveedor
   */
  static async obtenerPorProveedor(idProveedor) {
    const query = `
      SELECT 
        id_pago_proveedor, observaciones, monto, fecha_pago,
        metodo_pago, numero_transaccion, comprobante_pago,
        estado, fecha_registro
      FROM pago_proveedor
      WHERE id_proveedores = $1
      ORDER BY fecha_pago DESC
    `;
    const result = await db.query(query, [idProveedor]);
    return result.rows;
  }

  /**
   * Obtener pagos por rango de fechas
   */
  static async obtenerPorRangoFechas(fechaInicio, fechaFin) {
    const query = `
      SELECT 
        pp.id_pago_proveedor, pp.id_proveedores, pp.observaciones,
        pp.monto, pp.fecha_pago, pp.metodo_pago, pp.estado,
        p.nombre as proveedor_nombre, p.tipo_servicio
      FROM pago_proveedor pp
      INNER JOIN proveedores p ON pp.id_proveedores = p.id_proveedores
      WHERE pp.fecha_pago BETWEEN $1 AND $2
      ORDER BY pp.fecha_pago DESC
    `;
    const result = await db.query(query, [fechaInicio, fechaFin]);
    return result.rows;
  }

  /**
   * Crear nuevo pago
   */
  static async crear(datos) {
    const {
      id_proveedores, observaciones, monto, fecha_pago,
      metodo_pago, numero_transaccion, comprobante_pago, estado
    } = datos;
    
    const query = `
      INSERT INTO pago_proveedor 
        (id_proveedores, observaciones, monto, fecha_pago, metodo_pago,
         numero_transaccion, comprobante_pago, estado)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id_pago_proveedor, id_proveedores, observaciones, monto,
                fecha_pago, metodo_pago, numero_transaccion, comprobante_pago,
                estado, fecha_registro
    `;
    
    const result = await db.query(query, [
      id_proveedores, observaciones, monto, fecha_pago,
      metodo_pago || null, numero_transaccion || null,
      comprobante_pago || null, estado || 'Pagado'
    ]);
    return result.rows[0];
  }

  /**
   * Actualizar pago
   */
  static async actualizar(id, datos) {
    const {
      observaciones, monto, fecha_pago, metodo_pago,
      numero_transaccion, comprobante_pago, estado
    } = datos;
    
    const query = `
      UPDATE pago_proveedor
      SET observaciones = $2,
          monto = $3,
          fecha_pago = $4,
          metodo_pago = $5,
          numero_transaccion = $6,
          comprobante_pago = $7,
          estado = $8
      WHERE id_pago_proveedor = $1
      RETURNING id_pago_proveedor, id_proveedores, observaciones, monto,
                fecha_pago, metodo_pago, numero_transaccion, comprobante_pago,
                estado, fecha_registro
    `;
    
    const result = await db.query(query, [
      id, observaciones, monto, fecha_pago, metodo_pago,
      numero_transaccion, comprobante_pago, estado
    ]);
    return result.rows[0];
  }

  /**
   * Cambiar estado de pago
   */
  static async cambiarEstado(id, nuevoEstado) {
    const query = `
      UPDATE pago_proveedor
      SET estado = $2
      WHERE id_pago_proveedor = $1
      RETURNING id_pago_proveedor, estado
    `;
    const result = await db.query(query, [id, nuevoEstado]);
    return result.rows[0];
  }

  /**
   * Eliminar pago (anular)
   */
  static async eliminar(id) {
    // En lugar de eliminar, se anula
    const query = `
      UPDATE pago_proveedor
      SET estado = 'Anulado'
      WHERE id_pago_proveedor = $1
      RETURNING id_pago_proveedor
    `;
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Obtener total pagado a un proveedor
   */
  static async obtenerTotalPagado(idProveedor) {
    const query = `
      SELECT COALESCE(SUM(monto), 0) as total_pagado
      FROM pago_proveedor
      WHERE id_proveedores = $1 
        AND estado = 'Pagado'
    `;
    const result = await db.query(query, [idProveedor]);
    return parseFloat(result.rows[0].total_pagado);
  }

  /**
   * Obtener estadísticas de pagos por método
   */
  static async obtenerEstadisticasPorMetodo() {
    const query = `
      SELECT 
        metodo_pago,
        COUNT(*) as total_pagos,
        SUM(monto) as total_monto
      FROM pago_proveedor
      WHERE estado = 'Pagado'
      GROUP BY metodo_pago
      ORDER BY total_monto DESC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  /**
   * Obtener pagos pendientes
   */
  static async obtenerPendientes() {
    const query = `
      SELECT 
        pp.id_pago_proveedor, pp.id_proveedores, pp.observaciones,
        pp.monto, pp.fecha_pago, pp.estado,
        p.nombre as proveedor_nombre, p.telefono, p.email
      FROM pago_proveedor pp
      INNER JOIN proveedores p ON pp.id_proveedores = p.id_proveedores
      WHERE pp.estado = 'Pendiente'
      ORDER BY pp.fecha_pago ASC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  /**
   * Obtener resumen de pagos por proveedor
   */
  static async obtenerResumenPorProveedor(idProveedor) {
    const query = `
      SELECT 
        COUNT(*) as total_pagos,
        SUM(CASE WHEN estado = 'Pagado' THEN monto ELSE 0 END) as total_pagado,
        SUM(CASE WHEN estado = 'Pendiente' THEN monto ELSE 0 END) as total_pendiente,
        SUM(CASE WHEN estado = 'Anulado' THEN monto ELSE 0 END) as total_anulado
      FROM pago_proveedor
      WHERE id_proveedores = $1
    `;
    const result = await db.query(query, [idProveedor]);
    return result.rows[0];
  }
}

module.exports = PagoProveedor;
