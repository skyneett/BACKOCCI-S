/**
 * =============================================
 * VALIDATORS - Utilidades de Validación
 * =============================================
 * 
 * Funciones helper para validación de datos
 */

/**
 * Validar email
 */
const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validar que campos requeridos existan
 */
const validarCamposRequeridos = (datos, camposRequeridos) => {
  const camposFaltantes = [];
  
  for (const campo of camposRequeridos) {
    if (!datos[campo] || datos[campo] === '') {
      camposFaltantes.push(campo);
    }
  }
  
  return {
    valido: camposFaltantes.length === 0,
    camposFaltantes
  };
};

/**
 * Validar formato de fecha (YYYY-MM-DD)
 */
const validarFecha = (fecha) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(fecha)) return false;
  
  const date = new Date(fecha);
  return date instanceof Date && !isNaN(date);
};

/**
 * Validar que un número sea positivo
 */
const validarNumeroPositivo = (numero) => {
  return !isNaN(numero) && numero > 0;
};

/**
 * Validar rango de fechas
 */
const validarRangoFechas = (fechaInicio, fechaFin) => {
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  return fin >= inicio;
};

/**
 * Sanitizar string (prevenir inyección)
 */
const sanitizarString = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/[<>]/g, '');
};

/**
 * Formatear respuesta de error
 */
const formatearError = (error, mensaje = 'Error en el servidor') => {
  console.error('Error:', error);
  return {
    error: mensaje,
    message: process.env.NODE_ENV === 'development' ? error.message : mensaje,
    details: process.env.NODE_ENV === 'development' ? error.stack : undefined
  };
};

/**
 * Formatear respuesta exitosa
 */
const formatearExito = (data, mensaje = 'Operación exitosa') => {
  return {
    success: true,
    message: mensaje,
    data
  };
};

module.exports = {
  validarEmail,
  validarCamposRequeridos,
  validarFecha,
  validarNumeroPositivo,
  validarRangoFechas,
  sanitizarString,
  formatearError,
  formatearExito
};
