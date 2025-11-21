<?php
// ============================================
// CONFIGURACIÓN INICIAL
// ============================================

// CRÍTICO: Suprimir salida de errores HTML (usar logs en producción)
ini_set('display_errors', '1');
error_reporting(E_ALL);

// ============================================
// CONFIGURACIÓN CORS
// ============================================

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept');
header('Access-Control-Allow-Credentials: true');

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// =====================================================
// api/index.php - ENTRY POINT
// =====================================================

// IMPORTANTE: Solo incluir config.php
require_once __DIR__ . '/config/config.php';

// CRÍTICO: Definir AUTOLOADER PRIMERO (antes de usar cualquier clase)
spl_autoload_register(function ($class_name) {
    $directories = ['core', 'models', 'controllers', 'services', 'middleware'];
    
    foreach ($directories as $directory) {
        $file = __DIR__ . '/' . $directory . '/' . $class_name . '.php';
        if (file_exists($file)) {
            require_once $file;
            return;
        }
    }
});

// AHORA SÍ crear la conexión (el autoloader cargará Database.php automáticamente)
$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error de conexión a la base de datos'
    ]);
    exit();
}

// Obtener la ruta solicitada
$request = $_GET['request'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

// Router simple
try {
    // Separar la ruta
    $parts = explode('/', trim($request, '/'));
    $resource = $parts[0] ?? '';
    
    // Determinar qué archivo de ruta cargar
    switch($resource) {
        case 'auth':
            $routeFile = __DIR__ . '/routes/auth.php';
            if (file_exists($routeFile)) {
                require_once $routeFile;
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'error' => 'Ruta de autenticación no encontrada'
                ]);
            }
            break;
            
        case 'usuarios':
            $routeFile = __DIR__ . '/routes/usuarios.php';
            if (file_exists($routeFile)) {
                require_once $routeFile;
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'error' => 'Ruta de usuarios no encontrada'
                ]);
            }
            break;
            
        case 'clientes':
            $routeFile = __DIR__ . '/routes/clientes.php';
            if (file_exists($routeFile)) {
                require_once $routeFile;
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'error' => 'Ruta de clientes no encontrada'
                ]);
            }
            break;
            
        case 'pasajeros':
            $routeFile = __DIR__ . '/routes/pasajeros.php';
            if (file_exists($routeFile)) {
                require_once $routeFile;
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'error' => 'Ruta de pasajeros no encontrada'
                ]);
            }
            break;
            
        case 'cotizaciones':
            // CRÍTICO: $db debe estar disponible para cotizaciones.php
            $routeFile = __DIR__ . '/routes/cotizaciones.php';
            if (file_exists($routeFile)) {
                require_once $routeFile;
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'error' => 'Ruta de cotizaciones no encontrada'
                ]);
            }
            break;
            
        case 'plantillas':
            $routeFile = __DIR__ . '/routes/plantillas.php';
            if (file_exists($routeFile)) {
                require_once $routeFile;
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'error' => 'Ruta de plantillas no encontrada'
                ]);
            }
            break;
            
        case 'comisiones':
            $routeFile = __DIR__ . '/routes/comisiones.php';
            if (file_exists($routeFile)) {
                require_once $routeFile;
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'error' => 'Ruta de comisiones no encontrada'
                ]);
            }
            break;
            
        case 'dashboard':
            $routeFile = __DIR__ . '/routes/dashboard.php';
            if (file_exists($routeFile)) {
                require_once $routeFile;
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'error' => 'Ruta de dashboard no encontrada'
                ]);
            }
            break;
            
        case 'config':
            $routeFile = __DIR__ . '/routes/config.php';
            if (file_exists($routeFile)) {
                require_once $routeFile;
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'error' => 'Ruta de configuración no encontrada'
                ]);
            }
            break;
            
        case 'reportes':
            $routeFile = __DIR__ . '/routes/reportes.php';
            if (file_exists($routeFile)) {
                require_once $routeFile;
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'error' => 'Ruta de reportes no encontrada'
                ]);
            }
            break;

        case 'permisos':
            $routeFile = __DIR__ . '/routes/permisos.php';
            if (file_exists($routeFile)) {
                require_once $routeFile;
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'error' => 'Ruta de permisos no encontrada'
                ]);
            }
            break;
            
        case '':
            echo json_encode([
                'success' => true,
                'data' => [
                    'message' => 'API de Agencia de Viajes v1.0',
                    'status' => 'online',
                    'timestamp' => date('Y-m-d H:i:s')
                ]
            ]);
            break;
            
        default:
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'error' => 'Endpoint no encontrado: ' . $resource
            ]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error del servidor: ' . $e->getMessage()
    ]);
}
