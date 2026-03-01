/**
 * =============================================
 * ROL_PERMISO CONTROLLER
 * =============================================
 * 
 * Controlador para gestionar la relación roles-permisos
 */

const RolPermiso = require('../models/RolPermiso');

const rolPermisoController = {
  /**
   * Obtener permisos de un rol
   */
  obtenerPermisosPorRol: async (req, res) => {
    try {
      const { idRol } = req.params;
      const permisos = await RolPermiso.obtenerPermisosPorRol(idRol);
      res.json({
        success: true,
        data: permisos
      });
    } catch (error) {
      console.error('Error obteniendo permisos del rol:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener permisos del rol',
        error: error.message
      });
    }
  },

  /**
   * Obtener roles que tienen un permiso
   */
  obtenerRolesPorPermiso: async (req, res) => {
    try {
      const { idPermiso } = req.params;
      const roles = await RolPermiso.obtenerRolesPorPermiso(idPermiso);
      res.json({
        success: true,
        data: roles
      });
    } catch (error) {
      console.error('Error obteniendo roles con el permiso:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener roles con el permiso',
        error: error.message
      });
    }
  },

  /**
   * Asignar permiso a rol
   */
  asignar: async (req, res) => {
    try {
      const { id_roles, id_permisos } = req.body;
      const asignacion = await RolPermiso.asignar(id_roles, id_permisos);
      res.status(201).json({
        success: true,
        message: 'Permiso asignado correctamente',
        data: asignacion
      });
    } catch (error) {
      console.error('Error asignando permiso:', error);
      res.status(500).json({
        success: false,
        message: 'Error al asignar permiso',
        error: error.message
      });
    }
  },

  /**
   * Remover permiso de rol
   */
  remover: async (req, res) => {
    try {
      const { idRol, idPermiso } = req.params;
      const eliminado = await RolPermiso.remover(idRol, idPermiso);
      if (eliminado) {
        res.json({
          success: true,
          message: 'Permiso removido correctamente'
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Asignación no encontrada'
        });
      }
    } catch (error) {
      console.error('Error removiendo permiso:', error);
      res.status(500).json({
        success: false,
        message: 'Error al remover permiso',
        error: error.message
      });
    }
  }
};

module.exports = rolPermisoController;
