<?php

// ============================================
// CONFIGURACIÓN CORS - DEBE IR AL INICIO
// ============================================
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=UTF-8');

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// =====================================================
// api/routes/auth.php
// =====================================================

$authController = new AuthController();

// Separar el path después de 'auth/'
$path = implode('/', array_slice($parts, 1));

switch($method) {
    case 'POST':
        if ($path === 'login') {
            $authController->login();
        } elseif ($path === 'logout') {
            $authController->logout();
        }
        break;
        
    case 'GET':
        if ($path === 'me') {
            $authController->me();
        }
        break;
        
    default:
        Response::error('Método no permitido', 405);
}

?>