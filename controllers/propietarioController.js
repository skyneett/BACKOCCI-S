/**
 * =============================================
 * PROPIETARIO CONTROLLER
 * =============================================
 */

const Propietario = require('../models/Propietario');
const { validarCamposRequeridos, validarEmail, formatearError } = require('../utils/validators');

exports.obtenerTodos = async (req, res) => {
  try {
    const propietarios = await Propietario.obtenerTodos();
    res.json({ success: true, data: propietarios, total: propietarios.length });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener propietarios'));
  }
};

exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const propietario = await Propietario.obtenerPorId(id);
    
    if (!propietario) {
      return res.status(404).json({ error: 'Propietario no encontrado' });
    }
    
    res.json({ success: true, data: propietario });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener propietario'));
  }
};

exports.crear = async (req, res) => {
  try {
    const { nombre, apellido, telefono } = req.body;
    
    const validacion = validarCamposRequeridos(req.body, ['nombre', 'apellido', 'telefono']);
    if (!validacion.valido) {
      return res.status(400).json({ error: 'Campos incompletos', campos: validacion.camposFaltantes });
    }
    
    const nuevoPropietario = await Propietario.crear(req.body);
    res.status(201).json({ success: true, message: 'Propietario creado', data: nuevoPropietario });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al crear propietario'));
  }
};

exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const propietarioActualizado = await Propietario.actualizar(id, req.body);
    
    if (!propietarioActualizado) {
      return res.status(404).json({ error: 'Propietario no encontrado' });
    }
    
    res.json({ success: true, message: 'Propietario actualizado', data: propietarioActualizado });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al actualizar propietario'));
  }
};

exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const propietarioEliminado = await Propietario.eliminar(id);
    
    if (!propietarioEliminado) {
      return res.status(404).json({ error: 'Propietario no encontrado' });
    }
    
    res.json({ success: true, message: 'Propietario eliminado' });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al eliminar propietario'));
  }
};

exports.obtenerFincas = async (req, res) => {
  try {
    const { id } = req.params;
    const fincas = await Propietario.obtenerFincas(id);
    res.json({ success: true, data: fincas, total: fincas.length });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener fincas del propietario'));
  }
};
