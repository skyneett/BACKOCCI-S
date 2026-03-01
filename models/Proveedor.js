/**
 * =============================================
 * PROVEEDOR MODEL - Modelo de Proveedores
 * =============================================
 * 
 * Gestiona proveedores de servicios (transporte, alimentación, guías)
 * Tabla: proveedores
 */

const db = require('../config/database');

class Proveedor {
  /**
   * Obtener todos los proveedores
   */
  static async obtenerTodos() {
    const query = `
      SELECT 
        id_proveedores, nombre, tipo_servicio, telefono,
        email, direccion, estado, fecha_registro
      FROM proveedores
      ORDER BY nombre ASC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  /**
   * Obtener proveedor por ID
   */
  static async obtenerPorId(id) {
    const query = `
      SELECT 
        id_proveedores, nombre, tipo_servicio, telefono,
        email, direccion, estado, fecha_registro
      FROM proveedores
      WHERE id_proveedores = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Crear nuevo proveedor
   */
  static async crear(datos) {
    const { nombre, tipo_servicio, telefono, email, direccion } = datos;
    
    const query = `
      INSERT INTO proveedores (nombre, tipo_servicio, telefono, email, direccion)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const result = await db.query(query, [
      nombre, tipo_servicio, telefono, email, direccion
    ]);
    
    return result.rows[0];
  }

  /**
   * Actualizar proveedor
   */
  static async actualizar(id, datos) {
    const { nombre, tipo_servicio, telefono, email, direccion, estado } = datos;
    
    const query = `
      UPDATE proveedores
      SET 
        nombre = COALESCE($1, nombre),
        tipo_servicio = COALESCE($2, tipo_servicio),
        telefono = COALESCE($3, telefono),
        email = COALESCE($4, email),
        direccion = COALESCE($5, direccion),
        estado = COALESCE($6, estado)
      WHERE id_proveedores = $7
      RETURNING *
    `;
    
    const result = await db.query(query, [
      nombre, tipo_servicio, telefono, email, direccion, estado, id
    ]);
    
    return result.rows[0];
  }

  /**
   * Eliminar proveedor
   */
  static async eliminar(id) {
    const query = 'DELETE FROM proveedores WHERE id_proveedores = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Obtener servicios de un proveedor
   */
  static async obtenerServicios(idProveedor) {
    const query = `
      SELECT 
        s.id_servicio, s.nombre, s.descripcion, s.precio,
        s.imagen_url, s.estado,
        dps.precio_proveedor, dps.fecha_asignacion
      FROM servicio s
      INNER JOIN detalle_proveedor_servicio dps ON s.id_servicio = dps.id_servicio
      WHERE dps.id_proveedores = $1
      ORDER BY s.nombre ASC
    `;
    const result = await db.query(query, [idProveedor]);
    return result.rows;
  }

  /**
   * Asignar servicio a proveedor
   */
  static async asignarServicio(idProveedor, idServicio, precioProveedor) {
    const query = `
      INSERT INTO detalle_proveedor_servicio (id_proveedores, id_servicio, precio_proveedor)
      VALUES ($1, $2, $3)
      ON CONFLICT (id_proveedores, id_servicio) 
      DO UPDATE SET precio_proveedor = $3
      RETURNING *
    `;
    const result = await db.query(query, [idProveedor, idServicio, precioProveedor]);
    return result.rows[0];
  }

  /**
   * Remover servicio de proveedor
   */
  static async removerServicio(idProveedor, idServicio) {
    const query = `
      DELETE FROM detalle_proveedor_servicio
      WHERE id_proveedores = $1 AND id_servicio = $2
      RETURNING *
    `;
    const result = await db.query(query, [idProveedor, idServicio]);
    return result.rows[0];
  }

  /**
   * Obtener pagos realizados a un proveedor
   */
  static async obtenerPagos(idProveedor) {
    const query = `
      SELECT 
        id_pago_proveedor, observaciones, monto, fecha_pago,
        metodo_pago, numero_transaccion, comprobante_pago,
        estado, fecha_registro
      FROM pago_proveedor
      WHERE id_proveedores = $1
      ORDER BY fecha_pago DESC
    `;
    const result = await db.query(query, [idProveedor]);
    return result.rows;
  }

  /**
   * Registrar pago a proveedor
   */
  static async registrarPago(datos) {
    const {
      id_proveedores, observaciones, monto, fecha_pago,
      metodo_pago, numero_transaccion, comprobante_pago
    } = datos;
    
    const query = `
      INSERT INTO pago_proveedor (
        id_proveedores, observaciones, monto, fecha_pago,
        metodo_pago, numero_transaccion, comprobante_pago
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    const result = await db.query(query, [
      id_proveedores, observaciones, monto, fecha_pago,
      metodo_pago, numero_transaccion, comprobante_pago
    ]);
    
    return result.rows[0];
  }

  /**
   * Buscar proveedores
   */
  static async buscar(termino) {
    const query = `
      SELECT 
        id_proveedores, nombre, tipo_servicio, telefono, email, estado
      FROM proveedores
      WHERE 
        nombre ILIKE $1 OR
        tipo_servicio ILIKE $1 OR
        email ILIKE $1
      ORDER BY nombre ASC
      LIMIT 20
    `;
    const result = await db.query(query, [`%${termino}%`]);
    return result.rows;
  }

  /**
   * Obtener proveedores por tipo de servicio
   */
  static async obtenerPorTipo(tipoServicio) {
    const query = `
      SELECT 
        id_proveedores, nombre, tipo_servicio, telefono,
        email, direccion, estado
      FROM proveedores
      WHERE tipo_servicio = $1 AND estado = true
      ORDER BY nombre ASC
    `;
    const result = await db.query(query, [tipoServicio]);
    return result.rows;
  }
}

module.exports = Proveedor;
