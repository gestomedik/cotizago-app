ALTER TABLE `cotizacion_vuelos`
-- Campos detallados para IDA que faltaban
ADD COLUMN `numero_vuelo` VARCHAR(50) NULL AFTER `aerolinea`,
ADD COLUMN `origen` VARCHAR(100) NULL AFTER `numero_vuelo`,
ADD COLUMN `destino` VARCHAR(100) NULL AFTER `origen`,
ADD COLUMN `fecha_llegada` DATE NULL AFTER `hora_salida`,
ADD COLUMN `hora_llegada` TIME NULL AFTER `fecha_llegada`;