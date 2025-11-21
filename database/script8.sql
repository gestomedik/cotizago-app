-- Script para crear tabla de permisos y roles
-- Fecha: 2025-11-21

DROP TABLE IF EXISTS `permisos_roles`;

CREATE TABLE `permisos_roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rol` enum('administrador','agente') NOT NULL,
  `recurso` varchar(100) NOT NULL,
  `puede_ver` tinyint(1) DEFAULT 0,
  `puede_crear` tinyint(1) DEFAULT 0,
  `puede_editar` tinyint(1) DEFAULT 0,
  `puede_eliminar` tinyint(1) DEFAULT 0,
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_rol_recurso` (`rol`, `recurso`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insertar permisos por defecto para Administrador (Acceso Total)
INSERT INTO `permisos_roles` (`rol`, `recurso`, `puede_ver`, `puede_crear`, `puede_editar`, `puede_eliminar`) VALUES
('administrador', 'dashboard', 1, 1, 1, 1),
('administrador', 'cotizaciones', 1, 1, 1, 1),
('administrador', 'clientes', 1, 1, 1, 1),
('administrador', 'pasajeros', 1, 1, 1, 1),
('administrador', 'usuarios', 1, 1, 1, 1),
('administrador', 'configuracion_empresa', 1, 1, 1, 1),
('administrador', 'configuracion_seguridad', 1, 1, 1, 1),
('administrador', 'reportes', 1, 1, 1, 1),
('administrador', 'plantillas', 1, 1, 1, 1);

-- Insertar permisos por defecto para Agente (Acceso Limitado)
INSERT INTO `permisos_roles` (`rol`, `recurso`, `puede_ver`, `puede_crear`, `puede_editar`, `puede_eliminar`) VALUES
('agente', 'dashboard', 1, 0, 0, 0),
('agente', 'cotizaciones', 1, 1, 1, 0), -- Puede ver, crear y editar, pero no eliminar
('agente', 'clientes', 1, 1, 1, 0),
('agente', 'pasajeros', 1, 1, 1, 0),
('agente', 'usuarios', 0, 0, 0, 0), -- No puede ver usuarios
('agente', 'configuracion_empresa', 0, 0, 0, 0), -- No puede ver config empresa
('agente', 'configuracion_seguridad', 0, 0, 0, 0), -- No puede ver seguridad global (solo su perfil)
('agente', 'reportes', 1, 0, 0, 0), -- Solo ver reportes básicos (se filtrará por backend)
('agente', 'plantillas', 1, 0, 0, 0); -- Solo usar plantillas, no crear/editar
