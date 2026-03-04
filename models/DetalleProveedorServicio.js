/**
 * =============================================
 * DETALLE_PROVEEDOR_SERVICIO MODEL
 * =============================================
 * 
 * Gestiona la relación entre proveedores y servicios
 * Tabla: detalle_proveedor_servicio
 */

const db = require('../config/database');

class DetalleProveedorServicio {
  /**
   * Obtener todos los servicios de un proveedor
   */
  static async obtenerServiciosPorProveedor(idProveedor) {
    const query = `
      SELECT 
        dps.id_detalle_proveedor_servicio, dps.id_proveedores, dps.id_servicio,
        dps.precio_proveedor, dps.fecha_asignacion,
        s.nombre as servicio_nombre, s.descripcion as servicio_descripcion,
        s.precio as precio_base_servicio, s.estado as servicio_estado
      FROM detalle_proveedor_servicio dps
      INNER JOIN servicio s ON dps.id_servicio = s.id_servicio
      WHERE dps.id_proveedores = $1
      ORDER BY s.nombre
    `;
    const result = await db.query(query, [idProveedor]);
    return result.rows;
  }

  /**
   * Obtener todos los proveedores de un servicio
   */
  static async obtenerProveedoresPorServicio(idServicio) {
    const query = `
      SELECT 
        dps.id_detalle_proveedor_servicio, dps.id_proveedores, dps.id_servicio,
        dps.precio_proveedor, dps.fecha_asignacion,
        p.nombre as proveedor_nombre, p.id_tipo, tp.nombre as tipo_nombre,
        p.telefono, p.email, p.estado as proveedor_estado
      FROM detalle_proveedor_servicio dps
      INNER JOIN proveedores p ON dps.id_proveedores = p.id_proveedores
      LEFT JOIN tipo_proveedor tp ON p.id_tipo = tp.id_tipo
      WHERE dps.id_servicio = $1
      ORDER BY p.nombre
    `;
    const result = await db.query(query, [idServicio]);
    return result.rows;
  }

  /**
   * Obtener detalle específico por ID
   */
  static async obtenerPorId(id) {
    const query = `
      SELECT 
        dps.id_detalle_proveedor_servicio, dps.id_proveedores, dps.id_servicio,
        dps.precio_proveedor, dps.fecha_asignacion,
        p.nombre as proveedor_nombre, p.id_tipo, tp.nombre as tipo_nombre,
        s.nombre as servicio_nombre, s.descripcion as servicio_descripcion
      FROM detalle_proveedor_servicio dps
      INNER JOIN proveedores p ON dps.id_proveedores = p.id_proveedores
      LEFT JOIN tipo_proveedor tp ON p.id_tipo = tp.id_tipo
      INNER JOIN servicio s ON dps.id_servicio = s.id_servicio
      WHERE dps.id_detalle_proveedor_servicio = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Asignar servicio a proveedor
   */
  static async asignar(datos) {
    const { id_proveedores, id_servicio, precio_proveedor } = datos;
    
    const query = `
      INSERT INTO detalle_proveedor_servicio 
        (id_proveedores, id_servicio, precio_proveedor)
      VALUES ($1, $2, $3)
      ON CONFLICT (id_proveedores, id_servicio) DO UPDATE
        SET precio_proveedor = EXCLUDED.precio_proveedor
      RETURNING id_detalle_proveedor_servicio, id_proveedores, id_servicio,
                precio_proveedor, fecha_asignacion
    `;
    
    const result = await db.query(query, [id_proveedores, id_servicio, precio_proveedor]);
    return result.rows[0];
  }

  /**
   * Actualizar precio del proveedor
   */
  static async actualizarPrecio(id, nuevoPrecio) {
    const query = `
      UPDATE detalle_proveedor_servicio
      SET precio_proveedor = $2
      WHERE id_detalle_proveedor_servicio = $1
      RETURNING id_detalle_proveedor_servicio, id_proveedores, id_servicio,
                precio_proveedor, fecha_asignacion
    `;
    const result = await db.query(query, [id, nuevoPrecio]);
    return result.rows[0];
  }

  /**
   * Remover servicio de proveedor
   */
  static async eliminar(id) {
    const query = `
      DELETE FROM detalle_proveedor_servicio
      WHERE id_detalle_proveedor_servicio = $1
      RETURNING id_detalle_proveedor_servicio
    `;
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Verificar si un proveedor ofrece un servicio
   */
  static async verificarAsignacion(idProveedor, idServicio) {
    const query = `
      SELECT id_detalle_proveedor_servicio, precio_proveedor
      FROM detalle_proveedor_servicio
      WHERE id_proveedores = $1 AND id_servicio = $2
    `;
    const result = await db.query(query, [idProveedor, idServicio]);
    return result.rows[0];
  }
}

module.exports = DetalleProveedorServicio;
