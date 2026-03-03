/**
 * =============================================
 * AUTH CONTROLLER - Controlador de Autenticación
 * =============================================
 * 
 * Maneja login, registro y perfil de usuarios
 */

const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const Cliente = require('../models/Cliente');
const Empleado = require('../models/Empleado');
const { validarEmail, validarCamposRequeridos, formatearError } = require('../utils/validators');

/**
 * POST /api/auth/login
 * Iniciar sesión
 */
exports.login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    console.log("========== LOGIN DEBUG ==========");
    console.log("📩 Correo recibido:", correo);
    console.log("🔐 Contraseña recibida:", contrasena);

    // Validar campos requeridos
    const validacion = validarCamposRequeridos(req.body, ['correo', 'contrasena']);
    if (!validacion.valido) {
      console.log("❌ Campos incompletos");
      return res.status(400).json({
        error: 'Campos incompletos',
        message: `Faltan campos: ${validacion.camposFaltantes.join(', ')}`
      });
    }

    // Limpiar datos (MUY IMPORTANTE)
    const correoLimpio = correo.trim().toLowerCase();
    const contrasenaLimpia = contrasena.trim();

    console.log("📩 Correo limpio:", correoLimpio);
    console.log("🔐 Contraseña limpia:", contrasenaLimpia);

    // Buscar usuario por correo
    const usuario = await Usuario.obtenerPorCorreo(correoLimpio);

    console.log("👤 Usuario encontrado:", usuario);

    if (!usuario) {
      console.log("❌ Usuario no encontrado");
      return res.status(401).json({
        error: 'Credenciales inválidas',
        message: 'Correo o contraseña incorrectos'
      });
    }

    console.log("🧠 Hash en BD:", usuario.contrasena);
    console.log("📏 Longitud del hash:", usuario.contrasena ? usuario.contrasena.length : 0);

    // Validar integridad del hash bcrypt
    if (!usuario.contrasena || usuario.contrasena.length !== 60) {
      console.log("❌ Hash corrupto o inválido. Longitud esperada: 60");
      return res.status(500).json({
        error: 'Error interno de autenticación',
        message: 'El hash de contraseña está corrupto. Contacta al administrador.'
      });
    }

    // Verificar contraseña
    const contrasenaValida = await Usuario.verificarContrasena(
      contrasenaLimpia,
      usuario.contrasena
    );

    console.log("🔎 Resultado bcrypt.compare:", contrasenaValida);

    if (!contrasenaValida) {
      console.log("❌ Contraseña incorrecta");
      return res.status(401).json({
        error: 'Credenciales inválidas',
        message: 'Correo o contraseña incorrectos'
      });
    }

    console.log("✅ BCRYPT PASÓ");

    // Obtener perfil completo
    const perfil = await Usuario.obtenerPerfilCompleto(usuario.id_usuarios);

    console.log("📋 Perfil encontrado:", perfil);

    if (!perfil) {
      console.log("❌ Perfil no encontrado");
      return res.status(404).json({
        error: 'Perfil no encontrado',
        message: 'No se encontró información asociada al usuario'
      });
    }

    if (!perfil.estado) {
      console.log("❌ Usuario inactivo");
      return res.status(403).json({
        error: 'Cuenta inactiva',
        message: 'Tu cuenta ha sido desactivada'
      });
    }

    // Generar token
    const token = jwt.sign(
      {
        id: usuario.id_usuarios,
        correo: usuario.correo,
        rol_id: perfil.id_roles,
        rol_nombre: perfil.rol_nombre,
        tipo_usuario: perfil.tipo_usuario
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '5m' }
    );

    console.log("🎉 LOGIN EXITOSO");

    res.json({
      success: true,
      message: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id_usuarios,
        correo: usuario.correo,
        nombre: perfil.nombre,
        apellido: perfil.apellido,
        rol: perfil.rol_nombre,
        tipo_usuario: perfil.tipo_usuario
      }
    });

  } catch (error) {
    console.error("🔥 ERROR EN LOGIN:", error);
    res.status(500).json(formatearError(error, 'Error al iniciar sesión'));
  }
};

/**
 * POST /api/auth/register
 * Registrar nuevo cliente
 */
exports.register = async (req, res) => {
  try {
    const {
      correo, contrasena, nombre, apellido, tipo_documento,
      numero_documento, telefono, direccion, fecha_nacimiento
    } = req.body;

    // Validar campos requeridos
    const validacion = validarCamposRequeridos(req.body, [
      'correo', 'contrasena', 'nombre', 'apellido'
    ]);
    if (!validacion.valido) {
      return res.status(400).json({
        error: 'Campos incompletos',
        message: `Faltan campos: ${validacion.camposFaltantes.join(', ')}`
      });
    }

    // Validar email
    if (!validarEmail(correo)) {
      return res.status(400).json({
        error: 'Email inválido',
        message: 'El formato del correo electrónico no es válido'
      });
    }

    // Verificar si el correo ya existe
    const usuarioExistente = await Usuario.obtenerPorCorreo(correo);
    if (usuarioExistente) {
      return res.status(400).json({
        error: 'Correo ya registrado',
        message: 'Ya existe una cuenta con este correo electrónico'
      });
    }

    // Crear usuario
    const nuevoUsuario = await Usuario.crear({ correo, contrasena });

    // Crear cliente (rol 3 = Cliente por defecto)
    const nuevoCliente = await Cliente.crear({
      id_usuarios: nuevoUsuario.id_usuarios,
      id_roles: 3, // Rol Cliente
      nombre,
      apellido,
      tipo_documento,
      numero_documento,
      telefono,
      direccion,
      fecha_nacimiento
    });

    // Generar token JWT
    const token = jwt.sign(
      {
        id: nuevoUsuario.id_usuarios,
        correo: nuevoUsuario.correo,
        rol_id: 3,
        rol_nombre: 'Cliente',
        tipo_usuario: 'cliente'
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '5m' }
    );

    res.status(201).json({
      success: true,
      message: 'Registro exitoso',
      token,
      usuario: {
        id: nuevoUsuario.id_usuarios,
        correo: nuevoUsuario.correo,
        nombre: nuevoCliente.nombre,
        apellido: nuevoCliente.apellido,
        rol: 'Cliente'
      }
    });

  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al registrar usuario'));
  }
};

/**
 * GET /api/auth/profile
 * Obtener perfil del usuario autenticado
 */
exports.obtenerPerfil = async (req, res) => {
  try {
    const idUsuario = req.usuario.id; // Del middleware verificarToken

    const perfil = await Usuario.obtenerPerfilCompleto(idUsuario);
    
    if (!perfil) {
      return res.status(404).json({
        error: 'Perfil no encontrado',
        message: 'No se encontró información del usuario'
      });
    }

    res.json({
      success: true,
      perfil
    });

  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener perfil'));
  }
};

/**
 * PUT /api/auth/cambiar-contrasena
 * Cambiar contraseña del usuario autenticado
 */
exports.cambiarContrasena = async (req, res) => {
  try {
    const idUsuario = req.usuario.id;
    const { contrasenaActual, contrasenaNueva } = req.body;

    // Validar campos
    const validacion = validarCamposRequeridos(req.body, ['contrasenaActual', 'contrasenaNueva']);
    if (!validacion.valido) {
      return res.status(400).json({
        error: 'Campos incompletos',
        message: 'Debes proporcionar la contraseña actual y la nueva'
      });
    }

    // Obtener usuario con contraseña
    const usuario = await Usuario.obtenerPorId(idUsuario);
    const usuarioConPassword = await Usuario.obtenerPorCorreo(usuario.correo);

    // Verificar contraseña actual
    const contrasenaValida = await Usuario.verificarContrasena(
      contrasenaActual,
      usuarioConPassword.contrasena
    );

    if (!contrasenaValida) {
      return res.status(401).json({
        error: 'Contraseña incorrecta',
        message: 'La contraseña actual no es correcta'
      });
    }

    // Actualizar contraseña
    await Usuario.actualizarContrasena(idUsuario, contrasenaNueva);

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });

  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al cambiar contraseña'));
  }
};

/**
 * GET /api/auth/reset-admin
 * RUTA TEMPORAL: Resetear contraseña del admin
 */
exports.resetAdmin = async (req, res) => {
  try {
    const correoAdmin = 'admin@occitours.com';
    const nuevaContrasena = 'Admin123*';

    // Buscar usuario admin
    const usuario = await Usuario.obtenerPorCorreo(correoAdmin);

    if (!usuario) {
      return res.status(404).json({
        error: 'Usuario admin no encontrado',
        message: `No existe un usuario con correo ${correoAdmin}`
      });
    }

    // Actualizar contraseña usando el método del modelo
    await Usuario.actualizarContrasena(usuario.id_usuarios, nuevaContrasena);

    res.json({
      success: true,
      message: 'Contraseña del admin actualizada exitosamente',
      correo: correoAdmin,
      nuevaContrasena: nuevaContrasena,
      nota: 'Ahora puedes hacer login con estas credenciales'
    });

  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al resetear contraseña del admin'));
  }
};
