-- Crear tabla de configuración de empresa
CREATE TABLE IF NOT EXISTS configuracion_empresa (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre_empresa VARCHAR(255) NOT NULL,
    telefono VARCHAR(50),
    email VARCHAR(255),
    sitio_web VARCHAR(255),
    calle VARCHAR(255),
    colonia VARCHAR(255),
    ciudad VARCHAR(100),
    estado VARCHAR(100),
    codigo_postal VARCHAR(20),
    pais VARCHAR(100) DEFAULT 'México',
    logo_url VARCHAR(255),
    facebook VARCHAR(255),
    instagram VARCHAR(255),
    twitter VARCHAR(255),
    linkedin VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar configuración por defecto
INSERT INTO configuracion_empresa (
    nombre_empresa,
    telefono,
    email,
    sitio_web,
    calle,
    ciudad,
    estado,
    codigo_postal,
    pais
) VALUES (
    'Experiencias La Silla',
    '81 1529 4248',
    'contacto@experienciaslasilla.com',
    'https://www.experienciaslasilla.com',
    '',
    'Monterrey',
    'Nuevo León',
    '64000',
    'México'
);
