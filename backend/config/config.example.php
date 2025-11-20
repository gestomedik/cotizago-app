<?php
/**
 * config.php - Configuración de la aplicación
 * 
 * IMPORTANTE: Este archivo contiene configuraciones sensibles
 * y NO debe subirse a Git. Ya está incluido en .gitignore
 * 
 * INSTRUCCIONES:
 * 1. Copia este archivo como config.php en la misma carpeta
 * 2. Modifica los valores según tu entorno
 */

// =====================================================
// JWT (Auth Tokens)
// =====================================================
define('JWT_SECRET', 'tu-clave-secreta-super-segura-aqui-cambiar-en-produccion');
define('JWT_EXPIRATION', 86400); // 24 horas en segundos
define('API_URL', 'http://localhost:5000/api');

// =====================================================
// Otros ajustes
// =====================================================
define('ENVIRONMENT', 'development'); // development o production
