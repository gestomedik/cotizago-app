<?php

// =====================================================
// api/routes/permisos.php
// =====================================================

require_once __DIR__ . '/../controllers/PermisosController.php';

$controller = new PermisosController();

// Obtener el método HTTP
$method = $_SERVER['REQUEST_METHOD'];

// Obtener la ruta específica (después de /permisos/)
// $parts[0] es 'permisos'
$action = $parts[1] ?? '';
$id = $parts[2] ?? null;

try {
    switch ($method) {
        case 'GET':
            if ($action === 'mi-rol') {
                // GET /api/permisos/mi-rol
                $controller->getMisPermisos();
            } elseif ($action === 'inicializar') {
                // GET /api/permisos/inicializar (útil para setup)
                $controller->inicializar();
            } else {
                // GET /api/permisos
                $controller->getAll();
            }
            break;
            
        case 'PUT':
            if ($action && is_numeric($action)) {
                // PUT /api/permisos/:id
                $controller->update($action);
            } else {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'ID de permiso requerido']);
            }
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['success' => false, 'error' => 'Método no permitido']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'error' => 'Error en ruta permisos: ' . $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ]);
} catch (Error $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'error' => 'Error fatal en ruta permisos: ' . $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ]);
}
