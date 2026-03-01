/**
 * =============================================
 * RESERVA CONTROLLER
 * =============================================
 */

const Reserva = require('../models/Reserva');
const Programacion = require('../models/Programacion');
const { validarCamposRequeridos, formatearError } = require('../utils/validators');

exports.obtenerTodos = async (req, res) => {
  try {
    const reservas = await Reserva.obtenerTodos();
    res.json({ success: true, data: reservas, total: reservas.length });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener reservas'));
  }
};

exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const reserva = await Reserva.obtenerPorId(id);
    
    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    
    res.json({ success: true, data: reserva });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener reserva'));
  }
};

exports.crear = async (req, res) => {
  try {
    const validacion = validarCamposRequeridos(req.body, ['id_cliente']);
    if (!validacion.valido) {
      return res.status(400).json({ error: 'Campos incompletos', campos: validacion.camposFaltantes });
    }
    
    const nuevaReserva = await Reserva.crear(req.body);
    res.status(201).json({ success: true, message: 'Reserva creada', data: nuevaReserva });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al crear reserva'));
  }
};

exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const reservaActualizada = await Reserva.actualizar(id, req.body);
    
    if (!reservaActualizada) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    
    res.json({ success: true, message: 'Reserva actualizada', data: reservaActualizada });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al actualizar reserva'));
  }
};

exports.cancelar = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancelado_por, motivo_cancelacion } = req.body;
    
    const reservaCancelada = await Reserva.cancelar(id, { cancelado_por, motivo_cancelacion });
    
    if (!reservaCancelada) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    
    res.json({ success: true, message: 'Reserva cancelada', data: reservaCancelada });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al cancelar reserva'));
  }
};

exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const reservaEliminada = await Reserva.eliminar(id);
    
    if (!reservaEliminada) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    
    res.json({ success: true, message: 'Reserva eliminada' });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al eliminar reserva'));
  }
};

exports.agregarProgramacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_programacion, cantidad_personas, precio_unitario } = req.body;
    
    // Verificar disponibilidad de cupos
    const disponible = await Programacion.verificarDisponibilidad(id_programacion, cantidad_personas);
    if (!disponible) {
      return res.status(400).json({ error: 'No hay cupos disponibles' });
    }
    
    const detalle = await Reserva.agregarProgramacion({
      id_reserva: id,
      id_programacion,
      cantidad_personas,
      precio_unitario
    });
    
    // Reducir cupos
    await Programacion.reducirCupos(id_programacion, cantidad_personas);
    
    // Recalcular monto total
    const montoTotal = await Reserva.calcularMontoTotal(id);
    await Reserva.actualizar(id, { monto_total: montoTotal });
    
    res.status(201).json({ success: true, message: 'Programación agregada', data: detalle });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al agregar programación'));
  }
};

exports.agregarFinca = async (req, res) => {
  try {
    const { id } = req.params;
    const detalle = await Reserva.agregarFinca({ id_reserva: id, ...req.body });
    
    // Recalcular monto total
    const montoTotal = await Reserva.calcularMontoTotal(id);
    await Reserva.actualizar(id, { monto_total: montoTotal });
    
    res.status(201).json({ success: true, message: 'Finca agregada', data: detalle });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al agregar finca'));
  }
};

exports.agregarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const detalle = await Reserva.agregarServicio({ id_reserva: id, ...req.body });
    
    // Recalcular monto total
    const montoTotal = await Reserva.calcularMontoTotal(id);
    await Reserva.actualizar(id, { monto_total: montoTotal });
    
    res.status(201).json({ success: true, message: 'Servicio agregado', data: detalle });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al agregar servicio'));
  }
};

exports.agregarAcompanante = async (req, res) => {
  try {
    const { id } = req.params;
    const acompanante = await Reserva.agregarAcompanante({ id_reserva: id, ...req.body });
    res.status(201).json({ success: true, message: 'Acompañante agregado', data: acompanante });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al agregar acompañante'));
  }
};

exports.obtenerPorCliente = async (req, res) => {
  try {
    const { idCliente } = req.params;
    const reservas = await Reserva.obtenerPorCliente(idCliente);
    res.json({ success: true, data: reservas, total: reservas.length });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener reservas del cliente'));
  }
};

exports.buscar = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Parámetro de búsqueda requerido' });
    }
    
    const resultados = await Reserva.buscar(q);
    res.json({ success: true, data: resultados, total: resultados.length });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al buscar reservas'));
  }
};
