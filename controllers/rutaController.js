/**
 * =============================================
 * RUTA CONTROLLER
 * =============================================
 */

const Ruta = require('../models/Ruta');
const { validarCamposRequeridos, formatearError } = require('../utils/validators');

exports.obtenerTodos = async (req, res) => {
  try {
    const rutas = await Ruta.obtenerTodos();
    res.json({ success: true, data: rutas, total: rutas.length });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener rutas'));
  }
};

exports.obtenerActivas = async (req, res) => {
  try {
    const rutas = await Ruta.obtenerActivas();
    res.json({ success: true, data: rutas, total: rutas.length });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener rutas activas'));
  }
};

exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const ruta = await Ruta.obtenerPorId(id);
    
    if (!ruta) {
      return res.status(404).json({ error: 'Ruta no encontrada' });
    }
    
    // Obtener programaciones y estadísticas
    const programaciones = await Ruta.obtenerProgramaciones(id);
    const estadisticas = await Ruta.obtenerEstadisticas(id);
    
    ruta.programaciones = programaciones;
    ruta.estadisticas = estadisticas;
    
    res.json({ success: true, data: ruta });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener ruta'));
  }
};

exports.crear = async (req, res) => {
  try {
    const validacion = validarCamposRequeridos(req.body, ['nombre', 'precio_base']);
    if (!validacion.valido) {
      return res.status(400).json({ error: 'Campos incompletos', campos: validacion.camposFaltantes });
    }
    
    const nuevaRuta = await Ruta.crear(req.body);
    res.status(201).json({ success: true, message: 'Ruta creada', data: nuevaRuta });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al crear ruta'));
  }
};

exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const rutaActualizada = await Ruta.actualizar(id, req.body);
    
    if (!rutaActualizada) {
      return res.status(404).json({ error: 'Ruta no encontrada' });
    }
    
    res.json({ success: true, message: 'Ruta actualizada', data: rutaActualizada });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al actualizar ruta'));
  }
};

exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const rutaEliminada = await Ruta.eliminar(id);
    
    if (!rutaEliminada) {
      return res.status(404).json({ error: 'Ruta no encontrada' });
    }
    
    res.json({ success: true, message: 'Ruta eliminada' });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al eliminar ruta'));
  }
};

exports.buscar = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Parámetro de búsqueda requerido' });
    }
    
    const resultados = await Ruta.buscar(q);
    res.json({ success: true, data: resultados, total: resultados.length });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al buscar rutas'));
  }
};

exports.obtenerPorDificultad = async (req, res) => {
  try {
    const { dificultad } = req.params;
    const rutas = await Ruta.obtenerPorDificultad(dificultad);
    res.json({ success: true, data: rutas, total: rutas.length });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener rutas por dificultad'));
  }
};
