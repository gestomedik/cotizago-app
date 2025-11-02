<?php
/**
 * routes/dashboard.php
 * Rutas del dashboard
 */

// Obtener la acción (parte después de /dashboard/)
$action = $parts[1] ?? '';

// Instanciar el controlador (pasando $db)
$controller = new DashboardController($db);

// Determinar qué método llamar
switch($action) {
    case 'resumen':
        if ($method === 'GET') {
            echo $controller->resumen();
        } else {
            http_response_code(405);
            echo json_encode([
                'success' => false,
                'error' => 'Método no permitido'
            ]);
        }
        break;
        
    case 'proximos':
        if ($method === 'GET') {
            echo $controller->proximos();
        } else {
            http_response_code(405);
            echo json_encode([
                'success' => false,
                'error' => 'Método no permitido'
            ]);
        }
        break;
        
    case 'mes':
        if ($method === 'GET') {
            echo $controller->mes();
        } else {
            http_response_code(405);
            echo json_encode([
                'success' => false,
                'error' => 'Método no permitido'
            ]);
        }
        break;
        
    case 'en-proceso':
    case 'en_proceso':
        if ($method === 'GET') {
            echo $controller->enProceso();
        } else {
            http_response_code(405);
            echo json_encode([
                'success' => false,
                'error' => 'Método no permitido'
            ]);
        }
        break;
        
    case 'completados':
        if ($method === 'GET') {
            echo $controller->completados();
        } else {
            http_response_code(405);
            echo json_encode([
                'success' => false,
                'error' => 'Método no permitido'
            ]);
        }
        break;
        
    default:
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'error' => 'Acción no encontrada: ' . $action
        ]);
        break;
}
