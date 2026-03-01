/**
 * =============================================
 * PERMISO MODEL - Modelo de Permisos
 * =============================================
 * 
 * Gestiona permisos del sistema
 * Tabla: permisos
 */

const db = require('../config/database');

class Permiso {
  /**
   * Obtener todos los permisos
   */
  static async obtenerTodos() {
    const query = `
      SELECT id_permisos, nombre, descripcion, fecha_creacion
      FROM permisos
      ORDER BY nombre ASC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  /**
   * Obtener permiso por ID
   */
  static async obtenerPorId(id) {
    const query = `
      SELECT id_permisos, nombre, descripcion, fecha_creacion
      FROM permisos
      WHERE id_permisos = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Crear nuevo permiso
   */
  static async crear(datos) {
    const { nombre, descripcion } = datos;
    const query = `
      INSERT INTO permisos (nombre, descripcion)
      VALUES ($1, $2)
      RETURNING id_permisos, nombre, descripcion, fecha_creacion
    `;
    const result = await db.query(query, [nombre, descripcion]);
    return result.rows[0];
  }

  /**
   * Actualizar permiso
   */
  static async actualizar(id, datos) {
    const { nombre, descripcion } = datos;
    const query = `
      UPDATE permisos
      SET nombre = COALESCE($1, nombre),
          descripcion = COALESCE($2, descripcion)
      WHERE id_permisos = $3
      RETURNING id_permisos, nombre, descripcion, fecha_creacion
    `;
    const result = await db.query(query, [nombre, descripcion, id]);
    return result.rows[0];
  }

  /**
   * Eliminar permiso
   */
  static async eliminar(id) {
    const query = 'DELETE FROM permisos WHERE id_permisos = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Permiso;
