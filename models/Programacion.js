/**
 * =============================================
 * PROGRAMACION MODEL - Modelo de Programaciones
 * =============================================
 * 
 * Gestiona las programaciones de rutas turísticas
 * Tabla: programacion
 */

const db = require('../config/database');

class Programacion {
  /**
   * Obtener todas las programaciones
   */
  static async obtenerTodos() {
    const query = `
      SELECT 
        p.id_programacion, p.id_ruta, p.id_empleado,
        p.fecha_salida, p.fecha_regreso, p.cupos_totales,
        p.cupos_disponibles, p.precio_programacion, p.estado,
        p.fecha_creacion,
        r.nombre as ruta_nombre, r.duracion_dias,
        e.nombre as empleado_nombre, e.apellido as empleado_apellido
      FROM programacion p
      INNER JOIN ruta r ON p.id_ruta = r.id_ruta
      LEFT JOIN empleado e ON p.id_empleado = e.id_empleado
      ORDER BY p.fecha_salida DESC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  /**
   * Obtener programaciones activas (futuras y programadas)
   */
  static async obtenerActivas() {
    const query = `
      SELECT 
        p.id_programacion, p.id_ruta, p.id_empleado,
        p.fecha_salida, p.fecha_regreso, p.cupos_totales,
        p.cupos_disponibles, p.precio_programacion, p.estado,
        p.fecha_creacion,
        r.nombre as ruta_nombre, r.duracion_dias, r.dificultad,
        r.imagen_url,
        e.nombre as empleado_nombre, e.apellido as empleado_apellido
      FROM programacion p
      INNER JOIN ruta r ON p.id_ruta = r.id_ruta
      LEFT JOIN empleado e ON p.id_empleado = e.id_empleado
      WHERE p.estado = 'Programado' 
        AND p.fecha_salida >= CURRENT_DATE
        AND p.cupos_disponibles > 0
      ORDER BY p.fecha_salida ASC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  /**
   * Obtener programación por ID
   */
  static async obtenerPorId(id) {
    const query = `
      SELECT 
        p.id_programacion, p.id_ruta, p.id_empleado,
        p.fecha_salida, p.fecha_regreso, p.cupos_totales,
        p.cupos_disponibles, p.precio_programacion, p.estado,
        p.fecha_creacion,
        r.nombre as ruta_nombre, r.descripcion as ruta_descripcion,
        r.duracion_dias, r.dificultad, r.imagen_url,
        e.nombre as empleado_nombre, e.apellido as empleado_apellido,
        e.telefono as empleado_telefono
      FROM programacion p
      INNER JOIN ruta r ON p.id_ruta = r.id_ruta
      LEFT JOIN empleado e ON p.id_empleado = e.id_empleado
      WHERE p.id_programacion = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Crear nueva programación
   */
  static async crear(datos) {
    const {
      id_ruta, id_empleado, fecha_salida, fecha_regreso,
      cupos_totales, precio_programacion
    } = datos;
    
    const query = `
      INSERT INTO programacion (
        id_ruta, id_empleado, fecha_salida, fecha_regreso,
        cupos_totales, cupos_disponibles, precio_programacion
      )
      VALUES ($1, $2, $3, $4, $5, $5, $6)
      RETURNING *
    `;
    
    const result = await db.query(query, [
      id_ruta, id_empleado, fecha_salida, fecha_regreso,
      cupos_totales, precio_programacion
    ]);
    
    return result.rows[0];
  }

  /**
   * Actualizar programación
   */
  static async actualizar(id, datos) {
    const {
      id_ruta, id_empleado, fecha_salida, fecha_regreso,
      cupos_totales, cupos_disponibles, precio_programacion, estado
    } = datos;
    
    const query = `
      UPDATE programacion
      SET 
        id_ruta = COALESCE($1, id_ruta),
        id_empleado = COALESCE($2, id_empleado),
        fecha_salida = COALESCE($3, fecha_salida),
        fecha_regreso = COALESCE($4, fecha_regreso),
        cupos_totales = COALESCE($5, cupos_totales),
        cupos_disponibles = COALESCE($6, cupos_disponibles),
        precio_programacion = COALESCE($7, precio_programacion),
        estado = COALESCE($8, estado)
      WHERE id_programacion = $9
      RETURNING *
    `;
    
    const result = await db.query(query, [
      id_ruta, id_empleado, fecha_salida, fecha_regreso,
      cupos_totales, cupos_disponibles, precio_programacion, estado, id
    ]);
    
    return result.rows[0];
  }

  /**
   * Reducir cupos disponibles (al hacer reserva)
   */
  static async reducirCupos(id, cantidad) {
    const query = `
      UPDATE programacion
      SET cupos_disponibles = cupos_disponibles - $1
      WHERE id_programacion = $2
        AND cupos_disponibles >= $1
      RETURNING *
    `;
    const result = await db.query(query, [cantidad, id]);
    return result.rows[0];
  }

  /**
   * Liberar cupos (al cancelar reserva)
   */
  static async liberarCupos(id, cantidad) {
    const query = `
      UPDATE programacion
      SET cupos_disponibles = LEAST(cupos_disponibles + $1, cupos_totales)
      WHERE id_programacion = $2
      RETURNING *
    `;
    const result = await db.query(query, [cantidad, id]);
    return result.rows[0];
  }

  /**
   * Eliminar programación
   */
  static async eliminar(id) {
    const query = 'DELETE FROM programacion WHERE id_programacion = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Buscar programaciones
   */
  static async buscar(termino) {
    const query = `
      SELECT 
        p.id_programacion, p.fecha_salida, p.fecha_regreso,
        p.cupos_disponibles, p.precio_programacion, p.estado,
        r.nombre as ruta_nombre
      FROM programacion p
      INNER JOIN ruta r ON p.id_ruta = r.id_ruta
      WHERE 
        r.nombre ILIKE $1 OR
        p.estado ILIKE $1
      ORDER BY p.fecha_salida DESC
      LIMIT 20
    `;
    const result = await db.query(query, [`%${termino}%`]);
    return result.rows;
  }

  /**
   * Obtener programaciones por ruta
   */
  static async obtenerPorRuta(idRuta) {
    const query = `
      SELECT 
        p.id_programacion, p.fecha_salida, p.fecha_regreso,
        p.cupos_totales, p.cupos_disponibles, p.precio_programacion,
        p.estado,
        e.nombre as empleado_nombre, e.apellido as empleado_apellido
      FROM programacion p
      LEFT JOIN empleado e ON p.id_empleado = e.id_empleado
      WHERE p.id_ruta = $1
      ORDER BY p.fecha_salida DESC
    `;
    const result = await db.query(query, [idRuta]);
    return result.rows;
  }

  /**
   * Obtener programaciones por empleado
   */
  static async obtenerPorEmpleado(idEmpleado) {
    const query = `
      SELECT 
        p.id_programacion, p.fecha_salida, p.fecha_regreso,
        p.cupos_totales, p.cupos_disponibles, p.precio_programacion,
        p.estado,
        r.nombre as ruta_nombre, r.dificultad
      FROM programacion p
      INNER JOIN ruta r ON p.id_ruta = r.id_ruta
      WHERE p.id_empleado = $1
      ORDER BY p.fecha_salida DESC
    `;
    const result = await db.query(query, [idEmpleado]);
    return result.rows;
  }

  /**
   * Obtener reservas de una programación
   */
  static async obtenerReservas(idProgramacion) {
    const query = `
      SELECT 
        drp.id_detalle_reserva_programacion, drp.cantidad_personas,
        drp.precio_unitario, drp.subtotal,
        r.id_reserva, r.estado as reserva_estado, r.fecha_reserva,
        c.nombre as cliente_nombre, c.apellido as cliente_apellido,
        c.telefono as cliente_telefono
      FROM detalle_reserva_programacion drp
      INNER JOIN reserva r ON drp.id_reserva = r.id_reserva
      INNER JOIN cliente c ON r.id_cliente = c.id_cliente
      WHERE drp.id_programacion = $1
      ORDER BY r.fecha_reserva DESC
    `;
    const result = await db.query(query, [idProgramacion]);
    return result.rows;
  }

  /**
   * Verificar disponibilidad de cupos
   */
  static async verificarDisponibilidad(id, cantidadPersonas) {
    const query = `
      SELECT cupos_disponibles
      FROM programacion
      WHERE id_programacion = $1
    `;
    const result = await db.query(query, [id]);
    if (!result.rows[0]) return false;
    return result.rows[0].cupos_disponibles >= cantidadPersonas;
  }
}

module.exports = Programacion;
