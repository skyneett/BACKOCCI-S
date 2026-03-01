/**
 * =============================================
 * EMPLEADO CONTROLLER
 * =============================================
 */

const Empleado = require('../models/Empleado');
const Usuario = require('../models/Usuario');
const { validarCamposRequeridos, validarEmail, formatearError } = require('../utils/validators');

exports.obtenerTodos = async (req, res) => {
  try {
    const empleados = await Empleado.obtenerTodos();
    res.json({ success: true, data: empleados, total: empleados.length });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener empleados'));
  }
};

exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const empleado = await Empleado.obtenerPorId(id);
    
    if (!empleado) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }
    
    res.json({ success: true, data: empleado });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener empleado'));
  }
};

exports.crear = async (req, res) => {
  try {
    const { correo, contrasena, nombre, apellido, cargo } = req.body;
    
    const validacion = validarCamposRequeridos(req.body, ['correo', 'contrasena', 'nombre', 'apellido', 'cargo']);
    if (!validacion.valido) {
      return res.status(400).json({ error: 'Campos incompletos', campos: validacion.camposFaltantes });
    }
    
    if (!validarEmail(correo)) {
      return res.status(400).json({ error: 'Email inválido' });
    }
    
    // Crear usuario primero
    const nuevoUsuario = await Usuario.crear({ correo, contrasena });
    
    // Crear empleado
    const nuevoEmpleado = await Empleado.crear({
      ...req.body,
      id_usuarios: nuevoUsuario.id_usuarios,
      id_roles: 2 // Rol Empleado
    });
    
    res.status(201).json({ success: true, message: 'Empleado creado', data: nuevoEmpleado });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al crear empleado'));
  }
};

exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const empleadoActualizado = await Empleado.actualizar(id, req.body);
    
    if (!empleadoActualizado) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }
    
    res.json({ success: true, message: 'Empleado actualizado', data: empleadoActualizado });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al actualizar empleado'));
  }
};

exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const empleadoEliminado = await Empleado.eliminar(id);
    
    if (!empleadoEliminado) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }
    
    res.json({ success: true, message: 'Empleado eliminado' });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al eliminar empleado'));
  }
};

exports.buscar = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Se requiere parámetro de búsqueda "q"' });
    }
    
    const empleados = await Empleado.buscar(q);
    res.json({ success: true, data: empleados, total: empleados.length });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al buscar empleados'));
  }
};
