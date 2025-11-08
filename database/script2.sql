ALTER TABLE `cotizacion_vuelos`
ADD COLUMN `lugar_escala` VARCHAR(150) NULL AFTER `duracion_escala`,
ADD COLUMN `hora_regreso` TIME NULL AFTER `fecha_regreso`,
ADD COLUMN `fecha_regreso_llegada` DATE NULL AFTER `hora_regreso`,
ADD COLUMN `hora_regreso_llegada` TIME NULL AFTER `fecha_regreso_llegada`;

ALTER TABLE `cotizacion_vuelos`
ADD COLUMN `tiene_escala` TINYINT(1) DEFAULT 0 AFTER `hora_regreso_llegada`,
ADD COLUMN `kg_equipaje_documentado` INT DEFAULT 0,
ADD COLUMN `piezas_equipaje_documentado` INT DEFAULT 0;

ALTER TABLE `cotizacion_vuelos`
-- 1. Añadir tipo_vuelo si no existe (veo que ya intentaste añadirlo y dio error, así que lo ponemos con 'IF NOT EXISTS' si tu versión de MySQL lo soporta, o simplemente revisa si ya está).
-- Si YA LO TIENES (como parece en el log de abajo de tu imagen), SALTA ESTA LÍNEA:
-- ADD COLUMN `tipo_vuelo` ENUM('sencillo', 'redondo', 'multidestino') NOT NULL DEFAULT 'sencillo' AFTER `ruta`,

-- 2. Añadir los campos de regreso que FALTAN (ya tienes fecha_regreso y hora_regreso)
ADD COLUMN `fecha_regreso_llegada` DATE NULL DEFAULT NULL AFTER `hora_regreso`,
ADD COLUMN `hora_regreso_llegada` TIME NULL DEFAULT NULL AFTER `fecha_regreso_llegada`,

-- 3. Añadir los campos de escalas
ADD COLUMN `tiene_escala` TINYINT(1) NOT NULL DEFAULT 0 AFTER `hora_regreso_llegada`,
ADD COLUMN `duracion_escala` VARCHAR(50) NULL DEFAULT NULL AFTER `tiene_escala`,
ADD COLUMN `lugar_escala` VARCHAR(100) NULL DEFAULT NULL AFTER `duracion_escala`,

-- 4. Añadir los campos de equipaje y extras
ADD COLUMN `incluye_equipaje_mano` TINYINT(1) NOT NULL DEFAULT 1 AFTER `notas`,
ADD COLUMN `incluye_equipaje_documentado` TINYINT(1) NOT NULL DEFAULT 0 AFTER `incluye_equipaje_mano`,
ADD COLUMN `kg_equipaje_documentado` INT NULL DEFAULT 0 AFTER `incluye_equipaje_documentado`,
ADD COLUMN `piezas_equipaje_documentado` INT NULL DEFAULT 0 AFTER `kg_equipaje_documentado`,
ADD COLUMN `incluye_seleccion_asiento` TINYINT(1) NOT NULL DEFAULT 0 AFTER `piezas_equipaje_documentado`,
ADD COLUMN `incluye_tua` TINYINT(1) NOT NULL DEFAULT 1 AFTER `incluye_seleccion_asiento`;