/**
 * =============================================
 * PROGRAMACION CONTROLLER
 * =============================================
 */

const Programacion = require('../models/Programacion');
const { validarCamposRequeridos, formatearError } = require('../utils/validators');

exports.obtenerTodos = async (req, res) => {
  try {
    const programaciones = await Programacion.obtenerTodos();
    res.json({ success: true, data: programaciones, total: programaciones.length });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener programaciones'));
  }
};

exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const programacion = await Programacion.obtenerPorId(id);
    
    if (!programacion) {
      return res.status(404).json({ error: 'Programación no encontrada' });
    }
    
    res.json({ success: true, data: programacion });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener programación'));
  }
};

exports.crear = async (req, res) => {
  try {
    const { id_rutas, fecha_inicio, fecha_fin, cupo_disponible } = req.body;
    
    const validacion = validarCamposRequeridos(req.body, ['id_rutas', 'fecha_inicio', 'fecha_fin', 'cupo_disponible']);
    if (!validacion.valido) {
      return res.status(400).json({ error: 'Campos incompletos', campos: validacion.camposFaltantes });
    }
    
    // Validar que la fecha de fin sea posterior a la fecha de inicio
    if (new Date(fecha_fin) <= new Date(fecha_inicio)) {
      return res.status(400).json({ error: 'La fecha de fin debe ser posterior a la fecha de inicio' });
    }
    
    if (cupo_disponible <= 0) {
      return res.status(400).json({ error: 'El cupo disponible debe ser mayor a 0' });
    }
    
    const nuevaProgramacion = await Programacion.crear(req.body);
    res.status(201).json({ success: true, message: 'Programación creada', data: nuevaProgramacion });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al crear programación'));
  }
};

exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validar fechas si se proporcionan
    if (req.body.fecha_inicio && req.body.fecha_fin) {
      if (new Date(req.body.fecha_fin) <= new Date(req.body.fecha_inicio)) {
        return res.status(400).json({ error: 'La fecha de fin debe ser posterior a la fecha de inicio' });
      }
    }
    
    if (req.body.cupo_disponible !== undefined && req.body.cupo_disponible < 0) {
      return res.status(400).json({ error: 'El cupo disponible no puede ser negativo' });
    }
    
    const programacionActualizada = await Programacion.actualizar(id, req.body);
    
    if (!programacionActualizada) {
      return res.status(404).json({ error: 'Programación no encontrada' });
    }
    
    res.json({ success: true, message: 'Programación actualizada', data: programacionActualizada });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al actualizar programación'));
  }
};

exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const programacionEliminada = await Programacion.eliminar(id);
    
    if (!programacionEliminada) {
      return res.status(404).json({ error: 'Programación no encontrada' });
    }
    
    res.json({ success: true, message: 'Programación eliminada' });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al eliminar programación'));
  }
};

exports.obtenerDisponibles = async (req, res) => {
  try {
    const programaciones = await Programacion.obtenerDisponibles();
    res.json({ success: true, data: programaciones, total: programaciones.length });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener programaciones disponibles'));
  }
};

exports.obtenerPorRuta = async (req, res) => {
  try {
    const { id_ruta } = req.params;
    const programaciones = await Programacion.obtenerPorRuta(id_ruta);
    res.json({ success: true, data: programaciones, total: programaciones.length });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener programaciones de la ruta'));
  }
};
