/**
 * =============================================
 * TIPO PROVEEDOR MODEL - Modelo de Tipos de Proveedor
 * =============================================
 * 
 * Gestiona los tipos de proveedores
 * Tabla: tipo_proveedor
 */

const db = require('../config/database');

class TipoProveedor {
  /**
   * Obtener todos los tipos de proveedor
   */
  static async obtenerTodos() {
    const query = `
      SELECT 
        id_tipo, nombre, descripcion, estado
      FROM tipo_proveedor
      ORDER BY nombre ASC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  /**
   * Obtener tipos de proveedor activos
   */
  static async obtenerActivos() {
    const query = `
      SELECT 
        id_tipo, nombre, descripcion, estado
      FROM tipo_proveedor
      WHERE estado = true
      ORDER BY nombre ASC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  /**
   * Obtener tipo de proveedor por ID
   */
  static async obtenerPorId(id) {
    const query = `
      SELECT 
        id_tipo, nombre, descripcion, estado
      FROM tipo_proveedor
      WHERE id_tipo = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Crear nuevo tipo de proveedor
   */
  static async crear(datos) {
    const { nombre, descripcion, estado } = datos;
    
    const query = `
      INSERT INTO tipo_proveedor (nombre, descripcion, estado)
      VALUES ($1, $2, COALESCE($3, true))
      RETURNING *
    `;
    
    const result = await db.query(query, [nombre, descripcion, estado]);
    return result.rows[0];
  }

  /**
   * Actualizar tipo de proveedor
   */
  static async actualizar(id, datos) {
    const { nombre, descripcion, estado } = datos;
    
    const query = `
      UPDATE tipo_proveedor
      SET 
        nombre = COALESCE($1, nombre),
        descripcion = COALESCE($2, descripcion),
        estado = COALESCE($3, estado)
      WHERE id_tipo = $4
      RETURNING *
    `;
    
    const result = await db.query(query, [nombre, descripcion, estado, id]);
    return result.rows[0];
  }

  /**
   * Eliminar tipo de proveedor
   */
  static async eliminar(id) {
    const query = 'DELETE FROM tipo_proveedor WHERE id_tipo = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Cambiar estado de tipo de proveedor
   */
  static async cambiarEstado(id, estado) {
    const query = `
      UPDATE tipo_proveedor
      SET estado = $1
      WHERE id_tipo = $2
      RETURNING *
    `;
    const result = await db.query(query, [estado, id]);
    return result.rows[0];
  }

  /**
   * Verificar si un tipo tiene proveedores asociados
   */
  static async tieneProveedores(id) {
    const query = `
      SELECT COUNT(*) as total
      FROM proveedores
      WHERE id_tipo = $1
    `;
    const result = await db.query(query, [id]);
    return parseInt(result.rows[0].total) > 0;
  }

  /**
   * Obtener proveedores de un tipo
   */
  static async obtenerProveedores(id) {
    const query = `
      SELECT 
        id_proveedores, nombre, telefono, email, direccion, estado, fecha_registro
      FROM proveedores
      WHERE id_tipo = $1
      ORDER BY nombre ASC
    `;
    const result = await db.query(query, [id]);
    return result.rows;
  }

  /**
   * Buscar tipos de proveedor
   */
  static async buscar(termino) {
    const query = `
      SELECT 
        id_tipo, nombre, descripcion, estado
      FROM tipo_proveedor
      WHERE 
        nombre ILIKE $1 OR
        descripcion ILIKE $1
      ORDER BY nombre ASC
      LIMIT 20
    `;
    const result = await db.query(query, [`%${termino}%`]);
    return result.rows;
  }
}

module.exports = TipoProveedor;
