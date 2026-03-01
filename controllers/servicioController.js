/**
 * =============================================
 * SERVICIO CONTROLLER
 * =============================================
 */

const Servicio = require('../models/Servicio');
const { validarCamposRequeridos, formatearError } = require('../utils/validators');

exports.obtenerTodos = async (req, res) => {
  try {
    const servicios = await Servicio.obtenerTodos();
    res.json({ success: true, data: servicios, total: servicios.length });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener servicios'));
  }
};

exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const servicio = await Servicio.obtenerPorId(id);
    
    if (!servicio) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    
    res.json({ success: true, data: servicio });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener servicio'));
  }
};

exports.crear = async (req, res) => {
  try {
    const { nombre, tipo, precio, id_proveedores } = req.body;
    
    const validacion = validarCamposRequeridos(req.body, ['nombre', 'tipo', 'precio', 'id_proveedores']);
    if (!validacion.valido) {
      return res.status(400).json({ error: 'Campos incompletos', campos: validacion.camposFaltantes });
    }
    
    if (precio <= 0) {
      return res.status(400).json({ error: 'El precio debe ser mayor a 0' });
    }
    
    const nuevoServicio = await Servicio.crear(req.body);
    res.status(201).json({ success: true, message: 'Servicio creado', data: nuevoServicio });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al crear servicio'));
  }
};

exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (req.body.precio !== undefined && req.body.precio <= 0) {
      return res.status(400).json({ error: 'El precio debe ser mayor a 0' });
    }
    
    const servicioActualizado = await Servicio.actualizar(id, req.body);
    
    if (!servicioActualizado) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    
    res.json({ success: true, message: 'Servicio actualizado', data: servicioActualizado });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al actualizar servicio'));
  }
};

exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const servicioEliminado = await Servicio.eliminar(id);
    
    if (!servicioEliminado) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    
    res.json({ success: true, message: 'Servicio eliminado' });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al eliminar servicio'));
  }
};

exports.obtenerPorTipo = async (req, res) => {
  try {
    const { tipo } = req.params;
    const servicios = await Servicio.obtenerPorTipo(tipo);
    res.json({ success: true, data: servicios, total: servicios.length });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener servicios por tipo'));
  }
};

exports.obtenerDisponibles = async (req, res) => {
  try {
    const servicios = await Servicio.obtenerDisponibles();
    res.json({ success: true, data: servicios, total: servicios.length });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener servicios disponibles'));
  }
};
