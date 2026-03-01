/**
 * =============================================
 * ROL CONTROLLER
 * =============================================
 */

const Rol = require('../models/Rol');
const { validarCamposRequeridos, formatearError } = require('../utils/validators');

exports.obtenerTodos = async (req, res) => {
  try {
    const roles = await Rol.obtenerTodos();
    res.json({ success: true, data: roles, total: roles.length });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener roles'));
  }
};

exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const rol = await Rol.obtenerPorId(id);
    
    if (!rol) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }
    
    // Obtener permisos del rol
    const permisos = await Rol.obtenerPermisos(id);
    rol.permisos = permisos;
    
    res.json({ success: true, data: rol });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener rol'));
  }
};

exports.crear = async (req, res) => {
  try {
    const validacion = validarCamposRequeridos(req.body, ['nombre']);
    if (!validacion.valido) {
      return res.status(400).json({ error: 'Campos incompletos', campos: validacion.camposFaltantes });
    }
    
    const nuevoRol = await Rol.crear(req.body);
    res.status(201).json({ success: true, message: 'Rol creado', data: nuevoRol });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al crear rol'));
  }
};

exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const rolActualizado = await Rol.actualizar(id, req.body);
    
    if (!rolActualizado) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }
    
    res.json({ success: true, message: 'Rol actualizado', data: rolActualizado });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al actualizar rol'));
  }
};

exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const rolEliminado = await Rol.eliminar(id);
    
    if (!rolEliminado) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }
    
    res.json({ success: true, message: 'Rol eliminado' });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al eliminar rol'));
  }
};

exports.asignarPermiso = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_permiso } = req.body;
    
    const resultado = await Rol.asignarPermiso(id, id_permiso);
    res.json({ success: true, message: 'Permiso asignado', data: resultado });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al asignar permiso'));
  }
};

exports.removerPermiso = async (req, res) => {
  try {
    const { id, idPermiso } = req.params;
    await Rol.removerPermiso(id, idPermiso);
    res.json({ success: true, message: 'Permiso removido' });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al remover permiso'));
  }
};
