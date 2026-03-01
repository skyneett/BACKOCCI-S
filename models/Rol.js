/**
 * =============================================
 * ROL MODEL - Modelo de Roles
 * =============================================
 * 
 * Gestiona roles del sistema (Admin, Empleado, Cliente)
 * Tabla: roles
 */

const db = require('../config/database');

class Rol {
  /**
   * Obtener todos los roles
   */
  static async obtenerTodos() {
    const query = `
      SELECT id_roles, nombre, descripcion, estado, fecha_creacion
      FROM roles
      ORDER BY nombre ASC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  /**
   * Obtener rol por ID
   */
  static async obtenerPorId(id) {
    const query = `
      SELECT id_roles, nombre, descripcion, estado, fecha_creacion
      FROM roles
      WHERE id_roles = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Crear nuevo rol
   */
  static async crear(datos) {
    const { nombre, descripcion } = datos;
    const query = `
      INSERT INTO roles (nombre, descripcion)
      VALUES ($1, $2)
      RETURNING id_roles, nombre, descripcion, estado, fecha_creacion
    `;
    const result = await db.query(query, [nombre, descripcion]);
    return result.rows[0];
  }

  /**
   * Actualizar rol
   */
  static async actualizar(id, datos) {
    const { nombre, descripcion, estado } = datos;
    const query = `
      UPDATE roles
      SET nombre = COALESCE($1, nombre),
          descripcion = COALESCE($2, descripcion),
          estado = COALESCE($3, estado)
      WHERE id_roles = $4
      RETURNING id_roles, nombre, descripcion, estado, fecha_creacion
    `;
    const result = await db.query(query, [nombre, descripcion, estado, id]);
    return result.rows[0];
  }

  /**
   * Eliminar rol
   */
  static async eliminar(id) {
    const query = 'DELETE FROM roles WHERE id_roles = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Obtener permisos de un rol
   */
  static async obtenerPermisos(idRol) {
    const query = `
      SELECT p.id_permisos, p.nombre, p.descripcion
      FROM permisos p
      INNER JOIN rol_permiso rp ON p.id_permisos = rp.id_permisos
      WHERE rp.id_roles = $1
      ORDER BY p.nombre ASC
    `;
    const result = await db.query(query, [idRol]);
    return result.rows;
  }

  /**
   * Asignar permiso a rol
   */
  static async asignarPermiso(idRol, idPermiso) {
    const query = `
      INSERT INTO rol_permiso (id_roles, id_permisos)
      VALUES ($1, $2)
      ON CONFLICT (id_roles, id_permisos) DO NOTHING
      RETURNING *
    `;
    const result = await db.query(query, [idRol, idPermiso]);
    return result.rows[0];
  }

  /**
   * Remover permiso de rol
   */
  static async removerPermiso(idRol, idPermiso) {
    const query = `
      DELETE FROM rol_permiso
      WHERE id_roles = $1 AND id_permisos = $2
      RETURNING *
    `;
    const result = await db.query(query, [idRol, idPermiso]);
    return result.rows[0];
  }
}

module.exports = Rol;
