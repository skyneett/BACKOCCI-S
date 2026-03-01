/**
 * =============================================
 * PAGO_PROVEEDOR CONTROLLER
 * =============================================
 * 
 * Controlador para gestionar pagos a proveedores
 */

const PagoProveedor = require('../models/PagoProveedor');

const pagoProveedorController = {
  /**
   * Obtener todos los pagos
   */
  obtenerTodos: async (req, res) => {
    try {
      const pagos = await PagoProveedor.obtenerTodos();
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
      const pago = await PagoProveedor.obtenerPorId(id);
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
   * Obtener pagos por proveedor
   */
  obtenerPorProveedor: async (req, res) => {
    try {
      const { idProveedor } = req.params;
      const pagos = await PagoProveedor.obtenerPorProveedor(idProveedor);
      res.json({
        success: true,
        data: pagos
      });
    } catch (error) {
      console.error('Error obteniendo pagos del proveedor:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener pagos del proveedor',
        error: error.message
      });
    }
  },

  /**
   * Obtener pagos pendientes
   */
  obtenerPendientes: async (req, res) => {
    try {
      const pagos = await PagoProveedor.obtenerPendientes();
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
   * Crear pago
   */
  crear: async (req, res) => {
    try {
      const pago = await PagoProveedor.crear(req.body);
      res.status(201).json({
        success: true,
        message: 'Pago creado correctamente',
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
   * Actualizar pago
   */
  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const actualizado = await PagoProveedor.actualizar(id, req.body);
      res.json({
        success: true,
        message: 'Pago actualizado correctamente',
        data: actualizado
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
   * Cambiar estado
   */
  cambiarEstado: async (req, res) => {
    try {
      const { id } = req.params;
      const { estado } = req.body;
      const actualizado = await PagoProveedor.cambiarEstado(id, estado);
      res.json({
        success: true,
        message: 'Estado actualizado correctamente',
        data: actualizado
      });
    } catch (error) {
      console.error('Error cambiando estado:', error);
      res.status(500).json({
        success: false,
        message: 'Error al cambiar estado',
        error: error.message
      });
    }
  },

  /**
   * Eliminar (anular) pago
   */
  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      const eliminado = await PagoProveedor.eliminar(id);
      if (eliminado) {
        res.json({
          success: true,
          message: 'Pago anulado correctamente'
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Pago no encontrado'
        });
      }
    } catch (error) {
      console.error('Error anulando pago:', error);
      res.status(500).json({
        success: false,
        message: 'Error al anular pago',
        error: error.message
      });
    }
  }
};

module.exports = pagoProveedorController;
