ALTER TABLE `cotizacion_tours`
-- 1. Añadir Hora de Inicio (la causante del error actual)
ADD COLUMN `hora_inicio` TIME NULL DEFAULT NULL AFTER `fecha_tour`,

-- 2. Asegurar campos de ubicación y proveedor
-- (Si 'destino' ya existe, lo renombramos a 'ubicacion' para que coincida con el formulario, o puedes dejarlo como destino)
-- CHANGE COLUMN `destino` `ubicacion` VARCHAR(100) NULL DEFAULT NULL, 
ADD COLUMN `proveedor` VARCHAR(150) NULL DEFAULT NULL AFTER `nombre_tour`,

-- 3. Desglose de pasajeros
ADD COLUMN `cantidad_adultos` INT NOT NULL DEFAULT 1 AFTER `duracion`,
ADD COLUMN `cantidad_ninos` INT NOT NULL DEFAULT 0 AFTER `cantidad_adultos`,

-- 4. Desglose de precios (Nueva lógica)
ADD COLUMN `precio_venta_adulto` DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER `no_incluye`,
ADD COLUMN `precio_venta_nino` DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER `precio_venta_adulto`,

-- 5. Asegurar campos estándar
ADD COLUMN `no_incluye` TEXT NULL AFTER `incluye`;