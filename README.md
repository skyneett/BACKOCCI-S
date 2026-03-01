# 🚀 Occitours Backend MVC

Backend estructurado con arquitectura **Modelo-Vista-Controlador (MVC)** para el sistema de gestión turística Occitours.

## 📋 Características

- **Arquitectura MVC**: Separación clara de responsabilidades
- **PostgreSQL**: Base de datos relacional robusta
- **JWT**: Autenticación segura con tokens
- **Express.js**: Framework web minimalista y flexible
- **Node.js**: Entorno de ejecución JavaScript

## 🏗️ Estructura del Proyecto

```
occitours-backend-mvc/
│
├── config/              # Configuración de base de datos y entorno
│   └── database.js      # Conexión a PostgreSQL
│
├── models/              # Modelos de datos (esquema de tablas)
│   ├── Rol.js
│   ├── Permiso.js
│   ├── Usuario.js
│   ├── Cliente.js
│   ├── Empleado.js
│   ├── Propietario.js
│   ├── Proveedor.js
│   ├── Ruta.js
│   ├── Finca.js
│   ├── Servicio.js
│   ├── Programacion.js
│   ├── Reserva.js
│   └── Venta.js
│
├── controllers/         # Lógica de negocio
│   ├── rolController.js
│   ├── permisoController.js
│   ├── usuarioController.js
│   ├── clienteController.js
│   ├── empleadoController.js
│   ├── propietarioController.js
│   ├── proveedorController.js
│   ├── rutaController.js
│   ├── fincaController.js
│   ├── servicioController.js
│   ├── programacionController.js
│   ├── reservaController.js
│   ├── ventaController.js
│   ├── dashboardController.js
│   └── authController.js
│
├── routes/              # Definición de endpoints
│   ├── index.js         # Registro central de todas las rutas
│   ├── authRoutes.js
│   ├── rolRoutes.js
│   ├── permisoRoutes.js
│   ├── usuarioRoutes.js
│   ├── clienteRoutes.js
│   ├── empleadoRoutes.js
│   ├── propietarioRoutes.js
│   ├── proveedorRoutes.js
│   ├── rutaRoutes.js
│   ├── fincaRoutes.js
│   ├── servicioRoutes.js
│   ├── programacionRoutes.js
│   ├── reservaRoutes.js
│   ├── ventaRoutes.js
│   └── dashboardRoutes.js
│
├── middleware/          # Interceptores de peticiones
│   └── authMiddleware.js
│
├── utils/               # Utilidades y helpers
│   └── validators.js
│
├── server.js            # Punto de entrada de la aplicación
├── package.json         # Dependencias del proyecto
└── .env                 # Variables de entorno (no versionado)
```

## 🔧 Instalación

1. **Clonar el proyecto** (o ya está en tu escritorio)

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   - Copia `.env.example` a `.env`
   - Configura tus credenciales de PostgreSQL
   ```bash
   cp .env.example .env
   ```

4. **Crear la base de datos**:
   - Ejecuta el script `database/02_schema.sql` en PostgreSQL

5. **Iniciar el servidor**:
   ```bash
   # Modo desarrollo (con auto-reload)
   npm run dev

   # Modo producción
   npm start
   ```

## 📚 Endpoints Principales

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar cliente
- `GET /api/auth/profile` - Obtener perfil del usuario

### Roles y Permisos
- `GET /api/roles` - Listar roles
- `POST /api/roles` - Crear rol
- `GET /api/permisos` - Listar permisos
- `POST /api/roles/:id/permisos` - Asignar permisos a rol

### Clientes
- `GET /api/clientes` - Listar clientes
- `POST /api/clientes` - Crear cliente
- `GET /api/clientes/:id` - Obtener cliente
- `PUT /api/clientes/:id` - Actualizar cliente
- `DELETE /api/clientes/:id` - Eliminar cliente

### Empleados
- `GET /api/empleados` - Listar empleados
- `POST /api/empleados` - Crear empleado
- `GET /api/empleados/:id` - Obtener empleado
- `PUT /api/empleados/:id` - Actualizar empleado
- `DELETE /api/empleados/:id` - Eliminar empleado

### Fincas
- `GET /api/fincas` - Listar fincas
- `POST /api/fincas` - Crear finca
- `GET /api/fincas/:id` - Obtener finca
- `PUT /api/fincas/:id` - Actualizar finca
- `DELETE /api/fincas/:id` - Eliminar finca

### Rutas Turísticas
- `GET /api/rutas` - Listar rutas
- `POST /api/rutas` - Crear ruta
- `GET /api/rutas/:id` - Obtener ruta
- `PUT /api/rutas/:id` - Actualizar ruta
- `DELETE /api/rutas/:id` - Eliminar ruta

### Servicios
- `GET /api/servicios` - Listar servicios
- `POST /api/servicios` - Crear servicio
- `GET /api/servicios/:id` - Obtener servicio
- `PUT /api/servicios/:id` - Actualizar servicio
- `DELETE /api/servicios/:id` - Eliminar servicio

### Programaciones
- `GET /api/programaciones` - Listar programaciones
- `POST /api/programaciones` - Crear programación
- `GET /api/programaciones/:id` - Obtener programación
- `PUT /api/programaciones/:id` - Actualizar programación
- `DELETE /api/programaciones/:id` - Eliminar programación

### Reservas
- `GET /api/reservas` - Listar reservas
- `POST /api/reservas` - Crear reserva
- `GET /api/reservas/:id` - Obtener reserva
- `PUT /api/reservas/:id` - Actualizar reserva
- `DELETE /api/reservas/:id` - Cancelar reserva
- `POST /api/reservas/:id/acompanantes` - Agregar acompañantes
- `POST /api/reservas/:id/servicios` - Agregar servicios

### Ventas
- `GET /api/ventas` - Listar ventas
- `GET /api/ventas/:id` - Obtener venta
- `POST /api/ventas/:id/pagos` - Registrar pago

### Proveedores
- `GET /api/proveedores` - Listar proveedores
- `POST /api/proveedores` - Crear proveedor
- `GET /api/proveedores/:id` - Obtener proveedor
- `PUT /api/proveedores/:id` - Actualizar proveedor
- `POST /api/proveedores/:id/pagos` - Registrar pago a proveedor

### Propietarios
- `GET /api/propietarios` - Listar propietarios
- `POST /api/propietarios` - Crear propietario
- `GET /api/propietarios/:id` - Obtener propietario
- `PUT /api/propietarios/:id` - Actualizar propietario

### Dashboard
- `GET /api/dashboard/stats` - Estadísticas generales
- `GET /api/dashboard/reservas-mes` - Reservas por mes
- `GET /api/dashboard/ventas-mes` - Ventas por mes
- `GET /api/dashboard/top-rutas` - Rutas más vendidas

## 🔒 Autenticación

El sistema utiliza **JWT (JSON Web Tokens)** para autenticación:

1. El cliente envía credenciales a `/api/auth/login`
2. El servidor valida y retorna un token JWT
3. El cliente incluye el token en cada petición:
   ```
   Authorization: Bearer <token>
   ```
4. El middleware `verificarToken` valida el token en rutas protegidas

## 🧱 Arquitectura MVC

### Modelo (Model)
- Define la estructura de datos
- Métodos para consultas SQL
- Validaciones de datos

### Vista (View)
- En esta API REST, la "vista" son las respuestas JSON
- Los datos formateados se envían al cliente

### Controlador (Controller)
- Recibe peticiones HTTP
- Ejecuta lógica de negocio
- Llama a los modelos
- Retorna respuestas JSON

## 🗄️ Base de Datos

El sistema está diseñado para PostgreSQL con el siguiente esquema:

### Módulos Principales:
1. **Autenticación y Autorización** (roles, permisos, usuarios)
2. **Gestión de Personas** (clientes, empleados, propietarios)
3. **Proveedores** (servicios, pagos)
4. **Catálogos** (rutas, fincas, servicios)
5. **Operaciones** (programaciones, reservas, ventas)
6. **Detalles** (acompañantes, servicios adicionales, pagos)

## 👨‍💻 Tecnologías

- **Node.js** 18+ - Entorno de ejecución
- **Express.js** 4.x - Framework web
- **PostgreSQL** 12+ - Base de datos
- **JWT** - Autenticación
- **bcryptjs** - Encriptación de contraseñas
- **dotenv** - Variables de entorno

## 📝 Convenciones de Código

- **Nombres de archivos**: camelCase (ej: `clienteController.js`)
- **Nombres de clases**: PascalCase (ej: `class Cliente`)
- **Nombres de funciones**: camelCase (ej: `obtenerClientes()`)
- **Constantes**: UPPER_SNAKE_CASE (ej: `JWT_SECRET`)
- **Rutas**: kebab-case (ej: `/api/reservas-cliente`)

## 🚦 Estados de Respuesta HTTP

- **200 OK** - Petición exitosa
- **201 Created** - Recurso creado exitosamente
- **400 Bad Request** - Datos inválidos
- **401 Unauthorized** - No autenticado
- **403 Forbidden** - Sin permisos
- **404 Not Found** - Recurso no encontrado
- **500 Internal Server Error** - Error del servidor

## 📄 Licencia

MIT

## 👥 Equipo

Proyecto desarrollado para Occitours - Sistema de Gestión Turística
