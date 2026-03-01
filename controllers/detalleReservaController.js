/**
 * =============================================
 * DETALLE_RESERVA CONTROLLER
 * =============================================
 * 
 * Controlador para gestionar todos los detalles de reservas
 */

const DetalleReservaProgramacion = require('../models/DetalleReservaProgramacion');
const DetalleReservaFinca = require('../models/DetalleReservaFinca');
const DetalleReservaServicio = require('../models/DetalleReservaServicio');
const DetalleReservaAcompanante = require('../models/DetalleReservaAcompanante');

const detalleReservaController = {
  // ========== PROGRAMACIONES ==========
  obtenerProgramaciones: async (req, res) => {
    try {
      const { idReserva } = req.params;
      const programaciones = await DetalleReservaProgramacion.obtenerPorReserva(idReserva);
      res.json({
        success: true,
        data: programaciones
      });
    } catch (error) {
      console.error('Error obteniendo programaciones:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener programaciones de la reserva',
        error: error.message
      });
    }
  },

  obtenerReservasPorProgramacion: async (req, res) => {
    try {
      const { idProgramacion } = req.params;
      const reservas = await DetalleReservaProgramacion.obtenerPorProgramacion(idProgramacion);
      res.json({
        success: true,
        data: reservas
      });
    } catch (error) {
      console.error('Error obteniendo reservas:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener reservas de la programación',
        error: error.message
      });
    }
  },

  // ========== FINCAS ==========
  obtenerFincas: async (req, res) => {
    try {
      const { idReserva } = req.params;
      const fincas = await DetalleReservaFinca.obtenerPorReserva(idReserva);
      res.json({
        success: true,
        data: fincas
      });
    } catch (error) {
      console.error('Error obteniendo fincas:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener fincas de la reserva',
        error: error.message
      });
    }
  },

  verificarDisponibilidadFinca: async (req, res) => {
    try {
      const { idFinca } = req.params;
      const { fecha_checkin, fecha_checkout } = req.query;
      const disponible = await DetalleReservaFinca.verificarDisponibilidad(
        idFinca, 
        fecha_checkin, 
        fecha_checkout
      );
      res.json({
        success: true,
        disponible
      });
    } catch (error) {
      console.error('Error verificando disponibilidad:', error);
      res.status(500).json({
        success: false,
        message: 'Error al verificar disponibilidad de finca',
        error: error.message
      });
    }
  },

  // ========== SERVICIOS ==========
  obtenerServicios: async (req, res) => {
    try {
      const { idReserva } = req.params;
      const servicios = await DetalleReservaServicio.obtenerPorReserva(idReserva);
      res.json({
        success: true,
        data: servicios
      });
    } catch (error) {
      console.error('Error obteniendo servicios:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener servicios de la reserva',
        error: error.message
      });
    }
  },

  obtenerServiciosMasSolicitados: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const servicios = await DetalleReservaServicio.obtenerServiciosMasSolicitados(limit);
      res.json({
        success: true,
        data: servicios
      });
    } catch (error) {
      console.error('Error obteniendo servicios más solicitados:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener servicios más solicitados',
        error: error.message
      });
    }
  },

  // ========== ACOMPAÑANTES ==========
  obtenerAcompanantes: async (req, res) => {
    try {
      const { idReserva } = req.params;
      const acompanantes = await DetalleReservaAcompanante.obtenerPorReserva(idReserva);
      res.json({
        success: true,
        data: acompanantes
      });
    } catch (error) {
      console.error('Error obteniendo acompañantes:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener acompañantes de la reserva',
        error: error.message
      });
    }
  },

  obtenerEstadisticasAcompanantes: async (req, res) => {
    try {
      const estadisticas = await DetalleReservaAcompanante.obtenerEstadisticasPorEdad();
      res.json({
        success: true,
        data: estadisticas
      });
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener estadísticas de acompañantes',
        error: error.message
      });
    }
  }
};

module.exports = detalleReservaController;
