<?php
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