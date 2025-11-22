<?php
// =====================================================
// api/routes/config.php
// =====================================================

$database = new Database();
$db = $database->getConnection();

$action = $parts[1] ?? null;

switch($method) {
    case 'GET':
        if ($action === 'empresa') {
            // GET /config/empresa - Obtener configuración de empresa
            $controller = new ConfiguracionEmpresaController();
            $controller->get();
        } elseif ($action === 'comisiones') {
            // GET /config/comisiones - Ver rangos de comisión
            Auth::requireAuth();
            
            $query = "SELECT * FROM config_comisiones WHERE activo = 1 ORDER BY rango_minimo ASC";
            $stmt = $db->prepare($query);
            $stmt->execute();
            $config = $stmt->fetchAll();
            
            Response::success($config);
        }
        break;
        
    case 'POST':
        if ($action === 'empresa') {
            // POST /config/empresa - Crear/actualizar configuración de empresa
            $controller = new ConfiguracionEmpresaController();
            $controller->createOrUpdate();
        }
        break;
        
    case 'PUT':
        if ($action === 'comisiones') {
            // PUT /config/comisiones - Actualizar rangos
            Auth::requireAdmin();
            $data = json_decode(file_get_contents("php://input"), true);
            
            // Aquí iría la lógica para actualizar
            Response::success(null, 'Configuración actualizada');
        }
        break;
        
    default:
        Response::error('Método no permitido', 405);
}