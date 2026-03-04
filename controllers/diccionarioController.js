const ExcelJS = require('exceljs');
const path = require('path');

/**
 * Genera un archivo Excel con el diccionario de datos de la base de datos
 * Incluye todas las tablas, columnas, tipos de datos y descripciones
 */
const generarDiccionarioDatos = async (req, res) => {
    try {
        // Crear un nuevo libro de trabajo
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Occitours Sistema';
        workbook.created = new Date();
        
        // Crear hoja principal del diccionario
        const sheet = workbook.addWorksheet('Diccionario de Datos', {
            properties: { tabColor: { argb: 'FF0066CC' } },
            pageSetup: { paperSize: 9, orientation: 'landscape' }
        });
        
        // Definir las columnas con anchos específicos
        sheet.columns = [
            { header: 'Tabla', key: 'tabla', width: 35 },
            { header: 'Columna', key: 'columna', width: 35 },
            { header: 'Tipo de Dato', key: 'tipo', width: 25 },
            { header: 'Nulo', key: 'nulo', width: 10 },
            { header: 'Clave', key: 'clave', width: 15 },
            { header: 'Valor por Defecto', key: 'default', width: 25 },
            { header: 'Descripción', key: 'descripcion', width: 50 }
        ];
        
        // Estilo para el encabezado
        const headerRow = sheet.getRow(1);
        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF0066CC' }
        };
        headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
        headerRow.height = 25;
        
        // Definir la estructura de todas las tablas
        const tablas = [
            {
                nombre: 'roles',
                descripcion: 'Catálogo de roles del sistema (Admin, Empleado, Cliente)',
                columnas: [
                    { nombre: 'id_roles', tipo: 'SERIAL', nulo: 'NO', clave: 'PK', default: 'AUTO', descripcion: 'Identificador único del rol' },
                    { nombre: 'nombre', tipo: 'VARCHAR(50)', nulo: 'NO', clave: 'UNIQUE', default: null, descripcion: 'Nombre del rol (ej: Administrador, Cliente)' },
                    { nombre: 'descripcion', tipo: 'TEXT', nulo: 'SÍ', clave: '', default: null, descripcion: 'Descripción detallada del rol y sus funciones' },
                    { nombre: 'estado', tipo: 'BOOLEAN', nulo: 'SÍ', clave: '', default: 'true', descripcion: 'Estado del rol: true=activo, false=inactivo' },
                    { nombre: 'fecha_creacion', tipo: 'TIMESTAMP', nulo: 'SÍ', clave: '', default: 'CURRENT_TIMESTAMP', descripcion: 'Fecha y hora de creación del registro' }
                ]
            },
            {
                nombre: 'permisos',
                descripcion: 'Catálogo de permisos disponibles en el sistema',
                columnas: [
                    { nombre: 'id_permisos', tipo: 'SERIAL', nulo: 'NO', clave: 'PK', default: 'AUTO', descripcion: 'Identificador único del permiso' },
                    { nombre: 'nombre', tipo: 'VARCHAR(100)', nulo: 'NO', clave: 'UNIQUE', default: null, descripcion: 'Nombre del permiso (ej: crear_reserva, ver_reportes)' },
                    { nombre: 'descripcion', tipo: 'TEXT', nulo: 'SÍ', clave: '', default: null, descripcion: 'Descripción de la acción que permite' },
                    { nombre: 'fecha_creacion', tipo: 'TIMESTAMP', nulo: 'SÍ', clave: '', default: 'CURRENT_TIMESTAMP', descripcion: 'Fecha y hora de creación del registro' }
                ]
            },
            {
                nombre: 'rol_permiso',
                descripcion: 'Relación muchos a muchos entre roles y permisos',
                columnas: [
                    { nombre: 'id_rol_permiso', tipo: 'SERIAL', nulo: 'NO', clave: 'PK', default: 'AUTO', descripcion: 'Identificador único de la relación' },
                    { nombre: 'id_roles', tipo: 'INTEGER', nulo: 'NO', clave: 'FK', default: null, descripcion: 'Referencia al rol (roles.id_roles)' },
                    { nombre: 'id_permisos', tipo: 'INTEGER', nulo: 'NO', clave: 'FK', default: null, descripcion: 'Referencia al permiso (permisos.id_permisos)' },
                    { nombre: 'fecha_asignacion', tipo: 'TIMESTAMP', nulo: 'SÍ', clave: '', default: 'CURRENT_TIMESTAMP', descripcion: 'Fecha de asignación del permiso al rol' }
                ]
            },
            {
                nombre: 'usuarios',
                descripcion: 'Credenciales de autenticación (correo y contraseña)',
                columnas: [
                    { nombre: 'id_usuarios', tipo: 'SERIAL', nulo: 'NO', clave: 'PK', default: 'AUTO', descripcion: 'Identificador único del usuario' },
                    { nombre: 'correo', tipo: 'VARCHAR(100)', nulo: 'NO', clave: 'UNIQUE', default: null, descripcion: 'Correo electrónico para login (único)' },
                    { nombre: 'contrasena', tipo: 'VARCHAR(255)', nulo: 'NO', clave: '', default: null, descripcion: 'Contraseña hasheada con bcrypt' },
                    { nombre: 'fecha_creacion', tipo: 'TIMESTAMP', nulo: 'SÍ', clave: '', default: 'CURRENT_TIMESTAMP', descripcion: 'Fecha de creación de la cuenta' }
                ]
            },
            {
                nombre: 'cliente',
                descripcion: 'Información completa de clientes registrados',
                columnas: [
                    { nombre: 'id_cliente', tipo: 'SERIAL', nulo: 'NO', clave: 'PK', default: 'AUTO', descripcion: 'Identificador único del cliente' },
                    { nombre: 'id_usuarios', tipo: 'INTEGER', nulo: 'NO', clave: 'FK, UNIQUE', default: null, descripcion: 'Referencia a usuario (usuarios.id_usuarios)' },
                    { nombre: 'id_roles', tipo: 'INTEGER', nulo: 'SÍ', clave: 'FK', default: null, descripcion: 'Referencia al rol del cliente (roles.id_roles)' },
                    { nombre: 'nombre', tipo: 'VARCHAR(100)', nulo: 'NO', clave: '', default: null, descripcion: 'Nombre(s) del cliente' },
                    { nombre: 'apellido', tipo: 'VARCHAR(100)', nulo: 'NO', clave: '', default: null, descripcion: 'Apellido(s) del cliente' },
                    { nombre: 'tipo_documento', tipo: 'VARCHAR(20)', nulo: 'SÍ', clave: '', default: null, descripcion: 'CC, TI, CE, Pasaporte' },
                    { nombre: 'numero_documento', tipo: 'VARCHAR(50)', nulo: 'SÍ', clave: 'UNIQUE', default: null, descripcion: 'Número de identificación único' },
                    { nombre: 'telefono', tipo: 'VARCHAR(20)', nulo: 'SÍ', clave: '', default: null, descripcion: 'Número telefónico de contacto' },
                    { nombre: 'direccion', tipo: 'TEXT', nulo: 'SÍ', clave: '', default: null, descripcion: 'Dirección de residencia' },
                    { nombre: 'fecha_nacimiento', tipo: 'DATE', nulo: 'SÍ', clave: '', default: null, descripcion: 'Fecha de nacimiento del cliente' },
                    { nombre: 'estado', tipo: 'BOOLEAN', nulo: 'SÍ', clave: '', default: 'true', descripcion: 'Estado: true=activo, false=inactivo' },
                    { nombre: 'ultimo_acceso', tipo: 'TIMESTAMP', nulo: 'SÍ', clave: '', default: null, descripcion: 'Última fecha de inicio de sesión' },
                    { nombre: 'fecha_registro', tipo: 'TIMESTAMP', nulo: 'SÍ', clave: '', default: 'CURRENT_TIMESTAMP', descripcion: 'Fecha de registro en el sistema' },
                    { nombre: 'fecha_actualizacion', tipo: 'TIMESTAMP', nulo: 'SÍ', clave: '', default: 'CURRENT_TIMESTAMP', descripcion: 'Última actualización del perfil' }
                ]
            },
            {
                nombre: 'empleado',
                descripcion: 'Información completa de empleados',
                columnas: [
                    { nombre: 'id_empleado', tipo: 'SERIAL', nulo: 'NO', clave: 'PK', default: 'AUTO', descripcion: 'Identificador único del empleado' },
                    { nombre: 'id_usuarios', tipo: 'INTEGER', nulo: 'NO', clave: 'FK, UNIQUE', default: null, descripcion: 'Referencia a usuario (usuarios.id_usuarios)' },
                    { nombre: 'id_roles', tipo: 'INTEGER', nulo: 'SÍ', clave: 'FK', default: null, descripcion: 'Referencia al rol del empleado (roles.id_roles)' },
                    { nombre: 'nombre', tipo: 'VARCHAR(100)', nulo: 'NO', clave: '', default: null, descripcion: 'Nombre(s) del empleado' },
                    { nombre: 'apellido', tipo: 'VARCHAR(100)', nulo: 'NO', clave: '', default: null, descripcion: 'Apellido(s) del empleado' },
                    { nombre: 'tipo_documento', tipo: 'VARCHAR(20)', nulo: 'SÍ', clave: '', default: null, descripcion: 'CC, TI, CE, Pasaporte' },
                    { nombre: 'numero_documento', tipo: 'VARCHAR(50)', nulo: 'SÍ', clave: 'UNIQUE', default: null, descripcion: 'Número de identificación único' },
                    { nombre: 'telefono', tipo: 'VARCHAR(20)', nulo: 'SÍ', clave: '', default: null, descripcion: 'Número telefónico de contacto' },
                    { nombre: 'cargo', tipo: 'VARCHAR(50)', nulo: 'SÍ', clave: '', default: null, descripcion: 'Cargo o posición en la empresa' },
                    { nombre: 'fecha_contratacion', tipo: 'DATE', nulo: 'SÍ', clave: '', default: null, descripcion: 'Fecha de ingreso a la empresa' },
                    { nombre: 'estado', tipo: 'BOOLEAN', nulo: 'SÍ', clave: '', default: 'true', descripcion: 'Estado: true=activo, false=inactivo' },
                    { nombre: 'ultimo_acceso', tipo: 'TIMESTAMP', nulo: 'SÍ', clave: '', default: null, descripcion: 'Última fecha de inicio de sesión' },
                    { nombre: 'fecha_registro', tipo: 'TIMESTAMP', nulo: 'SÍ', clave: '', default: 'CURRENT_TIMESTAMP', descripcion: 'Fecha de registro en el sistema' },
                    { nombre: 'fecha_actualizacion', tipo: 'TIMESTAMP', nulo: 'SÍ', clave: '', default: 'CURRENT_TIMESTAMP', descripcion: 'Última actualización del perfil' }
                ]
            },
            {
                nombre: 'propietario',
                descripcion: 'Propietarios de fincas turísticas',
                columnas: [
                    { nombre: 'id_propietario', tipo: 'SERIAL', nulo: 'NO', clave: 'PK', default: 'AUTO', descripcion: 'Identificador único del propietario' },
                    { nombre: 'nombre', tipo: 'VARCHAR(100)', nulo: 'NO', clave: '', default: null, descripcion: 'Nombre(s) del propietario' },
                    { nombre: 'apellido', tipo: 'VARCHAR(100)', nulo: 'SÍ', clave: '', default: null, descripcion: 'Apellido(s) del propietario' },
                    { nombre: 'tipo_documento', tipo: 'VARCHAR(20)', nulo: 'SÍ', clave: '', default: null, descripcion: 'CC, TI, CE, Pasaporte, NIT' },
                    { nombre: 'numero_documento', tipo: 'VARCHAR(50)', nulo: 'SÍ', clave: 'UNIQUE', default: null, descripcion: 'Número de identificación único' },
                    { nombre: 'telefono', tipo: 'VARCHAR(20)', nulo: 'SÍ', clave: '', default: null, descripcion: 'Número telefónico de contacto' },
                    { nombre: 'email', tipo: 'VARCHAR(100)', nulo: 'SÍ', clave: '', default: null, descripcion: 'Correo electrónico de contacto' },
                    { nombre: 'direccion', tipo: 'TEXT', nulo: 'SÍ', clave: '', default: null, descripcion: 'Dirección de residencia o empresa' },
                    { nombre: 'estado', tipo: 'BOOLEAN', nulo: 'SÍ', clave: '', default: 'true', descripcion: 'Estado: true=activo, false=inactivo' },
                    { nombre: 'fecha_registro', tipo: 'TIMESTAMP', nulo: 'SÍ', clave: '', default: 'CURRENT_TIMESTAMP', descripcion: 'Fecha de registro en el sistema' }
                ]
            },
            {
                nombre: 'tipo_proveedor',
                descripcion: 'Catálogo de tipos de proveedores',
                columnas: [
                    { nombre: 'id_tipo', tipo: 'SERIAL', nulo: 'NO', clave: 'PK', default: 'AUTO', descripcion: 'Identificador único del tipo de proveedor' },
                    { nombre: 'nombre', tipo: 'VARCHAR(100)', nulo: 'NO', clave: 'UNIQUE', default: null, descripcion: 'Nombre del tipo (Transporte, Alimentación, Guía, Hospedaje)' },
                    { nombre: 'descripcion', tipo: 'TEXT', nulo: 'SÍ', clave: '', default: null, descripcion: 'Descripción del tipo de proveedor' },
                    { nombre: 'estado', tipo: 'BOOLEAN', nulo: 'SÍ', clave: '', default: 'true', descripcion: 'Estado: true=activo, false=inactivo' }
                ]
            },
            {
                nombre: 'proveedores',
                descripcion: 'Proveedores de servicios (transporte, alimentación, guía)',
                columnas: [
                    { nombre: 'id_proveedores', tipo: 'SERIAL', nulo: 'NO', clave: 'PK', default: 'AUTO', descripcion: 'Identificador único del proveedor' },
                    { nombre: 'nombre', tipo: 'VARCHAR(150)', nulo: 'NO', clave: '', default: null, descripcion: 'Nombre de la empresa o proveedor' },
                    { nombre: 'id_tipo', tipo: 'INTEGER', nulo: 'NO', clave: 'FK', default: null, descripcion: 'Referencia al tipo de proveedor (tipo_proveedor.id_tipo)' },
                    { nombre: 'telefono', tipo: 'VARCHAR(20)', nulo: 'SÍ', clave: '', default: null, descripcion: 'Número telefónico de contacto' },
                    { nombre: 'email', tipo: 'VARCHAR(100)', nulo: 'SÍ', clave: '', default: null, descripcion: 'Correo electrónico de contacto' },
                    { nombre: 'direccion', tipo: 'TEXT', nulo: 'SÍ', clave: '', default: null, descripcion: 'Dirección de la empresa' },
                    { nombre: 'estado', tipo: 'BOOLEAN', nulo: 'SÍ', clave: '', default: 'true', descripcion: 'Estado: true=activo, false=inactivo' },
                    { nombre: 'fecha_registro', tipo: 'TIMESTAMP', nulo: 'SÍ', clave: '', default: 'CURRENT_TIMESTAMP', descripcion: 'Fecha de registro en el sistema' }
                ]
            },
            {
                nombre: 'ruta',
                descripcion: 'Rutas turísticas disponibles',
                columnas: [
                    { nombre: 'id_ruta', tipo: 'SERIAL', nulo: 'NO', clave: 'PK', default: 'AUTO', descripcion: 'Identificador único de la ruta' },
                    { nombre: 'nombre', tipo: 'VARCHAR(150)', nulo: 'NO', clave: '', default: null, descripcion: 'Nombre de la ruta turística' },
                    { nombre: 'descripcion', tipo: 'TEXT', nulo: 'SÍ', clave: '', default: null, descripcion: 'Descripción detallada de la ruta e itinerario' },
                    { nombre: 'duracion_dias', tipo: 'INTEGER', nulo: 'SÍ', clave: '', default: null, descripcion: 'Duración total de la ruta en días' },
                    { nombre: 'precio_base', tipo: 'DECIMAL(10,2)', nulo: 'SÍ', clave: '', default: null, descripcion: 'Precio base por persona' },
                    { nombre: 'dificultad', tipo: 'VARCHAR(20)', nulo: 'SÍ', clave: '', default: null, descripcion: 'Fácil, Moderada, Difícil' },
                    { nombre: 'imagen_url', tipo: 'TEXT', nulo: 'SÍ', clave: '', default: null, descripcion: 'URL de la imagen principal de la ruta' },
                    { nombre: 'estado', tipo: 'BOOLEAN', nulo: 'SÍ', clave: '', default: 'true', descripcion: 'Estado: true=activo, false=inactivo' },
                    { nombre: 'fecha_creacion', tipo: 'TIMESTAMP', nulo: 'SÍ', clave: '', default: 'CURRENT_TIMESTAMP', descripcion: 'Fecha de creación de la ruta' }
                ]
            },
            {
                nombre: 'finca',
                descripcion: 'Fincas disponibles para hospedaje',
                columnas: [
                    { nombre: 'id_finca', tipo: 'SERIAL', nulo: 'NO', clave: 'PK', default: 'AUTO', descripcion: 'Identificador único de la finca' },
                    { nombre: 'id_propietario', tipo: 'INTEGER', nulo: 'SÍ', clave: 'FK', default: null, descripcion: 'Referencia al propietario (propietario.id_propietario)' },
                    { nombre: 'nombre', tipo: 'VARCHAR(150)', nulo: 'NO', clave: '', default: null, descripcion: 'Nombre de la finca' },
                    { nombre: 'descripcion', tipo: 'TEXT', nulo: 'SÍ', clave: '', default: null, descripcion: 'Descripción y servicios de la finca' },
                    { nombre: 'direccion', tipo: 'TEXT', nulo: 'SÍ', clave: '', default: null, descripcion: 'Dirección física de la finca' },
                    { nombre: 'ubicacion', tipo: 'VARCHAR(200)', nulo: 'SÍ', clave: '', default: null, descripcion: 'Coordenadas GPS o ciudad' },
                    { nombre: 'capacidad_personas', tipo: 'INTEGER', nulo: 'SÍ', clave: '', default: null, descripcion: 'Número máximo de personas' },
                    { nombre: 'precio_por_noche', tipo: 'DECIMAL(10,2)', nulo: 'SÍ', clave: '', default: null, descripcion: 'Precio por noche de hospedaje' },
                    { nombre: 'imagen_principal', tipo: 'TEXT', nulo: 'SÍ', clave: '', default: null, descripcion: 'URL de la imagen principal' },
                    { nombre: 'estado', tipo: 'BOOLEAN', nulo: 'SÍ', clave: '', default: 'true', descripcion: 'Estado: true=activo, false=inactivo' },
                    { nombre: 'fecha_registro', tipo: 'TIMESTAMP', nulo: 'SÍ', clave: '', default: 'CURRENT_TIMESTAMP', descripcion: 'Fecha de registro en el sistema' }
                ]
            },
            {
                nombre: 'servicio',
                descripcion: 'Servicios adicionales disponibles',
                columnas: [
                    { nombre: 'id_servicio', tipo: 'SERIAL', nulo: 'NO', clave: 'PK', default: 'AUTO', descripcion: 'Identificador único del servicio' },
                    { nombre: 'nombre', tipo: 'VARCHAR(150)', nulo: 'NO', clave: '', default: null, descripcion: 'Nombre del servicio' },
                    { nombre: 'descripcion', tipo: 'TEXT', nulo: 'SÍ', clave: '', default: null, descripcion: 'Descripción detallada del servicio' },
                    { nombre: 'precio', tipo: 'DECIMAL(10,2)', nulo: 'SÍ', clave: '', default: null, descripcion: 'Precio del servicio' },
                    { nombre: 'imagen_url', tipo: 'TEXT', nulo: 'SÍ', clave: '', default: null, descripcion: 'URL de la imagen del servicio' },
                    { nombre: 'estado', tipo: 'BOOLEAN', nulo: 'SÍ', clave: '', default: 'true', descripcion: 'Estado: true=disponible, false=no disponible' },
                    { nombre: 'fecha_creacion', tipo: 'TIMESTAMP', nulo: 'SÍ', clave: '', default: 'CURRENT_TIMESTAMP', descripcion: 'Fecha de creación del servicio' }
                ]
            },
            {
                nombre: 'detalle_proveedor_servicio',
                descripcion: 'Relación entre proveedores y servicios que ofrecen',
                columnas: [
                    { nombre: 'id_detalle_proveedor_servicio', tipo: 'SERIAL', nulo: 'NO', clave: 'PK', default: 'AUTO', descripcion: 'Identificador único de la relación' },
                    { nombre: 'id_proveedores', tipo: 'INTEGER', nulo: 'NO', clave: 'FK', default: null, descripcion: 'Referencia al proveedor (proveedores.id_proveedores)' },
                    { nombre: 'id_servicio', tipo: 'INTEGER', nulo: 'NO', clave: 'FK', default: null, descripcion: 'Referencia al servicio (servicio.id_servicio)' },
                    { nombre: 'precio_proveedor', tipo: 'DECIMAL(10,2)', nulo: 'SÍ', clave: '', default: null, descripcion: 'Precio específico del proveedor para este servicio' },
                    { nombre: 'fecha_asignacion', tipo: 'TIMESTAMP', nulo: 'SÍ', clave: '', default: 'CURRENT_TIMESTAMP', descripcion: 'Fecha de asignación del servicio al proveedor' }
                ]
            },
            {
                nombre: 'programacion',
                descripcion: 'Programaciones de rutas con fechas específicas',
                columnas: [
                    { nombre: 'id_programacion', tipo: 'SERIAL', nulo: 'NO', clave: 'PK', default: 'AUTO', descripcion: 'Identificador único de la programación' },
                    { nombre: 'id_ruta', tipo: 'INTEGER', nulo: 'NO', clave: 'FK', default: null, descripcion: 'Referencia a la ruta (ruta.id_ruta)' },
                    { nombre: 'id_empleado', tipo: 'INTEGER', nulo: 'SÍ', clave: 'FK', default: null, descripcion: 'Empleado responsable (empleado.id_empleado)' },
                    { nombre: 'fecha_salida', tipo: 'DATE', nulo: 'NO', clave: '', default: null, descripcion: 'Fecha de inicio de la ruta' },
                    { nombre: 'fecha_regreso', tipo: 'DATE', nulo: 'NO', clave: '', default: null, descripcion: 'Fecha de finalización de la ruta' },
                    { nombre: 'cupos_totales', tipo: 'INTEGER', nulo: 'NO', clave: '', default: null, descripcion: 'Número total de cupos disponibles' },
                    { nombre: 'cupos_disponibles', tipo: 'INTEGER', nulo: 'NO', clave: '', default: null, descripcion: 'Cupos aún disponibles para reservar' },
                    { nombre: 'precio_programacion', tipo: 'DECIMAL(10,2)', nulo: 'SÍ', clave: '', default: null, descripcion: 'Precio para esta programación específica' },
                    { nombre: 'estado', tipo: 'VARCHAR(20)', nulo: 'SÍ', clave: '', default: 'Programado', descripcion: 'Programado, En progreso, Completado, Cancelado' },
                    { nombre: 'fecha_creacion', tipo: 'TIMESTAMP', nulo: 'SÍ', clave: '', default: 'CURRENT_TIMESTAMP', descripcion: 'Fecha de creación de la programación' }
                ]
            },
            {
                nombre: 'reserva',
                descripcion: 'Reservas de clientes con código QR único',
                columnas: [
                    { nombre: 'id_reserva', tipo: 'SERIAL', nulo: 'NO', clave: 'PK', default: 'AUTO', descripcion: 'Identificador único de la reserva' },
                    { nombre: 'id_cliente', tipo: 'INTEGER', nulo: 'NO', clave: 'FK', default: null, descripcion: 'Referencia al cliente (cliente.id_cliente)' },
                    { nombre: 'fecha_reserva', tipo: 'TIMESTAMP', nulo: 'SÍ', clave: '', default: 'CURRENT_TIMESTAMP', descripcion: 'Fecha y hora de creación de la reserva' },
                    { nombre: 'estado', tipo: 'VARCHAR(20)', nulo: 'SÍ', clave: '', default: 'Pendiente', descripcion: 'Pendiente, Confirmada, Cancelada, Completada' },
                    { nombre: 'monto_total', tipo: 'DECIMAL(10,2)', nulo: 'SÍ', clave: '', default: '0', descripcion: 'Monto total de la reserva' },
                    { nombre: 'notas', tipo: 'TEXT', nulo: 'SÍ', clave: '', default: null, descripcion: 'Notas adicionales de la reserva' },
                    { nombre: 'cancelado_por', tipo: 'VARCHAR(100)', nulo: 'SÍ', clave: '', default: null, descripcion: 'Usuario que canceló la reserva' },
                    { nombre: 'fecha_cancelacion', tipo: 'TIMESTAMP', nulo: 'SÍ', clave: '', default: null, descripcion: 'Fecha de cancelación' },
                    { nombre: 'motivo_cancelacion', tipo: 'TEXT', nulo: 'SÍ', clave: '', default: null, descripcion: 'Motivo de cancelación' },
                    { nombre: 'codigo_qr', tipo: 'VARCHAR(100)', nulo: 'SÍ', clave: 'UNIQUE', default: 'AUTO', descripcion: 'Código QR único para pago (generado automáticamente)' },
                    { nombre: 'qr_generado', tipo: 'BOOLEAN', nulo: 'SÍ', clave: '', default: 'false', descripcion: 'Indica si se generó el código QR' },
                    { nombre: 'fecha_generacion_qr', tipo: 'TIMESTAMP', nulo: 'SÍ', clave: '', default: null, descripcion: 'Fecha de generación del código QR' },
                    { nombre: 'fecha_creacion', tipo: 'TIMESTAMP', nulo: 'SÍ', clave: '', default: 'CURRENT_TIMESTAMP', descripcion: 'Fecha de creación del registro' },
                    { nombre: 'fecha_actualizacion', tipo: 'TIMESTAMP', nulo: 'SÍ', clave: '', default: 'CURRENT_TIMESTAMP', descripcion: 'Última actualización' }
                ]
            },
            {
                nombre: 'detalle_reserva_programacion',
                descripcion: 'Rutas programadas incluidas en la reserva',
                columnas: [
                    { nombre: 'id_detalle_reserva_programacion', tipo: 'SERIAL', nulo: 'NO', clave: 'PK', default: 'AUTO', descripcion: 'Identificador único' },
                    { nombre: 'id_reserva', tipo: 'INTEGER', nulo: 'NO', clave: 'FK', default: null, descripcion: 'Referencia a la reserva (reserva.id_reserva)' },
                    { nombre: 'id_programacion', tipo: 'INTEGER', nulo: 'NO', clave: 'FK', default: null, descripcion: 'Referencia a la programación (programacion.id_programacion)' },
                    { nombre: 'cantidad_personas', tipo: 'INTEGER', nulo: 'SÍ', clave: '', default: '1', descripcion: 'Número de personas para esta programación' },
                    { nombre: 'precio_unitario', tipo: 'DECIMAL(10,2)', nulo: 'SÍ', clave: '', default: null, descripcion: 'Precio por persona' },
                    { nombre: 'subtotal', tipo: 'DECIMAL(10,2)', nulo: 'SÍ', clave: '', default: null, descripcion: 'Subtotal (cantidad * precio_unitario)' },
                    { nombre: 'fecha_agregado', tipo: 'TIMESTAMP', nulo: 'SÍ', clave: '', default: 'CURRENT_TIMESTAMP', descripcion: 'Fecha de agregado a la reserva' }
                ]
            },
            {
                nombre: 'detalle_reserva_finca',
                descripcion: 'Fincas incluidas en la reserva (hospedaje)',
                columnas: [
                    { nombre: 'id_detalle_reserva_finca', tipo: 'SERIAL', nulo: 'NO', clave: 'PK', default: 'AUTO', descripcion: 'Identificador único' },
                    { nombre: 'id_reserva', tipo: 'INTEGER', nulo: 'NO', clave: 'FK', default: null, descripcion: 'Referencia a la reserva (reserva.id_reserva)' },
                    { nombre: 'id_finca', tipo: 'INTEGER', nulo: 'NO', clave: 'FK', default: null, descripcion: 'Referencia a la finca (finca.id_finca)' },
                    { nombre: 'fecha_checkin', tipo: 'DATE', nulo: 'NO', clave: '', default: null, descripcion: 'Fecha de entrada a la finca' },
                    { nombre: 'fecha_checkout', tipo: 'DATE', nulo: 'NO', clave: '', default: null, descripcion: 'Fecha de salida de la finca' },
                    { nombre: 'numero_noches', tipo: 'INTEGER', nulo: 'SÍ', clave: '', default: null, descripcion: 'Número de noches de hospedaje' },
                    { nombre: 'precio_por_noche', tipo: 'DECIMAL(10,2)', nulo: 'SÍ', clave: '', default: null, descripcion: 'Precio por noche' },
                    { nombre: 'subtotal', tipo: 'DECIMAL(10,2)', nulo: 'SÍ', clave: '', default: null, descripcion: 'Subtotal (numero_noches * precio_por_noche)' },
                    { nombre: 'fecha_agregado', tipo: 'TIMESTAMP', nulo: 'SÍ', clave: '', default: 'CURRENT_TIMESTAMP', descripcion: 'Fecha de agregado a la reserva' }
                ]
            },
            {
                nombre: 'detalle_reserva_servicio',
                descripcion: 'Servicios adicionales incluidos en la reserva',
                columnas: [
                    { nombre: 'id_detalle_reserva_servicio', tipo: 'SERIAL', nulo: 'NO', clave: 'PK', default: 'AUTO', descripcion: 'Identificador único' },
                    { nombre: 'id_reserva', tipo: 'INTEGER', nulo: 'NO', clave: 'FK', default: null, descripcion: 'Referencia a la reserva (reserva.id_reserva)' },
                    { nombre: 'id_servicio', tipo: 'INTEGER', nulo: 'NO', clave: 'FK', default: null, descripcion: 'Referencia al servicio (servicio.id_servicio)' },
                    { nombre: 'cantidad', tipo: 'INTEGER', nulo: 'SÍ', clave: '', default: '1', descripcion: 'Cantidad de servicios' },
                    { nombre: 'precio_unitario', tipo: 'DECIMAL(10,2)', nulo: 'SÍ', clave: '', default: null, descripcion: 'Precio por unidad' },
                    { nombre: 'subtotal', tipo: 'DECIMAL(10,2)', nulo: 'SÍ', clave: '', default: null, descripcion: 'Subtotal (cantidad * precio_unitario)' },
                    { nombre: 'fecha_agregado', tipo: 'TIMESTAMP', nulo: 'SÍ', clave: '', default: 'CURRENT_TIMESTAMP', descripcion: 'Fecha de agregado a la reserva' }
                ]
            },
            {
                nombre: 'detalle_reserva_acompanante',
                descripcion: 'Acompañantes del cliente en la reserva',
                columnas: [
                    { nombre: 'id_detalle_reserva_acompanante', tipo: 'SERIAL', nulo: 'NO', clave: 'PK', default: 'AUTO', descripcion: 'Identificador único' },
                    { nombre: 'id_reserva', tipo: 'INTEGER', nulo: 'NO', clave: 'FK', default: null, descripcion: 'Referencia a la reserva (reserva.id_reserva)' },
                    { nombre: 'id_cliente', tipo: 'INTEGER', nulo: 'SÍ', clave: 'FK', default: null, descripcion: 'Cliente registrado (NULL si es invitado)' },
                    { nombre: 'nombre', tipo: 'VARCHAR(100)', nulo: 'NO', clave: '', default: null, descripcion: 'Nombre del acompañante' },
                    { nombre: 'apellido', tipo: 'VARCHAR(100)', nulo: 'NO', clave: '', default: null, descripcion: 'Apellido del acompañante' },
                    { nombre: 'tipo_documento', tipo: 'VARCHAR(20)', nulo: 'SÍ', clave: '', default: null, descripcion: 'CC, TI, CE, Pasaporte' },
                    { nombre: 'numero_documento', tipo: 'VARCHAR(50)', nulo: 'SÍ', clave: '', default: null, descripcion: 'Número de documento' },
                    { nombre: 'telefono', tipo: 'VARCHAR(20)', nulo: 'SÍ', clave: '', default: null, descripcion: 'Teléfono de contacto' },
                    { nombre: 'fecha_nacimiento', tipo: 'DATE', nulo: 'SÍ', clave: '', default: null, descripcion: 'Fecha de nacimiento' },
                    { nombre: 'fecha_agregado', tipo: 'TIMESTAMP', nulo: 'SÍ', clave: '', default: 'CURRENT_TIMESTAMP', descripcion: 'Fecha de agregado a la reserva' }
                ]
            },
            {
                nombre: 'venta',
                descripcion: 'Resumen financiero de la reserva (total, pagado, saldo)',
                columnas: [
                    { nombre: 'id_venta', tipo: 'SERIAL', nulo: 'NO', clave: 'PK', default: 'AUTO', descripcion: 'Identificador único de la venta' },
                    { nombre: 'id_reserva', tipo: 'INTEGER', nulo: 'NO', clave: 'FK, UNIQUE', default: null, descripcion: 'Referencia a la reserva (reserva.id_reserva)' },
                    { nombre: 'fecha_venta', tipo: 'TIMESTAMP', nulo: 'SÍ', clave: '', default: 'CURRENT_TIMESTAMP', descripcion: 'Fecha de generación de la venta' },
                    { nombre: 'monto_total', tipo: 'DECIMAL(10,2)', nulo: 'NO', clave: '', default: null, descripcion: 'Monto total a pagar' },
                    { nombre: 'monto_pagado', tipo: 'DECIMAL(10,2)', nulo: 'SÍ', clave: '', default: '0', descripcion: 'Total pagado hasta el momento' },
                    { nombre: 'saldo_pendiente', tipo: 'DECIMAL(10,2)', nulo: 'SÍ', clave: '', default: '0', descripcion: 'Saldo restante por pagar' },
                    { nombre: 'estado_pago', tipo: 'VARCHAR(20)', nulo: 'SÍ', clave: '', default: 'Pendiente', descripcion: 'Pendiente, Parcial, Pagado, Cancelado' },
                    { nombre: 'metodo_pago', tipo: 'VARCHAR(50)', nulo: 'SÍ', clave: '', default: null, descripcion: 'Efectivo, Tarjeta, Transferencia, PSE' },
                    { nombre: 'fecha_creacion', tipo: 'TIMESTAMP', nulo: 'SÍ', clave: '', default: 'CURRENT_TIMESTAMP', descripcion: 'Fecha de creación del registro' }
                ]
            },
            {
                nombre: 'pago',
                descripcion: 'Registro de cada pago/abono con comprobante',
                columnas: [
                    { nombre: 'id_pago', tipo: 'SERIAL', nulo: 'NO', clave: 'PK', default: 'AUTO', descripcion: 'Identificador único del pago' },
                    { nombre: 'id_venta', tipo: 'INTEGER', nulo: 'NO', clave: 'FK', default: null, descripcion: 'Referencia a la venta (venta.id_venta)' },
                    { nombre: 'id_reserva', tipo: 'INTEGER', nulo: 'NO', clave: 'FK', default: null, descripcion: 'Referencia a la reserva (reserva.id_reserva)' },
                    { nombre: 'monto', tipo: 'DECIMAL(10,2)', nulo: 'NO', clave: '', default: null, descripcion: 'Monto del abono' },
                    { nombre: 'metodo_pago', tipo: 'VARCHAR(50)', nulo: 'SÍ', clave: '', default: null, descripcion: 'Efectivo, Tarjeta, Transferencia, PSE, QR' },
                    { nombre: 'numero_transaccion', tipo: 'VARCHAR(100)', nulo: 'SÍ', clave: '', default: null, descripcion: 'Número de referencia de la transacción' },
                    { nombre: 'comprobante_url', tipo: 'TEXT', nulo: 'SÍ', clave: '', default: null, descripcion: 'URL del archivo del comprobante' },
                    { nombre: 'comprobante_nombre', tipo: 'VARCHAR(255)', nulo: 'SÍ', clave: '', default: null, descripcion: 'Nombre original del archivo' },
                    { nombre: 'comprobante_tipo', tipo: 'VARCHAR(50)', nulo: 'SÍ', clave: '', default: null, descripcion: 'image/jpeg, application/pdf, etc.' },
                    { nombre: 'estado', tipo: 'VARCHAR(20)', nulo: 'SÍ', clave: '', default: 'Pendiente', descripcion: 'Pendiente, Verificado, Rechazado, Aprobado' },
                    { nombre: 'verificado_por', tipo: 'INTEGER', nulo: 'SÍ', clave: 'FK', default: null, descripcion: 'Empleado que verificó (empleado.id_empleado)' },
                    { nombre: 'fecha_verificacion', tipo: 'TIMESTAMP', nulo: 'SÍ', clave: '', default: null, descripcion: 'Fecha de verificación del comprobante' },
                    { nombre: 'observaciones', tipo: 'TEXT', nulo: 'SÍ', clave: '', default: null, descripcion: 'Observaciones del pago' },
                    { nombre: 'motivo_rechazo', tipo: 'TEXT', nulo: 'SÍ', clave: '', default: null, descripcion: 'Motivo de rechazo del comprobante' },
                    { nombre: 'fecha_pago', tipo: 'TIMESTAMP', nulo: 'SÍ', clave: '', default: 'CURRENT_TIMESTAMP', descripcion: 'Fecha del pago' },
                    { nombre: 'fecha_creacion', tipo: 'TIMESTAMP', nulo: 'SÍ', clave: '', default: 'CURRENT_TIMESTAMP', descripcion: 'Fecha de creación del registro' },
                    { nombre: 'fecha_actualizacion', tipo: 'TIMESTAMP', nulo: 'SÍ', clave: '', default: 'CURRENT_TIMESTAMP', descripcion: 'Última actualización' }
                ]
            },
            {
                nombre: 'pago_proveedor',
                descripcion: 'Pagos realizados a proveedores',
                columnas: [
                    { nombre: 'id_pago_proveedor', tipo: 'SERIAL', nulo: 'NO', clave: 'PK', default: 'AUTO', descripcion: 'Identificador único del pago' },
                    { nombre: 'id_proveedores', tipo: 'INTEGER', nulo: 'NO', clave: 'FK', default: null, descripcion: 'Referencia al proveedor (proveedores.id_proveedores)' },
                    { nombre: 'observaciones', tipo: 'TEXT', nulo: 'NO', clave: '', default: null, descripcion: 'Descripción del pago' },
                    { nombre: 'monto', tipo: 'DECIMAL(10,2)', nulo: 'NO', clave: '', default: null, descripcion: 'Monto del pago' },
                    { nombre: 'fecha_pago', tipo: 'DATE', nulo: 'NO', clave: '', default: null, descripcion: 'Fecha del pago al proveedor' },
                    { nombre: 'metodo_pago', tipo: 'VARCHAR(50)', nulo: 'SÍ', clave: '', default: null, descripcion: 'Efectivo, Transferencia, Cheque' },
                    { nombre: 'numero_transaccion', tipo: 'VARCHAR(100)', nulo: 'SÍ', clave: '', default: null, descripcion: 'Número de referencia de la transacción' },
                    { nombre: 'comprobante_pago', tipo: 'TEXT', nulo: 'SÍ', clave: '', default: null, descripcion: 'URL o referencia del comprobante' },
                    { nombre: 'estado', tipo: 'VARCHAR(20)', nulo: 'SÍ', clave: '', default: 'Pagado', descripcion: 'Pagado, Pendiente, Anulado' },
                    { nombre: 'fecha_registro', tipo: 'TIMESTAMP', nulo: 'SÍ', clave: '', default: 'CURRENT_TIMESTAMP', descripcion: 'Fecha de registro del pago' }
                ]
            }
        ];
        
        // Agregar datos al Excel
        let rowCount = 2; // Comenzar después del encabezado
        
        tablas.forEach(tabla => {
            tabla.columnas.forEach((columna, index) => {
                const row = sheet.addRow({
                    tabla: index === 0 ? tabla.nombre : '', // Solo mostrar nombre de tabla en primera fila
                    columna: columna.nombre,
                    tipo: columna.tipo,
                    nulo: columna.nulo,
                    clave: columna.clave,
                    default: columna.default || '',
                    descripcion: columna.descripcion
                });
                
                // Estilo alternado de filas
                if (rowCount % 2 === 0) {
                    row.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFF5F5F5' }
                    };
                }
                
                // Negrita para el nombre de la tabla
                if (index === 0) {
                    row.getCell('tabla').font = { bold: true, size: 11 };
                    row.getCell('tabla').fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFE0E0FF' }
                    };
                }
                
                // Resaltar claves primarias y foráneas
                if (columna.clave.includes('PK')) {
                    row.getCell('clave').font = { bold: true, color: { argb: 'FFFF0000' } };
                } else if (columna.clave.includes('FK')) {
                    row.getCell('clave').font = { bold: true, color: { argb: 'FF0000FF' } };
                }
                
                rowCount++;
            });
            
            // Agregar fila en blanco entre tablas
            sheet.addRow({});
            rowCount++;
        });
        
        // Aplicar bordes a todas las celdas con datos
        sheet.eachRow((row, rowNumber) => {
            if (rowNumber <= rowCount) {
                row.eachCell((cell) => {
                    cell.border = {
                        top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                        left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                        bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                        right: { style: 'thin', color: { argb: 'FFCCCCCC' } }
                    };
                });
            }
        });
        
        // Crear segunda hoja con resumen
        const resumenSheet = workbook.addWorksheet('Resumen', {
            properties: { tabColor: { argb: 'FF00CC00' } }
        });
        
        resumenSheet.columns = [
            { header: 'Módulo', key: 'modulo', width: 40 },
            { header: 'Número de Tablas', key: 'tablas', width: 20 },
            { header: 'Tablas', key: 'nombres', width: 60 }
        ];
        
        // Estilo del encabezado de resumen
        const resumenHeaderRow = resumenSheet.getRow(1);
        resumenHeaderRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
        resumenHeaderRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF00CC00' }
        };
        resumenHeaderRow.alignment = { vertical: 'middle', horizontal: 'center' };
        resumenHeaderRow.height = 25;
        
        // Datos del resumen
        const modulos = [
            { modulo: 'Autenticación y Autorización', tablas: 3, nombres: 'roles, permisos, rol_permiso' },
            { modulo: 'Usuarios', tablas: 3, nombres: 'usuarios, cliente, empleado' },
            { modulo: 'Propietarios y Proveedores', tablas: 4, nombres: 'propietario, tipo_proveedor, proveedores, detalle_proveedor_servicio' },
            { modulo: 'Productos y Servicios', tablas: 3, nombres: 'ruta, finca, servicio' },
            { modulo: 'Programación', tablas: 1, nombres: 'programacion' },
            { modulo: 'Reservas', tablas: 5, nombres: 'reserva, detalle_reserva_programacion, detalle_reserva_finca, detalle_reserva_servicio, detalle_reserva_acompanante' },
            { modulo: 'Ventas y Pagos', tablas: 3, nombres: 'venta, pago, pago_proveedor' }
        ];
        
        modulos.forEach((mod, index) => {
            const row = resumenSheet.addRow(mod);
            if ((index + 2) % 2 === 0) {
                row.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFF0FFF0' }
                };
            }
        });
        
        // Agregar totales
        const totalRow = resumenSheet.addRow({
            modulo: 'TOTAL',
            tablas: 22,
            nombres: '-'
        });
        totalRow.font = { bold: true, size: 11 };
        totalRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFEB3B' }
        };
        
        // Aplicar bordes
        resumenSheet.eachRow((row, rowNumber) => {
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                    left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                    bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                    right: { style: 'thin', color: { argb: 'FFCCCCCC' } }
                };
            });
        });
        
        // Crear tercera hoja con referencias
        const referenciasSheet = workbook.addWorksheet('Referencias', {
            properties: { tabColor: { argb: 'FFFF6600' } }
        });
        
        referenciasSheet.columns = [
            { header: 'Abreviatura', key: 'abrev', width: 20 },
            { header: 'Significado', key: 'significado', width: 60 }
        ];
        
        const refHeaderRow = referenciasSheet.getRow(1);
        refHeaderRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
        refHeaderRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF6600' }
        };
        refHeaderRow.alignment = { vertical: 'middle', horizontal: 'center' };
        refHeaderRow.height = 25;
        
        const referencias = [
            { abrev: 'PK', significado: 'Primary Key (Clave Primaria)' },
            { abrev: 'FK', significado: 'Foreign Key (Clave Foránea)' },
            { abrev: 'UNIQUE', significado: 'Valor único en la tabla' },
            { abrev: 'SERIAL', significado: 'Entero autoincremental' },
            { abrev: 'VARCHAR(n)', significado: 'Cadena de caracteres de longitud variable (máximo n)' },
            { abrev: 'TEXT', significado: 'Cadena de texto de longitud ilimitada' },
            { abrev: 'INTEGER', significado: 'Número entero' },
            { abrev: 'DECIMAL(m,n)', significado: 'Número decimal con m dígitos totales y n decimales' },
            { abrev: 'BOOLEAN', significado: 'Valor booleano (true/false)' },
            { abrev: 'DATE', significado: 'Fecha (aaaa-mm-dd)' },
            { abrev: 'TIMESTAMP', significado: 'Fecha y hora' },
            { abrev: 'AUTO', significado: 'Generado automáticamente por el sistema' }
        ];
        
        referencias.forEach((ref, index) => {
            const row = referenciasSheet.addRow(ref);
            if ((index + 2) % 2 === 0) {
                row.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFFF3E0' }
                };
            }
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                    left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                    bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
                    right: { style: 'thin', color: { argb: 'FFCCCCCC' } }
                };
            });
        });
        
        // Generar el archivo
        const fileName = `Diccionario_Datos_Occitours_${new Date().toISOString().split('T')[0]}.xlsx`;
        
        // Configurar headers para descarga
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${fileName}"`
        );
        
        // Escribir a la respuesta
        await workbook.xlsx.write(res);
        
        console.log(`✅ Diccionario de datos generado: ${fileName}`);
        
    } catch (error) {
        console.error('❌ Error al generar diccionario de datos:', error);
        res.status(500).json({
            error: 'Error al generar el diccionario de datos',
            detalle: error.message
        });
    }
};

module.exports = {
    generarDiccionarioDatos
};
