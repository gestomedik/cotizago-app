<?php
// api/routes/pasajeros.php

require_once __DIR__ . '/../controllers/PasajerosController.php';

$controller = new PasajerosController();

// Obtener el ID si existe en la ruta
$pasajeroId = isset($parts[1]) && is_numeric($parts[1]) ? (int)$parts[1] : null;

// Enrutamiento
if ($pasajeroId) {
    // Rutas con ID: /pasajeros/:id
    switch ($method) {
        case 'GET':
            $controller->show($pasajeroId);
            break;
            
        case 'PUT':
            $controller->update($pasajeroId);
            break;
            
        case 'DELETE':
            $controller->destroy($pasajeroId);
            break;
            
        default:
            Response::error('Método no permitido', 405);
            break;
    }
} else {
    // Rutas sin ID: /pasajeros
    switch ($method) {
        case 'GET':
            $controller->index();
            break;
            
        case 'POST':
            $controller->store();
            break;
            
        default:
            Response::error('Método no permitido', 405);
            break;
    }
}