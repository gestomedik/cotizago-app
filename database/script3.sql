ALTER TABLE `cotizacion_vuelos`
CHANGE COLUMN `tiene_escala` `tiene_escala_ida` TINYINT(1) NOT NULL DEFAULT 0,
CHANGE COLUMN `duracion_escala` `duracion_escala_ida` VARCHAR(50) NULL DEFAULT NULL,
CHANGE COLUMN `lugar_escala` `lugar_escala_ida` VARCHAR(150) NULL DEFAULT NULL;