<?php
// api/controllers/PasajerosController.php

require_once __DIR__ . '/../core/Response.php';
require_once __DIR__ . '/../core/Auth.php';
//require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../core/Validator.php';

class PasajerosController {
    private $db;
    
    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }
    
    /**
     * GET /pasajeros
     * Listar todos los pasajeros con filtros opcionales
     */
    public function index() {
        try {
            Auth::requireAuth();
            
            // Obtener parámetros de búsqueda
            $cliente_id = isset($_GET['cliente_id']) ? (int)$_GET['cliente_id'] : null;
            $search = isset($_GET['search']) ? trim($_GET['search']) : '';
            
            $query = "
                SELECT 
                    p.id,
                    p.cliente_id,
                    p.nombre,
                    p.apellido,
                    p.fecha_nacimiento,
                    p.edad,
                    p.tipo_pasajero,
                    p.genero,
                    p.tipo_documento,
                    p.numero_documento,
                    p.pais_emision,
                    p.fecha_emision,
                    p.fecha_vencimiento,
                    p.nacionalidad,
                    p.alergias,
                    p.condiciones_medicas,
                    p.contacto_emergencia,
                    p.telefono_emergencia,
                    p.notas,
                    CONCAT(c.nombre, ' ', c.apellido) as cliente_nombre
                FROM pasajeros p
                INNER JOIN clientes c ON p.cliente_id = c.id
                WHERE 1=1
            ";
            
            $params = [];
            
            // Filtro por cliente
            if ($cliente_id) {
                $query .= " AND p.cliente_id = ?";
                $params[] = $cliente_id;
            }
            
            // Filtro de búsqueda
            if (!empty($search)) {
                $query .= " AND (p.nombre LIKE ? OR p.apellido LIKE ? OR p.numero_documento LIKE ?)";
                $searchParam = "%{$search}%";
                $params[] = $searchParam;
                $params[] = $searchParam;
                $params[] = $searchParam;
            }
            
            $query .= " ORDER BY c.nombre, p.nombre";
            
            $stmt = $this->db->prepare($query);
            $stmt->execute($params);
            $pasajeros = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Convertir tipos
            foreach ($pasajeros as &$pasajero) {
                $pasajero['id'] = (int)$pasajero['id'];
                $pasajero['cliente_id'] = (int)$pasajero['cliente_id'];
                $pasajero['edad'] = (int)$pasajero['edad'];
            }
            
            Response::success($pasajeros);
            
        } catch (Exception $e) {
            Response::error('Error al obtener pasajeros: ' . $e->getMessage(), 500);
        }
    }
    
    /**
     * GET /pasajeros/:id
     * Obtener un pasajero específico
     */
    public function show($id) {
        try {
            Auth::requireAuth();
            
            $query = "
                SELECT 
                    p.*,
                    CONCAT(c.nombre, ' ', c.apellido) as cliente_nombre
                FROM pasajeros p
                INNER JOIN clientes c ON p.cliente_id = c.id
                WHERE p.id = ?
            ";
            
            $stmt = $this->db->prepare($query);
            $stmt->execute([$id]);
            $pasajero = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$pasajero) {
                Response::notFound('Pasajero no encontrado');
            }
            
            // Convertir tipos
            $pasajero['id'] = (int)$pasajero['id'];
            $pasajero['cliente_id'] = (int)$pasajero['cliente_id'];
            $pasajero['edad'] = (int)$pasajero['edad'];
            
            Response::success($pasajero);
            
        } catch (Exception $e) {
            Response::error('Error al obtener pasajero: ' . $e->getMessage(), 500);
        }
    }
    
    /**
     * POST /pasajeros
     * Crear un nuevo pasajero
     */
    public function store() {
        try {
            Auth::requireAuth();
            
            $data = json_decode(file_get_contents("php://input"), true);
            
            // Validar datos requeridos
            $validator = new Validator();
            $validator->required($data['cliente_id'] ?? '', 'cliente_id');
            $validator->required($data['nombre'] ?? '', 'nombre');
            $validator->required($data['apellido'] ?? '', 'apellido');
            $validator->required($data['fecha_nacimiento'] ?? '', 'fecha_nacimiento');
            $validator->required($data['tipo_pasajero'] ?? '', 'tipo_pasajero');
            $validator->required($data['genero'] ?? '', 'genero');
            
            if ($validator->hasErrors()) {
                Response::validation($validator->getErrors());
            }
            
            // Calcular edad
            $fecha_nac = new DateTime($data['fecha_nacimiento']);
            $hoy = new DateTime();
            $edad = $hoy->diff($fecha_nac)->y;
            
            // Insertar pasajero
            $query = "
                INSERT INTO pasajeros (
                    cliente_id, nombre, apellido, fecha_nacimiento, edad, tipo_pasajero,
                    genero, tipo_documento, numero_documento, pais_emision,
                    fecha_emision, fecha_vencimiento, nacionalidad, alergias,
                    condiciones_medicas, contacto_emergencia, telefono_emergencia, notas
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ";
            
            $stmt = $this->db->prepare($query);
            $stmt->execute([
                $data['cliente_id'],
                $data['nombre'],
                $data['apellido'],
                $data['fecha_nacimiento'],
                $edad,
                $data['tipo_pasajero'],
                $data['genero'],
                $data['tipo_documento'] ?? null,
                $data['numero_documento'] ?? null,
                $data['pais_emision'] ?? null,
                $data['fecha_emision'] ?? null,
                $data['fecha_vencimiento'] ?? null,
                $data['nacionalidad'] ?? 'Mexicana',
                $data['alergias'] ?? null,
                $data['condiciones_medicas'] ?? null,
                $data['contacto_emergencia'] ?? null,
                $data['telefono_emergencia'] ?? null,
                $data['notas'] ?? null
            ]);
            
            $pasajeroId = $this->db->lastInsertId();
            
            // Obtener el pasajero creado
            $stmt = $this->db->prepare("
                SELECT p.*, CONCAT(c.nombre, ' ', c.apellido) as cliente_nombre
                FROM pasajeros p
                INNER JOIN clientes c ON p.cliente_id = c.id
                WHERE p.id = ?
            ");
            $stmt->execute([$pasajeroId]);
            $pasajero = $stmt->fetch(PDO::FETCH_ASSOC);
            
            Response::created($pasajero, 'Pasajero creado exitosamente');
            
        } catch (Exception $e) {
            Response::error('Error al crear pasajero: ' . $e->getMessage(), 500);
        }
    }
    
    /**
     * PUT /pasajeros/:id
     * Actualizar un pasajero existente
     */
    public function update($id) {
        try {
            Auth::requireAuth();
            
            $data = json_decode(file_get_contents("php://input"), true);
            
            // Verificar que el pasajero existe
            $checkQuery = "SELECT id FROM pasajeros WHERE id = ?";
            $checkStmt = $this->db->prepare($checkQuery);
            $checkStmt->execute([$id]);
            
            if (!$checkStmt->fetch()) {
                Response::notFound('Pasajero no encontrado');
            }
            
            // Construir query de actualización dinámico
            $fields = [];
            $values = [];
            
            $allowedFields = [
                'nombre', 'apellido', 'fecha_nacimiento', 'tipo_pasajero', 'genero',
                'tipo_documento', 'numero_documento', 'pais_emision', 'fecha_emision',
                'fecha_vencimiento', 'nacionalidad', 'alergias', 'condiciones_medicas',
                'contacto_emergencia', 'telefono_emergencia', 'notas'
            ];
            
            foreach ($allowedFields as $field) {
                if (isset($data[$field])) {
                    $fields[] = "$field = ?";
                    $values[] = $data[$field];
                }
            }
            
            // Recalcular edad si cambió la fecha de nacimiento
            if (isset($data['fecha_nacimiento'])) {
                $fecha_nac = new DateTime($data['fecha_nacimiento']);
                $hoy = new DateTime();
                $edad = $hoy->diff($fecha_nac)->y;
                $fields[] = "edad = ?";
                $values[] = $edad;
            }
            
            if (empty($fields)) {
                Response::error('No hay datos para actualizar', 400);
            }
            
            $values[] = $id;
            
            $query = "UPDATE pasajeros SET " . implode(', ', $fields) . " WHERE id = ?";
            $stmt = $this->db->prepare($query);
            $stmt->execute($values);
            
            // Obtener el pasajero actualizado
            $stmt = $this->db->prepare("
                SELECT p.*, CONCAT(c.nombre, ' ', c.apellido) as cliente_nombre
                FROM pasajeros p
                INNER JOIN clientes c ON p.cliente_id = c.id
                WHERE p.id = ?
            ");
            $stmt->execute([$id]);
            $pasajero = $stmt->fetch(PDO::FETCH_ASSOC);
            
            Response::updated($pasajero, 'Pasajero actualizado exitosamente');
            
        } catch (Exception $e) {
            Response::error('Error al actualizar pasajero: ' . $e->getMessage(), 500);
        }
    }
    
    /**
     * DELETE /pasajeros/:id
     * Eliminar un pasajero
     */
    public function destroy($id) {
        try {
            Auth::requireAuth();
            
            // Verificar que el pasajero existe
            $checkQuery = "SELECT id FROM pasajeros WHERE id = ?";
            $checkStmt = $this->db->prepare($checkQuery);
            $checkStmt->execute([$id]);
            
            if (!$checkStmt->fetch()) {
                Response::notFound('Pasajero no encontrado');
            }
            
            // Eliminar pasajero
            $query = "DELETE FROM pasajeros WHERE id = ?";
            $stmt = $this->db->prepare($query);
            $stmt->execute([$id]);
            
            Response::deleted('Pasajero eliminado exitosamente');
            
        } catch (Exception $e) {
            Response::error('Error al eliminar pasajero: ' . $e->getMessage(), 500);
        }
    }
}