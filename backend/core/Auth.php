<?php
/**
 * Auth.php - Sistema de Autenticación JWT
 * Compatible con Windows/Apache
 * SIN dependencias de Composer
 * VERSIÓN COMPLETA con métodos de password
 */

class Auth
{
    private static $secret_key;
    private static $issuer;
    private static $audience;
    private static $expiration_time;

    public static function init()
    {
        self::$secret_key = JWT_SECRET;
        self::$issuer = API_URL;
        self::$audience = API_URL;
        self::$expiration_time = JWT_EXPIRATION;
    }

    /**
     * Codifica en Base64 URL-safe
     */
    private static function base64UrlEncode($data)
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    /**
     * Decodifica desde Base64 URL-safe
     */
    private static function base64UrlDecode($data)
    {
        return base64_decode(strtr($data, '-_', '+/'));
    }

    /**
     * Genera un token JWT simple
     */
    public static function generateToken($userId, $email, $rol)
    {
        self::init();

        $issuedAt = time();
        $expire = $issuedAt + self::$expiration_time;

        $header = [
            'typ' => 'JWT',
            'alg' => 'HS256'
        ];

        $payload = [
            'iss' => self::$issuer,
            'aud' => self::$audience,
            'iat' => $issuedAt,
            'exp' => $expire,
            'data' => [
                'id' => $userId,
                'email' => $email,
                'rol' => $rol
            ]
        ];

        // Codificar header y payload
        $headerEncoded = self::base64UrlEncode(json_encode($header));
        $payloadEncoded = self::base64UrlEncode(json_encode($payload));

        // Crear firma
        $signature = hash_hmac('sha256', "$headerEncoded.$payloadEncoded", self::$secret_key, true);
        $signatureEncoded = self::base64UrlEncode($signature);

        // Retornar token completo
        return "$headerEncoded.$payloadEncoded.$signatureEncoded";
    }

    /**
     * Obtiene el token del header Authorization
     * Compatible con Windows/Apache - 4 métodos de detección
     */
    private static function getBearerToken()
    {
        $headers = null;

        // MÉTODO 1: Authorization header directo (Linux/nginx)
        if (isset($_SERVER['Authorization'])) {
            $headers = trim($_SERVER['Authorization']);
        }
        // MÉTODO 2: HTTP_AUTHORIZATION (Apache con mod_rewrite)
        elseif (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $headers = trim($_SERVER['HTTP_AUTHORIZATION']);
        }
        // MÉTODO 3: REDIRECT_HTTP_AUTHORIZATION (Apache en Windows con .htaccess)
        elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
            $headers = trim($_SERVER['REDIRECT_HTTP_AUTHORIZATION']);
        }
        // MÉTODO 4: Función apache_request_headers() si está disponible
        elseif (function_exists('apache_request_headers')) {
            $requestHeaders = apache_request_headers();
            $requestHeaders = array_combine(
                array_map('ucwords', array_keys($requestHeaders)),
                array_values($requestHeaders)
            );
            
            if (isset($requestHeaders['Authorization'])) {
                $headers = trim($requestHeaders['Authorization']);
            }
        }

        // Si encontramos el header, extraer el token
        if (!empty($headers)) {
            if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
                return $matches[1];
            }
        }

        return null;
    }

    /**
     * Verifica y decodifica el token JWT
     */
    public static function validateToken($token)
    {
        self::init();

        // Dividir el token en sus partes
        $parts = explode('.', $token);
        
        if (count($parts) !== 3) {
            return null;
        }

        list($headerEncoded, $payloadEncoded, $signatureEncoded) = $parts;

        // Verificar la firma
        $signature = self::base64UrlDecode($signatureEncoded);
        $expectedSignature = hash_hmac('sha256', "$headerEncoded.$payloadEncoded", self::$secret_key, true);

        if (!hash_equals($expectedSignature, $signature)) {
            return null; // Firma inválida
        }

        // Decodificar el payload
        $payload = json_decode(self::base64UrlDecode($payloadEncoded));

        if (!$payload) {
            return null;
        }

        // Verificar expiración
        if (isset($payload->exp) && $payload->exp < time()) {
            return null; // Token expirado
        }

        return $payload;
    }

    /**
     * Requiere autenticación - Lanza error 401 si no está autenticado
     * Retorna los datos del usuario si está autenticado
     */
    public static function requireAuth()
    {
        $token = self::getBearerToken();

        if (!$token) {
            Response::error('Token de autenticación requerido', 401);
            exit;
        }

        $decoded = self::validateToken($token);

        if (!$decoded) {
            Response::error('Token inválido o expirado', 401);
            exit;
        }

        // Retornar datos del usuario desde el token
        return [
            'id' => $decoded->data->id,
            'email' => $decoded->data->email,
            'rol' => $decoded->data->rol
        ];
    }

    /**
     * Verifica autenticación sin lanzar error (opcional)
     * Retorna datos del usuario o null
     */
    public static function checkAuth()
    {
        $token = self::getBearerToken();

        if (!$token) {
            return null;
        }

        $decoded = self::validateToken($token);

        if (!$decoded) {
            return null;
        }

        return [
            'id' => $decoded->data->id,
            'email' => $decoded->data->email,
            'rol' => $decoded->data->rol
        ];
    }

    /**
     * Verifica si el usuario tiene un rol específico
     */
    public static function requireRole($requiredRole)
    {
        $user = self::requireAuth();

        if ($user['rol'] !== $requiredRole) {
            Response::error('No tienes permisos para realizar esta acción', 403);
            exit;
        }

        return $user;
    }

    /**
     * Verifica si el usuario es administrador
     */
    public static function requireAdmin()
    {
        return self::requireRole('administrador');
    }

    /**
     * ========================================
     * MÉTODOS PARA GESTIÓN DE CONTRASEÑAS
     * ========================================
     */

    /**
     * Hashea una contraseña usando BCRYPT
     * Usar al crear o actualizar usuarios
     */
    public static function hashPassword($password)
    {
        return password_hash($password, PASSWORD_BCRYPT);
    }

    /**
     * Verifica si una contraseña coincide con su hash
     * Usar en el login
     */
    public static function verifyPassword($password, $hash)
    {
        return password_verify($password, $hash);
    }
}
