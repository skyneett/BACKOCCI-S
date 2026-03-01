/**
 * =============================================
 * RESERVA MODEL - Modelo de Reservas
 * =============================================
 * 
 * Gestiona las reservas de clientes
 * Tabla: reserva (y sus detalles)
 */

const db = require('../config/database');

class Reserva {
  /**
   * Obtener todas las reservas
   */
  static async obtenerTodos() {
    const query = `
      SELECT 
        r.id_reserva, r.id_cliente, r.fecha_reserva, r.estado,
        r.monto_total, r.notas, r.fecha_creacion,
        c.nombre as cliente_nombre, c.apellido as cliente_apellido,
        c.telefono as cliente_telefono, c.numero_documento
      FROM reserva r
      INNER JOIN cliente c ON r.id_cliente = c.id_cliente
      ORDER BY r.fecha_reserva DESC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  /**
   * Obtener reserva por ID (con todos sus detalles)
   */
  static async obtenerPorId(id) {
    const query = `
      SELECT 
        r.id_reserva, r.id_cliente, r.fecha_reserva, r.estado,
        r.monto_total, r.notas, r.cancelado_por, r.fecha_cancelacion,
        r.motivo_cancelacion, r.fecha_creacion, r.fecha_actualizacion,
        c.nombre as cliente_nombre, c.apellido as cliente_apellido,
        c.telefono as cliente_telefono, c.email as cliente_email,
        c.numero_documento, c.tipo_documento
      FROM reserva r
      INNER JOIN cliente c ON r.id_cliente = c.id_cliente
      INNER JOIN usuarios u ON c.id_usuarios = u.id_usuarios
      WHERE r.id_reserva = $1
    `;
    const result = await db.query(query, [id]);
    if (!result.rows[0]) return null;

    const reserva = result.rows[0];

    // Obtener detalles de programaciones
    reserva.programaciones = await this.obtenerDetallesProgramacion(id);
    
    // Obtener detalles de fincas
    reserva.fincas = await this.obtenerDetallesFinca(id);
    
    // Obtener detalles de servicios
    reserva.servicios = await this.obtenerDetallesServicio(id);
    
    // Obtener acompañantes
    reserva.acompanantes = await this.obtenerAcompanantes(id);

    return reserva;
  }

  /**
   * Obtener reservas de un cliente
   */
  static async obtenerPorCliente(idCliente) {
    const query = `
      SELECT 
        r.id_reserva, r.fecha_reserva, r.estado,
        r.monto_total, r.notas, r.fecha_creacion
      FROM reserva r
      WHERE r.id_cliente = $1
      ORDER BY r.fecha_reserva DESC
    `;
    const result = await db.query(query, [idCliente]);
    return result.rows;
  }

  /**
   * Crear nueva reserva
   */
  static async crear(datos) {
    const { id_cliente, notas } = datos;
    
    const query = `
      INSERT INTO reserva (id_cliente, notas)
      VALUES ($1, $2)
      RETURNING id_reserva, id_cliente, fecha_reserva, estado,
                monto_total, notas, fecha_creacion
    `;
    
    const result = await db.query(query, [id_cliente, notas]);
    return result.rows[0];
  }

  /**
   * Actualizar reserva
   */
  static async actualizar(id, datos) {
    const { estado, monto_total, notas } = datos;
    
    const query = `
      UPDATE reserva
      SET 
        estado = COALESCE($1, estado),
        monto_total = COALESCE($2, monto_total),
        notas = COALESCE($3, notas),
        fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id_reserva = $4
      RETURNING *
    `;
    
    const result = await db.query(query, [estado, monto_total, notas, id]);
    return result.rows[0];
  }

  /**
   * Cancelar reserva
   */
  static async cancelar(id, datos) {
    const { cancelado_por, motivo_cancelacion } = datos;
    
    const query = `
      UPDATE reserva
      SET 
        estado = 'Cancelada',
        cancelado_por = $1,
        motivo_cancelacion = $2,
        fecha_cancelacion = CURRENT_TIMESTAMP,
        fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id_reserva = $3
      RETURNING *
    `;
    
    const result = await db.query(query, [cancelado_por, motivo_cancelacion, id]);
    return result.rows[0];
  }

  /**
   * Eliminar reserva
   */
  static async eliminar(id) {
    const query = 'DELETE FROM reserva WHERE id_reserva = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Agregar programación a reserva
   */
  static async agregarProgramacion(datos) {
    const { id_reserva, id_programacion, cantidad_personas, precio_unitario } = datos;
    const subtotal = cantidad_personas * precio_unitario;
    
    const query = `
      INSERT INTO detalle_reserva_programacion (
        id_reserva, id_programacion, cantidad_personas, 
        precio_unitario, subtotal
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const result = await db.query(query, [
      id_reserva, id_programacion, cantidad_personas, precio_unitario, subtotal
    ]);
    
    return result.rows[0];
  }

  /**
   * Agregar finca a reserva
   */
  static async agregarFinca(datos) {
    const { 
      id_reserva, id_finca, fecha_checkin, fecha_checkout,
      numero_noches, precio_por_noche 
    } = datos;
    const subtotal = numero_noches * precio_por_noche;
    
    const query = `
      INSERT INTO detalle_reserva_finca (
        id_reserva, id_finca, fecha_checkin, fecha_checkout,
        numero_noches, precio_por_noche, subtotal
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    const result = await db.query(query, [
      id_reserva, id_finca, fecha_checkin, fecha_checkout,
      numero_noches, precio_por_noche, subtotal
    ]);
    
    return result.rows[0];
  }

  /**
   * Agregar servicio a reserva
   */
  static async agregarServicio(datos) {
    const { id_reserva, id_servicio, cantidad, precio_unitario } = datos;
    const subtotal = cantidad * precio_unitario;
    
    const query = `
      INSERT INTO detalle_reserva_servicio (
        id_reserva, id_servicio, cantidad, precio_unitario, subtotal
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const result = await db.query(query, [
      id_reserva, id_servicio, cantidad, precio_unitario, subtotal
    ]);
    
    return result.rows[0];
  }

  /**
   * Agregar acompañante a reserva
   */
  static async agregarAcompanante(datos) {
    const {
      id_reserva, id_cliente, nombre, apellido, tipo_documento,
      numero_documento, telefono, fecha_nacimiento
    } = datos;
    
    const query = `
      INSERT INTO detalle_reserva_acompanante (
        id_reserva, id_cliente, nombre, apellido, tipo_documento,
        numero_documento, telefono, fecha_nacimiento
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    const result = await db.query(query, [
      id_reserva, id_cliente, nombre, apellido, tipo_documento,
      numero_documento, telefono, fecha_nacimiento
    ]);
    
    return result.rows[0];
  }

  /**
   * Obtener detalles de programación de una reserva
   */
  static async obtenerDetallesProgramacion(idReserva) {
    const query = `
      SELECT 
        drp.id_detalle_reserva_programacion, drp.cantidad_personas,
        drp.precio_unitario, drp.subtotal,
        p.id_programacion, p.fecha_salida, p.fecha_regreso,
        r.nombre as ruta_nombre, r.dificultad
      FROM detalle_reserva_programacion drp
      INNER JOIN programacion p ON drp.id_programacion = p.id_programacion
      INNER JOIN ruta r ON p.id_ruta = r.id_ruta
      WHERE drp.id_reserva = $1
    `;
    const result = await db.query(query, [idReserva]);
    return result.rows;
  }

  /**
   * Obtener detalles de fincas de una reserva
   */
  static async obtenerDetallesFinca(idReserva) {
    const query = `
      SELECT 
        drf.id_detalle_reserva_finca, drf.fecha_checkin, drf.fecha_checkout,
        drf.numero_noches, drf.precio_por_noche, drf.subtotal,
        f.id_finca, f.nombre as finca_nombre, f.ubicacion
      FROM detalle_reserva_finca drf
      INNER JOIN finca f ON drf.id_finca = f.id_finca
      WHERE drf.id_reserva = $1
    `;
    const result = await db.query(query, [idReserva]);
    return result.rows;
  }

  /**
   * Obtener detalles de servicios de una reserva
   */
  static async obtenerDetallesServicio(idReserva) {
    const query = `
      SELECT 
        drs.id_detalle_reserva_servicio, drs.cantidad,
        drs.precio_unitario, drs.subtotal,
        s.id_servicio, s.nombre as servicio_nombre, s.descripcion
      FROM detalle_reserva_servicio drs
      INNER JOIN servicio s ON drs.id_servicio = s.id_servicio
      WHERE drs.id_reserva = $1
    `;
    const result = await db.query(query, [idReserva]);
    return result.rows;
  }

  /**
   * Obtener acompañantes de una reserva
   */
  static async obtenerAcompanantes(idReserva) {
    const query = `
      SELECT 
        id_detalle_reserva_acompanante, id_cliente, nombre, apellido,
        tipo_documento, numero_documento, telefono, fecha_nacimiento,
        fecha_agregado
      FROM detalle_reserva_acompanante
      WHERE id_reserva = $1
      ORDER BY fecha_agregado ASC
    `;
    const result = await db.query(query, [idReserva]);
    return result.rows;
  }

  /**
   * Calcular monto total de una reserva
   */
  static async calcularMontoTotal(idReserva) {
    const query = `
      SELECT 
        COALESCE(SUM(drp.subtotal), 0) +
        COALESCE(SUM(drf.subtotal), 0) +
        COALESCE(SUM(drs.subtotal), 0) as monto_total
      FROM reserva r
      LEFT JOIN detalle_reserva_programacion drp ON r.id_reserva = drp.id_reserva
      LEFT JOIN detalle_reserva_finca drf ON r.id_reserva = drf.id_reserva
      LEFT JOIN detalle_reserva_servicio drs ON r.id_reserva = drs.id_reserva
      WHERE r.id_reserva = $1
      GROUP BY r.id_reserva
    `;
    const result = await db.query(query, [idReserva]);
    return result.rows[0]?.monto_total || 0;
  }

  /**
   * Buscar reservas
   */
  static async buscar(termino) {
    const query = `
      SELECT 
        r.id_reserva, r.fecha_reserva, r.estado, r.monto_total,
        c.nombre as cliente_nombre, c.apellido as cliente_apellido,
        c.numero_documento
      FROM reserva r
      INNER JOIN cliente c ON r.id_cliente = c.id_cliente
      WHERE 
        CAST(r.id_reserva AS TEXT) ILIKE $1 OR
        c.nombre ILIKE $1 OR
        c.apellido ILIKE $1 OR
        c.numero_documento ILIKE $1 OR
        r.estado ILIKE $1
      ORDER BY r.fecha_reserva DESC
      LIMIT 20
    `;
    const result = await db.query(query, [`%${termino}%`]);
    return result.rows;
  }

  /**
   * Obtener reservas por estado
   */
  static async obtenerPorEstado(estado) {
    const query = `
      SELECT 
        r.id_reserva, r.fecha_reserva, r.monto_total, r.notas,
        c.nombre as cliente_nombre, c.apellido as cliente_apellido,
        c.telefono as cliente_telefono
      FROM reserva r
      INNER JOIN cliente c ON r.id_cliente = c.id_cliente
      WHERE r.estado = $1
      ORDER BY r.fecha_reserva DESC
    `;
    const result = await db.query(query, [estado]);
    return result.rows;
  }

  /**
   * Obtener reservas por rango de fechas
   */
  static async obtenerPorFechas(fechaInicio, fechaFin) {
    const query = `
      SELECT 
        r.id_reserva, r.fecha_reserva, r.estado, r.monto_total,
        c.nombre as cliente_nombre, c.apellido as cliente_apellido
      FROM reserva r
      INNER JOIN cliente c ON r.id_cliente = c.id_cliente
      WHERE r.fecha_reserva BETWEEN $1 AND $2
      ORDER BY r.fecha_reserva DESC
    `;
    const result = await db.query(query, [fechaInicio, fechaFin]);
    return result.rows;
  }
}

module.exports = Reserva;
