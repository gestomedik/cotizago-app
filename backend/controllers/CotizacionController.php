<?php
/**
 * CotizacionController - Versión Corregida
 * 
 * CORRECCIONES APLICADAS:
 * - Método list() en lugar de index()
 * - Métodos update() y delete() agregados
 * - Sin require_once manuales (usa autoloader)
 * - Constructor acepta $db como parámetro
 */

class CotizacionController {
    private $db;
    private $conn;
    
    public function __construct($db = null) {
        if ($db) {
            $this->conn = $db;
        } else {
            $this->db = new Database();
            $this->conn = $this->db->getConnection();
        }
    }
    
    /**
     * GET /cotizaciones
     * Listar todas las cotizaciones
     */
    public function list() {
        try {
            $user = Auth::requireAuth();
            
            // Si es agente, solo ver sus cotizaciones
            $sql = "SELECT c.*, 
                    CONCAT(cl.nombre, ' ', cl.apellido) as cliente_nombre,
                    CONCAT(u.nombre, ' ', u.apellido) as agente_nombre
                    FROM cotizaciones c
                    LEFT JOIN clientes cl ON c.cliente_id = cl.id
                    LEFT JOIN usuarios u ON c.agente_id = u.id";
            
            if ($user['rol'] === 'agente') {
                $sql .= " WHERE c.agente_id = :agente_id";
            }
            
            $sql .= " ORDER BY c.id DESC";
            
            $stmt = $this->conn->prepare($sql);
            
            if ($user['rol'] === 'agente') {
                $stmt->bindParam(':agente_id', $user['id']);
            }
            
            $stmt->execute();
            $cotizaciones = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            Response::success($cotizaciones);
            
        } catch (Exception $e) {
            Response::error('Error al obtener cotizaciones: ' . $e->getMessage(), 500);
        }
    }
    
    /**
     * GET /cotizaciones/{id}
     * Obtener una cotización específica con todos sus servicios
     */
    public function get($id) {
        try {
            $user = Auth::requireAuth();
            
            // Obtener cotización
            $sql = "SELECT c.*, 
                    CONCAT(cl.nombre, ' ', cl.apellido) as cliente_nombre,
                    cl.email as cliente_email,
                    cl.telefono as cliente_telefono,
                    CONCAT(u.nombre, ' ', u.apellido) as agente_nombre
                    FROM cotizaciones c
                    LEFT JOIN clientes cl ON c.cliente_id = cl.id
                    LEFT JOIN usuarios u ON c.agente_id = u.id
                    WHERE c.id = :id";
            
            // Si es agente, solo sus cotizaciones
            if ($user['rol'] === 'agente') {
                $sql .= " AND c.agente_id = :agente_id";
            }
            
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':id', $id);
            
            if ($user['rol'] === 'agente') {
                $stmt->bindParam(':agente_id', $user['id']);
            }
            
            $stmt->execute();
            $cotizacion = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$cotizacion) {
                Response::error('Cotización no encontrada', 404);
                return;
            }
            
            // Obtener servicios asociados
            $cotizacion['vuelos'] = $this->obtenerVuelos($id);
            $cotizacion['hoteles'] = $this->obtenerHoteles($id);
            $cotizacion['transportes'] = $this->obtenerTransportes($id);
            $cotizacion['tours'] = $this->obtenerTours($id);
            $cotizacion['seguros'] = $this->obtenerSeguros($id);
            $cotizacion['pasajeros'] = $this->obtenerPasajeros($id);
            
            Response::success($cotizacion);
            
        } catch (Exception $e) {
            Response::error('Error al obtener cotización: ' . $e->getMessage(), 500);
        }
    }
    
    /**
     * POST /cotizaciones
     * Crear una nueva cotización con todos sus servicios
     */
    public function create() {
        try {
            $user = Auth::requireAuth();
            $data = json_decode(file_get_contents('php://input'), true);
            
            // Validar datos requeridos
            if (empty($data['cliente_id']) || empty($data['origen']) || empty($data['destino']) || 
                empty($data['fecha_salida']) || empty($data['fecha_regreso'])) {
                Response::error('Faltan datos requeridos', 400);
                return;
            }
            
            // Iniciar transacción
            $this->conn->beginTransaction();
            
            try {
                // 1. Insertar cotización principal
                $cotizacion_id = $this->insertarCotizacion($data, $user['id']);
                
                // 2. Insertar vuelos si existen
                if (!empty($data['vuelos']) && is_array($data['vuelos'])) {
                    foreach ($data['vuelos'] as $vuelo) {
                        $this->insertarVuelo($cotizacion_id, $vuelo);
                    }
                }
                
                // 3. Insertar hoteles si existen
                if (!empty($data['hoteles']) && is_array($data['hoteles'])) {
                    foreach ($data['hoteles'] as $hotel) {
                        $this->insertarHotel($cotizacion_id, $hotel);
                    }
                }
                
                // 4. Insertar transportes si existen
                if (!empty($data['transportes']) && is_array($data['transportes'])) {
                    foreach ($data['transportes'] as $transporte) {
                        $this->insertarTransporte($cotizacion_id, $transporte);
                    }
                }
                
                // 5. Insertar tours si existen
                if (!empty($data['tours']) && is_array($data['tours'])) {
                    foreach ($data['tours'] as $tour) {
                        $this->insertarTour($cotizacion_id, $tour);
                    }
                }
                
                // 6. Insertar seguros si existen
                if (!empty($data['seguros']) && is_array($data['seguros'])) {
                    foreach ($data['seguros'] as $seguro) {
                        $this->insertarSeguro($cotizacion_id, $seguro);
                    }
                }
                
                // 7. Vincular pasajeros si existen
                if (!empty($data['pasajeros_ids']) && is_array($data['pasajeros_ids'])) {
                    foreach ($data['pasajeros_ids'] as $pasajero_id) {
                        $this->vincularPasajero($cotizacion_id, $pasajero_id);
                    }
                }
                
                // 8. Calcular y crear comisión
                $this->calcularYCrearComision($cotizacion_id, $user['id']);
                
                // Commit de la transacción
                $this->conn->commit();
                
                // Obtener la cotización completa creada
                $cotizacion_creada = $this->obtenerCotizacionCompleta($cotizacion_id);
                
                Response::success($cotizacion_creada, 'Cotización creada exitosamente', 201);
                
            } catch (Exception $e) {
                $this->conn->rollBack();
                throw $e;
            }
            
        } catch (Exception $e) {
            Response::error('Error al crear cotización: ' . $e->getMessage(), 500);
        }
    }
    
    /**
     * PUT /cotizaciones/{id}
     * Actualizar una cotización existente
     */
    public function update($id) {
        try {
            $user = Auth::requireAuth();
            $data = json_decode(file_get_contents('php://input'), true);
            
            // Verificar que la cotización existe y pertenece al usuario
            $sql = "SELECT * FROM cotizaciones WHERE id = :id";
            if ($user['rol'] === 'agente') {
                $sql .= " AND agente_id = :agente_id";
            }
            
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':id', $id);
            if ($user['rol'] === 'agente') {
                $stmt->bindParam(':agente_id', $user['id']);
            }
            $stmt->execute();
            
            $cotizacion = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$cotizacion) {
                Response::error('Cotización no encontrada o sin permisos', 404);
                return;
            }
            
            // Actualizar campos básicos
            $sql = "UPDATE cotizaciones SET
                    origen = :origen,
                    destino = :destino,
                    fecha_salida = :fecha_salida,
                    fecha_regreso = :fecha_regreso,
                    descripcion_general = :descripcion_general,
                    notas_internas = :notas_internas,
                    estado = :estado,
                    fecha_modificacion = NOW()
                    WHERE id = :id";
            
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':origen', $data['origen']);
            $stmt->bindParam(':destino', $data['destino']);
            $stmt->bindParam(':fecha_salida', $data['fecha_salida']);
            $stmt->bindParam(':fecha_regreso', $data['fecha_regreso']);
            $stmt->bindParam(':descripcion_general', $data['descripcion_general']);
            $stmt->bindParam(':notas_internas', $data['notas_internas']);
            $stmt->bindParam(':estado', $data['estado']);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            
            Response::success(['id' => $id], 'Cotización actualizada exitosamente');
            
        } catch (Exception $e) {
            Response::error('Error al actualizar cotización: ' . $e->getMessage(), 500);
        }
    }
    
    /**
     * DELETE /cotizaciones/{id}
     * Eliminar (cancelar) una cotización
     */
    public function delete($id) {
        try {
            $user = Auth::requireAuth();
            
            // Verificar que existe y pertenece al usuario
            $sql = "SELECT * FROM cotizaciones WHERE id = :id";
            if ($user['rol'] === 'agente') {
                $sql .= " AND agente_id = :agente_id";
            }
            
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':id', $id);
            if ($user['rol'] === 'agente') {
                $stmt->bindParam(':agente_id', $user['id']);
            }
            $stmt->execute();
            
            $cotizacion = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$cotizacion) {
                Response::error('Cotización no encontrada o sin permisos', 404);
                return;
            }
            
            // Soft delete - cambiar estado a cancelada
            $sql = "UPDATE cotizaciones SET estado = 'cancelada', fecha_modificacion = NOW() WHERE id = :id";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            
            Response::success(['id' => $id], 'Cotización cancelada exitosamente');
            
        } catch (Exception $e) {
            Response::error('Error al eliminar cotización: ' . $e->getMessage(), 500);
        }
    }
    
    // ==========================================
    // MÉTODOS PRIVADOS (continúan igual)
    // ==========================================
    
    /**
     * Insertar cotización principal
     * Ahora confía en los totales calculados por el frontend
     */
    private function insertarCotizacion($data, $agente_id) {
        // Generar folio único
        $folio = $this->generarFolio();
        
        // Calcular número de noches (esto sí lo dejamos en el backend)
        $fecha_salida_dt = new DateTime($data['fecha_salida']);
        $fecha_regreso_dt = new DateTime($data['fecha_regreso']);
        $num_noches = $fecha_salida_dt->diff($fecha_regreso_dt)->days;
        
        // --- USAR DATOS DEL PAYLOAD DIRECTAMENTE ---
        $costo_vuelos = $data['costo_vuelos'] ?? 0;
        $costo_hoteles = $data['costo_hoteles'] ?? 0;
        $costo_transportes = $data['costo_transportes'] ?? 0;
        $costo_tours = $data['costo_tours'] ?? 0;
        $costo_seguros = $data['costo_seguros'] ?? 0;
        $otros_costos = $data['otros_costos'] ?? 0;
        $costo_total = $data['costo_total'] ?? 0;
        $utilidad = $data['utilidad'] ?? 0;
        $precio_venta_final = $data['precio_venta_final'] ?? 0;
        $monto_comision = $data['monto_comision'] ?? 0;
        
        // (El backend aún puede calcular el porcentaje si lo necesita para reportes)
        $porcentaje_comision = ($precio_venta_final > 0) ? ($monto_comision / $precio_venta_final) * 100 : 0;
        
        $sql = "INSERT INTO cotizaciones (
                    folio, cliente_id, agente_id, origen, destino,
                    fecha_salida, fecha_regreso, num_noches,
                    tipo_viaje, num_adultos, num_ninos, num_infantes, 
                    num_pasajeros_total,  -- ¡CAMPO AÑADIDO!
                    descripcion_general, notas_internas,
                    costo_vuelos, costo_hoteles, costo_transportes,
                    costo_tours, costo_seguros, otros_costos, costo_total,
                    utilidad, precio_venta_final,
                    porcentaje_comision, monto_comision, 
                    estado, estado_pago,
                    fecha_creacion, fecha_modificacion -- ¡CAMPOS AÑADIDOS!
                ) VALUES (
                    :folio, :cliente_id, :agente_id, :origen, :destino,
                    :fecha_salida, :fecha_regreso, :num_noches,
                    :tipo_viaje, :num_adultos, :num_ninos, :num_infantes,
                    :num_pasajeros_total, -- ¡CAMPO AÑADIDO!
                    :descripcion_general, :notas_internas,
                    :costo_vuelos, :costo_hoteles, :costo_transportes,
                    :costo_tours, :costo_seguros, :otros_costos, :costo_total,
                    :utilidad, :precio_venta_final,
                    :porcentaje_comision, :monto_comision, 
                    'cotizacion', 'pendiente',
                    NOW(), NOW() -- ¡CAMPOS AÑADIDOS!
                )";
        
        $stmt = $this->conn->prepare($sql);
        
        // Asignar valores desde $data
        $tipo_viaje = $data['tipo_viaje'] ?? 'individual';
        $num_adultos = $data['num_adultos'] ?? 0;
        $num_ninos = $data['num_ninos'] ?? 0;
        $num_infantes = $data['num_infantes'] ?? 0;
        $num_pasajeros_total = $data['num_pasajeros_total'] ?? 0; // ¡CAMPO AÑADIDO!
        $descripcion = $data['descripcion_general'] ?? '';
        $notas = $data['notas_internas'] ?? '';
        
        $stmt->bindParam(':folio', $folio);
        $stmt->bindParam(':cliente_id', $data['cliente_id']);
        $stmt->bindParam(':agente_id', $agente_id);
        $stmt->bindParam(':origen', $data['origen']);
        $stmt->bindParam(':destino', $data['destino']);
        $stmt->bindParam(':fecha_salida', $data['fecha_salida']);
        $stmt->bindParam(':fecha_regreso', $data['fecha_regreso']);
        $stmt->bindParam(':num_noches', $num_noches);
        $stmt->bindParam(':tipo_viaje', $tipo_viaje);
        $stmt->bindParam(':num_adultos', $num_adultos);
        $stmt->bindParam(':num_ninos', $num_ninos);
        $stmt->bindParam(':num_infantes', $num_infantes);
        $stmt->bindParam(':num_pasajeros_total', $num_pasajeros_total); // ¡CAMPO AÑADIDO!
        $stmt->bindParam(':descripcion_general', $descripcion);
        $stmt->bindParam(':notas_internas', $notas);
        $stmt->bindParam(':costo_vuelos', $costo_vuelos);
        $stmt->bindParam(':costo_hoteles', $costo_hoteles);
        $stmt->bindParam(':costo_transportes', $costo_transportes);
        $stmt->bindParam(':costo_tours', $costo_tours);
        $stmt->bindParam(':costo_seguros', $costo_seguros);
        $stmt->bindParam(':otros_costos', $otros_costos);
        $stmt->bindParam(':costo_total', $costo_total);
        $stmt->bindParam(':utilidad', $utilidad);
        $stmt->bindParam(':precio_venta_final', $precio_venta_final);
        $stmt->bindParam(':porcentaje_comision', $porcentaje_comision);
        $stmt->bindParam(':monto_comision', $monto_comision);
                
        $stmt->execute();
        
        return $this->conn->lastInsertId();
    }
    
    // REEMPLAZA ESTAS 5 FUNCIONES (Líneas 473-657)

    /**
     * Insertar vuelo - CORREGIDO para tabla real (con precios y utilidad)
     */
    /**
     * Insertar vuelo - ACTUALIZADO CON REDONDO Y ESCALAS
     */
    private function insertarVuelo($cotizacion_id, $vuelo) {
        // Mantenemos 'ruta' como un resumen visual rápido
        $ruta = ($vuelo['origen'] ?? '') . ($vuelo['tipo_vuelo'] === 'redondo' ? ' ⇄ ' : ' → ') . ($vuelo['destino'] ?? '');
        
        $sql = "INSERT INTO cotizacion_vuelos (
                    cotizacion_id, tipo_vuelo, clase, num_pasajeros,
                    -- DATOS IDA
                    aerolinea, numero_vuelo, origen, destino, ruta,
                    fecha_salida, hora_salida, fecha_llegada, hora_llegada,
                    tiene_escala_ida, lugar_escala_ida, duracion_escala_ida,
                    -- DATOS REGRESO
                    aerolinea_regreso, numero_vuelo_regreso, origen_regreso, destino_regreso,
                    fecha_regreso, hora_regreso, fecha_regreso_llegada, hora_regreso_llegada,
                    tiene_escala_regreso, lugar_escala_regreso, duracion_escala_regreso,
                    -- COSTOS Y EXTRAS
                    costo_unitario, costo_total, precio_venta_unitario, precio_venta_total,
                    comision_vuelo, utilidad, notas,
                    incluye_equipaje_mano, incluye_equipaje_documentado,
                    kg_equipaje_documentado, piezas_equipaje_documentado,
                    incluye_seleccion_asiento, incluye_tua
                ) VALUES (
                    :cotizacion_id, :tipo_vuelo, :clase, :num_pasajeros,
                    -- IDA
                    :aerolinea, :numero_vuelo, :origen, :destino, :ruta,
                    :fecha_salida, :hora_salida, :fecha_llegada, :hora_llegada,
                    :tiene_escala_ida, :lugar_escala_ida, :duracion_escala_ida,
                    -- REGRESO
                    :aerolinea_regreso, :numero_vuelo_regreso, :origen_regreso, :destino_regreso,
                    :fecha_regreso, :hora_regreso, :fecha_regreso_llegada, :hora_regreso_llegada,
                    :tiene_escala_regreso, :lugar_escala_regreso, :duracion_escala_regreso,
                    -- COSTOS
                    :costo_unitario, :costo_total, :precio_venta_unitario, :precio_venta_total,
                    :comision_vuelo, :utilidad, :notas,
                    :incluye_equipaje_mano, :incluye_equipaje_documentado,
                    :kg_equipaje_documentado, :piezas_equipaje_documentado,
                    :incluye_seleccion_asiento, :incluye_tua
                )";
        
        $stmt = $this->conn->prepare($sql);
        
        $stmt->bindValue(':cotizacion_id', $cotizacion_id);
        $stmt->bindValue(':tipo_vuelo', $vuelo['tipo_vuelo'] ?? 'sencillo');
        $stmt->bindValue(':clase', $vuelo['clase'] ?? 'economica');
        $stmt->bindValue(':num_pasajeros', $vuelo['cantidad_pasajeros'] ?? 1);

        // --- IDA ---
        $stmt->bindValue(':aerolinea', $vuelo['aerolinea'] ?? null);
        $stmt->bindValue(':numero_vuelo', $vuelo['numero_vuelo'] ?? null);
        $stmt->bindValue(':origen', $vuelo['origen'] ?? null);
        $stmt->bindValue(':destino', $vuelo['destino'] ?? null);
        $stmt->bindValue(':ruta', $ruta);
        $stmt->bindValue(':fecha_salida', $vuelo['fecha_salida'] ?? null);
        $stmt->bindValue(':hora_salida', $vuelo['hora_salida'] ?? null);
        $stmt->bindValue(':fecha_llegada', $vuelo['fecha_llegada'] ?? null);
        $stmt->bindValue(':hora_llegada', $vuelo['hora_llegada'] ?? null);
        $stmt->bindValue(':tiene_escala_ida', !empty($vuelo['tiene_escala_ida']) ? 1 : 0);
        $stmt->bindValue(':lugar_escala_ida', $vuelo['lugar_escala_ida'] ?? null);
        $stmt->bindValue(':duracion_escala_ida', $vuelo['duracion_escala_ida'] ?? null);

        // --- REGRESO ---
        $stmt->bindValue(':aerolinea_regreso', $vuelo['aerolinea_regreso'] ?? null);
        $stmt->bindValue(':numero_vuelo_regreso', $vuelo['numero_vuelo_regreso'] ?? null);
        $stmt->bindValue(':origen_regreso', $vuelo['origen_regreso'] ?? null);
        $stmt->bindValue(':destino_regreso', $vuelo['destino_regreso'] ?? null);
        $stmt->bindValue(':fecha_regreso', $vuelo['fecha_regreso'] ?? null);
        $stmt->bindValue(':hora_regreso', $vuelo['hora_regreso'] ?? null);
        $stmt->bindValue(':fecha_regreso_llegada', $vuelo['fecha_regreso_llegada'] ?? null);
        $stmt->bindValue(':hora_regreso_llegada', $vuelo['hora_regreso_llegada'] ?? null);
        $stmt->bindValue(':tiene_escala_regreso', !empty($vuelo['tiene_escala_regreso']) ? 1 : 0);
        $stmt->bindValue(':lugar_escala_regreso', $vuelo['lugar_escala_regreso'] ?? null);
        $stmt->bindValue(':duracion_escala_regreso', $vuelo['duracion_escala_regreso'] ?? null);

        // --- COSTOS ---
        $stmt->bindValue(':costo_unitario', $vuelo['costo_unitario'] ?? 0);
        $stmt->bindValue(':costo_total', $vuelo['costo_total'] ?? 0);
        $stmt->bindValue(':precio_venta_unitario', ($vuelo['costo_unitario'] ?? 0) + ($vuelo['comision_vuelo'] ?? 0));
        $stmt->bindValue(':precio_venta_total', $vuelo['total_con_comision'] ?? 0);
        $stmt->bindValue(':comision_vuelo', $vuelo['comision_vuelo'] ?? 0);
        $stmt->bindValue(':utilidad', ($vuelo['comision_vuelo'] ?? 0) * ($vuelo['cantidad_pasajeros'] ?? 1));
        $stmt->bindValue(':notas', $vuelo['notas'] ?? '');

        // --- EXTRAS ---
        $stmt->bindValue(':incluye_equipaje_mano', !empty($vuelo['incluye_equipaje_mano']) ? 1 : 0);
        $stmt->bindValue(':incluye_equipaje_documentado', !empty($vuelo['incluye_equipaje_documentado']) ? 1 : 0);
        $stmt->bindValue(':kg_equipaje_documentado', $vuelo['kg_equipaje_documentado'] ?? 0);
        $stmt->bindValue(':piezas_equipaje_documentado', $vuelo['piezas_equipaje_documentado'] ?? 0);
        $stmt->bindValue(':incluye_seleccion_asiento', !empty($vuelo['incluye_seleccion_asiento']) ? 1 : 0);
        $stmt->bindValue(':incluye_tua', !empty($vuelo['incluye_tua']) ? 1 : 0);
        
        $stmt->execute();
    }
    
    /**
     * Insertar hotel - CORREGIDO para tabla real (con precios y utilidad)
     */
    private function insertarHotel($cotizacion_id, $hotel) {
        $sql = "INSERT INTO cotizacion_hoteles (
                    cotizacion_id, nombre_hotel, destino,
                    tipo_habitacion,
                    fecha_checkin, fecha_checkout,
                    num_noches, num_habitaciones, num_personas,
                    plan_alimentacion,
                    costo_por_noche, costo_total,
                    precio_venta_por_noche, precio_venta_total, -- AÑADIDOS
                    precio_venta_por_persona, comision_hotel, utilidad, notas -- AÑADIDOS
                ) VALUES (
                    :cotizacion_id, :nombre_hotel, :destino,
                    :tipo_habitacion,
                    :fecha_checkin, :fecha_checkout,
                    :num_noches, :num_habitaciones, :num_personas,
                    :plan_alimentacion,
                    :costo_por_noche, :costo_total,
                    :precio_venta_por_noche, :precio_venta_total, -- AÑADIDOS
                    :precio_venta_por_persona, :comision_hotel, :utilidad, :notas -- AÑADIDOS
                )";
        
        $stmt = $this->conn->prepare($sql);
        
        $stmt->bindParam(':cotizacion_id', $cotizacion_id);
        $stmt->bindParam(':nombre_hotel', $hotel['nombre_hotel']);
        $stmt->bindParam(':destino', $hotel['destino']);
        $stmt->bindParam(':tipo_habitacion', $hotel['tipo_habitacion']);
        $stmt->bindParam(':fecha_checkin', $hotel['fecha_checkin']);
        $stmt->bindParam(':fecha_checkout', $hotel['fecha_checkout']);
        $stmt->bindParam(':num_noches', $hotel['num_noches']);
        $stmt->bindParam(':num_habitaciones', $hotel['num_habitaciones']);
        $stmt->bindParam(':num_personas', $hotel['num_personas']);
        $stmt->bindParam(':plan_alimentacion', $hotel['plan_alimentacion']);
        $stmt->bindParam(':costo_por_noche', $hotel['costo_por_noche']);
        $stmt->bindParam(':costo_total', $hotel['costo_total']);
        $stmt->bindParam(':precio_venta_por_noche', $hotel['precio_venta_por_noche']);
        $stmt->bindParam(':precio_venta_total', $hotel['precio_venta_total']);
        $stmt->bindParam(':precio_venta_por_persona', $hotel['precio_venta_por_persona']);
        $stmt->bindParam(':comision_hotel', $hotel['comision_hotel']);
        $stmt->bindParam(':utilidad', $hotel['utilidad']);
        $stmt->bindParam(':notas', $hotel['notas']);
        
        $stmt->execute();
    }
    
    /**
     * Insertar transporte - CORREGIDO para tabla real (con precios y utilidad)
     */
    private function insertarTransporte($cotizacion_id, $transporte) {
        $sql = "INSERT INTO cotizacion_transportes (
                    cotizacion_id, tipo_transporte, proveedor,
                    origen, destino,
                    fecha_servicio, num_pasajeros, num_dias,
                    costo_total,
                    precio_venta_total, comision_transporte, utilidad, notas -- AÑADIDOS
                ) VALUES (
                    :cotizacion_id, :tipo_transporte, :proveedor,
                    :origen, :destino,
                    :fecha_servicio, :num_pasajeros, :num_dias,
                    :costo_total,
                    :precio_venta_total, :comision_transporte, :utilidad, :notas -- AÑADIDOS
                )";
        
        $stmt = $this->conn->prepare($sql);
        
        $stmt->bindParam(':cotizacion_id', $cotizacion_id);
        $stmt->bindParam(':tipo_transporte', $transporte['tipo_transporte']);
        $stmt->bindParam(':proveedor', $transporte['proveedor']);
        $stmt->bindParam(':origen', $transporte['origen']);
        $stmt->bindParam(':destino', $transporte['destino']);
        $stmt->bindParam(':fecha_servicio', $transporte['fecha_servicio']);
        $stmt->bindParam(':num_pasajeros', $transporte['num_pasajeros']);
        $stmt->bindParam(':num_dias', $transporte['num_dias']);
        $stmt->bindParam(':costo_total', $transporte['costo_total']);
        $stmt->bindParam(':precio_venta_total', $transporte['precio_venta_total']);
        $stmt->bindParam(':comision_transporte', $transporte['comision_transporte']);
        $stmt->bindParam(':utilidad', $transporte['utilidad']);
        $stmt->bindParam(':notas', $transporte['notas']);
        
        $stmt->execute();
    }
    
    /**
     * Insertar tour - CORREGIDO para tabla real (con precios y utilidad)
     */
    private function insertarTour($cotizacion_id, $tour) {
        $sql = "INSERT INTO cotizacion_tours (
                    cotizacion_id, nombre_tour, proveedor,
                    destino, fecha_tour, duracion,
                    num_personas, incluye,
                    costo_por_persona, costo_total,
                    precio_venta_por_persona, precio_venta_total, -- AÑADIDOS
                    comision_tour, utilidad, notas -- AÑADIDOS
                ) VALUES (
                    :cotizacion_id, :nombre_tour, :proveedor,
                    :destino, :fecha_tour, :duracion,
                    :num_personas, :incluye,
                    :costo_por_persona, :costo_total,
                    :precio_venta_por_persona, :precio_venta_total, -- AÑADIDOS
                    :comision_tour, :utilidad, :notas -- AÑADIDOS
                )";
        
        $stmt = $this->conn->prepare($sql);
        
        $stmt->bindParam(':cotizacion_id', $cotizacion_id);
        $stmt->bindParam(':nombre_tour', $tour['nombre_tour']);
        $stmt->bindParam(':proveedor', $tour['proveedor']);
        $stmt->bindParam(':destino', $tour['destino']);
		$stmt->bindParam(':fecha_tour', $tour['fecha_tour']);
        $stmt->bindParam(':duracion', $tour['duracion']);
        $stmt->bindParam(':num_personas', $tour['num_personas']); // ¡CORREGIDO!
        $stmt->bindParam(':incluye', $tour['incluye']);
        $stmt->bindParam(':costo_por_persona', $tour['costo_por_persona']);
        $stmt->bindParam(':costo_total', $tour['costo_total']);
        $stmt->bindParam(':precio_venta_por_persona', $tour['precio_venta_por_persona']);
        $stmt->bindParam(':precio_venta_total', $tour['precio_venta_total']);
        $stmt->bindParam(':comision_tour', $tour['comision_tour']);
        $stmt->bindParam(':utilidad', $tour['utilidad']);
        $stmt->bindParam(':notas', $tour['notas']);
        
        $stmt->execute();
    }
    
    /**
     * Insertar seguro - CORREGIDO para tabla real (con precios y utilidad)
     */
    private function insertarSeguro($cotizacion_id, $seguro) {
        $sql = "INSERT INTO cotizacion_seguros (
                    cotizacion_id, aseguradora, tipo_cobertura,
                    fecha_inicio, fecha_fin,
                    num_personas, monto_cobertura,
                    costo_por_persona, costo_total,
                    precio_venta_por_persona, precio_venta_total, -- AÑADIDOS
                    comision, utilidad, notas -- AÑADIDOS
                ) VALUES (
                    :cotizacion_id, :aseguradora, :tipo_cobertura,
                    :fecha_inicio, :fecha_fin,
                    :num_personas, :monto_cobertura,
                    :costo_por_persona, :costo_total,
                    :precio_venta_por_persona, :precio_venta_total, -- AÑADIDOS
                    :comision, :utilidad, :notas -- AÑADIDOS
                )";
        
        $stmt = $this->conn->prepare($sql);
        
        $stmt->bindParam(':cotizacion_id', $cotizacion_id);
        $stmt->bindParam(':aseguradora', $seguro['aseguradora']);
        $stmt->bindParam(':tipo_cobertura', $seguro['tipo_cobertura']);
        $stmt->bindParam(':fecha_inicio', $seguro['fecha_inicio']);
        $stmt->bindParam(':fecha_fin', $seguro['fecha_fin']);
        $stmt->bindParam(':num_personas', $seguro['num_personas']);
        $stmt->bindParam(':monto_cobertura', $seguro['monto_cobertura']);
        $stmt->bindParam(':costo_por_persona', $seguro['costo_por_persona']);
        $stmt->bindParam(':costo_total', $seguro['costo_total']);
        $stmt->bindParam(':precio_venta_por_persona', $seguro['precio_venta_por_persona']);
        $stmt->bindParam(':precio_venta_total', $seguro['precio_venta_total']);
        $stmt->bindParam(':comision', $seguro['comision']);
        $stmt->bindParam(':utilidad', $seguro['utilidad']);
        $stmt->bindParam(':notas', $seguro['notas']);
        
        $stmt->execute();
    }
    
    /**
     * Vincular pasajero
     */
    private function vincularPasajero($cotizacion_id, $pasajero_id) {
        $sql = "INSERT INTO cotizacion_pasajeros (cotizacion_id, pasajero_id) VALUES (:cotizacion_id, :pasajero_id)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':cotizacion_id', $cotizacion_id);
        $stmt->bindParam(':pasajero_id', $pasajero_id);
        $stmt->execute();
    }
    
    /**
     * Calcular y crear comisión
     */
    private function calcularYCrearComision($cotizacion_id, $agente_id) {
        // Obtener datos de la cotización
        $sql = "SELECT precio_venta_final, porcentaje_comision, monto_comision FROM cotizaciones WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id', $cotizacion_id);
        $stmt->execute();
        $cotizacion = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Calcular ventas del mes del agente
        $mes = date('m');
        $anio = date('Y');
        
        $sql_ventas = "SELECT COALESCE(SUM(precio_venta_final), 0) as total
                       FROM cotizaciones
                       WHERE agente_id = :agente_id
                       AND MONTH(fecha_creacion) = :mes
                       AND YEAR(fecha_creacion) = :anio
                       AND estado IN ('reservacion', 'completada')";
        
        $stmt_ventas = $this->conn->prepare($sql_ventas);
        $stmt_ventas->bindParam(':agente_id', $agente_id);
        $stmt_ventas->bindParam(':mes', $mes);
        $stmt_ventas->bindParam(':anio', $anio);
        $stmt_ventas->execute();
        $ventas = $stmt_ventas->fetch(PDO::FETCH_ASSOC);
        $ventas_mes_total = $ventas['total'];
        
        // Insertar en comisiones_agentes
        $sql_comision = "INSERT INTO comisiones_agentes (
                            agente_id, cotizacion_id, mes, anio,
                            monto_venta, ventas_mes_total, porcentaje_comision,
                            monto_comision, estado_viaje, pagado, fecha_creacion
                         ) VALUES (
                            :agente_id, :cotizacion_id, :mes, :anio,
                            :monto_venta, :ventas_mes_total, :porcentaje_comision,
                            :monto_comision, 'pendiente', 0, NOW()
                         )";
        
        $stmt_com = $this->conn->prepare($sql_comision);
        $stmt_com->bindParam(':agente_id', $agente_id);
        $stmt_com->bindParam(':cotizacion_id', $cotizacion_id);
        $stmt_com->bindParam(':mes', $mes);
        $stmt_com->bindParam(':anio', $anio);
        $stmt_com->bindParam(':monto_venta', $cotizacion['precio_venta_final']);
        $stmt_com->bindParam(':ventas_mes_total', $ventas_mes_total);
        $stmt_com->bindParam(':porcentaje_comision', $cotizacion['porcentaje_comision']);
        $stmt_com->bindParam(':monto_comision', $cotizacion['monto_comision']);
        $stmt_com->execute();
    }
    
    /**
     * Obtener porcentaje de comisión según rangos
     */
    private function obtenerPorcentajeComision($monto_venta) {
        $sql = "SELECT porcentaje_comision 
                FROM config_comisiones
                WHERE :monto >= rango_minimo
                AND (:monto <= rango_maximo OR rango_maximo IS NULL)
                AND activo = 1
                ORDER BY rango_minimo DESC
                LIMIT 1";
        
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':monto', $monto_venta);
        $stmt->execute();
        
        $config = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return $config ? $config['porcentaje_comision'] : 20.00;
    }
    
    /**
     * Generar folio único
     */
    private function generarFolio() {
        $anio = date('Y');
        
        $sql = "SELECT folio FROM cotizaciones 
                WHERE folio LIKE :patron 
                ORDER BY id DESC LIMIT 1";
        
        $patron = "CTZ-{$anio}-%";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':patron', $patron);
        $stmt->execute();
        
        $ultimo = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($ultimo) {
            $partes = explode('-', $ultimo['folio']);
            $numero = intval($partes[2]) + 1;
        } else {
            $numero = 1;
        }
        
        return sprintf('CTZ-%s-%03d', $anio, $numero);
    }
    
    private function calcularCostoVuelos($vuelos) {
        $total = 0;
        foreach ($vuelos as $vuelo) {
            $total += $vuelo['costo_total'] ?? 0;
        }
        return $total;
    }
    
    private function calcularCostoHoteles($hoteles) {
        $total = 0;
        foreach ($hoteles as $hotel) {
            $total += $hotel['costo_total'] ?? 0;
        }
        return $total;
    }
    
    private function calcularCostoTransportes($transportes) {
        $total = 0;
        foreach ($transportes as $transporte) {
            $total += $transporte['costo_total'] ?? 0;
        }
        return $total;
    }
    
    private function calcularCostoTours($tours) {
        $total = 0;
        foreach ($tours as $tour) {
            $total += $tour['costo_total'] ?? 0;
        }
        return $total;
    }
    
    private function calcularCostoSeguros($seguros) {
        $total = 0;
        foreach ($seguros as $seguro) {
            $total += $seguro['costo_total'] ?? 0;
        }
        return $total;
    }
    
    private function obtenerVuelos($cotizacion_id) {
        $sql = "SELECT * FROM cotizacion_vuelos WHERE cotizacion_id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id', $cotizacion_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    private function obtenerHoteles($cotizacion_id) {
        $sql = "SELECT * FROM cotizacion_hoteles WHERE cotizacion_id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id', $cotizacion_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    private function obtenerTransportes($cotizacion_id) {
        $sql = "SELECT * FROM cotizacion_transportes WHERE cotizacion_id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id', $cotizacion_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    private function obtenerTours($cotizacion_id) {
        $sql = "SELECT * FROM cotizacion_tours WHERE cotizacion_id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id', $cotizacion_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    private function obtenerSeguros($cotizacion_id) {
        $sql = "SELECT * FROM cotizacion_seguros WHERE cotizacion_id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id', $cotizacion_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    private function obtenerPasajeros($cotizacion_id) {
        $sql = "SELECT p.* 
                FROM pasajeros p
                INNER JOIN cotizacion_pasajeros cp ON p.id = cp.pasajero_id
                WHERE cp.cotizacion_id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id', $cotizacion_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    private function obtenerCotizacionCompleta($id) {
        $sql = "SELECT c.*, 
                CONCAT(cl.nombre, ' ', cl.apellido) as cliente_nombre,
                CONCAT(u.nombre, ' ', u.apellido) as agente_nombre
                FROM cotizaciones c
                LEFT JOIN clientes cl ON c.cliente_id = cl.id
                LEFT JOIN usuarios u ON c.agente_id = u.id
                WHERE c.id = :id";
        
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $cotizacion = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($cotizacion) {
            $cotizacion['vuelos'] = $this->obtenerVuelos($id);
            $cotizacion['hoteles'] = $this->obtenerHoteles($id);
            $cotizacion['transportes'] = $this->obtenerTransportes($id);
            $cotizacion['tours'] = $this->obtenerTours($id);
            $cotizacion['seguros'] = $this->obtenerSeguros($id);
        }
        
        return $cotizacion;
    }
}