<?php

// =====================================================
// api/models/Cliente.php
// =====================================================

class Cliente {
    private $conn;
    private $table = 'clientes';
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    // Obtener todos los clientes
    public function getAll($filters = []) {
        $query = "SELECT c.*, 
                  COUNT(DISTINCT p.id) as num_pasajeros,
                  DATE_FORMAT(c.fecha_registro, '%Y-%m-%d') as fecha_registro_formatted,
                  DATE_FORMAT(c.fecha_ultimo_viaje, '%Y-%m-%d') as fecha_ultimo_viaje_formatted
                  FROM " . $this->table . " c
                  LEFT JOIN pasajeros p ON c.id = p.cliente_id AND p.activo = 1
                  WHERE 1=1";
        
        $params = [];
        
        if (isset($filters['recurrente'])) {
            $query .= " AND c.es_recurrente = :recurrente";
            $params[':recurrente'] = $filters['recurrente'];
        }
        
        if (isset($filters['search'])) {
            $query .= " AND (c.nombre LIKE :search OR c.apellido LIKE :search OR c.email LIKE :search)";
            $params[':search'] = '%' . $filters['search'] . '%';
        }
        
        $query .= " GROUP BY c.id ORDER BY c.nombre ASC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute($params);
        
        return $stmt->fetchAll();
    }
    
    // Obtener un cliente por ID
    public function getById($id) {
        $query = "SELECT c.*,
                  COUNT(DISTINCT p.id) as num_pasajeros,
                  COUNT(DISTINCT cot.id) as num_cotizaciones,
                  DATE_FORMAT(c.fecha_registro, '%Y-%m-%d') as fecha_registro_formatted,
                  DATE_FORMAT(c.fecha_ultimo_viaje, '%Y-%m-%d') as fecha_ultimo_viaje_formatted
                  FROM " . $this->table . " c
                  LEFT JOIN pasajeros p ON c.id = p.cliente_id AND p.activo = 1
                  LEFT JOIN cotizaciones cot ON c.id = cot.cliente_id
                  WHERE c.id = :id
                  GROUP BY c.id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        return $stmt->fetch();
    }
    
    // Crear cliente
    public function create($data) {
        $query = "INSERT INTO " . $this->table . " 
                  (nombre, apellido, email, telefono, telefono_secundario, direccion, 
                   ciudad, estado, pais, codigo_postal, notas, usuario_registro_id) 
                  VALUES (:nombre, :apellido, :email, :telefono, :telefono_secundario, :direccion,
                          :ciudad, :estado, :pais, :codigo_postal, :notas, :usuario_id)";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(':nombre', $data['nombre']);
        $stmt->bindParam(':apellido', $data['apellido']);
        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':telefono', $data['telefono']);
        $stmt->bindParam(':telefono_secundario', $data['telefono_secundario']);
        $stmt->bindParam(':direccion', $data['direccion']);
        $stmt->bindParam(':ciudad', $data['ciudad']);
        $stmt->bindParam(':estado', $data['estado']);
        $stmt->bindParam(':pais', $data['pais']);
        $stmt->bindParam(':codigo_postal', $data['codigo_postal']);
        $stmt->bindParam(':notas', $data['notas']);
        $stmt->bindParam(':usuario_id', $data['usuario_id']);
        
        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        
        return false;
    }
    
    // Actualizar cliente
    public function update($id, $data) {
        $query = "UPDATE " . $this->table . " 
                  SET nombre = :nombre, 
                      apellido = :apellido, 
                      email = :email,
                      telefono = :telefono,
                      telefono_secundario = :telefono_secundario,
                      direccion = :direccion,
                      ciudad = :ciudad,
                      estado = :estado,
                      pais = :pais,
                      codigo_postal = :codigo_postal,
                      notas = :notas
                  WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(':nombre', $data['nombre']);
        $stmt->bindParam(':apellido', $data['apellido']);
        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':telefono', $data['telefono']);
        $stmt->bindParam(':telefono_secundario', $data['telefono_secundario']);
        $stmt->bindParam(':direccion', $data['direccion']);
        $stmt->bindParam(':ciudad', $data['ciudad']);
        $stmt->bindParam(':estado', $data['estado']);
        $stmt->bindParam(':pais', $data['pais']);
        $stmt->bindParam(':codigo_postal', $data['codigo_postal']);
        $stmt->bindParam(':notas', $data['notas']);
        $stmt->bindParam(':id', $id);
        
        return $stmt->execute();
    }
    
    // Eliminar cliente
    public function delete($id) {
        $query = "DELETE FROM " . $this->table . " WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        
        return $stmt->execute();
    }
    
    // Marcar como recurrente
    public function markAsRecurrent($id) {
        $query = "UPDATE " . $this->table . " 
                  SET es_recurrente = 1 
                  WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        
        return $stmt->execute();
    }
    
    // Actualizar contador de viajes
    public function updateTotalViajes($id) {
        $query = "UPDATE " . $this->table . " c
                  SET c.total_viajes = (
                      SELECT COUNT(*) FROM cotizaciones 
                      WHERE cliente_id = :id AND estado = 'reservacion'
                  ),
                  c.fecha_ultimo_viaje = (
                      SELECT MAX(fecha_salida) FROM cotizaciones 
                      WHERE cliente_id = :id AND estado = 'reservacion'
                  )
                  WHERE c.id = :id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        
        return $stmt->execute();
    }
}

?>