/**
 * =============================================
 * DETALLE_RESERVA_ACOMPANANTE MODEL
 * =============================================
 * 
 * Gestiona personas adicionales en la reserva (además del cliente titular)
 * Tabla: detalle_reserva_acompanante
 */

const db = require('../config/database');

class DetalleReservaAcompanante {
  /**
   * Obtener acompañantes de una reserva
   */
  static async obtenerPorReserva(idReserva) {
    const query = `
      SELECT 
        dra.id_detalle_reserva_acompanante, dra.id_reserva, dra.id_cliente,
        dra.nombre, dra.apellido, dra.tipo_documento, dra.numero_documento,
        dra.telefono, dra.fecha_nacimiento, dra.fecha_agregado,
        c.correo as cliente_correo
      FROM detalle_reserva_acompanante dra
      LEFT JOIN cliente c ON dra.id_cliente = c.id_cliente
      WHERE dra.id_reserva = $1
      ORDER BY dra.fecha_agregado
    `;
    const result = await db.query(query, [idReserva]);
    return result.rows;
  }

  /**
   * Obtener acompañante específico por ID
   */
  static async obtenerPorId(id) {
    const query = `
      SELECT 
        dra.id_detalle_reserva_acompanante, dra.id_reserva, dra.id_cliente,
        dra.nombre, dra.apellido, dra.tipo_documento, dra.numero_documento,
        dra.telefono, dra.fecha_nacimiento, dra.fecha_agregado
      FROM detalle_reserva_acompanante dra
      WHERE dra.id_detalle_reserva_acompanante = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Agregar acompañante a reserva
   */
  static async agregar(datos) {
    const { 
      id_reserva, id_cliente, nombre, apellido, tipo_documento,
      numero_documento, telefono, fecha_nacimiento 
    } = datos;
    
    const query = `
      INSERT INTO detalle_reserva_acompanante 
        (id_reserva, id_cliente, nombre, apellido, tipo_documento,
         numero_documento, telefono, fecha_nacimiento)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id_detalle_reserva_acompanante, id_reserva, id_cliente,
                nombre, apellido, tipo_documento, numero_documento,
                telefono, fecha_nacimiento, fecha_agregado
    `;
    
    const result = await db.query(query, [
      id_reserva, id_cliente || null, nombre, apellido, tipo_documento || null,
      numero_documento || null, telefono || null, fecha_nacimiento || null
    ]);
    return result.rows[0];
  }

  /**
   * Actualizar información de acompañante
   */
  static async actualizar(id, datos) {
    const { 
      nombre, apellido, tipo_documento, numero_documento,
      telefono, fecha_nacimiento 
    } = datos;
    
    const query = `
      UPDATE detalle_reserva_acompanante
      SET nombre = $2,
          apellido = $3,
          tipo_documento = $4,
          numero_documento = $5,
          telefono = $6,
          fecha_nacimiento = $7
      WHERE id_detalle_reserva_acompanante = $1
      RETURNING id_detalle_reserva_acompanante, id_reserva, id_cliente,
                nombre, apellido, tipo_documento, numero_documento,
                telefono, fecha_nacimiento
    `;
    
    const result = await db.query(query, [
      id, nombre, apellido, tipo_documento || null,
      numero_documento || null, telefono || null, fecha_nacimiento || null
    ]);
    return result.rows[0];
  }

  /**
   * Eliminar acompañante de reserva
   */
  static async eliminar(id) {
    const query = `
      DELETE FROM detalle_reserva_acompanante
      WHERE id_detalle_reserva_acompanante = $1
      RETURNING id_detalle_reserva_acompanante
    `;
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Contar acompañantes de una reserva
   */
  static async contarPorReserva(idReserva) {
    const query = `
      SELECT COUNT(*) as total_acompanantes
      FROM detalle_reserva_acompanante
      WHERE id_reserva = $1
    `;
    const result = await db.query(query, [idReserva]);
    return parseInt(result.rows[0].total_acompanantes);
  }

  /**
   * Agregar múltiples acompañantes
   */
  static async agregarMultiples(idReserva, acompanantes) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');
      
      const resultados = [];
      for (const acompanante of acompanantes) {
        const query = `
          INSERT INTO detalle_reserva_acompanante 
            (id_reserva, id_cliente, nombre, apellido, tipo_documento,
             numero_documento, telefono, fecha_nacimiento)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING id_detalle_reserva_acompanante, id_reserva, nombre, apellido
        `;
        
        const result = await client.query(query, [
          idReserva,
          acompanante.id_cliente || null,
          acompanante.nombre,
          acompanante.apellido,
          acompanante.tipo_documento || null,
          acompanante.numero_documento || null,
          acompanante.telefono || null,
          acompanante.fecha_nacimiento || null
        ]);
        
        resultados.push(result.rows[0]);
      }
      
      await client.query('COMMIT');
      return resultados;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Obtener estadísticas de acompañantes por edad
   */
  static async obtenerEstadisticasPorEdad() {
    const query = `
      SELECT 
        CASE 
          WHEN EXTRACT(YEAR FROM AGE(fecha_nacimiento)) < 18 THEN 'Menores de 18'
          WHEN EXTRACT(YEAR FROM AGE(fecha_nacimiento)) BETWEEN 18 AND 30 THEN '18-30 años'
          WHEN EXTRACT(YEAR FROM AGE(fecha_nacimiento)) BETWEEN 31 AND 50 THEN '31-50 años'
          WHEN EXTRACT(YEAR FROM AGE(fecha_nacimiento)) > 50 THEN 'Mayores de 50'
          ELSE 'Sin especificar'
        END as rango_edad,
        COUNT(*) as total
      FROM detalle_reserva_acompanante
      WHERE fecha_nacimiento IS NOT NULL
      GROUP BY rango_edad
      ORDER BY total DESC
    `;
    const result = await db.query(query);
    return result.rows;
  }
}

module.exports = DetalleReservaAcompanante;
