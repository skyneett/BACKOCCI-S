/**
 * =============================================
 * PROPIETARIO MODEL - Modelo de Propietarios
 * =============================================
 * 
 * Gestiona propietarios de fincas
 * Tabla: propietario
 */

const db = require('../config/database');

class Propietario {
  /**
   * Obtener todos los propietarios
   */
  static async obtenerTodos() {
    const query = `
      SELECT 
        id_propietario, nombre, apellido, tipo_documento,
        numero_documento, telefono, email, direccion,
        estado, fecha_registro
      FROM propietario
      ORDER BY nombre ASC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  /**
   * Obtener propietario por ID
   */
  static async obtenerPorId(id) {
    const query = `
      SELECT 
        id_propietario, nombre, apellido, tipo_documento,
        numero_documento, telefono, email, direccion,
        estado, fecha_registro
      FROM propietario
      WHERE id_propietario = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Crear nuevo propietario
   */
  static async crear(datos) {
    const {
      nombre, apellido, tipo_documento, numero_documento,
      telefono, email, direccion
    } = datos;
    
    const query = `
      INSERT INTO propietario (
        nombre, apellido, tipo_documento, numero_documento,
        telefono, email, direccion
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    const result = await db.query(query, [
      nombre, apellido, tipo_documento, numero_documento,
      telefono, email, direccion
    ]);
    
    return result.rows[0];
  }

  /**
   * Actualizar propietario
   */
  static async actualizar(id, datos) {
    const {
      nombre, apellido, tipo_documento, numero_documento,
      telefono, email, direccion, estado
    } = datos;
    
    const query = `
      UPDATE propietario
      SET 
        nombre = COALESCE($1, nombre),
        apellido = COALESCE($2, apellido),
        tipo_documento = COALESCE($3, tipo_documento),
        numero_documento = COALESCE($4, numero_documento),
        telefono = COALESCE($5, telefono),
        email = COALESCE($6, email),
        direccion = COALESCE($7, direccion),
        estado = COALESCE($8, estado)
      WHERE id_propietario = $9
      RETURNING *
    `;
    
    const result = await db.query(query, [
      nombre, apellido, tipo_documento, numero_documento,
      telefono, email, direccion, estado, id
    ]);
    
    return result.rows[0];
  }

  /**
   * Eliminar propietario
   */
  static async eliminar(id) {
    const query = 'DELETE FROM propietario WHERE id_propietario = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Obtener fincas de un propietario
   */
  static async obtenerFincas(idPropietario) {
    const query = `
      SELECT 
        id_finca, nombre, descripcion, direccion, ubicacion,
        capacidad_personas, precio_por_noche, imagen_principal,
        estado, fecha_registro
      FROM finca
      WHERE id_propietario = $1
      ORDER BY nombre ASC
    `;
    const result = await db.query(query, [idPropietario]);
    return result.rows;
  }

  /**
   * Buscar propietarios
   */
  static async buscar(termino) {
    const query = `
      SELECT 
        id_propietario, nombre, apellido, numero_documento,
        telefono, email, estado
      FROM propietario
      WHERE 
        nombre ILIKE $1 OR
        apellido ILIKE $1 OR
        numero_documento ILIKE $1 OR
        email ILIKE $1
      ORDER BY nombre ASC
      LIMIT 20
    `;
    const result = await db.query(query, [`%${termino}%`]);
    return result.rows;
  }
}

module.exports = Propietario;
