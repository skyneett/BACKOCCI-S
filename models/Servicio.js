/**
 * =============================================
 * SERVICIO MODEL - Modelo de Servicios
 * =============================================
 * 
 * Gestiona servicios adicionales del sistema
 * Tabla: servicio
 */

const db = require('../config/database');

class Servicio {
  /**
   * Obtener todos los servicios
   */
  static async obtenerTodos() {
    const query = `
      SELECT 
        id_servicio, nombre, descripcion, precio,
        imagen_url, estado, fecha_creacion
      FROM servicio
      ORDER BY nombre ASC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  /**
   * Obtener servicios disponibles
   */
  static async obtenerDisponibles() {
    const query = `
      SELECT 
        id_servicio, nombre, descripcion, precio,
        imagen_url, estado, fecha_creacion
      FROM servicio
      WHERE estado = true
      ORDER BY nombre ASC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  /**
   * Obtener servicio por ID
   */
  static async obtenerPorId(id) {
    const query = `
      SELECT 
        id_servicio, nombre, descripcion, precio,
        imagen_url, estado, fecha_creacion
      FROM servicio
      WHERE id_servicio = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Crear nuevo servicio
   */
  static async crear(datos) {
    const { nombre, descripcion, precio, imagen_url } = datos;
    
    const query = `
      INSERT INTO servicio (nombre, descripcion, precio, imagen_url)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const result = await db.query(query, [
      nombre, descripcion, precio, imagen_url
    ]);
    
    return result.rows[0];
  }

  /**
   * Actualizar servicio
   */
  static async actualizar(id, datos) {
    const { nombre, descripcion, precio, imagen_url, estado } = datos;
    
    const query = `
      UPDATE servicio
      SET 
        nombre = COALESCE($1, nombre),
        descripcion = COALESCE($2, descripcion),
        precio = COALESCE($3, precio),
        imagen_url = COALESCE($4, imagen_url),
        estado = COALESCE($5, estado)
      WHERE id_servicio = $6
      RETURNING *
    `;
    
    const result = await db.query(query, [
      nombre, descripcion, precio, imagen_url, estado, id
    ]);
    
    return result.rows[0];
  }

  /**
   * Eliminar servicio
   */
  static async eliminar(id) {
    const query = 'DELETE FROM servicio WHERE id_servicio = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Buscar servicios
   */
  static async buscar(termino) {
    const query = `
      SELECT 
        id_servicio, nombre, descripcion, precio, estado
      FROM servicio
      WHERE 
        nombre ILIKE $1 OR
        descripcion ILIKE $1
      ORDER BY nombre ASC
      LIMIT 20
    `;
    const result = await db.query(query, [`%${termino}%`]);
    return result.rows;
  }

  /**
   * Obtener proveedores de un servicio
   */
  static async obtenerProveedores(idServicio) {
    const query = `
      SELECT 
        p.id_proveedores, p.nombre, p.tipo_servicio,
        p.telefono, p.email, p.estado,
        dps.precio_proveedor, dps.fecha_asignacion
      FROM proveedores p
      INNER JOIN detalle_proveedor_servicio dps ON p.id_proveedores = dps.id_proveedores
      WHERE dps.id_servicio = $1
      ORDER BY p.nombre ASC
    `;
    const result = await db.query(query, [idServicio]);
    return result.rows;
  }

  /**
   * Obtener estadísticas de un servicio
   */
  static async obtenerEstadisticas(idServicio) {
    const query = `
      SELECT 
        COUNT(drs.id_detalle_reserva_servicio) as veces_solicitado,
        COALESCE(SUM(drs.cantidad), 0) as cantidad_total,
        COALESCE(SUM(drs.subtotal), 0) as ingresos_totales
      FROM servicio s
      LEFT JOIN detalle_reserva_servicio drs ON s.id_servicio = drs.id_servicio
      WHERE s.id_servicio = $1
      GROUP BY s.id_servicio
    `;
    const result = await db.query(query, [idServicio]);
    return result.rows[0] || {
      veces_solicitado: 0,
      cantidad_total: 0,
      ingresos_totales: 0
    };
  }
}

module.exports = Servicio;
