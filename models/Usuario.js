/**
 * =============================================
 * USUARIO MODEL - Modelo de Usuarios
 * =============================================
 * 
 * Gestiona la autenticación (correo y contraseña)
 * Tabla: usuarios
 */

const db = require('../config/database');
const bcrypt = require('bcryptjs');

class Usuario {
  /**
   * Obtener todos los usuarios
   */
  static async obtenerTodos() {
    const query = `
      SELECT id_usuarios, correo, fecha_creacion
      FROM usuarios
      ORDER BY fecha_creacion DESC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  /**
   * Obtener usuario por ID
   */
  static async obtenerPorId(id) {
    const query = `
      SELECT id_usuarios, correo, fecha_creacion
      FROM usuarios
      WHERE id_usuarios = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Obtener usuario por correo (incluye contraseña para login)
   */
  static async obtenerPorCorreo(correo) {
    const query = `
      SELECT id_usuarios, correo, contrasena, fecha_creacion
      FROM usuarios
      WHERE correo = $1
    `;
    const result = await db.query(query, [correo]);
    return result.rows[0];
  }

  /**
   * Crear nuevo usuario
   */
  static async crear(datos) {
    const { correo, contrasena } = datos;
    
    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const contrasenaHash = await bcrypt.hash(contrasena, salt);
    
    const query = `
      INSERT INTO usuarios (correo, contrasena)
      VALUES ($1, $2)
      RETURNING id_usuarios, correo, fecha_creacion
    `;
    const result = await db.query(query, [correo, contrasenaHash]);
    return result.rows[0];
  }

  /**
   * Actualizar contraseña
   */
  static async actualizarContrasena(id, nuevaContrasena) {
    const salt = await bcrypt.genSalt(10);
    const contrasenaHash = await bcrypt.hash(nuevaContrasena, salt);
    
    const query = `
      UPDATE usuarios
      SET contrasena = $1
      WHERE id_usuarios = $2
      RETURNING id_usuarios, correo
    `;
    const result = await db.query(query, [contrasenaHash, id]);
    return result.rows[0];
  }

  /**
   * Verificar contraseña
   */
  static async verificarContrasena(contrasenaPlana, contrasenaHash) {
    return await bcrypt.compare(contrasenaPlana, contrasenaHash);
  }

  /**
   * Eliminar usuario
   */
  static async eliminar(id) {
    const query = 'DELETE FROM usuarios WHERE id_usuarios = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Obtener perfil completo (cliente o empleado)
   */
  static async obtenerPerfilCompleto(idUsuario) {
    // Intentar obtener como cliente
    const queryCliente = `
      SELECT 
        u.id_usuarios, u.correo,
        c.id_cliente, c.nombre, c.apellido, c.tipo_documento, 
        c.numero_documento, c.telefono, c.direccion, c.fecha_nacimiento,
        c.estado, c.ultimo_acceso,
        r.id_roles, r.nombre as rol_nombre,
        'cliente' as tipo_usuario
      FROM usuarios u
      INNER JOIN cliente c ON u.id_usuarios = c.id_usuarios
      LEFT JOIN roles r ON c.id_roles = r.id_roles
      WHERE u.id_usuarios = $1
    `;
    let result = await db.query(queryCliente, [idUsuario]);
    
    if (result.rows.length > 0) {
      return result.rows[0];
    }

    // Si no es cliente, intentar como empleado
    const queryEmpleado = `
      SELECT 
        u.id_usuarios, u.correo,
        e.id_empleado, e.nombre, e.apellido, e.tipo_documento,
        e.numero_documento, e.telefono, e.cargo, e.fecha_contratacion,
        e.estado, e.ultimo_acceso,
        r.id_roles, r.nombre as rol_nombre,
        'empleado' as tipo_usuario
      FROM usuarios u
      INNER JOIN empleado e ON u.id_usuarios = e.id_usuarios
      LEFT JOIN roles r ON e.id_roles = r.id_roles
      WHERE u.id_usuarios = $1
    `;
    result = await db.query(queryEmpleado, [idUsuario]);
    
    return result.rows[0];
  }
}

module.exports = Usuario;
