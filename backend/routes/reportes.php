<?php
// =====================================================
// api/routes/reportes.php
// =====================================================

$database = new Database();
$db = $database->getConnection();

$tipo = $parts[1] ?? null;

switch($method) {
    case 'GET':
        $currentUser = Auth::requireAuth();
        
        switch($tipo) {
            case 'ventas':
                // Reporte de ventas
                $query = "SELECT 
                          DATE_FORMAT(c.fecha_salida, '%Y-%m') as periodo,
                          COUNT(*) as total_ventas,
                          SUM(c.precio_venta_total) as monto_total,
                          SUM(c.comision_total) as comisiones_totales
                          FROM cotizaciones c
                          WHERE c.estado = 'reservacion'
                          GROUP BY periodo
                          ORDER BY periodo DESC
                          LIMIT 12";
                
                $stmt = $db->prepare($query);
                $stmt->execute();
                $reporte = $stmt->fetchAll();
                
                Response::success($reporte);
                break;
                
            case 'utilidades':
                // Reporte de utilidades
                $query = "SELECT * FROM vista_reporte_utilidades 
                          WHERE estado = 'reservacion'
                          ORDER BY fecha_salida DESC
                          LIMIT 50";
                
                $stmt = $db->prepare($query);
                $stmt->execute();
                $reporte = $stmt->fetchAll();
                
                Response::success($reporte);
                break;
                
            case 'agentes':
                // Reporte por agente
                Auth::requireAdmin();
                
                $query = "SELECT * FROM vista_ventas_agentes 
                          WHERE anio = YEAR(CURDATE())
                          ORDER BY ventas_totales DESC";
                
                $stmt = $db->prepare($query);
                $stmt->execute();
                $reporte = $stmt->fetchAll();
                
                Response::success($reporte);
                break;
                
            default:
                Response::error('Tipo de reporte no encontrado', 404);
        }
        break;
        
    default:
        Response::error('Método no permitido', 405);
}