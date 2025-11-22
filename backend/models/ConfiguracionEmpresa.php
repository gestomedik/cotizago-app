<?php

// =====================================================
// api/models/ConfiguracionEmpresa.php
// =====================================================

class ConfiguracionEmpresa {
    private $conn;
    private $table = 'configuracion_empresa';
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    // Obtener configuración de empresa (siempre hay solo un registro)
    public function get() {
        $query = "SELECT * FROM " . $this->table . " LIMIT 1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        return $stmt->fetch();
    }
    
    // Crear o actualizar configuración
    public function createOrUpdate($data) {
        // Primero verificar si existe un registro
        $existing = $this->get();
        
        if ($existing) {
            // Actualizar
            return $this->update($existing['id'], $data);
        } else {
            // Crear
            return $this->create($data);
        }
    }
    
    // Crear nuevo registro
    private function create($data) {
        $query = "INSERT INTO " . $this->table . " 
                  SET nombre_empresa = :nombre_empresa,
                      telefono = :telefono,
                      email = :email,
                      sitio_web = :sitio_web,
                      calle = :calle,
                      colonia = :colonia,
                      ciudad = :ciudad,
                      estado = :estado,
                      codigo_postal = :codigo_postal,
                      pais = :pais,
                      logo_url = :logo_url,
                      facebook = :facebook,
                      instagram = :instagram,
                      twitter = :twitter,
                      linkedin = :linkedin";
        
        $stmt = $this->conn->prepare($query);
        
        $this->bindParams($stmt, $data);
        
        return $stmt->execute();
    }
    
    // Actualizar registro existente
    private function update($id, $data) {
        $query = "UPDATE " . $this->table . " 
                  SET nombre_empresa = :nombre_empresa,
                      telefono = :telefono,
                      email = :email,
                      sitio_web = :sitio_web,
                      calle = :calle,
                      colonia = :colonia,
                      ciudad = :ciudad,
                      estado = :estado,
                      codigo_postal = :codigo_postal,
                      pais = :pais,
                      logo_url = :logo_url,
                      facebook = :facebook,
                      instagram = :instagram,
                      twitter = :twitter,
                      linkedin = :linkedin
                  WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        
        $this->bindParams($stmt, $data);
        $stmt->bindParam(':id', $id);
        
        return $stmt->execute();
    }
    
    // Helper para bind de parámetros
    private function bindParams($stmt, $data) {
        $stmt->bindParam(':nombre_empresa', $data['nombre_empresa']);
        $stmt->bindParam(':telefono', $data['telefono']);
        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':sitio_web', $data['sitio_web']);
        $stmt->bindParam(':calle', $data['calle']);
        $stmt->bindParam(':colonia', $data['colonia']);
        $stmt->bindParam(':ciudad', $data['ciudad']);
        $stmt->bindParam(':estado', $data['estado']);
        $stmt->bindParam(':codigo_postal', $data['codigo_postal']);
        $stmt->bindParam(':pais', $data['pais']);
        $stmt->bindParam(':logo_url', $data['logo_url']);
        $stmt->bindParam(':facebook', $data['facebook']);
        $stmt->bindParam(':instagram', $data['instagram']);
        $stmt->bindParam(':twitter', $data['twitter']);
        $stmt->bindParam(':linkedin', $data['linkedin']);
    }
}
