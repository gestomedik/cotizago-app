<?php

class DashboardController {
    private $db;
    
    public function __construct($db) {
        $this->db = $db;
    }
    
    /**
     * GET /dashboard/resumen
     * Resumen general del sistema
     */
    public function resumen() {
        try {
            // Obtener estadísticas del mes actual
            $mesActual = date('Y-m');
            
            // Cotizaciones del mes
            $query = "SELECT COUNT(*) as total FROM cotizaciones 
                     WHERE DATE_FORMAT(fecha_creacion, '%Y-%m') = :mes";
            $stmt = $this->db->prepare($query);
            $stmt->execute(['mes' => $mesActual]);
            $cotizacionesMes = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
            
            // Reservaciones activas (estado = reservacion)
            $query = "SELECT COUNT(*) as total FROM cotizaciones 
                     WHERE estado = 'reservacion'";
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            $reservacionesActivas = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
            
            // Ventas del mes
            $query = "SELECT COALESCE(SUM(precio_venta_final), 0) as total 
                     FROM cotizaciones 
                     WHERE DATE_FORMAT(fecha_creacion, '%Y-%m') = :mes
                     AND estado IN ('reservacion', 'completada')";
            $stmt = $this->db->prepare($query);
            $stmt->execute(['mes' => $mesActual]);
            $ventasMes = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
            
            // Comisión acumulada del mes
            $query = "SELECT COALESCE(SUM(monto_comision), 0) as total 
                     FROM comisiones_agentes 
                     WHERE DATE_FORMAT(fecha_creacion, '%Y-%m') = :mes";
            $stmt = $this->db->prepare($query);
            $stmt->execute(['mes' => $mesActual]);
            $comisionAcumulada = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
            
            // Clientes totales
            $query = "SELECT COUNT(*) as total FROM clientes";
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            $clientesTotales = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
            
            // Clientes nuevos del mes
            $query = "SELECT COUNT(*) as total FROM clientes 
                     WHERE DATE_FORMAT(fecha_registro, '%Y-%m') = :mes";
            $stmt = $this->db->prepare($query);
            $stmt->execute(['mes' => $mesActual]);
            $clientesNuevosMes = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
            
            // Pasajeros totales
            $query = "SELECT COUNT(*) as total FROM pasajeros";
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            $pasajerosTotales = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
            
            $data = [
                'cotizaciones_mes' => (int)$cotizacionesMes,
                'reservaciones_activas' => (int)$reservacionesActivas,
                'ventas_mes' => (float)$ventasMes,
                'comision_acumulada' => (float)$comisionAcumulada,
                'clientes_totales' => (int)$clientesTotales,
                'clientes_nuevos_mes' => (int)$clientesNuevosMes,
                'pasajeros_totales' => (int)$pasajerosTotales
            ];
            
            return json_encode([
                'success' => true,
                'data' => $data
            ]);
            
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'error' => 'Error al obtener resumen: ' . $e->getMessage()
            ]);
        }
    }
    
    /**
     * GET /dashboard/proximos
     * Viajes próximos a iniciar (siguientes 30 días)
     */
    public function proximos() {
        try {
            $query = "SELECT 
                        c.id,
                        c.folio,
                        CONCAT(cl.nombre, ' ', cl.apellido) as cliente,
                        c.destino,
                        c.fecha_salida,
                        (c.num_adultos + c.num_ninos + c.num_infantes) as num_pasajeros,
                        c.estado,
                        c.precio_venta_final,
                        DATEDIFF(c.fecha_salida, CURDATE()) as dias_restantes
                     FROM cotizaciones c
                     INNER JOIN clientes cl ON c.cliente_id = cl.id
                     WHERE c.estado IN ('reservacion', 'completada')
                     AND c.fecha_salida >= CURDATE()
                     AND c.fecha_salida <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
                     ORDER BY c.fecha_salida ASC
                     LIMIT 10";
            
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            $proximos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Formatear datos
            foreach ($proximos as &$viaje) {
                $viaje['num_pasajeros'] = (int)$viaje['num_pasajeros'];
                $viaje['precio_venta_final'] = (float)$viaje['precio_venta_final'];
                $viaje['dias_restantes'] = (int)$viaje['dias_restantes'];
            }
            
            return json_encode([
                'success' => true,
                'data' => $proximos
            ]);
            
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'error' => 'Error al obtener viajes próximos: ' . $e->getMessage()
            ]);
        }
    }
    
    /**
     * GET /dashboard/mes
     * Estadísticas del mes actual
     */
    public function mes() {
        try {
            $mesActual = date('Y-m');
            
            // Cotizaciones creadas
            $query = "SELECT COUNT(*) as total FROM cotizaciones 
                     WHERE DATE_FORMAT(fecha_creacion, '%Y-%m') = :mes";
            $stmt = $this->db->prepare($query);
            $stmt->execute(['mes' => $mesActual]);
            $cotizacionesCreadas = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
            
            // Conversiones (cotizaciones que se convirtieron en reservaciones)
            $query = "SELECT COUNT(*) as total FROM cotizaciones 
                     WHERE DATE_FORMAT(fecha_creacion, '%Y-%m') = :mes
                     AND estado IN ('reservacion', 'completada')";
            $stmt = $this->db->prepare($query);
            $stmt->execute(['mes' => $mesActual]);
            $conversiones = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
            
            // Calcular tasa de conversión
            $tasaConversion = $cotizacionesCreadas > 0 
                ? round(($conversiones / $cotizacionesCreadas) * 100, 2) 
                : 0;
            
            // Ventas totales
            $query = "SELECT COALESCE(SUM(precio_venta_final), 0) as total 
                     FROM cotizaciones 
                     WHERE DATE_FORMAT(fecha_creacion, '%Y-%m') = :mes
                     AND estado IN ('reservacion', 'completada')";
            $stmt = $this->db->prepare($query);
            $stmt->execute(['mes' => $mesActual]);
            $ventasTotales = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
            
            // Comisiones generadas
            $query = "SELECT COALESCE(SUM(monto_comision), 0) as total 
                     FROM comisiones_agentes 
                     WHERE DATE_FORMAT(fecha_creacion, '%Y-%m') = :mes";
            $stmt = $this->db->prepare($query);
            $stmt->execute(['mes' => $mesActual]);
            $comisionesGeneradas = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
            
            $data = [
                'cotizaciones_creadas' => (int)$cotizacionesCreadas,
                'conversiones' => (int)$conversiones,
                'tasa_conversion' => (float)$tasaConversion,
                'ventas_totales' => (float)$ventasTotales,
                'comisiones_generadas' => (float)$comisionesGeneradas
            ];
            
            return json_encode([
                'success' => true,
                'data' => $data
            ]);
            
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'error' => 'Error al obtener estadísticas del mes: ' . $e->getMessage()
            ]);
        }
    }
    
    /**
     * GET /dashboard/en-proceso
     * Reservaciones en proceso
     */
    public function enProceso() {
        try {
            $query = "SELECT 
                        c.id,
                        c.folio,
                        CONCAT(cl.nombre, ' ', cl.apellido) as cliente,
                        c.destino,
                        c.fecha_salida,
                        c.fecha_regreso,
                        (c.num_adultos + c.num_ninos + c.num_infantes) as num_pasajeros,
                        c.estado,
                        c.estado_pago,
                        c.precio_venta_final
                     FROM cotizaciones c
                     INNER JOIN clientes cl ON c.cliente_id = cl.id
                     WHERE c.estado = 'reservacion'
                     AND c.fecha_salida >= CURDATE()
                     ORDER BY c.fecha_salida ASC";
            
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            $enProceso = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Formatear datos
            foreach ($enProceso as &$reservacion) {
                $reservacion['num_pasajeros'] = (int)$reservacion['num_pasajeros'];
                $reservacion['precio_venta_final'] = (float)$reservacion['precio_venta_final'];
            }
            
            return json_encode([
                'success' => true,
                'data' => $enProceso
            ]);
            
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'error' => 'Error al obtener reservaciones en proceso: ' . $e->getMessage()
            ]);
        }
    }
    
    /**
     * GET /dashboard/completados
     * Viajes completados
     */
    public function completados() {
        try {
            $query = "SELECT 
                        c.id,
                        c.folio,
                        CONCAT(cl.nombre, ' ', cl.apellido) as cliente,
                        c.destino,
                        c.fecha_salida,
                        c.fecha_regreso,
                        (c.num_adultos + c.num_ninos + c.num_infantes) as num_pasajeros,
                        c.precio_venta_final,
                        c.utilidad
                     FROM cotizaciones c
                     INNER JOIN clientes cl ON c.cliente_id = cl.id
                     WHERE c.estado = 'completada'
                     ORDER BY c.fecha_regreso DESC
                     LIMIT 20";
            
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            $completados = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Formatear datos
            foreach ($completados as &$viaje) {
                $viaje['num_pasajeros'] = (int)$viaje['num_pasajeros'];
                $viaje['precio_venta_final'] = (float)$viaje['precio_venta_final'];
                $viaje['utilidad'] = (float)$viaje['utilidad'];
            }
            
            return json_encode([
                'success' => true,
                'data' => $completados
            ]);
            
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'error' => 'Error al obtener viajes completados: ' . $e->getMessage()
            ]);
        }
    }
}
