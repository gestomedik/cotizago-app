ALTER TABLE `cotizacion_vuelos`
ADD COLUMN `aerolinea_regreso` VARCHAR(100) NULL AFTER `hora_regreso_llegada`,
ADD COLUMN `numero_vuelo_regreso` VARCHAR(50) NULL AFTER `aerolinea_regreso`,
ADD COLUMN `origen_regreso` VARCHAR(100) NULL AFTER `numero_vuelo_regreso`,
ADD COLUMN `destino_regreso` VARCHAR(100) NULL AFTER `origen_regreso`,
ADD COLUMN `tiene_escala_regreso` TINYINT(1) NOT NULL DEFAULT 0 AFTER `destino_regreso`,
ADD COLUMN `lugar_escala_regreso` VARCHAR(150) NULL AFTER `tiene_escala_regreso`,
ADD COLUMN `duracion_escala_regreso` VARCHAR(50) NULL AFTER `lugar_escala_regreso`;