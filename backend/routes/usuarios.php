<?php
// backend/routes/usuarios.php

require_once __DIR__ . '/../controllers/UsuarioController.php';

// 1. Instanciar el controlador
$controller = new UsuarioController($db);

// 2. Obtener segmentos de la ruta (usando la variable $request de index.php)
$segments = explode('/', trim($request, '/'));
// segments[0] = 'usuarios'
// segments[1] = ID (si existe)

$id = isset($segments[1]) && is_numeric($segments[1]) ? (int)$segments[1] : null;

// 3. Determinar el método HTTP y enrutar
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if ($id) {
            // GET /api/usuarios/{id} -> Obtener uno
            $controller->get($id);
        } else {
            // GET /api/usuarios -> Listar todos
            $controller->list();
        }
        break;

    case 'POST':
        // POST /api/usuarios -> Crear
        $controller->create();
        break;

    case 'PUT':
        // PUT /api/usuarios/{id} -> Actualizar
        if ($id) {
            $controller->update($id);
        } else {
            Response::error('ID requerido para actualizar', 400);
        }
        break;

    case 'DELETE':
        // DELETE /api/usuarios/{id} -> Eliminar
        if ($id) {
            $controller->delete($id);
        } else {
            Response::error('ID requerido para eliminar', 400);
        }
        break;

    default:
        Response::error('Método no permitido', 405);
        break;
}
?>