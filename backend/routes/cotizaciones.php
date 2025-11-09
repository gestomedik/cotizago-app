<?php
/**
 * routes/cotizaciones.php - VERSIÓN CORREGIDA FINAL
 * * Rutas para el módulo de cotizaciones
 */

require_once __DIR__ . '/../controllers/CotizacionController.php';

// 1. Instanciar el controller
$controller = new CotizacionController($db);

// 2. Obtener el ID de la URL (SI EXISTE) - ¡ESTO DEBE IR PRIMERO!
// Ejemplo URL: /api/cotizaciones/5
$uri_parts = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
$id = null;

// Buscar si hay un ID después de 'cotizaciones'
$cotizaciones_index = array_search('cotizaciones', $uri_parts);
if ($cotizaciones_index !== false && isset($uri_parts[$cotizaciones_index + 1])) {
    $possible_id = $uri_parts[$cotizaciones_index + 1];
    // Verificar que sea numérico
    if (is_numeric($possible_id)) {
        $id = $possible_id;
    }
}

// 3. Determinar el método HTTP
$method = $_SERVER['REQUEST_METHOD'];

// 4. Enrutar según el método y la presencia de ID
switch ($method) {
    case 'GET':
        if ($id) {
            // GET /api/cotizaciones/{id} - Obtener una
            echo $controller->get($id);
        } else {
            // GET /api/cotizaciones - Listar todas
            echo $controller->list();
        }
        break;
        
    case 'POST':
        // POST /api/cotizaciones - Crear nueva
        echo $controller->create();
        break;
        
    case 'PUT':
        if ($id) {
            // PUT /api/cotizaciones/{id} - Actualizar
            echo $controller->update($id);
        } else {
            Response::error('ID requerido para actualizar', 400);
        }
        break;
        
    case 'DELETE':
        if ($id) {
            // DELETE /api/cotizaciones/{id} - Eliminar
            echo $controller->delete($id);
        } else {
            Response::error('ID requerido para eliminar', 400);
        }
        break;
        
    default:
        Response::error('Método no permitido', 405);
        break;
}
?>