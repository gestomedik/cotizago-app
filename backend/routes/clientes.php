<?php
/**
 * routes/clientes.php
 * Rutas para el módulo de clientes
 */

// Verificar autenticación
$user = Auth::requireAuth();

// Instanciar el controlador (pasando $db)
$controller = new ClienteController($db);

// Determinar método HTTP
$method = $_SERVER['REQUEST_METHOD'];

// Obtener segmentos de la ruta
$segments = explode('/', trim($request, '/'));
// segments[0] = 'clientes'
// segments[1] = ID (si existe)

$action = isset($segments[1]) && is_numeric($segments[1]) ? 'show' : 'index';
$id = isset($segments[1]) && is_numeric($segments[1]) ? (int)$segments[1] : null;

// Routing
switch ($method) {
    case 'GET':
        if ($id) {
            // GET /clientes/{id}
            echo $controller->show($id);
        } else {
            // GET /clientes
            echo $controller->index();
        }
        break;
        
    case 'POST':
        // POST /clientes
        echo $controller->create();
        break;
        
    case 'PUT':
        if ($id) {
            // PUT /clientes/{id}
            echo $controller->update($id);
        } else {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'ID requerido para actualizar'
            ]);
        }
        break;
        
    case 'DELETE':
        if ($id) {
            // DELETE /clientes/{id}
            echo $controller->delete($id);
        } else {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'ID requerido para eliminar'
            ]);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode([
            'success' => false,
            'error' => 'Método no permitido'
        ]);
        break;
}
