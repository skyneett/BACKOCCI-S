/**
 * =============================================
 * AUTH MIDDLEWARE - Middleware de Autenticación
 * =============================================
 * 
 * Protege rutas mediante validación de tokens JWT
 * 
 * USO:
 * - verificarToken: Valida que el usuario esté autenticado
 * - verificarRol: Valida que el usuario tenga un rol específico
 */

const jwt = require('jsonwebtoken');

/**
 * Verificar que el token JWT sea válido
 */
const verificarToken = (req, res, next) => {
  // Extraer token del header Authorization
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({
      error: 'Token no proporcionado',
      message: 'Debes iniciar sesión para acceder a este recurso'
    });
  }

  try {
    // Verificar y decodificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Adjuntar datos del usuario al request
    req.usuario = decoded;
    
    next();
    
  } catch (error) {
    // Token expirado
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expirado',
        message: 'Tu sesión ha expirado, por favor inicia sesión nuevamente'
      });
    }
    
    // Token inválido
    return res.status(401).json({
      error: 'Token inválido',
      message: 'El token proporcionado no es válido'
    });
  }
};

/**
 * Verificar que el usuario tenga uno de los roles permitidos
 * @param {...string} rolesPermitidos - Roles que pueden acceder
 */
const verificarRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        error: 'No autenticado',
        message: 'Debes estar autenticado para acceder'
      });
    }

    const { rol_nombre } = req.usuario;

    if (!rolesPermitidos.includes(rol_nombre)) {
      return res.status(403).json({
        error: 'Acceso denegado',
        message: `Solo usuarios con rol ${rolesPermitidos.join(' o ')} pueden acceder`
      });
    }

    next();
  };
};

/**
 * Verificar que el usuario acceda solo a sus propios recursos
 */
const verificarPropietarioRecurso = (req, res, next) => {
  const idUsuarioAutenticado = req.usuario.id;
  const idUsuarioRecurso = parseInt(req.params.id) || parseInt(req.body.id_usuario);

  // Admin puede acceder a cualquier recurso
  if (req.usuario.rol_nombre === 'Admin') {
    return next();
  }

  // Usuario solo puede acceder a sus propios recursos
  if (idUsuarioAutenticado !== idUsuarioRecurso) {
    return res.status(403).json({
      error: 'Acceso denegado',
      message: 'No tienes permiso para acceder a este recurso'
    });
  }

  next();
};

module.exports = {
  verificarToken,
  verificarRol,
  verificarPropietarioRecurso
};
