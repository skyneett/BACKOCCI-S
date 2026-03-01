/**
 * =============================================
 * CLIENTE MODEL - Modelo de Clientes
 * =============================================
 * 
 * Gestiona la información de clientes del sistema
 * Tabla: cliente
 */

const db = require('../config/database');

class Cliente {
  /**
   * Obtener todos los clientes
   */
  static async obtenerTodos() {
    const query = `
      SELECT 
        c.id_cliente, c.id_usuarios, c.id_roles,
        c.nombre, c.apellido, c.tipo_documento, c.numero_documento,
        c.telefono, c.direccion, c.fecha_nacimiento, c.estado,
        c.ultimo_acceso, c.fecha_registro, c.fecha_actualizacion,
        u.correo,
        r.nombre as rol_nombre
      FROM cliente c
      INNER JOIN usuarios u ON c.id_usuarios = u.id_usuarios
      LEFT JOIN roles r ON c.id_roles = r.id_roles
      ORDER BY c.fecha_registro DESC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  /**
   * Obtener cliente por ID
   */
  static async obtenerPorId(id) {
    const query = `
      SELECT 
        c.id_cliente, c.id_usuarios, c.id_roles,
        c.nombre, c.apellido, c.tipo_documento, c.numero_documento,
        c.telefono, c.direccion, c.fecha_nacimiento, c.estado,
        c.ultimo_acceso, c.fecha_registro, c.fecha_actualizacion,
        u.correo,
        r.nombre as rol_nombre
      FROM cliente c
      INNER JOIN usuarios u ON c.id_usuarios = u.id_usuarios
      LEFT JOIN roles r ON c.id_roles = r.id_roles
      WHERE c.id_cliente = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Obtener cliente por ID de usuario
   */
  static async obtenerPorIdUsuario(idUsuario) {
    const query = `
      SELECT 
        c.id_cliente, c.id_usuarios, c.id_roles,
        c.nombre, c.apellido, c.tipo_documento, c.numero_documento,
        c.telefono, c.direccion, c.fecha_nacimiento, c.estado,
        c.ultimo_acceso, c.fecha_registro, c.fecha_actualizacion,
        u.correo,
        r.nombre as rol_nombre
      FROM cliente c
      INNER JOIN usuarios u ON c.id_usuarios = u.id_usuarios
      LEFT JOIN roles r ON c.id_roles = r.id_roles
      WHERE c.id_usuarios = $1
    `;
    const result = await db.query(query, [idUsuario]);
    return result.rows[0];
  }

  /**
   * Crear nuevo cliente (requiere usuario creado previamente)
   */
  static async crear(datos) {
    const {
      id_usuarios, id_roles, nombre, apellido, tipo_documento,
      numero_documento, telefono, direccion, fecha_nacimiento
    } = datos;
    
    const query = `
      INSERT INTO cliente (
        id_usuarios, id_roles, nombre, apellido, tipo_documento,
        numero_documento, telefono, direccion, fecha_nacimiento
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id_cliente, id_usuarios, id_roles, nombre, apellido,
                tipo_documento, numero_documento, telefono, direccion,
                fecha_nacimiento, estado, fecha_registro
    `;
    
    const result = await db.query(query, [
      id_usuarios, id_roles, nombre, apellido, tipo_documento,
      numero_documento, telefono, direccion, fecha_nacimiento
    ]);
    
    return result.rows[0];
  }

  /**
   * Actualizar cliente
   */
  static async actualizar(id, datos) {
    const {
      nombre, apellido, tipo_documento, numero_documento,
      telefono, direccion, fecha_nacimiento, estado
    } = datos;
    
    const query = `
      UPDATE cliente
      SET 
        nombre = COALESCE($1, nombre),
        apellido = COALESCE($2, apellido),
        tipo_documento = COALESCE($3, tipo_documento),
        numero_documento = COALESCE($4, numero_documento),
        telefono = COALESCE($5, telefono),
        direccion = COALESCE($6, direccion),
        fecha_nacimiento = COALESCE($7, fecha_nacimiento),
        estado = COALESCE($8, estado),
        fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id_cliente = $9
      RETURNING *
    `;
    
    const result = await db.query(query, [
      nombre, apellido, tipo_documento, numero_documento,
      telefono, direccion, fecha_nacimiento, estado, id
    ]);
    
    return result.rows[0];
  }

  /**
   * Actualizar último acceso
   */
  static async actualizarUltimoAcceso(id) {
    const query = `
      UPDATE cliente
      SET ultimo_acceso = CURRENT_TIMESTAMP
      WHERE id_cliente = $1
      RETURNING ultimo_acceso
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Eliminar cliente (también elimina usuario en cascada)
   */
  static async eliminar(id) {
    const query = 'DELETE FROM cliente WHERE id_cliente = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Buscar clientes por nombre o documento
   */
  static async buscar(termino) {
    const query = `
      SELECT 
        c.id_cliente, c.nombre, c.apellido, c.numero_documento,
        c.telefono, c.estado, u.correo
      FROM cliente c
      INNER JOIN usuarios u ON c.id_usuarios = u.id_usuarios
      WHERE 
        c.nombre ILIKE $1 OR
        c.apellido ILIKE $1 OR
        c.numero_documento ILIKE $1 OR
        u.correo ILIKE $1
      ORDER BY c.nombre ASC
      LIMIT 20
    `;
    const result = await db.query(query, [`%${termino}%`]);
    return result.rows;
  }

  /**
   * Obtener estadísticas de un cliente
   */
  static async obtenerEstadisticas(idCliente) {
    const query = `
      SELECT 
        COUNT(r.id_reserva) as total_reservas,
        SUM(CASE WHEN r.estado = 'Confirmada' THEN 1 ELSE 0 END) as reservas_confirmadas,
        SUM(CASE WHEN r.estado = 'Cancelada' THEN 1 ELSE 0 END) as reservas_canceladas,
        COALESCE(SUM(r.monto_total), 0) as monto_total_gastado
      FROM cliente c
      LEFT JOIN reserva r ON c.id_cliente = r.id_cliente
      WHERE c.id_cliente = $1
      GROUP BY c.id_cliente
    `;
    const result = await db.query(query, [idCliente]);
    return result.rows[0] || {
      total_reservas: 0,
      reservas_confirmadas: 0,
      reservas_canceladas: 0,
      monto_total_gastado: 0
    };
  }
}

module.exports = Cliente;
