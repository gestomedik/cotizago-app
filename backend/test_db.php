<?php
// test_db.php
// Script de diagnóstico para verificar conexión a BD y tabla permisos_roles

ini_set('display_errors', 1);
error_reporting(E_ALL);

echo "<h1>Diagnóstico de Base de Datos</h1>";

// 1. Verificar configuración
echo "<h2>1. Configuración</h2>";
$configFile = __DIR__ . '/config/config.php';
if (file_exists($configFile)) {
    echo "<p style='color:green'>✅ config.php encontrado</p>";
    require_once $configFile;
} else {
    echo "<p style='color:red'>❌ config.php NO encontrado</p>";
}

// 2. Verificar conexión
echo "<h2>2. Conexión a BD</h2>";
require_once __DIR__ . '/core/Database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    echo "<p style='color:green'>✅ Conexión exitosa</p>";
} catch (Exception $e) {
    echo "<p style='color:red'>❌ Error de conexión: " . $e->getMessage() . "</p>";
    die();
}

// 3. Verificar tabla permisos_roles
echo "<h2>3. Tabla permisos_roles</h2>";
try {
    $query = "SELECT COUNT(*) as count FROM permisos_roles";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "<p style='color:green'>✅ Tabla 'permisos_roles' existe. Registros: " . $row['count'] . "</p>";
    
    // Mostrar estructura
    $stmt = $db->query("DESCRIBE permisos_roles");
    echo "<h3>Estructura:</h3><ul>";
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo "<li>" . $row['Field'] . " (" . $row['Type'] . ")</li>";
    }
    echo "</ul>";
    
} catch (PDOException $e) {
    echo "<p style='color:red'>❌ Error al consultar tabla: " . $e->getMessage() . "</p>";
    echo "<p>Posible solución: Ejecutar el script SQL de creación de tabla.</p>";
}

// 4. Verificar Auth (JWT)
echo "<h2>4. Configuración JWT</h2>";
if (defined('JWT_SECRET')) {
    echo "<p style='color:green'>✅ JWT_SECRET definido</p>";
} else {
    echo "<p style='color:red'>❌ JWT_SECRET NO definido</p>";
}
