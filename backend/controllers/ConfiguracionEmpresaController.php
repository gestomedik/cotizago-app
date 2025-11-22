<?php

// =====================================================
// api/controllers/ConfiguracionEmpresaController.php
// =====================================================

class ConfiguracionEmpresaController {
    private $db;
    private $configuracion;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->configuracion = new ConfiguracionEmpresa($this->db);
    }

    // Obtener configuración de empresa
    public function get() {
        // Cualquier usuario autenticado puede ver la configuración
        Auth::requireAuth();
        
        try {
            $result = $this->configuracion->get();
            
            if ($result) {
                Response::success($result);
            } else {
                // Si no hay configuración, retornar valores por defecto
                Response::success([
                    'nombre_empresa' => '',
                    'telefono' => '',
                    'email' => '',
                    'sitio_web' => '',
                    'calle' => '',
                    'colonia' => '',
                    'ciudad' => '',
                    'estado' => '',
                    'codigo_postal' => '',
                    'pais' => 'México',
                    'logo_url' => '',
                    'facebook' => '',
                    'instagram' => '',
                    'twitter' => '',
                    'linkedin' => ''
                ]);
            }
        } catch (Exception $e) {
            Response::error('Error al obtener configuración: ' . $e->getMessage());
        }
    }

    // Crear o actualizar configuración
    public function createOrUpdate() {
        // Solo administradores pueden modificar la configuración
        $user = Auth::requireAuth();
        
        $rol = strtolower(trim($user['rol']));
        if ($rol !== 'administrador') {
            Response::error('No tiene permisos para modificar la configuración', 403);
            return;
        }
        
        $data = json_decode(file_get_contents("php://input"), true);
        
        // Validar campos requeridos
        if (!isset($data['nombre_empresa']) || empty(trim($data['nombre_empresa']))) {
            Response::error('El nombre de la empresa es requerido', 400);
            return;
        }
        
        // Asegurar que todos los campos existan (aunque sean vacíos)
        $campos = [
            'nombre_empresa', 'telefono', 'email', 'sitio_web',
            'calle', 'colonia', 'ciudad', 'estado', 'codigo_postal', 'pais',
            'logo_url', 'facebook', 'instagram', 'twitter', 'linkedin'
        ];
        
        foreach ($campos as $campo) {
            if (!isset($data[$campo])) {
                $data[$campo] = '';
            }
        }
        
        try {
            if ($this->configuracion->createOrUpdate($data)) {
                $result = $this->configuracion->get();
                Response::success($result, 'Configuración guardada correctamente');
            } else {
                Response::error('Error al guardar la configuración');
            }
        } catch (Exception $e) {
            Response::error('Error al guardar configuración: ' . $e->getMessage());
        }
    }
}
