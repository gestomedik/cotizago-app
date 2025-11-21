<?php

// =====================================================
// backend/core/AuthMiddleware.php
// =====================================================

require_once __DIR__ . '/Auth.php';
require_once __DIR__ . '/../models/Permiso.php';
require_once __DIR__ . '/../config/database.php';

class AuthMiddleware {
    
    /**
     * Verifica si el usuario tiene permiso para acceder al recurso
     * 
     * @param string $recurso Nombre del recurso (ej: 'cotizaciones')
     * @param string $accion Acción a realizar ('ver', 'crear', 'editar', 'eliminar')
     * @return array Datos del usuario si tiene permiso
     */
    public static function checkPermission($recurso, $accion) {
        // 1. Verificar autenticación básica (token válido)
        $user = Auth::requireAuth();
        
        // 2. Si es administrador, tiene acceso total (bypass opcional, pero mejor verificar explícitamente)
        // En este diseño, verificamos en la tabla incluso para admin para mantener consistencia,
        // pero el modelo Permiso ya tiene un fallback para admin = true.
        
        // 3. Verificar permiso específico en base de datos
        $database = new Database();
        $db = $database->getConnection();
        $permisoModel = new Permiso($db);
        
        if (!$permisoModel->tienePermiso($user['rol'], $recurso, $accion)) {
            Response::error('No tienes permisos para realizar esta acción en ' . $recurso, 403);
            exit;
        }
        
        return $user;
    }
    
    /**
     * Alias para verificar permiso de lectura
     */
    public static function canView($recurso) {
        return self::checkPermission($recurso, 'ver');
    }
    
    /**
     * Alias para verificar permiso de creación
     */
    public static function canCreate($recurso) {
        return self::checkPermission($recurso, 'crear');
    }
    
    /**
     * Alias para verificar permiso de edición
     */
    public static function canEdit($recurso) {
        return self::checkPermission($recurso, 'editar');
    }
    
    /**
     * Alias para verificar permiso de eliminación
     */
    public static function canDelete($recurso) {
        return self::checkPermission($recurso, 'eliminar');
    }
}
