/**
 * =============================================
 * DETALLE_PROVEEDOR_SERVICIO CONTROLLER
 * =============================================
 * 
 * Controlador para gestionar servicios de proveedores
 */

const DetalleProveedorServicio = require('../models/DetalleProveedorServicio');

const detalleProveedorServicioController = {
  /**
   * Obtener servicios de un proveedor
   */
  obtenerServiciosPorProveedor: async (req, res) => {
    try {
      const { idProveedor } = req.params;
      const servicios = await DetalleProveedorServicio.obtenerServiciosPorProveedor(idProveedor);
      res.json({
        success: true,
        data: servicios
      });
    } catch (error) {
      console.error('Error obteniendo servicios del proveedor:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener servicios del proveedor',
        error: error.message
      });
    }
  },

  /**
   * Obtener proveedores de un servicio
   */
  obtenerProveedoresPorServicio: async (req, res) => {
    try {
      const { idServicio } = req.params;
      const proveedores = await DetalleProveedorServicio.obtenerProveedoresPorServicio(idServicio);
      res.json({
        success: true,
        data: proveedores
      });
    } catch (error) {
      console.error('Error obteniendo proveedores del servicio:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener proveedores del servicio',
        error: error.message
      });
    }
  },

  /**
   * Obtener detalle por ID
   */
  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const detalle = await DetalleProveedorServicio.obtenerPorId(id);
      if (detalle) {
        res.json({
          success: true,
          data: detalle
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Detalle no encontrado'
        });
      }
    } catch (error) {
      console.error('Error obteniendo detalle:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener detalle',
        error: error.message
      });
    }
  },

  /**
   * Asignar servicio a proveedor
   */
  asignar: async (req, res) => {
    try {
      const asignacion = await DetalleProveedorServicio.asignar(req.body);
      res.status(201).json({
        success: true,
        message: 'Servicio asignado correctamente',
        data: asignacion
      });
    } catch (error) {
      console.error('Error asignando servicio:', error);
      res.status(500).json({
        success: false,
        message: 'Error al asignar servicio',
        error: error.message
      });
    }
  },

  /**
   * Actualizar precio
   */
  actualizarPrecio: async (req, res) => {
    try {
      const { id } = req.params;
      const { precio_proveedor } = req.body;
      const actualizado = await DetalleProveedorServicio.actualizarPrecio(id, precio_proveedor);
      res.json({
        success: true,
        message: 'Precio actualizado correctamente',
        data: actualizado
      });
    } catch (error) {
      console.error('Error actualizando precio:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar precio',
        error: error.message
      });
    }
  },

  /**
   * Eliminar asignación
   */
  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      const eliminado = await DetalleProveedorServicio.eliminar(id);
      if (eliminado) {
        res.json({
          success: true,
          message: 'Asignación eliminada correctamente'
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Asignación no encontrada'
        });
      }
    } catch (error) {
      console.error('Error eliminando asignación:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar asignación',
        error: error.message
      });
    }
  }
};

module.exports = detalleProveedorServicioController;
