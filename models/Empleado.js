/**
 * =============================================
 * EMPLEADO MODEL - Modelo de Empleados
 * =============================================
 * 
 * Gestiona la información de empleados del sistema
 * Tabla: empleado
 */

const db = require('../config/database');

class Empleado {
  /**
   * Obtener todos los empleados
   */
  static async obtenerTodos() {
    const query = `
      SELECT 
        e.id_empleado, e.id_usuarios, e.id_roles,
        e.nombre, e.apellido, e.tipo_documento, e.numero_documento,
        e.telefono, e.cargo, e.fecha_contratacion, e.estado,
        e.ultimo_acceso, e.fecha_registro, e.fecha_actualizacion,
        u.correo,
        r.nombre as rol_nombre
      FROM empleado e
      INNER JOIN usuarios u ON e.id_usuarios = u.id_usuarios
      LEFT JOIN roles r ON e.id_roles = r.id_roles
      ORDER BY e.fecha_registro DESC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  /**
   * Obtener empleado por ID
   */
  static async obtenerPorId(id) {
    const query = `
      SELECT 
        e.id_empleado, e.id_usuarios, e.id_roles,
        e.nombre, e.apellido, e.tipo_documento, e.numero_documento,
        e.telefono, e.cargo, e.fecha_contratacion, e.estado,
        e.ultimo_acceso, e.fecha_registro, e.fecha_actualizacion,
        u.correo,
        r.nombre as rol_nombre
      FROM empleado e
      INNER JOIN usuarios u ON e.id_usuarios = u.id_usuarios
      LEFT JOIN roles r ON e.id_roles = r.id_roles
      WHERE e.id_empleado = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Obtener empleado por ID de usuario
   */
  static async obtenerPorIdUsuario(idUsuario) {
    const query = `
      SELECT 
        e.id_empleado, e.id_usuarios, e.id_roles,
        e.nombre, e.apellido, e.tipo_documento, e.numero_documento,
        e.telefono, e.cargo, e.fecha_contratacion, e.estado,
        e.ultimo_acceso, e.fecha_registro, e.fecha_actualizacion,
        u.correo,
        r.nombre as rol_nombre
      FROM empleado e
      INNER JOIN usuarios u ON e.id_usuarios = u.id_usuarios
      LEFT JOIN roles r ON e.id_roles = r.id_roles
      WHERE e.id_usuarios = $1
    `;
    const result = await db.query(query, [idUsuario]);
    return result.rows[0];
  }

  /**
   * Crear nuevo empleado (requiere usuario creado previamente)
   */
  static async crear(datos) {
    const {
      id_usuarios, id_roles, nombre, apellido, tipo_documento,
      numero_documento, telefono, cargo, fecha_contratacion
    } = datos;
    
    const query = `
      INSERT INTO empleado (
        id_usuarios, id_roles, nombre, apellido, tipo_documento,
        numero_documento, telefono, cargo, fecha_contratacion
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id_empleado, id_usuarios, id_roles, nombre, apellido,
                tipo_documento, numero_documento, telefono, cargo,
                fecha_contratacion, estado, fecha_registro
    `;
    
    const result = await db.query(query, [
      id_usuarios, id_roles, nombre, apellido, tipo_documento,
      numero_documento, telefono, cargo, fecha_contratacion
    ]);
    
    return result.rows[0];
  }

  /**
   * Actualizar empleado
   */
  static async actualizar(id, datos) {
    const {
      nombre, apellido, tipo_documento, numero_documento,
      telefono, cargo, fecha_contratacion, estado
    } = datos;
    
    const query = `
      UPDATE empleado
      SET 
        nombre = COALESCE($1, nombre),
        apellido = COALESCE($2, apellido),
        tipo_documento = COALESCE($3, tipo_documento),
        numero_documento = COALESCE($4, numero_documento),
        telefono = COALESCE($5, telefono),
        cargo = COALESCE($6, cargo),
        fecha_contratacion = COALESCE($7, fecha_contratacion),
        estado = COALESCE($8, estado),
        fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id_empleado = $9
      RETURNING *
    `;
    
    const result = await db.query(query, [
      nombre, apellido, tipo_documento, numero_documento,
      telefono, cargo, fecha_contratacion, estado, id
    ]);
    
    return result.rows[0];
  }

  /**
   * Actualizar último acceso
   */
  static async actualizarUltimoAcceso(id) {
    const query = `
      UPDATE empleado
      SET ultimo_acceso = CURRENT_TIMESTAMP
      WHERE id_empleado = $1
      RETURNING ultimo_acceso
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Eliminar empleado
   */
  static async eliminar(id) {
    const query = 'DELETE FROM empleado WHERE id_empleado = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Buscar empleados por nombre o documento
   */
  static async buscar(termino) {
    const query = `
      SELECT 
        e.id_empleado, e.nombre, e.apellido, e.numero_documento,
        e.telefono, e.cargo, e.estado, u.correo
      FROM empleado e
      INNER JOIN usuarios u ON e.id_usuarios = u.id_usuarios
      WHERE 
        e.nombre ILIKE $1 OR
        e.apellido ILIKE $1 OR
        e.numero_documento ILIKE $1 OR
        e.cargo ILIKE $1 OR
        u.correo ILIKE $1
      ORDER BY e.nombre ASC
      LIMIT 20
    `;
    const result = await db.query(query, [`%${termino}%`]);
    return result.rows;
  }

  /**
   * Obtener programaciones asignadas a un empleado
   */
  static async obtenerProgramaciones(idEmpleado) {
    const query = `
      SELECT 
        p.id_programacion, p.fecha_salida, p.fecha_regreso,
        p.cupos_totales, p.cupos_disponibles, p.precio_programacion,
        p.estado, r.nombre as ruta_nombre
      FROM programacion p
      INNER JOIN ruta r ON p.id_ruta = r.id_ruta
      WHERE p.id_empleado = $1
      ORDER BY p.fecha_salida DESC
    `;
    const result = await db.query(query, [idEmpleado]);
    return result.rows;
  }
}

module.exports = Empleado;
