/**
 * =============================================
 * RUTA MODEL - Modelo de Rutas Turísticas
 * =============================================
 * 
 * Gestiona rutas turísticas del sistema
 * Tabla: ruta
 */

const db = require('../config/database');

class Ruta {
  /**
   * Obtener todas las rutas
   */
  static async obtenerTodos() {
    const query = `
      SELECT 
        id_ruta, nombre, descripcion, duracion_dias,
        precio_base, dificultad, imagen_url, estado,
        fecha_creacion
      FROM ruta
      ORDER BY nombre ASC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  /**
   * Obtener rutas activas
   */
  static async obtenerActivas() {
    const query = `
      SELECT 
        id_ruta, nombre, descripcion, duracion_dias,
        precio_base, dificultad, imagen_url, estado,
        fecha_creacion
      FROM ruta
      WHERE estado = true
      ORDER BY nombre ASC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  /**
   * Obtener ruta por ID
   */
  static async obtenerPorId(id) {
    const query = `
      SELECT 
        id_ruta, nombre, descripcion, duracion_dias,
        precio_base, dificultad, imagen_url, estado,
        fecha_creacion
      FROM ruta
      WHERE id_ruta = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Crear nueva ruta
   */
  static async crear(datos) {
    const {
      nombre, descripcion, duracion_dias, precio_base,
      dificultad, imagen_url
    } = datos;
    
    const query = `
      INSERT INTO ruta (
        nombre, descripcion, duracion_dias, precio_base,
        dificultad, imagen_url
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const result = await db.query(query, [
      nombre, descripcion, duracion_dias, precio_base,
      dificultad, imagen_url
    ]);
    
    return result.rows[0];
  }

  /**
   * Actualizar ruta
   */
  static async actualizar(id, datos) {
    const {
      nombre, descripcion, duracion_dias, precio_base,
      dificultad, imagen_url, estado
    } = datos;
    
    const query = `
      UPDATE ruta
      SET 
        nombre = COALESCE($1, nombre),
        descripcion = COALESCE($2, descripcion),
        duracion_dias = COALESCE($3, duracion_dias),
        precio_base = COALESCE($4, precio_base),
        dificultad = COALESCE($5, dificultad),
        imagen_url = COALESCE($6, imagen_url),
        estado = COALESCE($7, estado)
      WHERE id_ruta = $8
      RETURNING *
    `;
    
    const result = await db.query(query, [
      nombre, descripcion, duracion_dias, precio_base,
      dificultad, imagen_url, estado, id
    ]);
    
    return result.rows[0];
  }

  /**
   * Eliminar ruta
   */
  static async eliminar(id) {
    const query = 'DELETE FROM ruta WHERE id_ruta = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Obtener programaciones de una ruta
   */
  static async obtenerProgramaciones(idRuta) {
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
   * Buscar rutas
   */
  static async buscar(termino) {
    const query = `
      SELECT 
        id_ruta, nombre, descripcion, duracion_dias,
        precio_base, dificultad, estado
      FROM ruta
      WHERE 
        nombre ILIKE $1 OR
        descripcion ILIKE $1 OR
        dificultad ILIKE $1
      ORDER BY nombre ASC
      LIMIT 20
    `;
    const result = await db.query(query, [`%${termino}%`]);
    return result.rows;
  }

  /**
   * Obtener rutas por dificultad
   */
  static async obtenerPorDificultad(dificultad) {
    const query = `
      SELECT 
        id_ruta, nombre, descripcion, duracion_dias,
        precio_base, dificultad, imagen_url, estado
      FROM ruta
      WHERE dificultad = $1 AND estado = true
      ORDER BY precio_base ASC
    `;
    const result = await db.query(query, [dificultad]);
    return result.rows;
  }

  /**
   * Obtener estadísticas de una ruta
   */
  static async obtenerEstadisticas(idRuta) {
    const query = `
      SELECT 
        COUNT(DISTINCT p.id_programacion) as total_programaciones,
        COUNT(DISTINCT drp.id_reserva) as total_reservas,
        COALESCE(SUM(drp.subtotal), 0) as ingresos_totales
      FROM ruta r
      LEFT JOIN programacion p ON r.id_ruta = p.id_ruta
      LEFT JOIN detalle_reserva_programacion drp ON p.id_programacion = drp.id_programacion
      WHERE r.id_ruta = $1
      GROUP BY r.id_ruta
    `;
    const result = await db.query(query, [idRuta]);
    return result.rows[0] || {
      total_programaciones: 0,
      total_reservas: 0,
      ingresos_totales: 0
    };
  }
}

module.exports = Ruta;
