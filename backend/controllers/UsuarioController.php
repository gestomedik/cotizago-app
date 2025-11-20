<?php
require_once __DIR__ . '/../core/Response.php';

class UsuarioController {
    private $conn;

    public function __construct($db) {
        // $db ya es la conexión PDO directa desde index.php
        $this->conn = $db;
    }

    public function list() {
        try {
            // Seleccionamos campos. Aseguramos que 'permisos' exista o lo manejamos.
            $sql = "SELECT id, nombre, apellido, email, telefono, fecha_nacimiento, rol, activo, ultimo_acceso, permisos FROM usuarios ORDER BY nombre ASC";
            $stmt = $this->conn->query($sql);
            $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            foreach ($usuarios as &$user) {
                $user['activo'] = $user['activo'] == 1;
                // Manejo seguro de json_decode para permisos
                $permisos = $user['permisos'] ?? '{}';
                $user['permisos'] = json_decode($permisos, true);
                if (json_last_error() !== JSON_ERROR_NONE) {
                    $user['permisos'] = []; // Fallback si el JSON es inválido
                }
            }

            Response::success($usuarios);
        } catch (Exception $e) {
            Response::error('Error al listar usuarios: ' . $e->getMessage());
        }
    }

    public function get($id) {
        try {
            $stmt = $this->conn->prepare("SELECT id, nombre, apellido, email, telefono, fecha_nacimiento, rol, activo, permisos FROM usuarios WHERE id = :id");
            $stmt->bindValue(':id', $id);
            $stmt->execute();
            $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$usuario) {
                Response::error('Usuario no encontrado', 404);
                return;
            }

            $usuario['activo'] = $usuario['activo'] == 1;
            $permisos = $usuario['permisos'] ?? '{}';
            $usuario['permisos'] = json_decode($permisos, true);

            Response::success($usuario);
        } catch (Exception $e) {
            Response::error('Error al obtener usuario: ' . $e->getMessage());
        }
    }

    public function create() {
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (empty($data['nombre']) || empty($data['apellido']) || empty($data['email']) || empty($data['password'])) {
                Response::error('Nombre, apellido, email y contraseña son obligatorios', 400);
                return;
            }

            // Verificar email duplicado
            $stmtCheck = $this->conn->prepare("SELECT id FROM usuarios WHERE email = :email");
            $stmtCheck->execute([':email' => $data['email']]);
            if ($stmtCheck->fetch()) {
                Response::error('El email ya está registrado', 409);
                return;
            }

            $sql = "INSERT INTO usuarios (nombre, apellido, email, password, telefono, fecha_nacimiento, rol, activo, permisos, fecha_registro) 
                    VALUES (:nombre, :apellido, :email, :password, :telefono, :fecha_nacimiento, :rol, :activo, :permisos, NOW())";
            
            $stmt = $this->conn->prepare($sql);
            
            $stmt->bindValue(':nombre', $data['nombre']);
            $stmt->bindValue(':apellido', $data['apellido']);
            $stmt->bindValue(':email', $data['email']);
            $stmt->bindValue(':password', password_hash($data['password'], PASSWORD_DEFAULT));
            $stmt->bindValue(':telefono', $data['telefono'] ?? null);
            $stmt->bindValue(':fecha_nacimiento', !empty($data['fecha_nacimiento']) ? $data['fecha_nacimiento'] : null);
            $stmt->bindValue(':rol', $data['rol'] ?? 'Agente');
            $stmt->bindValue(':activo', isset($data['activo']) ? ($data['activo'] ? 1 : 0) : 1);
            $stmt->bindValue(':permisos', isset($data['permisos']) ? json_encode($data['permisos']) : '{}');

            $stmt->execute();
            $id = $this->conn->lastInsertId();

            Response::created(['id' => $id], 'Usuario creado correctamente');
        } catch (Exception $e) {
            Response::error('Error al crear usuario: ' . $e->getMessage());
        }
    }

    public function update($id) {
        try {
            $data = json_decode(file_get_contents('php://input'), true);

            if (empty($data['nombre']) || empty($data['apellido']) || empty($data['email'])) {
                Response::error('Nombre, apellido y email son obligatorios', 400);
                return;
            }

            // Verificar email duplicado (excluyendo el usuario actual)
            $stmtCheck = $this->conn->prepare("SELECT id FROM usuarios WHERE email = :email AND id != :id");
            $stmtCheck->execute([':email' => $data['email'], ':id' => $id]);
            if ($stmtCheck->fetch()) {
                Response::error('El email ya está registrado por otro usuario', 409);
                return;
            }

            $fields = [
                'nombre = :nombre',
                'apellido = :apellido',
                'email = :email',
                'telefono = :telefono',
                'fecha_nacimiento = :fecha_nacimiento',
                'rol = :rol',
                'activo = :activo',
                'permisos = :permisos'
            ];

            if (!empty($data['password'])) {
                $fields[] = 'password = :password';
            }

            $sql = "UPDATE usuarios SET " . implode(', ', $fields) . " WHERE id = :id";
            $stmt = $this->conn->prepare($sql);

            $stmt->bindValue(':nombre', $data['nombre']);
            $stmt->bindValue(':apellido', $data['apellido']);
            $stmt->bindValue(':email', $data['email']);
            $stmt->bindValue(':telefono', $data['telefono'] ?? null);
            $stmt->bindValue(':fecha_nacimiento', !empty($data['fecha_nacimiento']) ? $data['fecha_nacimiento'] : null);
            $stmt->bindValue(':rol', $data['rol']);
            $stmt->bindValue(':activo', $data['activo'] ? 1 : 0);
            $stmt->bindValue(':permisos', isset($data['permisos']) ? json_encode($data['permisos']) : '{}');
            $stmt->bindValue(':id', $id);

            if (!empty($data['password'])) {
                $stmt->bindValue(':password', password_hash($data['password'], PASSWORD_DEFAULT));
            }

            $stmt->execute();
            Response::success(null, 'Usuario actualizado correctamente');
        } catch (Exception $e) {
            Response::error('Error al actualizar usuario: ' . $e->getMessage());
        }
    }

    public function delete($id) {
        try {
            $stmt = $this->conn->prepare("DELETE FROM usuarios WHERE id = :id");
            $stmt->bindValue(':id', $id);
            $stmt->execute();
            Response::success(null, 'Usuario eliminado correctamente');
        } catch (Exception $e) {
             Response::error('Error al eliminar usuario: ' . $e->getMessage());
        }
    }
}