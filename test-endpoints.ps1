# ====================================================
# 🧪 SCRIPT DE PRUEBA DE ENDPOINTS - OCCITOURS
# ====================================================
# Descripción: Prueba todos los endpoints GET del API
# Uso: .\test-endpoints.ps1
# ====================================================

# Configuración
$BASE_URL = "http://localhost:3000"
$EMAIL = "admin@occitours.com"  # Cambia esto por tu usuario
$PASSWORD = "admin123"           # Cambia esto por tu contraseña

# Colores
function Write-Success { param($msg) Write-Host "✅ $msg" -ForegroundColor Green }
function Write-Info { param($msg) Write-Host "ℹ️  $msg" -ForegroundColor Cyan }
function Write-Error { param($msg) Write-Host "❌ $msg" -ForegroundColor Red }
function Write-Warning { param($msg) Write-Host "⚠️  $msg" -ForegroundColor Yellow }
function Write-Title { param($msg) Write-Host "`n📋 $msg" -ForegroundColor Magenta -BackgroundColor Black }

Clear-Host
Write-Title "PRUEBA DE ENDPOINTS - OCCITOURS API"
Write-Info "URL Base: $BASE_URL"
Write-Info "Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

# ====================================================
# PASO 1: Verificar que el servidor esté corriendo
# ====================================================
Write-Title "PASO 1: Verificando servidor"

try {
    $health = Invoke-RestMethod -Uri "$BASE_URL/api/dashboard" -Method Get -TimeoutSec 5 -ErrorAction Stop
    Write-Success "Servidor está ejecutándose correctamente"
} catch {
    if ($_.Exception.Message -like "*Token no proporcionado*") {
        Write-Success "Servidor está ejecutándose (requiere autenticación)"
    } else {
        Write-Error "No se puede conectar al servidor"
        Write-Warning "Asegúrate de que el servidor esté corriendo: npm run dev"
        exit
    }
}

# ====================================================
# PASO 2: Probar endpoints públicos
# ====================================================
Write-Title "PASO 2: Probando endpoints públicos (sin autenticación)"

$endpointsPublicos = @(
    @{Nombre="Rutas activas"; Url="/api/rutas/activas"},
    @{Nombre="Buscar rutas"; Url="/api/rutas/buscar?nombre="},
    @{Nombre="Rutas por dificultad"; Url="/api/rutas/dificultad/Fácil"}
)

foreach ($endpoint in $endpointsPublicos) {
    try {
        $url = "$BASE_URL$($endpoint.Url)"
        $response = Invoke-RestMethod -Uri $url -Method Get -ErrorAction Stop
        $count = if ($response -is [Array]) { $response.Count } else { if ($response) { 1 } else { 0 } }
        Write-Success "$($endpoint.Nombre): $count registro(s)"
    } catch {
        Write-Warning "$($endpoint.Nombre): Error - $($_.Exception.Message)"
    }
}

# ====================================================
# PASO 3: Obtener token de autenticación
# ====================================================
Write-Title "PASO 3: Obteniendo token de autenticación"

try {
    $loginData = @{
        correo = $EMAIL
        contrasena = $PASSWORD
    } | ConvertTo-Json

    $auth = Invoke-RestMethod -Uri "$BASE_URL/api/auth/login" `
        -Method Post `
        -Body $loginData `
        -ContentType "application/json" `
        -ErrorAction Stop

    $token = $auth.token
    Write-Success "Token obtenido exitosamente"
    Write-Info "Usuario: $EMAIL"
    Write-Info "Token: $($token.Substring(0, 20))..."
} catch {
    Write-Error "Error al hacer login"
    Write-Warning "Verifica tus credenciales en la línea 11-12 del script"
    Write-Warning "O crea un usuario con: Invoke-RestMethod -Uri '$BASE_URL/api/auth/registro' -Method Post"
    Write-Info "`nContinuando pruebas sin autenticación...`n"
    $token = $null
}

# ====================================================
# PASO 4: Probar endpoints protegidos
# ====================================================
if ($token) {
    Write-Title "PASO 4: Probando endpoints protegidos (con token)"

    $headers = @{
        "Authorization" = "Bearer $token"
    }

    $endpointsProtegidos = @(
        @{Nombre="Roles"; Url="/api/roles"; Icono="👥"},
        @{Nombre="Permisos"; Url="/api/permisos"; Icono="🔐"},
        @{Nombre="Clientes"; Url="/api/clientes"; Icono="👤"},
        @{Nombre="Empleados"; Url="/api/empleados"; Icono="👔"},
        @{Nombre="Propietarios"; Url="/api/propietarios"; Icono="🏠"},
        @{Nombre="Proveedores"; Url="/api/proveedores"; Icono="🚚"},
        @{Nombre="Rutas"; Url="/api/rutas"; Icono="🗺️"},
        @{Nombre="Fincas"; Url="/api/fincas"; Icono="🏡"},
        @{Nombre="Servicios"; Url="/api/servicios"; Icono="🎯"},
        @{Nombre="Programaciones"; Url="/api/programaciones"; Icono="📅"},
        @{Nombre="Reservas"; Url="/api/reservas"; Icono="📝"},
        @{Nombre="Ventas"; Url="/api/ventas"; Icono="💰"},
        @{Nombre="Pagos"; Url="/api/pagos"; Icono="💳"},
        @{Nombre="Dashboard"; Url="/api/dashboard"; Icono="📊"}
    )

    $exitosos = 0
    $fallidos = 0

    foreach ($endpoint in $endpointsProtegidos) {
        try {
            $url = "$BASE_URL$($endpoint.Url)"
            $response = Invoke-RestMethod -Uri $url -Method Get -Headers $headers -ErrorAction Stop
            
            $count = if ($response -is [Array]) { 
                $response.Count 
            } elseif ($response.PSObject.Properties.Name -contains 'total') {
                "Dashboard OK"
            } elseif ($response) { 
                1 
            } else { 
                0 
            }
            
            Write-Success "$($endpoint.Icono) $($endpoint.Nombre): $count"
            $exitosos++
        } catch {
            Write-Error "$($endpoint.Icono) $($endpoint.Nombre): $($_.Exception.Message)"
            $fallidos++
        }
    }

    # ====================================================
    # RESUMEN
    # ====================================================
    Write-Title "RESUMEN DE PRUEBAS"
    Write-Success "Exitosos: $exitosos endpoints"
    if ($fallidos -gt 0) {
        Write-Error "Fallidos: $fallidos endpoints"
    }
    
    $total = $exitosos + $fallidos
    $porcentaje = [math]::Round(($exitosos / $total) * 100, 2)
    Write-Info "Tasa de éxito: $porcentaje%"
} else {
    Write-Warning "No se pudo obtener token. Pruebas protegidas omitidas."
}

# ====================================================
# PASO 5: Probar descarga de Excel
# ====================================================
Write-Title "PASO 5: Probando descarga de diccionario Excel"

try {
    $excelPath = "Diccionario_Occitours_$(Get-Date -Format 'yyyyMMdd_HHmmss').xlsx"
    Invoke-WebRequest -Uri "$BASE_URL/api/diccionario/descargar" -OutFile $excelPath -ErrorAction Stop
    Write-Success "Excel descargado: $excelPath"
    Write-Info "Tamaño: $([math]::Round((Get-Item $excelPath).Length / 1KB, 2)) KB"
} catch {
    Write-Warning "No se pudo descargar el Excel: $($_.Exception.Message)"
}

# ====================================================
# FIN
# ====================================================
Write-Title "PRUEBAS COMPLETADAS"
Write-Info "Presiona cualquier tecla para salir..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
