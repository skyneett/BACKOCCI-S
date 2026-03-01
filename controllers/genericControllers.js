/**
 * =============================================
 * CONTROLADORES RESTANTES - CRUD Genérico
 * =============================================
 */

const Permiso = require('../models/Permiso');
const Empleado = require('../models/Empleado');
const Propietario = require('../models/Propietario');
const Proveedor = require('../models/Proveedor');
const Finca = require('../models/Finca');
const Servicio = require('../models/Servicio');
const Programacion = require('../models/Programacion');
const Reserva = require('../models/Reserva');
const Venta = require('../models/Venta');
const { validarCamposRequeridos, formatearError } = require('../utils/validators');

// Helper para crear controlador CRUD genérico
const crearControladorCRUD = (Modelo, nombreEntidad) => ({
  obtenerTodos: async (req, res) => {
    try {
      const datos = await Modelo.obtenerTodos();
      res.json({ success: true, data: datos, total: datos.length });
    } catch (error) {
      res.status(500).json(formatearError(error, `Error al obtener ${nombreEntidad}`));
    }
  },

  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const dato = await Modelo.obtenerPorId(id);
      
      if (!dato) {
        return res.status(404).json({ error: `${nombreEntidad} no encontrado/a` });
      }
      
      res.json({ success: true, data: dato });
    } catch (error) {
      res.status(500).json(formatearError(error, `Error al obtener ${nombreEntidad}`));
    }
  },

  crear: async (req, res) => {
    try {
      const nuevoDato = await Modelo.crear(req.body);
      res.status(201).json({ success: true, message: `${nombreEntidad} creado/a`, data: nuevoDato });
    } catch (error) {
      res.status(500).json(formatearError(error, `Error al crear ${nombreEntidad}`));
    }
  },

  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const datoActualizado = await Modelo.actualizar(id, req.body);
      
      if (!datoActualizado) {
        return res.status(404).json({ error: `${nombreEntidad} no encontrado/a` });
      }
      
      res.json({ success: true, message: `${nombreEntidad} actualizado/a`, data: datoActualizado });
    } catch (error) {
      res.status(500).json(formatearError(error, `Error al actualizar ${nombreEntidad}`));
    }
  },

  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      const datoEliminado = await Modelo.eliminar(id);
      
      if (!datoEliminado) {
        return res.status(404).json({ error: `${nombreEntidad} no encontrado/a` });
      }
      
      res.json({ success: true, message: `${nombreEntidad} eliminado/a` });
    } catch (error) {
      res.status(500).json(formatearError(error, `Error al eliminar ${nombreEntidad}`));
    }
  }
});

// Exportar controladores
module.exports = {
  permisoController: crearControladorCRUD(Permiso, 'Permiso'),
  empleadoController: crearControladorCRUD(Empleado, 'Empleado'),
  propietarioController: crearControladorCRUD(Propietario, 'Propietario'),
  proveedorController: crearControladorCRUD(Proveedor, 'Proveedor'),
  fincaController: crearControladorCRUD(Finca, 'Finca'),
  servicioController: crearControladorCRUD(Servicio, 'Servicio'),
  programacionController: crearControladorCRUD(Programacion, 'Programacion'),
  reservaController: crearControladorCRUD(Reserva, 'Reserva'),
  ventaController: crearControladorCRUD(Venta, 'Venta')
};
