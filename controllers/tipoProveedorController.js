/**
 * =============================================
 * TIPO PROVEEDOR CONTROLLER
 * =============================================
 */

const TipoProveedor = require('../models/TipoProveedor');
const { validarCamposRequeridos, formatearError } = require('../utils/validators');

/**
 * Obtener todos los tipos de proveedor
 */
exports.obtenerTodos = async (req, res) => {
  try {
    const tipos = await TipoProveedor.obtenerTodos();
    res.json({ success: true, data: tipos, total: tipos.length });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener tipos de proveedor'));
  }
};

/**
 * Obtener tipos de proveedor activos
 */
exports.obtenerActivos = async (req, res) => {
  try {
    const tipos = await TipoProveedor.obtenerActivos();
    res.json({ success: true, data: tipos, total: tipos.length });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener tipos activos'));
  }
};

/**
 * Obtener tipo de proveedor por ID
 */
exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const tipo = await TipoProveedor.obtenerPorId(id);
    
    if (!tipo) {
      return res.status(404).json({ error: 'Tipo de proveedor no encontrado' });
    }
    
    res.json({ success: true, data: tipo });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener tipo de proveedor'));
  }
};

/**
 * Crear nuevo tipo de proveedor
 */
exports.crear = async (req, res) => {
  try {
    const { nombre } = req.body;
    
    const validacion = validarCamposRequeridos(req.body, ['nombre']);
    if (!validacion.valido) {
      return res.status(400).json({ 
        error: 'Campos incompletos', 
        campos: validacion.camposFaltantes 
      });
    }
    
    const nuevoTipo = await TipoProveedor.crear(req.body);
    res.status(201).json({ 
      success: true, 
      message: 'Tipo de proveedor creado exitosamente', 
      data: nuevoTipo 
    });
  } catch (error) {
    if (error.code === '23505') { // Duplicate key
      return res.status(400).json({ error: 'Ya existe un tipo de proveedor con ese nombre' });
    }
    res.status(500).json(formatearError(error, 'Error al crear tipo de proveedor'));
  }
};

/**
 * Actualizar tipo de proveedor
 */
exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    
    const tipoActualizado = await TipoProveedor.actualizar(id, req.body);
    
    if (!tipoActualizado) {
      return res.status(404).json({ error: 'Tipo de proveedor no encontrado' });
    }
    
    res.json({ 
      success: true, 
      message: 'Tipo de proveedor actualizado exitosamente', 
      data: tipoActualizado 
    });
  } catch (error) {
    if (error.code === '23505') { // Duplicate key
      return res.status(400).json({ error: 'Ya existe un tipo de proveedor con ese nombre' });
    }
    res.status(500).json(formatearError(error, 'Error al actualizar tipo de proveedor'));
  }
};

/**
 * Eliminar tipo de proveedor
 */
exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si tiene proveedores asociados
    const tieneProveedores = await TipoProveedor.tieneProveedores(id);
    if (tieneProveedores) {
      return res.status(400).json({ 
        error: 'No se puede eliminar el tipo de proveedor porque tiene proveedores asociados' 
      });
    }
    
    const tipoEliminado = await TipoProveedor.eliminar(id);
    
    if (!tipoEliminado) {
      return res.status(404).json({ error: 'Tipo de proveedor no encontrado' });
    }
    
    res.json({ 
      success: true, 
      message: 'Tipo de proveedor eliminado exitosamente', 
      data: tipoEliminado 
    });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al eliminar tipo de proveedor'));
  }
};

/**
 * Cambiar estado de tipo de proveedor
 */
exports.cambiarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    
    if (typeof estado !== 'boolean') {
      return res.status(400).json({ error: 'El estado debe ser un valor booleano' });
    }
    
    const tipoActualizado = await TipoProveedor.cambiarEstado(id, estado);
    
    if (!tipoActualizado) {
      return res.status(404).json({ error: 'Tipo de proveedor no encontrado' });
    }
    
    res.json({ 
      success: true, 
      message: `Tipo de proveedor ${estado ? 'activado' : 'desactivado'} exitosamente`, 
      data: tipoActualizado 
    });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al cambiar estado'));
  }
};

/**
 * Obtener proveedores de un tipo
 */
exports.obtenerProveedores = async (req, res) => {
  try {
    const { id } = req.params;
    const proveedores = await TipoProveedor.obtenerProveedores(id);
    res.json({ success: true, data: proveedores, total: proveedores.length });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al obtener proveedores del tipo'));
  }
};

/**
 * Buscar tipos de proveedor
 */
exports.buscar = async (req, res) => {
  try {
    const { termino } = req.query;
    
    if (!termino) {
      return res.status(400).json({ error: 'Se requiere un término de búsqueda' });
    }
    
    const tipos = await TipoProveedor.buscar(termino);
    res.json({ success: true, data: tipos, total: tipos.length });
  } catch (error) {
    res.status(500).json(formatearError(error, 'Error al buscar tipos de proveedor'));
  }
};
