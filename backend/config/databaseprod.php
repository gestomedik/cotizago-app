<?php

// =====================================================
// api/config/database.php
// Configuración de conexión a MySQL
// =====================================================

class Database {
    private $host = 'localhost';
    private $db_name = 'adminexplasilla_cotizago';  // ← Usa "agencia_viajes" o "cotizago" según tu BD
    private $username = 'adminexplasilla_admindev';
    private $password = 'm001e5a21d54a';
    private $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            $dsn = "mysql:host={$this->host};dbname={$this->db_name};charset=utf8mb4";
            $this->conn = new PDO($dsn, $this->username, $this->password);
            
            // Configurar PDO
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            $this->conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
            
        } catch(PDOException $e) {
            error_log("Error de conexión a BD: " . $e->getMessage());
            return null;
        }

        return $this->conn;
    }
    
    public function close() {
        $this->conn = null;
    }
}

// También definir las constantes por si algún otro archivo las usa
define('DB_HOST', 'localhost');
define('DB_NAME', 'cotizago');  // ← Cambia a 'cotizago' si tu BD se llama así
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');
