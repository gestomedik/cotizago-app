<?php

// =====================================================
// api/models/Permiso.php
// =====================================================

class Permiso {
    private $conn;
    private $table = 'permisos_roles';
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    // Obtener todos los permisos
    public function getAll() {
        $query = "SELECT * FROM " . $this->table . " ORDER BY rol, recurso";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        return $stmt->fetchAll();
    }
    
    // Obtener permisos por rol
    public function getByRol($rol) {
        $query = "SELECT * FROM " . $this->table . " WHERE rol = :rol ORDER BY recurso";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':rol', $rol);
        $stmt->execute();
        
        return $stmt->fetchAll();
    }
    
    // Verificar si un rol tiene permiso específico
    public function tienePermiso($rol, $recurso, $accion) {
        // Mapear acción a columna
        $columna = '';
        switch ($accion) {
            case 'ver': $columna = 'puede_ver'; break;
            case 'crear': $columna = 'puede_crear'; break;
            case 'editar': $columna = 'puede_editar'; break;
            case 'eliminar': $columna = 'puede_eliminar'; break;
            default: return false;
        }
        
        $query = "SELECT " . $columna . " FROM " . $this->table . " 
                  WHERE rol = :rol AND recurso = :recurso LIMIT 1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':rol', $rol);
        $stmt->bindParam(':recurso', $recurso);
        $stmt->execute();
        
        if ($row = $stmt->fetch()) {
            return (bool)$row[$columna];
        }
        
        // Si no existe el registro, por defecto denegar (excepto admin que podría tener lógica especial)
        if ($rol === 'administrador') return true;
        
        return false;
    }
    
    // Actualizar permiso
    public function update($id, $data) {
        $query = "UPDATE " . $this->table . " 
                  SET puede_ver = :ver, 
                      puede_crear = :crear, 
                      puede_editar = :editar, 
                      puede_eliminar = :eliminar
                  WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(':ver', $data['puede_ver']);
        $stmt->bindParam(':crear', $data['puede_crear']);
        $stmt->bindParam(':editar', $data['puede_editar']);
        $stmt->bindParam(':eliminar', $data['puede_eliminar']);
        $stmt->bindParam(':id', $id);
        
        return $stmt->execute();
    }
    
    // Obtener lista de recursos disponibles (hardcoded o de DB)
    public function getRecursosDisponibles() {
        return [
            'dashboard',
            'cotizaciones',
            'clientes',
            'pasajeros',
            'usuarios',
            'configuracion_empresa',
            'configuracion_seguridad',
            'reportes',
            'plantillas'
        ];
    }
    
    // Inicializar permisos faltantes para un rol (útil cuando se agregan nuevos recursos)
    public function inicializarPermisosFaltantes($rol) {
        $recursos = $this->getRecursosDisponibles();
        $permisosActuales = $this->getByRol($rol);
        
        $recursosExistentes = [];
        foreach ($permisosActuales as $p) {
            $recursosExistentes[] = $p['recurso'];
        }
        
        foreach ($recursos as $recurso) {
            if (!in_array($recurso, $recursosExistentes)) {
                // Insertar con valores por defecto (0 para todos, 1 para admin)
                $val = ($rol === 'administrador') ? 1 : 0;
                
                $query = "INSERT INTO " . $this->table . " 
                          (rol, recurso, puede_ver, puede_crear, puede_editar, puede_eliminar) 
                          VALUES (:rol, :recurso, :val, :val, :val, :val)";
                
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(':rol', $rol);
                $stmt->bindParam(':recurso', $recurso);
                $stmt->bindParam(':val', $val);
                $stmt->execute();
            }
        }
    }
}
