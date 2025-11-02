<?php
/**
 * Modelo: Cotizacion
 * Gestión de cotizaciones de viaje
 */

class Cotizacion {
    private $conn;
    private $table = 'cotizaciones';

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Obtener todas las cotizaciones con información del cliente
     */
    public function getAll($filters = []) {
        $query = "SELECT 
                    cotizaciones.id,
                    cotizaciones.folio,
                    cotizaciones.cliente_id,
                    CONCAT(clientes.nombre, ' ', clientes.apellido) as cliente_nombre,
                    cotizaciones.origen,
                    cotizaciones.destino,
                    cotizaciones.fecha_salida,
                    cotizaciones.fecha_regreso,
                    cotizaciones.num_noches,
                    cotizaciones.num_adultos,
                    cotizaciones.num_ninos,
                    cotizaciones.num_infantes,
                    cotizaciones.costo_total,
                    cotizaciones.precio_venta_total as precio_venta_final,
                    cotizaciones.utilidad_total as utilidad,
                    cotizaciones.comision_total as monto_comision,
                    cotizaciones.estado,
                    cotizaciones.estado_pago,
                    cotizaciones.paso_actual,
                    cotizaciones.fecha_creacion,
                    cotizaciones.agente_id,
                    CONCAT(usuarios.nombre, ' ', usuarios.apellido) as agente_nombre
                FROM {$this->table} AS cotizaciones
                INNER JOIN clientes ON cotizaciones.cliente_id = clientes.id
                LEFT JOIN usuarios ON cotizaciones.agente_id = usuarios.id
                WHERE 1=1";

        // Aplicar filtros
        if (!empty($filters['estado'])) {
            $query .= " AND cotizaciones.estado = :estado";
        }
        if (!empty($filters['cliente_id'])) {
            $query .= " AND cotizaciones.cliente_id = :cliente_id";
        }
        if (!empty($filters['usuario_id'])) {
            $query .= " AND cotizaciones.agente_id = :usuario_id";
        }

        $query .= " ORDER BY cotizaciones.fecha_creacion DESC";

        $stmt = $this->conn->prepare($query);

        // Bind filters
        if (!empty($filters['estado'])) {
            $stmt->bindParam(':estado', $filters['estado']);
        }
        if (!empty($filters['cliente_id'])) {
            $stmt->bindParam(':cliente_id', $filters['cliente_id']);
        }
        if (!empty($filters['usuario_id'])) {
            $stmt->bindParam(':usuario_id', $filters['usuario_id']);
        }

        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Obtener una cotización específica con todos sus detalles
     */
    public function getById($id) {
        // Obtener cotización base
        $query = "SELECT 
                    cotizaciones.*,
                    CONCAT(clientes.nombre, ' ', clientes.apellido) as cliente_nombre,
                    clientes.email as cliente_email,
                    clientes.telefono as cliente_telefono,
                    CONCAT(usuarios.nombre, ' ', usuarios.apellido) as agente_nombre
                FROM {$this->table} AS cotizaciones
                INNER JOIN clientes ON cotizaciones.cliente_id = clientes.id
                LEFT JOIN usuarios ON cotizaciones.agente_id = usuarios.id
                WHERE cotizaciones.id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $cotizacion = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$cotizacion) {
            return null;
        }

        // Obtener pasajeros
        $query = "SELECT p.* 
                FROM pasajeros p
                INNER JOIN cotizacion_pasajeros cp ON p.id = cp.pasajero_id
                WHERE cp.cotizacion_id = :cotizacion_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':cotizacion_id', $id);
        $stmt->execute();
        $cotizacion['pasajeros'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Obtener vuelos
        $query = "SELECT * FROM vuelos WHERE cotizacion_id = :cotizacion_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':cotizacion_id', $id);
        $stmt->execute();
        $cotizacion['vuelos'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Obtener hoteles
        $query = "SELECT * FROM hoteles WHERE cotizacion_id = :cotizacion_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':cotizacion_id', $id);
        $stmt->execute();
        $cotizacion['hoteles'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Obtener transportes
        $query = "SELECT * FROM transportes WHERE cotizacion_id = :cotizacion_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':cotizacion_id', $id);
        $stmt->execute();
        $cotizacion['transportes'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Obtener tours
        $query = "SELECT * FROM tours WHERE cotizacion_id = :cotizacion_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':cotizacion_id', $id);
        $stmt->execute();
        $cotizacion['tours'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Obtener seguros
        $query = "SELECT * FROM seguros WHERE cotizacion_id = :cotizacion_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':cotizacion_id', $id);
        $stmt->execute();
        $cotizacion['seguros'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $cotizacion;
    }

    /**
     * Crear una nueva cotización
     */
    public function create($data) {
        // Generar folio
        $folio = $this->generarFolio();

        // Calcular número de noches
        $fecha_salida = new DateTime($data['fecha_salida']);
        $fecha_regreso = new DateTime($data['fecha_regreso']);
        $num_noches = $fecha_salida->diff($fecha_regreso)->days;

        $query = "INSERT INTO {$this->table} 
                (folio, cliente_id, agente_id, origen, destino, 
                fecha_salida, fecha_regreso, num_noches, 
                num_adultos, num_ninos, num_infantes, tipo_viaje,
                descripcion_general, notas_internas,
                costo_vuelos, costo_hoteles, costo_transportes, 
                costo_tours, costo_seguros, otros_costos,
                costo_total, utilidad_total, precio_venta_total,
                porcentaje_comision_agente, comision_agente,
                estado, estado_pago, fecha_creacion)
                VALUES 
                (:folio, :cliente_id, :usuario_id, :origen, :destino,
                :fecha_salida, :fecha_regreso, :num_noches,
                :num_adultos, :num_ninos, :num_infantes, :tipo_viaje,
                :descripcion_general, :notas_internas,
                :costo_vuelos, :costo_hoteles, :costo_transportes,
                :costo_tours, :costo_seguros, :otros_costos,
                :costo_total, :utilidad, :precio_venta_final,
                :porcentaje_comision, :monto_comision,
                'cotizacion', 'pendiente', NOW())";

        $stmt = $this->conn->prepare($query);

        // Bind parameters
        $stmt->bindParam(':folio', $folio);
        $stmt->bindParam(':cliente_id', $data['cliente_id']);
        $stmt->bindParam(':usuario_id', $data['usuario_id']);
        $stmt->bindParam(':origen', $data['origen']);
        $stmt->bindParam(':destino', $data['destino']);
        $stmt->bindParam(':fecha_salida', $data['fecha_salida']);
        $stmt->bindParam(':fecha_regreso', $data['fecha_regreso']);
        $stmt->bindParam(':num_noches', $num_noches);
        $stmt->bindParam(':num_adultos', $data['num_adultos']);
        $stmt->bindParam(':num_ninos', $data['num_ninos']);
        $stmt->bindParam(':num_infantes', $data['num_infantes']);
        $stmt->bindParam(':tipo_viaje', $data['tipo_viaje']);
        $stmt->bindParam(':descripcion_general', $data['descripcion_general']);
        $stmt->bindParam(':notas_internas', $data['notas_internas']);
        
        // Costos
        $costo_vuelos = $data['costo_vuelos'] ?? 0;
        $costo_hoteles = $data['costo_hoteles'] ?? 0;
        $costo_transportes = $data['costo_transportes'] ?? 0;
        $costo_tours = $data['costo_tours'] ?? 0;
        $costo_seguros = $data['costo_seguros'] ?? 0;
        $otros_costos = $data['otros_costos'] ?? 0;
        
        $stmt->bindParam(':costo_vuelos', $costo_vuelos);
        $stmt->bindParam(':costo_hoteles', $costo_hoteles);
        $stmt->bindParam(':costo_transportes', $costo_transportes);
        $stmt->bindParam(':costo_tours', $costo_tours);
        $stmt->bindParam(':costo_seguros', $costo_seguros);
        $stmt->bindParam(':otros_costos', $otros_costos);
        
        $stmt->bindParam(':costo_total', $data['costo_total']);
        $stmt->bindParam(':utilidad', $data['utilidad']);
        $stmt->bindParam(':precio_venta_final', $data['precio_venta_final']);
        $stmt->bindParam(':porcentaje_comision', $data['porcentaje_comision']);
        $stmt->bindParam(':monto_comision', $data['monto_comision']);

        if ($stmt->execute()) {
            $cotizacion_id = $this->conn->lastInsertId();

            // Vincular pasajeros
            if (!empty($data['pasajeros_ids'])) {
                $this->vincularPasajeros($cotizacion_id, $data['pasajeros_ids']);
            }

            return $cotizacion_id;
        }

        return false;
    }

    /**
     * Actualizar una cotización
     */
    public function update($id, $data) {
        // Calcular número de noches si cambió
        if (isset($data['fecha_salida']) && isset($data['fecha_regreso'])) {
            $fecha_salida = new DateTime($data['fecha_salida']);
            $fecha_regreso = new DateTime($data['fecha_regreso']);
            $data['num_noches'] = $fecha_salida->diff($fecha_regreso)->days;
        }

        $query = "UPDATE {$this->table} SET ";
        $fields = [];
        
        $allowed_fields = [
            'cliente_id', 'origen', 'destino', 'fecha_salida', 'fecha_regreso',
            'num_noches', 'num_adultos', 'num_ninos', 'num_infantes', 'tipo_viaje',
            'descripcion_general', 'notas_internas',
            'costo_vuelos', 'costo_hoteles', 'costo_transportes', 'costo_tours',
            'costo_seguros', 'otros_costos', 'costo_total', 'utilidad',
            'precio_venta_final', 'porcentaje_comision', 'monto_comision',
            'estado', 'estado_pago'
        ];

        foreach ($allowed_fields as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = :$field";
            }
        }

        if (empty($fields)) {
            return false;
        }

        $query .= implode(', ', $fields);
        $query .= ", fecha_modificacion = NOW() WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);

        foreach ($allowed_fields as $field) {
            if (isset($data[$field])) {
                $stmt->bindParam(":$field", $data[$field]);
            }
        }

        return $stmt->execute();
    }

    /**
     * Eliminar una cotización (soft delete)
     */
    public function delete($id) {
        $query = "UPDATE {$this->table} SET estado = 'cancelada' WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    /**
     * Vincular pasajeros a una cotización
     */
    private function vincularPasajeros($cotizacion_id, $pasajeros_ids) {
        $query = "INSERT INTO cotizacion_pasajeros (cotizacion_id, pasajero_id, fecha_vinculacion)
                VALUES (:cotizacion_id, :pasajero_id, NOW())";
        
        $stmt = $this->conn->prepare($query);
        
        foreach ($pasajeros_ids as $pasajero_id) {
            $stmt->bindParam(':cotizacion_id', $cotizacion_id);
            $stmt->bindParam(':pasajero_id', $pasajero_id);
            $stmt->execute();
        }
    }

    /**
     * Generar folio único para la cotización
     */
    private function generarFolio() {
        $year = date('Y');
        
        // Obtener el último número de folio del año
        $query = "SELECT folio FROM {$this->table} 
                WHERE folio LIKE :pattern 
                ORDER BY id DESC LIMIT 1";
        
        $pattern = "CTZ-{$year}-%";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':pattern', $pattern);
        $stmt->execute();
        
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($result) {
            // Extraer el número y sumar 1
            $parts = explode('-', $result['folio']);
            $numero = intval($parts[2]) + 1;
        } else {
            $numero = 1;
        }
        
        return sprintf("CTZ-%s-%03d", $year, $numero);
    }

    /**
     * Calcular comisión según configuración de rangos
     */
    public function calcularComision($precio_venta) {
        $query = "SELECT porcentaje_comision 
                FROM config_comisiones 
                WHERE activo = 1 
                AND :precio >= rango_minimo 
                AND (:precio <= rango_maximo OR rango_maximo IS NULL)
                LIMIT 1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':precio', $precio_venta);
        $stmt->execute();
        
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($result) {
            return $result['porcentaje_comision'];
        }
        
        return 20.00; // Comisión por defecto si no hay configuración
    }
}