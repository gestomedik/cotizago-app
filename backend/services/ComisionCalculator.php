<?php

// =====================================================
// api/services/ComisionCalculator.php
// =====================================================

class ComisionCalculator {
    private $conn;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    // Calcular el porcentaje de comisión según ventas del mes
    public function calcularPorcentajeComision($agenteId, $mes, $anio) {
        // Obtener total de ventas del agente en ese mes
        $query = "SELECT COALESCE(SUM(precio_venta_total), 0) as total_ventas
                  FROM cotizaciones
                  WHERE agente_id = :agente_id
                    AND estado = 'reservacion'
                    AND MONTH(fecha_salida) = :mes
                    AND YEAR(fecha_salida) = :anio";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':agente_id', $agenteId);
        $stmt->bindParam(':mes', $mes);
        $stmt->bindParam(':anio', $anio);
        $stmt->execute();
        
        $result = $stmt->fetch();
        $totalVentas = $result['total_ventas'];
        
        // Obtener configuración de comisiones
        $query = "SELECT * FROM config_comisiones 
                  WHERE activo = 1 
                  AND :total_ventas >= rango_minimo
                  AND (:total_ventas <= rango_maximo OR rango_maximo IS NULL)
                  ORDER BY rango_minimo DESC
                  LIMIT 1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':total_ventas', $totalVentas);
        $stmt->execute();
        
        $config = $stmt->fetch();
        
        return [
            'total_ventas_mes' => $totalVentas,
            'porcentaje_comision' => $config['porcentaje_comision'] ?? 20,
            'rango_minimo' => $config['rango_minimo'] ?? 0,
            'rango_maximo' => $config['rango_maximo'] ?? null
        ];
    }
    
    // Recalcular todas las comisiones de un mes (cuando se cancela algo)
    public function recalcularComisionesMes($agenteId, $mes, $anio) {
        // Obtener el nuevo porcentaje
        $info = $this->calcularPorcentajeComision($agenteId, $mes, $anio);
        
        // Actualizar todas las comisiones de ese mes
        $query = "UPDATE comisiones_agentes ca
                  INNER JOIN cotizaciones c ON ca.cotizacion_id = c.id
                  SET ca.porcentaje_comision = :porcentaje,
                      ca.monto_comision = (c.comision_total * :porcentaje / 100),
                      ca.ventas_mes_total = :total_ventas
                  WHERE ca.agente_id = :agente_id
                    AND ca.mes = :mes
                    AND ca.anio = :anio
                    AND ca.estado_viaje != 'cancelado'";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':porcentaje', $info['porcentaje_comision']);
        $stmt->bindParam(':total_ventas', $info['total_ventas_mes']);
        $stmt->bindParam(':agente_id', $agenteId);
        $stmt->bindParam(':mes', $mes);
        $stmt->bindParam(':anio', $anio);
        
        return $stmt->execute();
    }
    
    // Registrar comisión de una cotización
    public function registrarComision($cotizacionId) {
        // Obtener datos de la cotización
        $query = "SELECT * FROM cotizaciones WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $cotizacionId);
        $stmt->execute();
        $cotizacion = $stmt->fetch();
        
        if (!$cotizacion) {
            return false;
        }
        
        $mes = date('n', strtotime($cotizacion['fecha_salida']));
        $anio = date('Y', strtotime($cotizacion['fecha_salida']));
        
        // Calcular porcentaje de comisión
        $info = $this->calcularPorcentajeComision($cotizacion['agente_id'], $mes, $anio);
        
        $montoComision = $cotizacion['comision_total'] * ($info['porcentaje_comision'] / 100);
        
        // Actualizar en cotizaciones
        $query = "UPDATE cotizaciones 
                  SET porcentaje_comision_agente = :porcentaje,
                      comision_agente = :monto
                  WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':porcentaje', $info['porcentaje_comision']);
        $stmt->bindParam(':monto', $montoComision);
        $stmt->bindParam(':id', $cotizacionId);
        $stmt->execute();
        
        // Insertar en comisiones_agentes
        $query = "INSERT INTO comisiones_agentes 
                  (agente_id, cotizacion_id, mes, anio, monto_venta, ventas_mes_total, 
                   porcentaje_comision, monto_comision, estado_viaje, pagado)
                  VALUES (:agente_id, :cotizacion_id, :mes, :anio, :monto_venta, :ventas_mes_total,
                          :porcentaje, :monto_comision, 'pendiente', 0)";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':agente_id', $cotizacion['agente_id']);
        $stmt->bindParam(':cotizacion_id', $cotizacionId);
        $stmt->bindParam(':mes', $mes);
        $stmt->bindParam(':anio', $anio);
        $stmt->bindParam(':monto_venta', $cotizacion['precio_venta_total']);
        $stmt->bindParam(':ventas_mes_total', $info['total_ventas_mes']);
        $stmt->bindParam(':porcentaje', $info['porcentaje_comision']);
        $stmt->bindParam(':monto_comision', $montoComision);
        
        if ($stmt->execute()) {
            // Recalcular todas las comisiones del mes (porque cambió el total)
            $this->recalcularComisionesMes($cotizacion['agente_id'], $mes, $anio);
            return true;
        }
        
        return false;
    }
}

?>