<?php

// =====================================================
// api/controllers/AuthController.php
// =====================================================

class AuthController {
    private $db;
    private $usuarioModel;
    
    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->usuarioModel = new Usuario($this->db);
    }
    
    // Login
    public function login() {
        $data = json_decode(file_get_contents("php://input"), true);
        
        // Validar
        $validator = new Validator();
        $validator->required($data['email'] ?? '', 'email');
        $validator->email($data['email'] ?? '', 'email');
        $validator->required($data['password'] ?? '', 'password');
        
        if ($validator->hasErrors()) {
            Response::validation($validator->getErrors());
        }
        
        // Buscar usuario
        $usuario = $this->usuarioModel->getByEmail($data['email']);
        
        if (!$usuario) {
            Response::error('Credenciales inválidas', 401);
        }
        
        // Verificar contraseña
        if (!Auth::verifyPassword($data['password'], $usuario['password'])) {
            Response::error('Credenciales inválidas', 401);
        }
        
        // Verificar que esté activo
        if (!$usuario['activo']) {
            Response::error('Usuario inactivo', 403);
        }
        
        // Actualizar último acceso
        $this->usuarioModel->updateLastAccess($usuario['id']);
        
        // Generar token
        $token = Auth::generateToken($usuario['id'], $usuario['email'], $usuario['rol']);
        
        Response::success([
            'token' => $token,
            'usuario' => [
                'id' => $usuario['id'],
                'nombre' => $usuario['nombre'],
                'apellido' => $usuario['apellido'],
                'email' => $usuario['email'],
                'rol' => $usuario['rol']
            ]
        ], 'Login exitoso');
    }
    
    // Obtener usuario actual
    public function me() {
        $currentUser = Auth::requireAuth();
        
        $usuario = $this->usuarioModel->getById($currentUser->id);
        
        if (!$usuario) {
            Response::notFound('Usuario no encontrado');
        }
        
        unset($usuario['password']);
        
        Response::success($usuario);
    }
    
    // Logout (opcional, cliente elimina token)
    public function logout() {
        Auth::requireAuth();
        Response::success(null, 'Logout exitoso');
    }
}

?>