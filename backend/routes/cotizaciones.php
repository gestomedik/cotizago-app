<?php
/**
 * routes/cotizaciones.php - CORREGIDO
 * 
 * Rutas para el módulo de cotizaciones
 * Arregla el error: "undefined variable $db"
 */

require_once __DIR__ . '/../controllers/CotizacionController.php';

// Instanciar el controller CON la conexión a BD
$controller = new CotizacionController($db);

// Determinar el método HTTP
$method = $_SERVER['REQUEST_METHOD'];

// PUT /api/cotizaciones/{id} - Actualizar
if ($_SERVER['REQUEST_METHOD'] === 'PUT' && $id) {
    $controller->update($id);
}

// DELETE /api/cotizaciones/{id} - Eliminar
else if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && $id) {
    $controller->delete($id);
}

// Obtener el ID si viene en la URL
// Ejemplo: /api/cotizaciones/5
$uri_parts = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
$id = null;

// Buscar si hay un ID después de 'cotizaciones'
$cotizaciones_index = array_search('cotizaciones', $uri_parts);
if ($cotizaciones_index !== false && isset($uri_parts[$cotizaciones_index + 1])) {
    $id = $uri_parts[$cotizaciones_index + 1];
    // Verificar que sea numérico
    if (!is_numeric($id)) {
        $id = null;
    }
}

// Enrutar según el método y la presencia de ID
switch ($method) {
    case 'GET':
        if ($id) {
            // GET /api/cotizaciones/{id} - Obtener una cotización específica
            echo $controller->get($id);
        } else {
            // GET /api/cotizaciones - Listar todas las cotizaciones
            echo $controller->list();
        }
        break;
        
    case 'POST':
        // POST /api/cotizaciones - Crear nueva cotización
        echo $controller->create();
        break;
        
    case 'PUT':
        if ($id) {
            // PUT /api/cotizaciones/{id} - Actualizar cotización
            echo $controller->update($id);
        } else {
            echo Response::error('ID requerido para actualizar', 400);
        }
        break;
        
    case 'DELETE':
        if ($id) {
            // DELETE /api/cotizaciones/{id} - Eliminar cotización
            echo $controller->delete($id);
        } else {
            echo Response::error('ID requerido para eliminar', 400);
        }
        break;
        
    default:
        echo Response::error('Método no permitido', 405);
        break;
}
