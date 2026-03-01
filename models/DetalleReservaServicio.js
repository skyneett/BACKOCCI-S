/**
 * =============================================
 * DETALLE_RESERVA_SERVICIO MODEL
 * =============================================
 * 
 * Gestiona la relación entre reservas y servicios adicionales
 * Tabla: detalle_reserva_servicio
 */

const db = require('../config/database');

class DetalleReservaServicio {
  /**
   * Obtener servicios de una reserva
   */
  static async obtenerPorReserva(idReserva) {
    const query = `
      SELECT 
        drs.id_detalle_reserva_servicio, drs.id_reserva, drs.id_servicio,
        drs.cantidad, drs.precio_unitario, drs.subtotal, drs.fecha_agregado,
        s.nombre as servicio_nombre, s.descripcion as servicio_descripcion,
        s.imagen_url, s.estado as servicio_estado
      FROM detalle_reserva_servicio drs
      INNER JOIN servicio s ON drs.id_servicio = s.id_servicio
      WHERE drs.id_reserva = $1
      ORDER BY drs.fecha_agregado
    `;
    const result = await db.query(query, [idReserva]);
    return result.rows;
  }

  /**
   * Obtener detalle específico por ID
   */
  static async obtenerPorId(id) {
    const query = `
      SELECT 
        drs.id_detalle_reserva_servicio, drs.id_reserva, drs.id_servicio,
        drs.cantidad, drs.precio_unitario, drs.subtotal, drs.fecha_agregado,
        s.nombre as servicio_nombre, s.descripcion as servicio_descripcion,
        s.precio as precio_base_servicio
      FROM detalle_reserva_servicio drs
      INNER JOIN servicio s ON drs.id_servicio = s.id_servicio
      WHERE drs.id_detalle_reserva_servicio = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Agregar servicio a reserva
   */
  static async agregar(datos) {
    const { id_reserva, id_servicio, cantidad, precio_unitario } = datos;
    const subtotal = cantidad * precio_unitario;
    
    const query = `
      INSERT INTO detalle_reserva_servicio 
        (id_reserva, id_servicio, cantidad, precio_unitario, subtotal)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id_detalle_reserva_servicio, id_reserva, id_servicio,
                cantidad, precio_unitario, subtotal, fecha_agregado
    `;
    
    const result = await db.query(query, [
      id_reserva, id_servicio, cantidad, precio_unitario, subtotal
    ]);
    return result.rows[0];
  }

  /**
   * Actualizar cantidad de un servicio
   */
  static async actualizarCantidad(id, nuevaCantidad) {
    const query = `
      UPDATE detalle_reserva_servicio
      SET cantidad = $2,
          subtotal = cantidad * precio_unitario
      WHERE id_detalle_reserva_servicio = $1
      RETURNING id_detalle_reserva_servicio, id_reserva, id_servicio,
                cantidad, precio_unitario, subtotal
    `;
    const result = await db.query(query, [id, nuevaCantidad]);
    return result.rows[0];
  }

  /**
   * Eliminar servicio de reserva
   */
  static async eliminar(id) {
    const query = `
      DELETE FROM detalle_reserva_servicio
      WHERE id_detalle_reserva_servicio = $1
      RETURNING id_detalle_reserva_servicio
    `;
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Obtener total de servicios de una reserva
   */
  static async obtenerTotalPorReserva(idReserva) {
    const query = `
      SELECT COALESCE(SUM(subtotal), 0) as total_servicios
      FROM detalle_reserva_servicio
      WHERE id_reserva = $1
    `;
    const result = await db.query(query, [idReserva]);
    return parseFloat(result.rows[0].total_servicios);
  }

  /**
   * Obtener servicios más solicitados
   */
  static async obtenerServiciosMasSolicitados(limit = 10) {
    const query = `
      SELECT 
        s.id_servicio, s.nombre, s.descripcion, s.precio,
        COUNT(drs.id_detalle_reserva_servicio) as total_reservas,
        SUM(drs.cantidad) as total_cantidad,
        SUM(drs.subtotal) as total_ingresos
      FROM servicio s
      INNER JOIN detalle_reserva_servicio drs ON s.id_servicio = drs.id_servicio
      INNER JOIN reserva r ON drs.id_reserva = r.id_reserva
      WHERE r.estado NOT IN ('Cancelada')
      GROUP BY s.id_servicio, s.nombre, s.descripcion, s.precio
      ORDER BY total_cantidad DESC
      LIMIT $1
    `;
    const result = await db.query(query, [limit]);
    return result.rows;
  }
}

module.exports = DetalleReservaServicio;
