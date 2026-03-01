/**
 * =============================================
 * PROVEEDOR CONTROLLER
 * =============================================
 */

const Proveedor = require('../models/Proveedor');
const { validarCamposRequeridos, validarEmail, formatearError } = require('../utils/validators');

exports.obtenerTodos = async (req, res) => {
  try {
    const proveedores = await Proveedor.obtenerTodos();
    res.json({ success: true, data: proveedores, total: proveedores.length });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener proveedores'));
  }
};

exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const proveedor = await Proveedor.obtenerPorId(id);
    
    if (!proveedor) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }
    
    res.json({ success: true, data: proveedor });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener proveedor'));
  }
};

exports.crear = async (req, res) => {
  try {
    const { nombre_empresa, telefono } = req.body;
    
    const validacion = validarCamposRequeridos(req.body, ['nombre_empresa', 'telefono']);
    if (!validacion.valido) {
      return res.status(400).json({ error: 'Campos incompletos', campos: validacion.camposFaltantes });
    }
    
    if (req.body.correo && !validarEmail(req.body.correo)) {
      return res.status(400).json({ error: 'Email inválido' });
    }
    
    const nuevoProveedor = await Proveedor.crear(req.body);
    res.status(201).json({ success: true, message: 'Proveedor creado', data: nuevoProveedor });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al crear proveedor'));
  }
};

exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (req.body.correo && !validarEmail(req.body.correo)) {
      return res.status(400).json({ error: 'Email inválido' });
    }
    
    const proveedorActualizado = await Proveedor.actualizar(id, req.body);
    
    if (!proveedorActualizado) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }
    
    res.json({ success: true, message: 'Proveedor actualizado', data: proveedorActualizado });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al actualizar proveedor'));
  }
};

exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const proveedorEliminado = await Proveedor.eliminar(id);
    
    if (!proveedorEliminado) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }
    
    res.json({ success: true, message: 'Proveedor eliminado' });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al eliminar proveedor'));
  }
};

exports.obtenerServicios = async (req, res) => {
  try {
    const { id } = req.params;
    const servicios = await Proveedor.obtenerServicios(id);
    res.json({ success: true, data: servicios, total: servicios.length });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener servicios del proveedor'));
  }
};
