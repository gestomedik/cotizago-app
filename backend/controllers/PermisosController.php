<?php

// =====================================================
// api/controllers/PermisosController.php
// =====================================================



class PermisosController {
    private $db;
    private $permiso;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->permiso = new Permiso($this->db);
    }

    // Obtener todos los permisos (Solo Admin)
    public function getAll() {
        // Verificar que el usuario esté autenticado y sea admin
        $user = Auth::requireAuth();
        
        // Normalizar el rol a minúsculas para comparación
        $rol = strtolower(trim($user['rol']));
        
        // Solo administradores pueden ver la matriz completa
        if ($rol !== 'administrador') {
            Response::error('No tiene permisos para acceder a esta función. Rol actual: ' . $user['rol'], 403);
            return;
        }
        
        try {
            // Inicializar permisos faltantes para todos los roles
            $this->permiso->inicializarPermisosFaltantes('administrador');
            $this->permiso->inicializarPermisosFaltantes('agente');
            
            $result = $this->permiso->getAll();
            Response::success($result);
        } catch (Exception $e) {
            Response::error('Error al obtener permisos: ' . $e->getMessage());
        }
    }

    // Obtener permisos del usuario actual
    public function getMisPermisos() {
        // Cualquier usuario autenticado puede ver sus propios permisos
        $user = Auth::requireAuth();
        
        try {
            // Asegurar que existan registros para todos los recursos
            $this->permiso->inicializarPermisosFaltantes($user['rol']);
            
            $result = $this->permiso->getByRol($user['rol']);
            Response::success($result);
        } catch (Exception $e) {
            Response::error('Error al obtener mis permisos: ' . $e->getMessage());
        }
    }

    // Actualizar un permiso (Solo Admin)
    public function update($id) {
        // Verificar que el usuario esté autenticado y sea admin
        $user = Auth::requireAuth();
        
        // Normalizar el rol a minúsculas para comparación
        $rol = strtolower(trim($user['rol']));
        
        // Solo administradores pueden modificar permisos
        if ($rol !== 'administrador') {
            Response::error('No tiene permisos para modificar permisos. Rol actual: ' . $user['rol'], 403);
            return;
        }
        
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['puede_ver']) || !isset($data['puede_crear']) || 
            !isset($data['puede_editar']) || !isset($data['puede_eliminar'])) {
            Response::error('Datos incompletos', 400);
            return;
        }
        
        try {
            if ($this->permiso->update($id, $data)) {
                Response::updated([], 'Permiso actualizado correctamente');
            } else {
                Response::error('Error al actualizar permiso');
            }
        } catch (Exception $e) {
            Response::error('Error al actualizar permiso: ' . $e->getMessage());
        }
    }
    
    // Inicializar permisos (útil para desarrollo/setup)
    public function inicializar() {
        AuthMiddleware::checkPermission('configuracion_seguridad', 'crear');
        
        try {
            $this->permiso->inicializarPermisosFaltantes('administrador');
            $this->permiso->inicializarPermisosFaltantes('agente');
            Response::success([], 'Permisos inicializados');
        } catch (Exception $e) {
            Response::error('Error: ' . $e->getMessage());
        }
    }
}
