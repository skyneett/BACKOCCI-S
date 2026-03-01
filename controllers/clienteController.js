/**
 * =============================================
 * CLIENTE CONTROLLER
 * =============================================
 */

const Cliente = require('../models/Cliente');
const Usuario = require('../models/Usuario');
const { validarCamposRequeridos, validarEmail, formatearError } = require('../utils/validators');

exports.obtenerTodos = async (req, res) => {
  try {
    const clientes = await Cliente.obtenerTodos();
    res.json({ success: true, data: clientes, total: clientes.length });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener clientes'));
  }
};

exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.obtenerPorId(id);
    
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    // Obtener estadísticas
    const estadisticas = await Cliente.obtenerEstadisticas(id);
    cliente.estadisticas = estadisticas;
    
    res.json({ success: true, data: cliente });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener cliente'));
  }
};

exports.crear = async (req, res) => {
  try {
    const { correo, contrasena, nombre, apellido } = req.body;
    
    const validacion = validarCamposRequeridos(req.body, ['correo', 'contrasena', 'nombre', 'apellido']);
    if (!validacion.valido) {
      return res.status(400).json({ error: 'Campos incompletos', campos: validacion.camposFaltantes });
    }
    
    if (!validarEmail(correo)) {
      return res.status(400).json({ error: 'Email inválido' });
    }
    
    // Crear usuario primero
    const nuevoUsuario = await Usuario.crear({ correo, contrasena });
    
    // Crear cliente
    const nuevoCliente = await Cliente.crear({
      ...req.body,
      id_usuarios: nuevoUsuario.id_usuarios,
      id_roles: 3 // Rol Cliente
    });
    
    res.status(201).json({ success: true, message: 'Cliente creado', data: nuevoCliente });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al crear cliente'));
  }
};

exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const clienteActualizado = await Cliente.actualizar(id, req.body);
    
    if (!clienteActualizado) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    res.json({ success: true, message: 'Cliente actualizado', data: clienteActualizado });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al actualizar cliente'));
  }
};

exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const clienteEliminado = await Cliente.eliminar(id);
    
    if (!clienteEliminado) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    res.json({ success: true, message: 'Cliente eliminado' });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al eliminar cliente'));
  }
};

exports.buscar = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Parámetro de búsqueda requerido' });
    }
    
    const resultados = await Cliente.buscar(q);
    res.json({ success: true, data: resultados, total: resultados.length });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al buscar clientes'));
  }
};
