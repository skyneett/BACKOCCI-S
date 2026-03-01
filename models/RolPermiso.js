/**
 * =============================================
 * ROL_PERMISO MODEL - Modelo Relación Roles-Permisos
 * =============================================
 * 
 * Gestiona la relación muchos a muchos entre roles y permisos
 * Tabla: rol_permiso
 */

const db = require('../config/database');

class RolPermiso {
  /**
   * Obtener todos los permisos de un rol
   */
  static async obtenerPermisosPorRol(idRol) {
    const query = `
      SELECT 
        rp.id_rol_permiso, rp.id_roles, rp.id_permisos, rp.fecha_asignacion,
        p.nombre as permiso_nombre, p.descripcion as permiso_descripcion
      FROM rol_permiso rp
      INNER JOIN permisos p ON rp.id_permisos = p.id_permisos
      WHERE rp.id_roles = $1
      ORDER BY p.nombre
    `;
    const result = await db.query(query, [idRol]);
    return result.rows;
  }

  /**
   * Obtener todos los roles que tienen un permiso
   */
  static async obtenerRolesPorPermiso(idPermiso) {
    const query = `
      SELECT 
        rp.id_rol_permiso, rp.id_roles, rp.id_permisos, rp.fecha_asignacion,
        r.nombre as rol_nombre, r.descripcion as rol_descripcion
      FROM rol_permiso rp
      INNER JOIN roles r ON rp.id_roles = r.id_roles
      WHERE rp.id_permisos = $1
      ORDER BY r.nombre
    `;
    const result = await db.query(query, [idPermiso]);
    return result.rows;
  }

  /**
   * Asignar permiso a rol
   */
  static async asignar(idRol, idPermiso) {
    const query = `
      INSERT INTO rol_permiso (id_roles, id_permisos)
      VALUES ($1, $2)
      ON CONFLICT (id_roles, id_permisos) DO NOTHING
      RETURNING id_rol_permiso, id_roles, id_permisos, fecha_asignacion
    `;
    const result = await db.query(query, [idRol, idPermiso]);
    return result.rows[0];
  }

  /**
   * Remover permiso de rol
   */
  static async remover(idRol, idPermiso) {
    const query = `
      DELETE FROM rol_permiso
      WHERE id_roles = $1 AND id_permisos = $2
      RETURNING id_rol_permiso
    `;
    const result = await db.query(query, [idRol, idPermiso]);
    return result.rowCount > 0;
  }

  /**
   * Verificar si un rol tiene un permiso específico
   */
  static async verificarPermiso(idRol, idPermiso) {
    const query = `
      SELECT id_rol_permiso
      FROM rol_permiso
      WHERE id_roles = $1 AND id_permisos = $2
    `;
    const result = await db.query(query, [idRol, idPermiso]);
    return result.rows.length > 0;
  }

  /**
   * Asignar múltiples permisos a un rol
   */
  static async asignarMultiples(idRol, idsPermisos) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');
      
      const results = [];
      for (const idPermiso of idsPermisos) {
        const query = `
          INSERT INTO rol_permiso (id_roles, id_permisos)
          VALUES ($1, $2)
          ON CONFLICT (id_roles, id_permisos) DO NOTHING
          RETURNING id_rol_permiso, id_roles, id_permisos, fecha_asignacion
        `;
        const result = await client.query(query, [idRol, idPermiso]);
        if (result.rows[0]) {
          results.push(result.rows[0]);
        }
      }
      
      await client.query('COMMIT');
      return results;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Remover todos los permisos de un rol
   */
  static async removerTodosDelRol(idRol) {
    const query = `
      DELETE FROM rol_permiso
      WHERE id_roles = $1
      RETURNING id_rol_permiso
    `;
    const result = await db.query(query, [idRol]);
    return result.rowCount;
  }
}

module.exports = RolPermiso;
