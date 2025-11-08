ALTER TABLE `cotizacion_vuelos`
ADD COLUMN `tipo_vuelo` ENUM('sencillo', 'redondo') NOT NULL DEFAULT 'sencillo' AFTER `aerolinea`,
ADD COLUMN `fecha_regreso` DATETIME NULL DEFAULT NULL AFTER `fecha_llegada`;