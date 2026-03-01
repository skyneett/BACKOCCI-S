/**
 * =============================================
 * DETALLE_RESERVA_FINCA MODEL
 * =============================================
 * 
 * Gestiona la relación entre reservas y fincas (hospedaje)
 * Tabla: detalle_reserva_finca
 */

const db = require('../config/database');

class DetalleReservaFinca {
  /**
   * Obtener fincas de una reserva
   */
  static async obtenerPorReserva(idReserva) {
    const query = `
      SELECT 
        drf.id_detalle_reserva_finca, drf.id_reserva, drf.id_finca,
        drf.fecha_checkin, drf.fecha_checkout, drf.numero_noches,
        drf.precio_por_noche, drf.subtotal, drf.fecha_agregado,
        f.nombre as finca_nombre, f.descripcion as finca_descripcion,
        f.direccion, f.ubicacion, f.capacidad_personas,
        f.imagen_principal, f.estado as finca_estado,
        prop.nombre as propietario_nombre, prop.apellido as propietario_apellido,
        prop.telefono as propietario_telefono
      FROM detalle_reserva_finca drf
      INNER JOIN finca f ON drf.id_finca = f.id_finca
      LEFT JOIN propietario prop ON f.id_propietario = prop.id_propietario
      WHERE drf.id_reserva = $1
      ORDER BY drf.fecha_checkin
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
        drf.id_detalle_reserva_finca, drf.id_reserva, drf.id_finca,
        drf.fecha_checkin, drf.fecha_checkout, drf.numero_noches,
        drf.precio_por_noche, drf.subtotal, drf.fecha_agregado,
        f.nombre as finca_nombre, f.descripcion as finca_descripcion,
        f.direccion, f.ubicacion
      FROM detalle_reserva_finca drf
      INNER JOIN finca f ON drf.id_finca = f.id_finca
      WHERE drf.id_detalle_reserva_finca = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Agregar finca a reserva
   */
  static async agregar(datos) {
    const { 
      id_reserva, id_finca, fecha_checkin, fecha_checkout, 
      numero_noches, precio_por_noche 
    } = datos;
    
    const subtotal = numero_noches * precio_por_noche;
    
    const query = `
      INSERT INTO detalle_reserva_finca 
        (id_reserva, id_finca, fecha_checkin, fecha_checkout, 
         numero_noches, precio_por_noche, subtotal)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id_detalle_reserva_finca, id_reserva, id_finca,
                fecha_checkin, fecha_checkout, numero_noches,
                precio_por_noche, subtotal, fecha_agregado
    `;
    
    const result = await db.query(query, [
      id_reserva, id_finca, fecha_checkin, fecha_checkout,
      numero_noches, precio_por_noche, subtotal
    ]);
    return result.rows[0];
  }

  /**
   * Actualizar fechas de hospedaje
   */
  static async actualizarFechas(id, datos) {
    const { fecha_checkin, fecha_checkout, numero_noches } = datos;
    
    const query = `
      UPDATE detalle_reserva_finca
      SET fecha_checkin = $2,
          fecha_checkout = $3,
          numero_noches = $4,
          subtotal = numero_noches * precio_por_noche
      WHERE id_detalle_reserva_finca = $1
      RETURNING id_detalle_reserva_finca, id_reserva, id_finca,
                fecha_checkin, fecha_checkout, numero_noches,
                precio_por_noche, subtotal
    `;
    const result = await db.query(query, [
      id, fecha_checkin, fecha_checkout, numero_noches
    ]);
    return result.rows[0];
  }

  /**
   * Eliminar detalle
   */
  static async eliminar(id) {
    const query = `
      DELETE FROM detalle_reserva_finca
      WHERE id_detalle_reserva_finca = $1
      RETURNING id_detalle_reserva_finca
    `;
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Obtener reservas de una finca en un rango de fechas
   */
  static async obtenerReservasPorFincaYFecha(idFinca, fechaInicio, fechaFin) {
    const query = `
      SELECT 
        drf.id_detalle_reserva_finca, drf.fecha_checkin, drf.fecha_checkout,
        drf.numero_noches, drf.subtotal,
        r.id_reserva, r.estado as reserva_estado,
        c.nombre as cliente_nombre, c.apellido as cliente_apellido,
        c.telefono as cliente_telefono
      FROM detalle_reserva_finca drf
      INNER JOIN reserva r ON drf.id_reserva = r.id_reserva
      INNER JOIN cliente c ON r.id_cliente = c.id_cliente
      WHERE drf.id_finca = $1
        AND r.estado NOT IN ('Cancelada')
        AND (
          (drf.fecha_checkin BETWEEN $2 AND $3) OR
          (drf.fecha_checkout BETWEEN $2 AND $3) OR
          (drf.fecha_checkin <= $2 AND drf.fecha_checkout >= $3)
        )
      ORDER BY drf.fecha_checkin
    `;
    const result = await db.query(query, [idFinca, fechaInicio, fechaFin]);
    return result.rows;
  }

  /**
   * Verificar disponibilidad de finca
   */
  static async verificarDisponibilidad(idFinca, fechaCheckin, fechaCheckout) {
    const reservasConflicto = await this.obtenerReservasPorFincaYFecha(
      idFinca, fechaCheckin, fechaCheckout
    );
    return reservasConflicto.length === 0;
  }
}

module.exports = DetalleReservaFinca;
