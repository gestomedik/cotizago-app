ALTER TABLE cotizacion_transportes 
MODIFY COLUMN tipo_transporte ENUM('terrestre','aereo','maritimo') 
DEFAULT 'terrestre' 
NOT NULL;