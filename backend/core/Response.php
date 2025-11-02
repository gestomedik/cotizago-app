<?php
/**
 * Response.php
 * Clase para manejar respuestas HTTP JSON
 */

class Response {
    
    /**
     * Respuesta exitosa
     */
    public static function success($data = [], $message = '') {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'data' => $data,
            'message' => $message
        ]);
        exit;
    }
    
    /**
     * Respuesta de error
     */
    public static function error($message, $code = 400) {
        http_response_code($code);
        echo json_encode([
            'success' => false,
            'error' => $message,
            'code' => $code
        ]);
        exit;
    }
    
    /**
     * Respuesta de recurso creado
     */
    public static function created($data = [], $message = 'Recurso creado exitosamente') {
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'data' => $data,
            'message' => $message
        ]);
        exit;
    }
    
    /**
     * Respuesta de recurso actualizado
     */
    public static function updated($data = [], $message = 'Recurso actualizado exitosamente') {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'data' => $data,
            'message' => $message
        ]);
        exit;
    }
    
    /**
     * Respuesta de recurso eliminado
     */
    public static function deleted($message = 'Recurso eliminado exitosamente') {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => $message
        ]);
        exit;
    }
    
    /**
     * Respuesta de recurso no encontrado
     */
    public static function notFound($message = 'Recurso no encontrado') {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'error' => $message,
            'code' => 404
        ]);
        exit;
    }
    
    /**
     * Respuesta de validación fallida
     */
    public static function validation($errors) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'validation_errors' => $errors
        ]);
        exit;
    }
    
    /**
     * Respuesta de no autorizado
     */
    public static function unauthorized($message = 'No autorizado') {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => $message,
            'code' => 401
        ]);
        exit;
    }
    
    /**
     * Respuesta de prohibido
     */
    public static function forbidden($message = 'No tienes permisos para realizar esta acción') {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'error' => $message,
            'code' => 403
        ]);
        exit;
    }
}
