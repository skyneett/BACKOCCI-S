/**
 * =============================================
 * PAGO CONTROLLER - Controlador de Pagos/Abonos
 * =============================================
 * 
 * Gestiona los pagos con comprobantes
 */

const Pago = require('../models/Pago');

const pagoController = {
  /**
   * Obtener todos los pagos
   */
  obtenerTodos: async (req, res) => {
    try {
      const pagos = await Pago.obtenerTodos();
      res.json({
        success: true,
        data: pagos
      });
    } catch (error) {
      console.error('Error obteniendo pagos:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener pagos',
        error: error.message
      });
    }
  },

  /**
   * Obtener pago por ID
   */
  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const pago = await Pago.obtenerPorId(id);
      
      if (pago) {
        res.json({
          success: true,
          data: pago
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Pago no encontrado'
        });
      }
    } catch (error) {
      console.error('Error obteniendo pago:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener pago',
        error: error.message
      });
    }
  },

  /**
   * Obtener pagos de una venta
   */
  obtenerPorVenta: async (req, res) => {
    try {
      const { idVenta } = req.params;
      const pagos = await Pago.obtenerPorVenta(idVenta);
      res.json({
        success: true,
        data: pagos
      });
    } catch (error) {
      console.error('Error obteniendo pagos de venta:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener pagos de la venta',
        error: error.message
      });
    }
  },

  /**
   * Obtener pagos de una reserva
   */
  obtenerPorReserva: async (req, res) => {
    try {
      const { idReserva } = req.params;
      const pagos = await Pago.obtenerPorReserva(idReserva);
      res.json({
        success: true,
        data: pagos
      });
    } catch (error) {
      console.error('Error obteniendo pagos de reserva:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener pagos de la reserva',
        error: error.message
      });
    }
  },

  /**
   * Obtener pagos pendientes de verificación
   */
  obtenerPendientes: async (req, res) => {
    try {
      const pagos = await Pago.obtenerPendientes();
      res.json({
        success: true,
        data: pagos
      });
    } catch (error) {
      console.error('Error obteniendo pagos pendientes:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener pagos pendientes',
        error: error.message
      });
    }
  },

  /**
   * Crear nuevo pago/abono con comprobante
   */
  crear: async (req, res) => {
    try {
      const pago = await Pago.crear(req.body);
      res.status(201).json({
        success: true,
        message: 'Pago registrado correctamente. Pendiente de verificación.',
        data: pago
      });
    } catch (error) {
      console.error('Error creando pago:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear pago',
        error: error.message
      });
    }
  },

  /**
   * Verificar/Aprobar/Rechazar pago
   */
  verificar: async (req, res) => {
    try {
      const { id } = req.params;
      const { estado, observaciones, motivo_rechazo } = req.body;
      
      // Validar estado
      if (!['Verificado', 'Aprobado', 'Rechazado'].includes(estado)) {
        return res.status(400).json({
          success: false,
          message: 'Estado inválido. Debe ser: Verificado, Aprobado o Rechazado'
        });
      }
      
      // Si es rechazado, requerir motivo
      if (estado === 'Rechazado' && !motivo_rechazo) {
        return res.status(400).json({
          success: false,
          message: 'Debe proporcionar el motivo de rechazo'
        });
      }
      
      const pago = await Pago.verificar(id, req.body);
      
      const mensajes = {
        'Verificado': 'Pago verificado correctamente',
        'Aprobado': 'Pago aprobado. Estado de venta actualizado.',
        'Rechazado': 'Pago rechazado'
      };
      
      res.json({
        success: true,
        message: mensajes[estado],
        data: pago
      });
    } catch (error) {
      console.error('Error verificando pago:', error);
      res.status(500).json({
        success: false,
        message: 'Error al verificar pago',
        error: error.message
      });
    }
  },

  /**
   * Actualizar pago
   */
  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const pago = await Pago.actualizar(id, req.body);
      
      res.json({
        success: true,
        message: 'Pago actualizado correctamente',
        data: pago
      });
    } catch (error) {
      console.error('Error actualizando pago:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar pago',
        error: error.message
      });
    }
  },

  /**
   * Eliminar pago
   */
  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      const eliminado = await Pago.eliminar(id);
      
      if (eliminado) {
        res.json({
          success: true,
          message: 'Pago eliminado correctamente'
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Pago no encontrado'
        });
      }
    } catch (error) {
      console.error('Error eliminando pago:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar pago',
        error: error.message
      });
    }
  },

  /**
   * Obtener resumen de pagos de una venta
   */
  obtenerResumenVenta: async (req, res) => {
    try {
      const { idVenta } = req.params;
      const resumen = await Pago.obtenerResumenVenta(idVenta);
      res.json({
        success: true,
        data: resumen
      });
    } catch (error) {
      console.error('Error obteniendo resumen:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener resumen de pagos',
        error: error.message
      });
    }
  },

  /**
   * Obtener estadísticas generales
   */
  obtenerEstadisticas: async (req, res) => {
    try {
      const estadisticas = await Pago.obtenerEstadisticas();
      res.json({
        success: true,
        data: estadisticas
      });
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener estadísticas',
        error: error.message
      });
    }
  }
};

module.exports = pagoController;
