/**
 * =============================================
 * PERMISO CONTROLLER
 * ============================================= */

const Permiso = require('../models/Permiso');
const { validarCamposRequeridos, formatearError } = require('../utils/validators');

exports.obtenerTodos = async (req, res) => {
  try {
    const permisos = await Permiso.obtenerTodos();
    res.json({ success: true, data: permisos, total: permisos.length });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener permisos'));
  }
};

exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const permiso = await Permiso.obtenerPorId(id);
    
    if (!permiso) {
      return res.status(404).json({ error: 'Permiso no encontrado' });
    }
    
    res.json({ success: true, data: permiso });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener permiso'));
  }
};

exports.crear = async (req, res) => {
  try {
    const { nombre } = req.body;
    
    const validacion = validarCamposRequeridos(req.body, ['nombre']);
    if (!validacion.valido) {
      return res.status(400).json({ error: 'Campos incompletos', campos: validacion.camposFaltantes });
    }
    
    const nuevoPermiso = await Permiso.crear(req.body);
    res.status(201).json({ success: true, message: 'Permiso creado', data: nuevoPermiso });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al crear permiso'));
  }
};

exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const permisoActualizado = await Permiso.actualizar(id, req.body);
    
    if (!permisoActualizado) {
      return res.status(404).json({ error: 'Permiso no encontrado' });
    }
    
    res.json({ success: true, message: 'Permiso actualizado', data: permisoActualizado });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al actualizar permiso'));
  }
};

exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const permisoEliminado = await Permiso.eliminar(id);
    
    if (!permisoEliminado) {
      return res.status(404).json({ error: 'Permiso no encontrado' });
    }
    
    res.json({ success: true, message: 'Permiso eliminado' });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al eliminar permiso'));
  }
};
