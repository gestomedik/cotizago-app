<?php
/**
 * Database.php
 * Clase para manejar la conexión a MySQL con PDO
 */

class Database {
    private $host = 'localhost';
    private $db_name = 'cotizago';  // Nombre de tu base de datos
    private $username = 'root';
    private $password = '';  // Vacío en XAMPP por defecto
    private $charset = 'utf8mb4';
    private $conn;
    
    /**
     * Obtener conexión a la base de datos
     */
    public function getConnection() {
        $this->conn = null;
        
        try {
            $dsn = "mysql:host={$this->host};dbname={$this->db_name};charset={$this->charset}";
            
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];
            
            $this->conn = new PDO($dsn, $this->username, $this->password, $options);
            
        } catch(PDOException $e) {
            error_log("Error de conexión: " . $e->getMessage());
            throw new Exception("Error al conectar con la base de datos");
        }
        
        return $this->conn;
    }
}
