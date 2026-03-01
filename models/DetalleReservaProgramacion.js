/**
 * =============================================
 * DETALLE_RESERVA_PROGRAMACION MODEL
 * =============================================
 * 
 * Gestiona la relación entre reservas y programaciones (rutas programadas)
 * Tabla: detalle_reserva_programacion
 */

const db = require('../config/database');

class DetalleReservaProgramacion {
  /**
   * Obtener programaciones de una reserva
   */
  static async obtenerPorReserva(idReserva) {
    const query = `
      SELECT 
        drp.id_detalle_reserva_programacion, drp.id_reserva, drp.id_programacion,
        drp.cantidad_personas, drp.precio_unitario, drp.subtotal, drp.fecha_agregado,
        prog.fecha_salida, prog.fecha_regreso, prog.cupos_disponibles,
        prog.precio_programacion, prog.estado as programacion_estado,
        r.nombre as ruta_nombre, r.descripcion as ruta_descripcion,
        r.duracion_dias, r.dificultad
      FROM detalle_reserva_programacion drp
      INNER JOIN programacion prog ON drp.id_programacion = prog.id_programacion
      INNER JOIN ruta r ON prog.id_ruta = r.id_ruta
      WHERE drp.id_reserva = $1
      ORDER BY prog.fecha_salida
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
        drp.id_detalle_reserva_programacion, drp.id_reserva, drp.id_programacion,
        drp.cantidad_personas, drp.precio_unitario, drp.subtotal, drp.fecha_agregado,
        prog.fecha_salida, prog.fecha_regreso, prog.cupos_disponibles,
        r.nombre as ruta_nombre, r.descripcion as ruta_descripcion
      FROM detalle_reserva_programacion drp
      INNER JOIN programacion prog ON drp.id_programacion = prog.id_programacion
      INNER JOIN ruta r ON prog.id_ruta = r.id_ruta
      WHERE drp.id_detalle_reserva_programacion = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Agregar programación a reserva
   */
  static async agregar(datos) {
    const { id_reserva, id_programacion, cantidad_personas, precio_unitario } = datos;
    const subtotal = cantidad_personas * precio_unitario;
    
    const query = `
      INSERT INTO detalle_reserva_programacion 
        (id_reserva, id_programacion, cantidad_personas, precio_unitario, subtotal)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id_detalle_reserva_programacion, id_reserva, id_programacion,
                cantidad_personas, precio_unitario, subtotal, fecha_agregado
    `;
    
    const result = await db.query(query, [
      id_reserva, id_programacion, cantidad_personas, precio_unitario, subtotal
    ]);
    return result.rows[0];
  }

  /**
   * Actualizar cantidad de personas
   */
  static async actualizarCantidad(id, nuevaCantidad) {
    const query = `
      UPDATE detalle_reserva_programacion
      SET cantidad_personas = $2,
          subtotal = cantidad_personas * precio_unitario
      WHERE id_detalle_reserva_programacion = $1
      RETURNING id_detalle_reserva_programacion, id_reserva, id_programacion,
                cantidad_personas, precio_unitario, subtotal
    `;
    const result = await db.query(query, [id, nuevaCantidad]);
    return result.rows[0];
  }

  /**
   * Eliminar detalle
   */
  static async eliminar(id) {
    const query = `
      DELETE FROM detalle_reserva_programacion
      WHERE id_detalle_reserva_programacion = $1
      RETURNING id_detalle_reserva_programacion
    `;
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Obtener todas las reservas de una programación
   */
  static async obtenerPorProgramacion(idProgramacion) {
    const query = `
      SELECT 
        drp.id_detalle_reserva_programacion, drp.id_reserva, drp.cantidad_personas,
        drp.precio_unitario, drp.subtotal, drp.fecha_agregado,
        r.fecha_reserva, r.estado as reserva_estado,
        c.nombre as cliente_nombre, c.apellido as cliente_apellido,
        c.telefono as cliente_telefono
      FROM detalle_reserva_programacion drp
      INNER JOIN reserva r ON drp.id_reserva = r.id_reserva
      INNER JOIN cliente c ON r.id_cliente = c.id_cliente
      WHERE drp.id_programacion = $1
      ORDER BY drp.fecha_agregado DESC
    `;
    const result = await db.query(query, [idProgramacion]);
    return result.rows;
  }

  /**
   * Obtener total de personas reservadas en una programación
   */
  static async obtenerTotalPersonas(idProgramacion) {
    const query = `
      SELECT COALESCE(SUM(cantidad_personas), 0) as total_personas
      FROM detalle_reserva_programacion drp
      INNER JOIN reserva r ON drp.id_reserva = r.id_reserva
      WHERE drp.id_programacion = $1 
        AND r.estado NOT IN ('Cancelada')
    `;
    const result = await db.query(query, [idProgramacion]);
    return parseInt(result.rows[0].total_personas);
  }
}

module.exports = DetalleReservaProgramacion;
