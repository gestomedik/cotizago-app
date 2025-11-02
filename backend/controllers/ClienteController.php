<?php

class ClienteController {
    private $db;
    
    public function __construct($db) {
        $this->db = $db;
    }
    
    /**
     * GET /clientes
     * Listar todos los clientes
     */
    public function index() {
        try {
            // Obtener filtros de query params
            $recurrente = isset($_GET['recurrente']) ? (int)$_GET['recurrente'] : null;
            $search = isset($_GET['search']) ? $_GET['search'] : null;
            
            // Query base
            $query = "SELECT 
                        id,
                        nombre,
                        apellido,
                        email,
                        telefono,
                        telefono_secundario,
                        direccion,
                        ciudad,
                        estado,
                        pais,
                        codigo_postal,
                        es_recurrente,
                        total_viajes,
                        fecha_ultimo_viaje,
                        notas,
                        usuario_registro_id,
                        fecha_registro
                    FROM clientes
                    WHERE 1=1";
            
            $params = [];
            
            // Filtro por recurrente
            if ($recurrente !== null) {
                $query .= " AND es_recurrente = :recurrente";
                $params['recurrente'] = $recurrente;
            }
            
            // Filtro por búsqueda
            if ($search) {
                $query .= " AND (
                    nombre LIKE :search 
                    OR apellido LIKE :search 
                    OR email LIKE :search
                    OR CONCAT(nombre, ' ', apellido) LIKE :search
                )";
                $params['search'] = "%{$search}%";
            }
            
            $query .= " ORDER BY fecha_registro DESC";
            
            $stmt = $this->db->prepare($query);
            $stmt->execute($params);
            $clientes = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Formatear datos
            foreach ($clientes as &$cliente) {
                $cliente['id'] = (int)$cliente['id'];
                $cliente['es_recurrente'] = (int)$cliente['es_recurrente'];
                $cliente['total_viajes'] = (int)$cliente['total_viajes'];
            }
            
            return json_encode([
                'success' => true,
                'data' => $clientes
            ]);
            
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'error' => 'Error al obtener clientes: ' . $e->getMessage()
            ]);
        }
    }
    
    /**
     * GET /clientes/{id}
     * Obtener un cliente específico
     */
    public function show($id) {
        try {
            $query = "SELECT 
                        id,
                        nombre,
                        apellido,
                        email,
                        telefono,
                        telefono_secundario,
                        direccion,
                        ciudad,
                        estado,
                        pais,
                        codigo_postal,
                        es_recurrente,
                        total_viajes,
                        fecha_ultimo_viaje,
                        notas,
                        usuario_registro_id,
                        fecha_registro
                    FROM clientes
                    WHERE id = :id";
            
            $stmt = $this->db->prepare($query);
            $stmt->execute(['id' => $id]);
            $cliente = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$cliente) {
                http_response_code(404);
                return json_encode([
                    'success' => false,
                    'error' => 'Cliente no encontrado'
                ]);
            }
            
            // Formatear datos
            $cliente['id'] = (int)$cliente['id'];
            $cliente['es_recurrente'] = (int)$cliente['es_recurrente'];
            $cliente['total_viajes'] = (int)$cliente['total_viajes'];
            
            return json_encode([
                'success' => true,
                'data' => $cliente
            ]);
            
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'error' => 'Error al obtener cliente: ' . $e->getMessage()
            ]);
        }
    }
    
    /**
     * POST /clientes
     * Crear un nuevo cliente
     */
    public function create() {
        try {
            // Obtener datos del request
            $data = json_decode(file_get_contents("php://input"), true);
            
            // Validar campos requeridos
            if (empty($data['nombre']) || empty($data['apellido'])) {
                http_response_code(400);
                return json_encode([
                    'success' => false,
                    'error' => 'Nombre y apellido son requeridos'
                ]);
            }
            
            // Verificar si el email ya existe
            if (!empty($data['email'])) {
                $checkQuery = "SELECT id FROM clientes WHERE email = :email";
                $checkStmt = $this->db->prepare($checkQuery);
                $checkStmt->execute(['email' => $data['email']]);
                
                if ($checkStmt->fetch()) {
                    http_response_code(409);
                    return json_encode([
                        'success' => false,
                        'error' => 'El email ya está registrado'
                    ]);
                }
            }
            
            // Obtener el ID del usuario autenticado desde el token
            $headers = getallheaders();
            $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
            $token = str_replace('Bearer ', '', $authHeader);
            
            // Decodificar el token para obtener el user_id
            $tokenParts = explode('.', $token);
            $payload = json_decode(base64_decode($tokenParts[1]), true);
            // Estructura real del token: payload['data']['id']
            $userId = $payload['data']['id'] ?? null;
            
            // Insertar cliente
            $query = "INSERT INTO clientes (
                        nombre,
                        apellido,
                        email,
                        telefono,
                        telefono_secundario,
                        direccion,
                        ciudad,
                        estado,
                        pais,
                        codigo_postal,
                        notas,
                        usuario_registro_id,
                        fecha_registro
                    ) VALUES (
                        :nombre,
                        :apellido,
                        :email,
                        :telefono,
                        :telefono_secundario,
                        :direccion,
                        :ciudad,
                        :estado,
                        :pais,
                        :codigo_postal,
                        :notas,
                        :usuario_registro_id,
                        NOW()
                    )";
            
            $stmt = $this->db->prepare($query);
            $stmt->execute([
                'nombre' => $data['nombre'],
                'apellido' => $data['apellido'],
                'email' => $data['email'] ?? null,
                'telefono' => $data['telefono'] ?? null,
                'telefono_secundario' => $data['telefono_secundario'] ?? null,
                'direccion' => $data['direccion'] ?? null,
                'ciudad' => $data['ciudad'] ?? null,
                'estado' => $data['estado'] ?? null,
                'pais' => $data['pais'] ?? 'México',
                'codigo_postal' => $data['codigo_postal'] ?? null,
                'notas' => $data['notas'] ?? null,
                'usuario_registro_id' => $userId
            ]);
            
            $clienteId = $this->db->lastInsertId();
            
            // Obtener el cliente creado
            $getQuery = "SELECT * FROM clientes WHERE id = :id";
            $getStmt = $this->db->prepare($getQuery);
            $getStmt->execute(['id' => $clienteId]);
            $cliente = $getStmt->fetch(PDO::FETCH_ASSOC);
            
            http_response_code(201);
            return json_encode([
                'success' => true,
                'data' => $cliente,
                'message' => 'Cliente creado exitosamente'
            ]);
            
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'error' => 'Error al crear cliente: ' . $e->getMessage()
            ]);
        }
    }
    
    /**
     * PUT /clientes/{id}
     * Actualizar un cliente
     */
    public function update($id) {
        try {
            // Verificar que el cliente existe
            $checkQuery = "SELECT id FROM clientes WHERE id = :id";
            $checkStmt = $this->db->prepare($checkQuery);
            $checkStmt->execute(['id' => $id]);
            
            if (!$checkStmt->fetch()) {
                http_response_code(404);
                return json_encode([
                    'success' => false,
                    'error' => 'Cliente no encontrado'
                ]);
            }
            
            // Obtener datos del request
            $data = json_decode(file_get_contents("php://input"), true);
            
            // Validar campos requeridos
            if (empty($data['nombre']) || empty($data['apellido'])) {
                http_response_code(400);
                return json_encode([
                    'success' => false,
                    'error' => 'Nombre y apellido son requeridos'
                ]);
            }
            
            // Verificar si el email ya existe (en otro cliente)
            if (!empty($data['email'])) {
                $emailCheckQuery = "SELECT id FROM clientes WHERE email = :email AND id != :id";
                $emailCheckStmt = $this->db->prepare($emailCheckQuery);
                $emailCheckStmt->execute(['email' => $data['email'], 'id' => $id]);
                
                if ($emailCheckStmt->fetch()) {
                    http_response_code(409);
                    return json_encode([
                        'success' => false,
                        'error' => 'El email ya está registrado en otro cliente'
                    ]);
                }
            }
            
            // Actualizar cliente
            $query = "UPDATE clientes SET
                        nombre = :nombre,
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
            
            $stmt = $this->db->prepare($query);
            $stmt->execute([
                'id' => $id,
                'nombre' => $data['nombre'],
                'apellido' => $data['apellido'],
                'email' => $data['email'] ?? null,
                'telefono' => $data['telefono'] ?? null,
                'telefono_secundario' => $data['telefono_secundario'] ?? null,
                'direccion' => $data['direccion'] ?? null,
                'ciudad' => $data['ciudad'] ?? null,
                'estado' => $data['estado'] ?? null,
                'pais' => $data['pais'] ?? 'México',
                'codigo_postal' => $data['codigo_postal'] ?? null,
                'notas' => $data['notas'] ?? null
            ]);
            
            // Obtener el cliente actualizado
            $getQuery = "SELECT * FROM clientes WHERE id = :id";
            $getStmt = $this->db->prepare($getQuery);
            $getStmt->execute(['id' => $id]);
            $cliente = $getStmt->fetch(PDO::FETCH_ASSOC);
            
            return json_encode([
                'success' => true,
                'data' => $cliente,
                'message' => 'Cliente actualizado exitosamente'
            ]);
            
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'error' => 'Error al actualizar cliente: ' . $e->getMessage()
            ]);
        }
    }
    
    /**
     * DELETE /clientes/{id}
     * Eliminar un cliente
     */
    public function delete($id) {
        try {
            // Verificar que el cliente existe
            $checkQuery = "SELECT id FROM clientes WHERE id = :id";
            $checkStmt = $this->db->prepare($checkQuery);
            $checkStmt->execute(['id' => $id]);
            
            if (!$checkStmt->fetch()) {
                http_response_code(404);
                return json_encode([
                    'success' => false,
                    'error' => 'Cliente no encontrado'
                ]);
            }
            
            // Verificar si tiene pasajeros asociados
            $pasajerosQuery = "SELECT COUNT(*) as total FROM pasajeros WHERE cliente_id = :id";
            $pasajerosStmt = $this->db->prepare($pasajerosQuery);
            $pasajerosStmt->execute(['id' => $id]);
            $result = $pasajerosStmt->fetch(PDO::FETCH_ASSOC);
            
            if ($result['total'] > 0) {
                http_response_code(400);
                return json_encode([
                    'success' => false,
                    'error' => 'No se puede eliminar el cliente porque tiene pasajeros asociados'
                ]);
            }
            
            // Eliminar cliente
            $query = "DELETE FROM clientes WHERE id = :id";
            $stmt = $this->db->prepare($query);
            $stmt->execute(['id' => $id]);
            
            return json_encode([
                'success' => true,
                'message' => 'Cliente eliminado exitosamente'
            ]);
            
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'error' => 'Error al eliminar cliente: ' . $e->getMessage()
            ]);
        }
    }
}
