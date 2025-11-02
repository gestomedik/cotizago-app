<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');

$debug = [
    'php_version' => PHP_VERSION,
    'request_method' => $_SERVER['REQUEST_METHOD'],
    'http_authorization_in_server' => isset($_SERVER['HTTP_AUTHORIZATION']) ? 'SÍ EXISTE' : 'NO EXISTE',
    'http_authorization_value' => $_SERVER['HTTP_AUTHORIZATION'] ?? null,
    'all_http_headers' => []
];

// Listar todos los headers HTTP_*
foreach ($_SERVER as $key => $value) {
    if (substr($key, 0, 5) === 'HTTP_') {
        $debug['all_http_headers'][$key] = $value;
    }
}

// getallheaders si existe
if (function_exists('getallheaders')) {
    $debug['getallheaders'] = getallheaders();
}

echo json_encode($debug, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);