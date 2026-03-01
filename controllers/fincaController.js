/**
 * =============================================
 * FINCA CONTROLLER
 * =============================================
 */

const Finca = require('../models/Finca');
const { validarCamposRequeridos, formatearError } = require('../utils/validators');

exports.obtenerTodos = async (req, res) => {
  try {
    const fincas = await Finca.obtenerTodos();
    res.json({ success: true, data: fincas, total: fincas.length });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener fincas'));
  }
};

exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const finca = await Finca.obtenerPorId(id);
    
    if (!finca) {
      return res.status(404).json({ error: 'Finca no encontrada' });
    }
    
    res.json({ success: true, data: finca });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener finca'));
  }
};

exports.crear = async (req, res) => {
  try {
    const { nombre, municipio, id_propietarios } = req.body;
    
    const validacion = validarCamposRequeridos(req.body, ['nombre', 'municipio', 'id_propietarios']);
    if (!validacion.valido) {
      return res.status(400).json({ error: 'Campos incompletos', campos: validacion.camposFaltantes });
    }
    
    const nuevaFinca = await Finca.crear(req.body);
    res.status(201).json({ success: true, message: 'Finca creada', data: nuevaFinca });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al crear finca'));
  }
};

exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const fincaActualizada = await Finca.actualizar(id, req.body);
    
    if (!fincaActualizada) {
      return res.status(404).json({ error: 'Finca no encontrada' });
    }
    
    res.json({ success: true, message: 'Finca actualizada', data: fincaActualizada });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al actualizar finca'));
  }
};

exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const fincaEliminada = await Finca.eliminar(id);
    
    if (!fincaEliminada) {
      return res.status(404).json({ error: 'Finca no encontrada' });
    }
    
    res.json({ success: true, message: 'Finca eliminada' });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al eliminar finca'));
  }
};

exports.obtenerDisponibles = async (req, res) => {
  try {
    const fincas = await Finca.obtenerDisponibles();
    res.json({ success: true, data: fincas, total: fincas.length });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener fincas disponibles'));
  }
};

exports.buscar = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Se requiere parámetro de búsqueda "q"' });
    }
    
    const fincas = await Finca.buscar(q);
    res.json({ success: true, data: fincas, total: fincas.length });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al buscar fincas'));
  }
};
