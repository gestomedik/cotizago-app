ALTER TABLE `cotizacion_tours`
-- Renombrar columnas para claridad (opcional pero recomendado)
CHANGE COLUMN `destino` `ubicacion` VARCHAR(100) NULL DEFAULT NULL,

-- Añadir desglose de pasajeros si no existe
ADD COLUMN `cantidad_adultos` INT NOT NULL DEFAULT 1 AFTER `duracion`,
ADD COLUMN `cantidad_ninos` INT NOT NULL DEFAULT 0 AFTER `cantidad_adultos`,

-- Añadir nuevos campos de precios de venta unitarios
ADD COLUMN `precio_venta_adulto` DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER `costo_total`,
ADD COLUMN `precio_venta_nino` DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER `precio_venta_adulto`;