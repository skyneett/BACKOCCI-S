/**
 * =============================================
 * FINCA MODEL - Modelo de Fincas
 * =============================================
 * 
 * Gestiona fincas turísticas del sistema
 * Tabla: finca
 */

const db = require('../config/database');

class Finca {
  /**
   * Obtener todas las fincas
   */
  static async obtenerTodos() {
    const query = `
      SELECT 
        f.id_finca, f.id_propietario, f.nombre, f.descripcion,
        f.direccion, f.ubicacion, f.capacidad_personas,
        f.precio_por_noche, f.imagen_principal, f.estado,
        f.fecha_registro,
        p.nombre as propietario_nombre,
        p.apellido as propietario_apellido,
        p.telefono as propietario_telefono
      FROM finca f
      LEFT JOIN propietario p ON f.id_propietario = p.id_propietario
      ORDER BY f.nombre ASC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  /**
   * Obtener fincas activas
   */
  static async obtenerActivas() {
    const query = `
      SELECT 
        f.id_finca, f.id_propietario, f.nombre, f.descripcion,
        f.direccion, f.ubicacion, f.capacidad_personas,
        f.precio_por_noche, f.imagen_principal, f.estado,
        f.fecha_registro,
        p.nombre as propietario_nombre,
        p.apellido as propietario_apellido
      FROM finca f
      LEFT JOIN propietario p ON f.id_propietario = p.id_propietario
      WHERE f.estado = true
      ORDER BY f.nombre ASC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  /**
   * Obtener finca por ID
   */
  static async obtenerPorId(id) {
    const query = `
      SELECT 
        f.id_finca, f.id_propietario, f.nombre, f.descripcion,
        f.direccion, f.ubicacion, f.capacidad_personas,
        f.precio_por_noche, f.imagen_principal, f.estado,
        f.fecha_registro,
        p.nombre as propietario_nombre,
        p.apellido as propietario_apellido,
        p.telefono as propietario_telefono,
        p.email as propietario_email
      FROM finca f
      LEFT JOIN propietario p ON f.id_propietario = p.id_propietario
      WHERE f.id_finca = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Crear nueva finca
   */
  static async crear(datos) {
    const {
      id_propietario, nombre, descripcion, direccion, ubicacion,
      capacidad_personas, precio_por_noche, imagen_principal
    } = datos;
    
    const query = `
      INSERT INTO finca (
        id_propietario, nombre, descripcion, direccion, ubicacion,
        capacidad_personas, precio_por_noche, imagen_principal
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    const result = await db.query(query, [
      id_propietario, nombre, descripcion, direccion, ubicacion,
      capacidad_personas, precio_por_noche, imagen_principal
    ]);
    
    return result.rows[0];
  }

  /**
   * Actualizar finca
   */
  static async actualizar(id, datos) {
    const {
      id_propietario, nombre, descripcion, direccion, ubicacion,
      capacidad_personas, precio_por_noche, imagen_principal, estado
    } = datos;
    
    const query = `
      UPDATE finca
      SET 
        id_propietario = COALESCE($1, id_propietario),
        nombre = COALESCE($2, nombre),
        descripcion = COALESCE($3, descripcion),
        direccion = COALESCE($4, direccion),
        ubicacion = COALESCE($5, ubicacion),
        capacidad_personas = COALESCE($6, capacidad_personas),
        precio_por_noche = COALESCE($7, precio_por_noche),
        imagen_principal = COALESCE($8, imagen_principal),
        estado = COALESCE($9, estado)
      WHERE id_finca = $10
      RETURNING *
    `;
    
    const result = await db.query(query, [
      id_propietario, nombre, descripcion, direccion, ubicacion,
      capacidad_personas, precio_por_noche, imagen_principal, estado, id
    ]);
    
    return result.rows[0];
  }

  /**
   * Eliminar finca
   */
  static async eliminar(id) {
    const query = 'DELETE FROM finca WHERE id_finca = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Buscar fincas
   */
  static async buscar(termino) {
    const query = `
      SELECT 
        f.id_finca, f.nombre, f.ubicacion, f.capacidad_personas,
        f.precio_por_noche, f.estado,
        p.nombre as propietario_nombre
      FROM finca f
      LEFT JOIN propietario p ON f.id_propietario = p.id_propietario
      WHERE 
        f.nombre ILIKE $1 OR
        f.descripcion ILIKE $1 OR
        f.ubicacion ILIKE $1 OR
        p.nombre ILIKE $1
      ORDER BY f.nombre ASC
      LIMIT 20
    `;
    const result = await db.query(query, [`%${termino}%`]);
    return result.rows;
  }

  /**
   * Obtener fincas por capacidad
   */
  static async obtenerPorCapacidad(capacidadMinima) {
    const query = `
      SELECT 
        id_finca, nombre, descripcion, ubicacion,
        capacidad_personas, precio_por_noche, imagen_principal
      FROM finca
      WHERE capacidad_personas >= $1 AND estado = true
      ORDER BY precio_por_noche ASC
    `;
    const result = await db.query(query, [capacidadMinima]);
    return result.rows;
  }

  /**
   * Obtener reservas de una finca
   */
  static async obtenerReservas(idFinca) {
    const query = `
      SELECT 
        drf.id_detalle_reserva_finca, drf.fecha_checkin, 
        drf.fecha_checkout, drf.numero_noches, drf.subtotal,
        r.id_reserva, r.estado as reserva_estado,
        c.nombre as cliente_nombre, c.apellido as cliente_apellido,
        c.telefono as cliente_telefono
      FROM detalle_reserva_finca drf
      INNER JOIN reserva r ON drf.id_reserva = r.id_reserva
      INNER JOIN cliente c ON r.id_cliente = c.id_cliente
      WHERE drf.id_finca = $1
      ORDER BY drf.fecha_checkin DESC
    `;
    const result = await db.query(query, [idFinca]);
    return result.rows;
  }

  /**
   * Verificar disponibilidad de finca en fechas
   */
  static async verificarDisponibilidad(idFinca, fechaCheckin, fechaCheckout) {
    const query = `
      SELECT COUNT(*) as reservas_conflicto
      FROM detalle_reserva_finca drf
      INNER JOIN reserva r ON drf.id_reserva = r.id_reserva
      WHERE drf.id_finca = $1
        AND r.estado IN ('Pendiente', 'Confirmada')
        AND (
          (drf.fecha_checkin <= $2 AND drf.fecha_checkout > $2) OR
          (drf.fecha_checkin < $3 AND drf.fecha_checkout >= $3) OR
          (drf.fecha_checkin >= $2 AND drf.fecha_checkout <= $3)
        )
    `;
    const result = await db.query(query, [idFinca, fechaCheckin, fechaCheckout]);
    return result.rows[0].reservas_conflicto === '0';
  }
}

module.exports = Finca;
