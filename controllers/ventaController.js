/**
 * =============================================
 * VENTA CONTROLLER
 * =============================================
 */

const Venta = require('../models/Venta');
const { validarCamposRequeridos, formatearError } = require('../utils/validators');

exports.obtenerTodos = async (req, res) => {
  try {
    const ventas = await Venta.obtenerTodos();
    res.json({ success: true, data: ventas, total: ventas.length });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener ventas'));
  }
};

exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const venta = await Venta.obtenerPorId(id);
    
    if (!venta) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }
    
    res.json({ success: true, data: venta });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener venta'));
  }
};

exports.crear = async (req, res) => {
  try {
    const validacion = validarCamposRequeridos(req.body, ['id_reserva', 'monto_total']);
    if (!validacion.valido) {
      return res.status(400).json({ error: 'Campos incompletos', campos: validacion.camposFaltantes });
    }
    
    const nuevaVenta = await Venta.crear(req.body);
    res.status(201).json({ success: true, message: 'Venta creada', data: nuevaVenta });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al crear venta'));
  }
};

exports.registrarPago = async (req, res) => {
  try {
    const { id } = req.params;
    const { monto_pago, metodo_pago } = req.body;
    
    const validacion = validarCamposRequeridos(req.body, ['monto_pago']);
    if (!validacion.valido) {
      return res.status(400).json({ error: 'Debe especificar el monto del pago' });
    }
    
    const ventaActualizada = await Venta.registrarPago(id, { monto_pago, metodo_pago });
    
    if (!ventaActualizada) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }
    
    res.json({ success: true, message: 'Pago registrado', data: ventaActualizada });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al registrar pago'));
  }
};

exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const ventaActualizada = await Venta.actualizar(id, req.body);
    
    if (!ventaActualizada) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }
    
    res.json({ success: true, message: 'Venta actualizada', data: ventaActualizada });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al actualizar venta'));
  }
};

exports.cancelar = async (req, res) => {
  try {
    const { id } = req.params;
    const ventaCancelada = await Venta.cancelar(id);
    
    if (!ventaCancelada) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }
    
    res.json({ success: true, message: 'Venta cancelada', data: ventaCancelada });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al cancelar venta'));
  }
};

exports.obtenerEstadisticas = async (req, res) => {
  try {
    const estadisticas = await Venta.obtenerEstadisticas();
    res.json({ success: true, data: estadisticas });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener estadísticas'));
  }
};

exports.obtenerPorEstadoPago = async (req, res) => {
  try {
    const { estadoPago } = req.params;
    const ventas = await Venta.obtenerPorEstadoPago(estadoPago);
    res.json({ success: true, data: ventas, total: ventas.length });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener ventas por estado'));
  }
};

exports.buscar = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Parámetro de búsqueda requerido' });
    }
    
    const resultados = await Venta.buscar(q);
    res.json({ success: true, data: resultados, total: resultados.length });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al buscar ventas'));
  }
};
