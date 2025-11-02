<?php
/**
 * cors.php
 * Headers CORS para permitir peticiones desde Next.js
 * 
 * Este archivo debe estar en: C:\xampp\htdocs\ELS\CotizaGO\api\cors.php
 * Y debe ser incluido al inicio de index.php
 */

// Permitir origen específico (desarrollo local)
header('Access-Control-Allow-Origin: http://localhost:3000');

// Métodos HTTP permitidos
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

// Headers que el cliente puede enviar
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept');

// Permitir credenciales (cookies, authorization headers)
header('Access-Control-Allow-Credentials: true');

// Duración del caché preflight (24 horas)
header('Access-Control-Max-Age: 86400');

// Content-Type para respuestas JSON
header('Content-Type: application/json; charset=utf-8');

// Si es una petición OPTIONS (preflight), responder inmediatamente con 200
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}
