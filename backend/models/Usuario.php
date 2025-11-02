<?php

// =====================================================
// api/models/Usuario.php
// =====================================================

class Usuario {
    private $conn;
    private $table = 'usuarios';
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    // Obtener todos los usuarios
    public function getAll($filters = []) {
        $query = "SELECT id, nombre, apellido, email, rol, activo, 
                  DATE_FORMAT(fecha_registro, '%Y-%m-%d %H:%i') as fecha_registro,
                  DATE_FORMAT(ultimo_acceso, '%Y-%m-%d %H:%i') as ultimo_acceso
                  FROM " . $this->table . " WHERE 1=1";
        
        $params = [];
        
        if (isset($filters['rol'])) {
            $query .= " AND rol = :rol";
            $params[':rol'] = $filters['rol'];
        }
        
        if (isset($filters['activo'])) {
            $query .= " AND activo = :activo";
            $params[':activo'] = $filters['activo'];
        }
        
        $query .= " ORDER BY nombre ASC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute($params);
        
        return $stmt->fetchAll();
    }
    
    // Obtener un usuario por ID
    public function getById($id) {
        $query = "SELECT id, nombre, apellido, email, rol, activo,
                  DATE_FORMAT(fecha_registro, '%Y-%m-%d %H:%i') as fecha_registro,
                  DATE_FORMAT(ultimo_acceso, '%Y-%m-%d %H:%i') as ultimo_acceso
                  FROM " . $this->table . " WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        return $stmt->fetch();
    }
    
    // Obtener usuario por email
    public function getByEmail($email) {
        $query = "SELECT * FROM " . $this->table . " WHERE email = :email";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        
        return $stmt->fetch();
    }
    
    // Crear usuario
    public function create($data) {
        $query = "INSERT INTO " . $this->table . " 
                  (nombre, apellido, email, password, rol, activo) 
                  VALUES (:nombre, :apellido, :email, :password, :rol, :activo)";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(':nombre', $data['nombre']);
        $stmt->bindParam(':apellido', $data['apellido']);
        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':password', $data['password']);
        $stmt->bindParam(':rol', $data['rol']);
        $stmt->bindParam(':activo', $data['activo']);
        
        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        
        return false;
    }
    
    // Actualizar usuario
    public function update($id, $data) {
        $query = "UPDATE " . $this->table . " 
                  SET nombre = :nombre, 
                      apellido = :apellido, 
                      email = :email,
                      rol = :rol,
                      activo = :activo";
        
        if (isset($data['password']) && !empty($data['password'])) {
            $query .= ", password = :password";
        }
        
        $query .= " WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(':nombre', $data['nombre']);
        $stmt->bindParam(':apellido', $data['apellido']);
        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':rol', $data['rol']);
        $stmt->bindParam(':activo', $data['activo']);
        $stmt->bindParam(':id', $id);
        
        if (isset($data['password']) && !empty($data['password'])) {
            $stmt->bindParam(':password', $data['password']);
        }
        
        return $stmt->execute();
    }
    
    // Eliminar usuario
    public function delete($id) {
        $query = "DELETE FROM " . $this->table . " WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        
        return $stmt->execute();
    }
    
    // Actualizar último acceso
    public function updateLastAccess($id) {
        $query = "UPDATE " . $this->table . " SET ultimo_acceso = NOW() WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        
        return $stmt->execute();
    }
}

?>