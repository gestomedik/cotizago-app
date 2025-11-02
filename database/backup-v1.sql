-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: cotizago
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `telefono_secundario` varchar(20) DEFAULT NULL,
  `direccion` text DEFAULT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `estado` varchar(100) DEFAULT NULL,
  `pais` varchar(100) DEFAULT NULL,
  `codigo_postal` varchar(10) DEFAULT NULL,
  `notas` text DEFAULT NULL,
  `es_recurrente` tinyint(1) DEFAULT 0,
  `total_viajes` int(11) DEFAULT 0,
  `fecha_registro` datetime DEFAULT current_timestamp(),
  `fecha_ultimo_viaje` datetime DEFAULT NULL,
  `usuario_registro_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_registro_id` (`usuario_registro_id`),
  KEY `idx_nombre` (`nombre`,`apellido`),
  KEY `idx_email` (`email`),
  KEY `idx_recurrente` (`es_recurrente`),
  CONSTRAINT `clientes_ibfk_1` FOREIGN KEY (`usuario_registro_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (1,'Juan','Pérez','juan@test.com','81-1234-5678',NULL,NULL,'Guadalupe','Nuevo León','México',NULL,'Cliente de prueba',0,0,'2025-10-19 13:34:03',NULL,1),(2,'Maria','Rodriguez','exampl@gmail.com','8155547855','','Santa Rosa','LA','California','USA','64000','Prueba',0,0,'2025-10-21 21:26:41',NULL,1),(3,'Jaime','Luevano','jgluevano@gmail.com','8111218616',NULL,'','','','México','',NULL,0,0,'2025-10-24 21:28:09',NULL,1),(4,'priueba','pruebnas','prueba@prueba.com','81555478222','','','Monterrey','Nuevo Leon','México','64000','prueba',0,0,'2025-10-26 21:44:16',NULL,1);
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comisiones_agentes`
--

DROP TABLE IF EXISTS `comisiones_agentes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comisiones_agentes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `agente_id` int(11) NOT NULL,
  `cotizacion_id` int(11) NOT NULL,
  `mes` int(11) NOT NULL,
  `anio` int(11) NOT NULL,
  `monto_venta` decimal(12,2) NOT NULL,
  `ventas_mes_total` decimal(12,2) NOT NULL,
  `porcentaje_comision` decimal(5,2) NOT NULL,
  `monto_comision` decimal(12,2) NOT NULL,
  `estado_viaje` enum('pendiente','realizado','cancelado') DEFAULT 'pendiente',
  `pagado` tinyint(1) DEFAULT 0,
  `fecha_pago` datetime DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `cotizacion_id` (`cotizacion_id`),
  KEY `idx_agente_periodo` (`agente_id`,`anio`,`mes`),
  KEY `idx_estado` (`estado_viaje`,`pagado`),
  CONSTRAINT `comisiones_agentes_ibfk_1` FOREIGN KEY (`agente_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `comisiones_agentes_ibfk_2` FOREIGN KEY (`cotizacion_id`) REFERENCES `cotizaciones` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comisiones_agentes`
--

LOCK TABLES `comisiones_agentes` WRITE;
/*!40000 ALTER TABLE `comisiones_agentes` DISABLE KEYS */;
INSERT INTO `comisiones_agentes` VALUES (1,1,8,11,2025,23580.00,0.00,11.91,2808.00,'pendiente',0,NULL,'2025-11-01 11:00:17');
/*!40000 ALTER TABLE `comisiones_agentes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `config_comisiones`
--

DROP TABLE IF EXISTS `config_comisiones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `config_comisiones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rango_minimo` decimal(12,2) NOT NULL,
  `rango_maximo` decimal(12,2) DEFAULT NULL,
  `porcentaje_comision` decimal(5,2) NOT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_rangos` (`rango_minimo`,`rango_maximo`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `config_comisiones`
--

LOCK TABLES `config_comisiones` WRITE;
/*!40000 ALTER TABLE `config_comisiones` DISABLE KEYS */;
INSERT INTO `config_comisiones` VALUES (1,0.00,100000.00,20.00,1,'2025-10-18 22:41:01'),(2,100000.01,200000.00,25.00,1,'2025-10-18 22:41:01'),(3,200000.01,NULL,35.00,1,'2025-10-18 22:41:01');
/*!40000 ALTER TABLE `config_comisiones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cotizacion_hoteles`
--

DROP TABLE IF EXISTS `cotizacion_hoteles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cotizacion_hoteles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cotizacion_id` int(11) NOT NULL,
  `nombre_hotel` varchar(200) DEFAULT NULL,
  `destino` varchar(100) DEFAULT NULL,
  `tipo_habitacion` varchar(100) DEFAULT NULL,
  `fecha_checkin` date DEFAULT NULL,
  `fecha_checkout` date DEFAULT NULL,
  `num_noches` int(11) DEFAULT 1,
  `num_habitaciones` int(11) DEFAULT 1,
  `num_personas` int(11) DEFAULT 1,
  `plan_alimentacion` enum('sin_alimentos','desayuno','media_pension','pension_completa','todo_incluido') DEFAULT NULL,
  `costo_por_noche` decimal(10,2) DEFAULT 0.00,
  `costo_total` decimal(12,2) DEFAULT 0.00,
  `precio_venta_por_noche` decimal(10,2) DEFAULT 0.00,
  `precio_venta_total` decimal(12,2) DEFAULT 0.00,
  `precio_venta_por_persona` decimal(12,2) DEFAULT 0.00,
  `comision_hotel` decimal(12,2) DEFAULT 0.00,
  `utilidad` decimal(12,2) DEFAULT 0.00,
  `notas` text DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_cotizacion` (`cotizacion_id`),
  CONSTRAINT `cotizacion_hoteles_ibfk_1` FOREIGN KEY (`cotizacion_id`) REFERENCES `cotizaciones` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cotizacion_hoteles`
--

LOCK TABLES `cotizacion_hoteles` WRITE;
/*!40000 ALTER TABLE `cotizacion_hoteles` DISABLE KEYS */;
INSERT INTO `cotizacion_hoteles` VALUES (1,8,'Hotel catedral','La Paz','doble','2026-02-16','2026-02-21',5,1,1,'desayuno',2580.00,12900.00,3180.00,15900.00,15900.00,2000.00,3000.00,'','2025-11-01 11:00:17');
/*!40000 ALTER TABLE `cotizacion_hoteles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cotizacion_pasajeros`
--

DROP TABLE IF EXISTS `cotizacion_pasajeros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cotizacion_pasajeros` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cotizacion_id` int(11) NOT NULL,
  `pasajero_id` int(11) NOT NULL,
  `tipo_pasajero` enum('adulto','nino','infante') NOT NULL,
  `edad_al_viajar` int(11) DEFAULT NULL,
  `aplica_tarifa_especial` tinyint(1) DEFAULT 0,
  `notas` text DEFAULT NULL,
  `fecha_vinculacion` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_cotizacion_pasajero` (`cotizacion_id`,`pasajero_id`),
  KEY `idx_cotizacion` (`cotizacion_id`),
  KEY `idx_pasajero` (`pasajero_id`),
  CONSTRAINT `cotizacion_pasajeros_ibfk_1` FOREIGN KEY (`cotizacion_id`) REFERENCES `cotizaciones` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cotizacion_pasajeros_ibfk_2` FOREIGN KEY (`pasajero_id`) REFERENCES `pasajeros` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cotizacion_pasajeros`
--

LOCK TABLES `cotizacion_pasajeros` WRITE;
/*!40000 ALTER TABLE `cotizacion_pasajeros` DISABLE KEYS */;
INSERT INTO `cotizacion_pasajeros` VALUES (1,2,1,'adulto',NULL,0,NULL,'2025-10-24 16:39:57'),(2,3,1,'adulto',NULL,0,NULL,'2025-10-24 16:42:20'),(3,4,1,'adulto',NULL,0,NULL,'2025-10-24 21:47:20'),(6,8,1,'adulto',NULL,0,NULL,'2025-11-01 11:00:17');
/*!40000 ALTER TABLE `cotizacion_pasajeros` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cotizacion_seguros`
--

DROP TABLE IF EXISTS `cotizacion_seguros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cotizacion_seguros` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cotizacion_id` int(11) NOT NULL,
  `aseguradora` varchar(150) DEFAULT NULL,
  `tipo_cobertura` varchar(200) DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `num_personas` int(11) DEFAULT 1,
  `monto_cobertura` decimal(12,2) DEFAULT NULL,
  `costo_por_persona` decimal(10,2) DEFAULT 0.00,
  `costo_total` decimal(12,2) DEFAULT 0.00,
  `precio_venta_por_persona` decimal(10,2) DEFAULT 0.00,
  `precio_venta_total` decimal(12,2) DEFAULT 0.00,
  `comision` decimal(12,2) DEFAULT 0.00,
  `utilidad` decimal(12,2) DEFAULT 0.00,
  `notas` text DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_cotizacion` (`cotizacion_id`),
  CONSTRAINT `cotizacion_seguros_ibfk_1` FOREIGN KEY (`cotizacion_id`) REFERENCES `cotizaciones` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cotizacion_seguros`
--

LOCK TABLES `cotizacion_seguros` WRITE;
/*!40000 ALTER TABLE `cotizacion_seguros` DISABLE KEYS */;
/*!40000 ALTER TABLE `cotizacion_seguros` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cotizacion_tours`
--

DROP TABLE IF EXISTS `cotizacion_tours`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cotizacion_tours` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cotizacion_id` int(11) NOT NULL,
  `nombre_tour` varchar(200) DEFAULT NULL,
  `proveedor` varchar(150) DEFAULT NULL,
  `destino` varchar(100) DEFAULT NULL,
  `fecha_tour` date DEFAULT NULL,
  `duracion` varchar(50) DEFAULT NULL,
  `num_personas` int(11) DEFAULT 1,
  `incluye` text DEFAULT NULL,
  `costo_por_persona` decimal(10,2) DEFAULT 0.00,
  `costo_total` decimal(12,2) DEFAULT 0.00,
  `precio_venta_por_persona` decimal(10,2) DEFAULT 0.00,
  `precio_venta_total` decimal(12,2) DEFAULT 0.00,
  `comision_tour` decimal(12,2) DEFAULT 0.00,
  `utilidad` decimal(12,2) DEFAULT 0.00,
  `notas` text DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_cotizacion` (`cotizacion_id`),
  CONSTRAINT `cotizacion_tours_ibfk_1` FOREIGN KEY (`cotizacion_id`) REFERENCES `cotizaciones` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cotizacion_tours`
--

LOCK TABLES `cotizacion_tours` WRITE;
/*!40000 ALTER TABLE `cotizacion_tours` DISABLE KEYS */;
INSERT INTO `cotizacion_tours` VALUES (1,8,'Ballenas','Civitatis','La Paz','2026-02-18','11 horas',1,'tosd',1872.00,1872.00,2080.00,2080.00,208.00,208.00,'baehjeha\ntodos','2025-11-01 11:00:17');
/*!40000 ALTER TABLE `cotizacion_tours` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cotizacion_transportes`
--

DROP TABLE IF EXISTS `cotizacion_transportes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cotizacion_transportes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cotizacion_id` int(11) NOT NULL,
  `tipo_transporte` enum('autobus','van','auto_renta','taxi','tren','otro') DEFAULT NULL,
  `proveedor` varchar(150) DEFAULT NULL,
  `origen` varchar(100) DEFAULT NULL,
  `destino` varchar(100) DEFAULT NULL,
  `fecha_servicio` date DEFAULT NULL,
  `num_pasajeros` int(11) DEFAULT 1,
  `num_dias` int(11) DEFAULT 1,
  `costo_total` decimal(12,2) DEFAULT 0.00,
  `precio_venta_total` decimal(12,2) DEFAULT 0.00,
  `comision_transporte` decimal(12,2) DEFAULT 0.00,
  `utilidad` decimal(12,2) DEFAULT 0.00,
  `notas` text DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_cotizacion` (`cotizacion_id`),
  CONSTRAINT `cotizacion_transportes_ibfk_1` FOREIGN KEY (`cotizacion_id`) REFERENCES `cotizaciones` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cotizacion_transportes`
--

LOCK TABLES `cotizacion_transportes` WRITE;
/*!40000 ALTER TABLE `cotizacion_transportes` DISABLE KEYS */;
INSERT INTO `cotizacion_transportes` VALUES (1,8,'','Best ady','Tijuana','La Paz','2026-02-16',1,1,1500.00,1800.00,300.00,300.00,'Apto - hotel\ntaxi','2025-11-01 11:00:17');
/*!40000 ALTER TABLE `cotizacion_transportes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cotizacion_vuelos`
--

DROP TABLE IF EXISTS `cotizacion_vuelos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cotizacion_vuelos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cotizacion_id` int(11) NOT NULL,
  `aerolinea` varchar(100) DEFAULT NULL,
  `ruta` varchar(200) DEFAULT NULL,
  `fecha_salida` datetime DEFAULT NULL,
  `hora_salida` time DEFAULT NULL,
  `fecha_regreso` datetime DEFAULT NULL,
  `hora_regreso` time DEFAULT NULL,
  `clase` enum('economica','premium','ejecutiva','primera') DEFAULT 'economica',
  `num_pasajeros` int(11) DEFAULT 1,
  `costo_unitario` decimal(10,2) DEFAULT 0.00,
  `costo_total` decimal(12,2) DEFAULT 0.00,
  `precio_venta_unitario` decimal(10,2) DEFAULT 0.00,
  `precio_venta_total` decimal(12,2) DEFAULT 0.00,
  `comision_vuelo` decimal(12,2) DEFAULT 0.00,
  `utilidad` decimal(12,2) DEFAULT 0.00,
  `notas` text DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  `incluye_equipaje_mano` tinyint(1) DEFAULT 1,
  `incluye_equipaje_documentado` tinyint(1) DEFAULT 0,
  `kg_equipaje_documentado` int(11) DEFAULT 0,
  `piezas_equipaje_documentado` int(11) DEFAULT 0,
  `incluye_seleccion_asiento` tinyint(1) DEFAULT 0,
  `incluye_tua` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `idx_cotizacion` (`cotizacion_id`),
  CONSTRAINT `cotizacion_vuelos_ibfk_1` FOREIGN KEY (`cotizacion_id`) REFERENCES `cotizaciones` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cotizacion_vuelos`
--

LOCK TABLES `cotizacion_vuelos` WRITE;
/*!40000 ALTER TABLE `cotizacion_vuelos` DISABLE KEYS */;
INSERT INTO `cotizacion_vuelos` VALUES (2,8,'Volaris','Tijuana → La Paz','2026-02-16 00:00:00','09:00:00','2026-02-21 00:00:00','15:15:00','economica',1,3500.00,3500.00,3800.00,3800.00,300.00,300.00,'Num Vuelo: 123\nDuración: 2h','2025-11-01 11:00:17',1,0,0,0,0,1);
/*!40000 ALTER TABLE `cotizacion_vuelos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cotizaciones`
--

DROP TABLE IF EXISTS `cotizaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cotizaciones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `folio` varchar(50) NOT NULL,
  `cliente_id` int(11) DEFAULT NULL,
  `agente_id` int(11) NOT NULL,
  `plantilla_id` int(11) DEFAULT NULL,
  `es_plantilla` tinyint(1) DEFAULT 0,
  `tipo_viaje` enum('individual','grupo') DEFAULT 'individual',
  `descripcion_general` text DEFAULT NULL,
  `notas_internas` text DEFAULT NULL,
  `costo_vuelos` decimal(12,2) DEFAULT 0.00,
  `costo_hoteles` decimal(12,2) DEFAULT 0.00,
  `costo_transportes` decimal(12,2) DEFAULT 0.00,
  `costo_tours` decimal(12,2) DEFAULT 0.00,
  `costo_seguros` decimal(12,2) DEFAULT 0.00,
  `otros_costos` decimal(12,2) DEFAULT 0.00,
  `destino` varchar(200) DEFAULT NULL,
  `fecha_salida` date DEFAULT NULL,
  `fecha_regreso` date DEFAULT NULL,
  `num_noches` int(11) DEFAULT 0,
  `num_adultos` int(11) DEFAULT 0,
  `num_ninos` int(11) DEFAULT 0,
  `num_infantes` int(11) DEFAULT 0,
  `num_pasajeros_total` int(11) DEFAULT 0,
  `estado` enum('cotizacion','reservacion','cancelada') DEFAULT 'cotizacion',
  `estado_pago` enum('pendiente','anticipo','pagado','reembolso') DEFAULT 'pendiente',
  `paso_actual` int(1) DEFAULT 1,
  `cotizacion_completa` tinyint(1) DEFAULT 0,
  `origen` varchar(100) DEFAULT NULL,
  `costo_total` decimal(12,2) DEFAULT 0.00,
  `precio_venta_final` decimal(12,2) DEFAULT 0.00,
  `monto_comision` decimal(12,2) DEFAULT 0.00,
  `utilidad` decimal(12,2) DEFAULT 0.00,
  `porcentaje_comision` decimal(5,2) DEFAULT 0.00,
  `comision_agente` decimal(12,2) DEFAULT 0.00,
  `link_pago` text DEFAULT NULL,
  `fecha_cancelacion` datetime DEFAULT NULL,
  `motivo_cancelacion` text DEFAULT NULL,
  `porcentaje_penalizacion` decimal(5,2) DEFAULT 0.00,
  `monto_penalizacion` decimal(12,2) DEFAULT 0.00,
  `comision_cancelacion` decimal(12,2) DEFAULT 0.00,
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  `fecha_envio_cliente` datetime DEFAULT NULL,
  `fecha_respuesta_cliente` datetime DEFAULT NULL,
  `fecha_vencimiento_cotizacion` date DEFAULT NULL,
  `fecha_modificacion` datetime DEFAULT NULL,
  `fecha_actualizacion` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `fecha_conversion_reserva` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `folio` (`folio`),
  KEY `cliente_id` (`cliente_id`),
  KEY `idx_folio` (`folio`),
  KEY `idx_estado` (`estado`),
  KEY `idx_agente` (`agente_id`),
  KEY `idx_plantilla` (`plantilla_id`),
  KEY `idx_fechas` (`fecha_salida`,`fecha_regreso`),
  CONSTRAINT `cotizaciones_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`),
  CONSTRAINT `cotizaciones_ibfk_2` FOREIGN KEY (`agente_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `cotizaciones_ibfk_3` FOREIGN KEY (`plantilla_id`) REFERENCES `plantillas_paquetes` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cotizaciones`
--

LOCK TABLES `cotizaciones` WRITE;
/*!40000 ALTER TABLE `cotizaciones` DISABLE KEYS */;
INSERT INTO `cotizaciones` VALUES (1,'CTZ-2025-001',2,1,NULL,0,'individual','Ballenas',NULL,3500.00,10900.00,1500.00,3130.00,0.00,0.00,'La Paz','2026-02-16','2026-02-21',5,1,0,0,0,'cotizacion','pendiente',1,0,'Tijuana',19030.00,19030.00,0.00,0.00,0.00,0.00,NULL,NULL,NULL,0.00,0.00,0.00,'2025-10-24 16:36:25',NULL,NULL,NULL,NULL,'2025-10-24 16:36:25',NULL),(2,'CTZ-2025-002',2,1,NULL,0,'individual','Ballenas',NULL,3500.00,10900.00,1500.00,3130.00,0.00,0.00,'La Paz','2026-02-16','2026-02-21',5,1,0,0,0,'cotizacion','pendiente',1,0,'Tijuana',19030.00,19030.00,0.00,0.00,0.00,0.00,NULL,NULL,NULL,0.00,0.00,0.00,'2025-10-24 16:39:57',NULL,NULL,NULL,NULL,'2025-10-24 16:39:57',NULL),(3,'CTZ-2025-003',2,1,NULL,0,'individual','fdsfds',NULL,350.00,56565.00,0.00,0.00,0.00,0.00,'fds','2026-01-01','2026-01-15',14,1,0,0,0,'cancelada','pendiente',1,0,'sdfsd',56915.00,56915.00,0.00,0.00,0.00,0.00,NULL,NULL,NULL,0.00,0.00,0.00,'2025-10-24 16:42:20',NULL,NULL,NULL,'2025-10-24 21:24:50','2025-10-24 21:24:50',NULL),(4,'CTZ-2025-004',3,1,NULL,0,'individual','Avistamiento de Ballenas',NULL,5400.00,15900.00,1500.00,2050.00,0.00,0.00,'La PAz','2026-02-16','2026-02-21',5,1,0,0,0,'cotizacion','pendiente',1,0,'Monterrey',24850.00,24850.00,0.00,0.00,0.00,0.00,NULL,NULL,NULL,0.00,0.00,0.00,'2025-10-24 21:47:20',NULL,NULL,NULL,NULL,'2025-10-24 21:47:20',NULL),(8,'CTZ-2025-005',2,1,NULL,0,'individual','Avistamiento de ballenas','',3500.00,12900.00,1500.00,1872.00,0.00,0.00,'La Paz','2026-02-16','2026-02-21',5,1,0,0,1,'cotizacion','pendiente',1,0,'Tijuana',19772.00,23580.00,2808.00,3808.00,11.91,0.00,NULL,NULL,NULL,0.00,0.00,0.00,'2025-11-01 11:00:17',NULL,NULL,NULL,'2025-11-01 11:00:17','2025-11-01 11:00:17',NULL);
/*!40000 ALTER TABLE `cotizaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `log_actividades`
--

DROP TABLE IF EXISTS `log_actividades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `log_actividades` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `tabla_afectada` varchar(50) DEFAULT NULL,
  `registro_id` int(11) DEFAULT NULL,
  `accion` enum('crear','actualizar','eliminar','consultar') DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_usuario` (`usuario_id`),
  KEY `idx_fecha` (`fecha`),
  CONSTRAINT `log_actividades_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log_actividades`
--

LOCK TABLES `log_actividades` WRITE;
/*!40000 ALTER TABLE `log_actividades` DISABLE KEYS */;
/*!40000 ALTER TABLE `log_actividades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pasajeros`
--

DROP TABLE IF EXISTS `pasajeros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pasajeros` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cliente_id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `edad` int(11) DEFAULT NULL,
  `tipo_pasajero` enum('adulto','nino','infante') NOT NULL,
  `genero` enum('masculino','femenino','otro') DEFAULT NULL,
  `tipo_documento` enum('pasaporte','ine','licencia','acta_nacimiento','otro') DEFAULT NULL,
  `numero_documento` varchar(50) DEFAULT NULL,
  `pais_emision` varchar(100) DEFAULT NULL,
  `fecha_emision` date DEFAULT NULL,
  `fecha_vencimiento` date DEFAULT NULL,
  `documento_frontal` longblob DEFAULT NULL,
  `documento_frontal_tipo` varchar(50) DEFAULT NULL,
  `documento_frontal_nombre` varchar(255) DEFAULT NULL,
  `documento_reverso` longblob DEFAULT NULL,
  `documento_reverso_tipo` varchar(50) DEFAULT NULL,
  `documento_reverso_nombre` varchar(255) DEFAULT NULL,
  `nacionalidad` varchar(100) DEFAULT NULL,
  `alergias` text DEFAULT NULL,
  `condiciones_medicas` text DEFAULT NULL,
  `contacto_emergencia` varchar(200) DEFAULT NULL,
  `telefono_emergencia` varchar(20) DEFAULT NULL,
  `notas` text DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `fecha_registro` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_cliente` (`cliente_id`),
  KEY `idx_tipo` (`tipo_pasajero`),
  KEY `idx_nombre` (`nombre`,`apellido`),
  CONSTRAINT `pasajeros_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pasajeros`
--

LOCK TABLES `pasajeros` WRITE;
/*!40000 ALTER TABLE `pasajeros` DISABLE KEYS */;
INSERT INTO `pasajeros` VALUES (1,2,'Buenaventura','Rodriguez','1959-01-01',66,'adulto','masculino','','','','0000-00-00','0000-00-00',NULL,NULL,NULL,NULL,NULL,NULL,'Mexicana','','','','','',1,'2025-10-21 22:18:25'),(2,2,'Jessica','Rodriguez','1999-01-01',26,'adulto','masculino','','','','0000-00-00','0000-00-00',NULL,NULL,NULL,NULL,NULL,NULL,'Mexicana','','','','','',1,'2025-10-26 21:48:45');
/*!40000 ALTER TABLE `pasajeros` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plantilla_hoteles`
--

DROP TABLE IF EXISTS `plantilla_hoteles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plantilla_hoteles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `plantilla_id` int(11) NOT NULL,
  `nombre_hotel` varchar(200) DEFAULT NULL,
  `tipo_habitacion` varchar(100) DEFAULT NULL,
  `num_noches` int(11) DEFAULT 1,
  `plan_alimentacion` enum('sin_alimentos','desayuno','media_pension','pension_completa','todo_incluido') DEFAULT NULL,
  `costo_por_noche` decimal(10,2) DEFAULT 0.00,
  `precio_venta_por_noche` decimal(10,2) DEFAULT 0.00,
  `notas` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plantilla_id` (`plantilla_id`),
  CONSTRAINT `plantilla_hoteles_ibfk_1` FOREIGN KEY (`plantilla_id`) REFERENCES `plantillas_paquetes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plantilla_hoteles`
--

LOCK TABLES `plantilla_hoteles` WRITE;
/*!40000 ALTER TABLE `plantilla_hoteles` DISABLE KEYS */;
/*!40000 ALTER TABLE `plantilla_hoteles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plantilla_seguros`
--

DROP TABLE IF EXISTS `plantilla_seguros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plantilla_seguros` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `plantilla_id` int(11) NOT NULL,
  `aseguradora` varchar(150) DEFAULT NULL,
  `tipo_cobertura` varchar(200) DEFAULT NULL,
  `costo_por_persona` decimal(10,2) DEFAULT 0.00,
  `precio_venta_por_persona` decimal(10,2) DEFAULT 0.00,
  `notas` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plantilla_id` (`plantilla_id`),
  CONSTRAINT `plantilla_seguros_ibfk_1` FOREIGN KEY (`plantilla_id`) REFERENCES `plantillas_paquetes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plantilla_seguros`
--

LOCK TABLES `plantilla_seguros` WRITE;
/*!40000 ALTER TABLE `plantilla_seguros` DISABLE KEYS */;
/*!40000 ALTER TABLE `plantilla_seguros` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plantilla_tours`
--

DROP TABLE IF EXISTS `plantilla_tours`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plantilla_tours` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `plantilla_id` int(11) NOT NULL,
  `nombre_tour` varchar(200) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `duracion` varchar(50) DEFAULT NULL,
  `costo_por_persona` decimal(10,2) DEFAULT 0.00,
  `precio_venta_por_persona` decimal(10,2) DEFAULT 0.00,
  `notas` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plantilla_id` (`plantilla_id`),
  CONSTRAINT `plantilla_tours_ibfk_1` FOREIGN KEY (`plantilla_id`) REFERENCES `plantillas_paquetes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plantilla_tours`
--

LOCK TABLES `plantilla_tours` WRITE;
/*!40000 ALTER TABLE `plantilla_tours` DISABLE KEYS */;
/*!40000 ALTER TABLE `plantilla_tours` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plantilla_transportes`
--

DROP TABLE IF EXISTS `plantilla_transportes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plantilla_transportes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `plantilla_id` int(11) NOT NULL,
  `tipo_transporte` enum('autobus','van','auto_renta','taxi','tren','otro') DEFAULT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  `costo_total` decimal(12,2) DEFAULT 0.00,
  `precio_venta_total` decimal(12,2) DEFAULT 0.00,
  `notas` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plantilla_id` (`plantilla_id`),
  CONSTRAINT `plantilla_transportes_ibfk_1` FOREIGN KEY (`plantilla_id`) REFERENCES `plantillas_paquetes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plantilla_transportes`
--

LOCK TABLES `plantilla_transportes` WRITE;
/*!40000 ALTER TABLE `plantilla_transportes` DISABLE KEYS */;
/*!40000 ALTER TABLE `plantilla_transportes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plantilla_vuelos`
--

DROP TABLE IF EXISTS `plantilla_vuelos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plantilla_vuelos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `plantilla_id` int(11) NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  `aerolinea` varchar(100) DEFAULT NULL,
  `ruta` varchar(200) DEFAULT NULL,
  `clase` enum('economica','premium','ejecutiva','primera') DEFAULT 'economica',
  `costo_unitario` decimal(10,2) DEFAULT 0.00,
  `precio_venta_unitario` decimal(10,2) DEFAULT 0.00,
  `notas` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plantilla_id` (`plantilla_id`),
  CONSTRAINT `plantilla_vuelos_ibfk_1` FOREIGN KEY (`plantilla_id`) REFERENCES `plantillas_paquetes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plantilla_vuelos`
--

LOCK TABLES `plantilla_vuelos` WRITE;
/*!40000 ALTER TABLE `plantilla_vuelos` DISABLE KEYS */;
/*!40000 ALTER TABLE `plantilla_vuelos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plantillas_paquetes`
--

DROP TABLE IF EXISTS `plantillas_paquetes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plantillas_paquetes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_paquete` varchar(200) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `destino` varchar(200) DEFAULT NULL,
  `duracion_dias` int(11) DEFAULT NULL,
  `tipo_viaje` enum('individual','grupo') DEFAULT 'individual',
  `num_adultos_base` int(11) DEFAULT 2,
  `num_ninos_base` int(11) DEFAULT 0,
  `num_infantes_base` int(11) DEFAULT 0,
  `incluye` text DEFAULT NULL,
  `no_incluye` text DEFAULT NULL,
  `precio_base` decimal(12,2) DEFAULT 0.00,
  `activo` tinyint(1) DEFAULT 1,
  `destacado` tinyint(1) DEFAULT 0,
  `categoria` enum('playa','ciudad','aventura','cultural','romantico','familiar','corporativo','otro') DEFAULT NULL,
  `imagen_url` varchar(500) DEFAULT NULL,
  `usuario_creador_id` int(11) DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  `fecha_actualizacion` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `total_veces_usado` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `usuario_creador_id` (`usuario_creador_id`),
  KEY `idx_destino` (`destino`),
  KEY `idx_activo` (`activo`),
  KEY `idx_categoria` (`categoria`),
  CONSTRAINT `plantillas_paquetes_ibfk_1` FOREIGN KEY (`usuario_creador_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plantillas_paquetes`
--

LOCK TABLES `plantillas_paquetes` WRITE;
/*!40000 ALTER TABLE `plantillas_paquetes` DISABLE KEYS */;
/*!40000 ALTER TABLE `plantillas_paquetes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('administrador','agente') DEFAULT 'agente',
  `activo` tinyint(1) DEFAULT 1,
  `fecha_registro` datetime DEFAULT current_timestamp(),
  `ultimo_acceso` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_rol` (`rol`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Admin','Sistema','admin@tuagencia.com','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','administrador',1,'2025-10-18 22:41:02','2025-11-01 09:29:24');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `vista_clientes_recurrentes`
--

DROP TABLE IF EXISTS `vista_clientes_recurrentes`;
/*!50001 DROP VIEW IF EXISTS `vista_clientes_recurrentes`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vista_clientes_recurrentes` AS SELECT 
 1 AS `id`,
 1 AS `nombre`,
 1 AS `apellido`,
 1 AS `email`,
 1 AS `telefono`,
 1 AS `ciudad`,
 1 AS `estado_provincia`,
 1 AS `total_viajes`,
 1 AS `fecha_ultimo_viaje`,
 1 AS `es_recurrente`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vista_comisiones_pendientes`
--

DROP TABLE IF EXISTS `vista_comisiones_pendientes`;
/*!50001 DROP VIEW IF EXISTS `vista_comisiones_pendientes`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vista_comisiones_pendientes` AS SELECT 
 1 AS `id`,
 1 AS `cotizacion_id`,
 1 AS `folio`,
 1 AS `agente_id`,
 1 AS `agente_nombre`,
 1 AS `monto_venta`,
 1 AS `porcentaje_comision`,
 1 AS `monto_comision`,
 1 AS `estado_viaje`,
 1 AS `fecha_pago`,
 1 AS `dias_pendiente`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vista_dashboard_completados`
--

DROP TABLE IF EXISTS `vista_dashboard_completados`;
/*!50001 DROP VIEW IF EXISTS `vista_dashboard_completados`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vista_dashboard_completados` AS SELECT 
 1 AS `id`,
 1 AS `folio`,
 1 AS `cliente_id`,
 1 AS `cliente_nombre`,
 1 AS `destino`,
 1 AS `fecha_salida`,
 1 AS `fecha_regreso`,
 1 AS `precio_venta_final`,
 1 AS `utilidad`,
 1 AS `monto_comision`,
 1 AS `estado_pago`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vista_dashboard_en_proceso`
--

DROP TABLE IF EXISTS `vista_dashboard_en_proceso`;
/*!50001 DROP VIEW IF EXISTS `vista_dashboard_en_proceso`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vista_dashboard_en_proceso` AS SELECT 
 1 AS `id`,
 1 AS `folio`,
 1 AS `cliente_id`,
 1 AS `cliente_nombre`,
 1 AS `origen`,
 1 AS `destino`,
 1 AS `fecha_salida`,
 1 AS `fecha_regreso`,
 1 AS `precio_venta_final`,
 1 AS `estado`,
 1 AS `estado_pago`,
 1 AS `fecha_creacion`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vista_dashboard_mes`
--

DROP TABLE IF EXISTS `vista_dashboard_mes`;
/*!50001 DROP VIEW IF EXISTS `vista_dashboard_mes`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vista_dashboard_mes` AS SELECT 
 1 AS `total_cotizaciones`,
 1 AS `cotizaciones_activas`,
 1 AS `reservaciones`,
 1 AS `completadas`,
 1 AS `canceladas`,
 1 AS `ventas_totales`,
 1 AS `comisiones_generadas`,
 1 AS `tasa_conversion`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vista_dashboard_proximos`
--

DROP TABLE IF EXISTS `vista_dashboard_proximos`;
/*!50001 DROP VIEW IF EXISTS `vista_dashboard_proximos`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vista_dashboard_proximos` AS SELECT 
 1 AS `id`,
 1 AS `folio`,
 1 AS `cliente_id`,
 1 AS `cliente_nombre`,
 1 AS `destino`,
 1 AS `fecha_salida`,
 1 AS `fecha_regreso`,
 1 AS `num_noches`,
 1 AS `num_pasajeros`,
 1 AS `precio_venta_final`,
 1 AS `estado`,
 1 AS `estado_pago`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vista_pasajeros_cotizacion`
--

DROP TABLE IF EXISTS `vista_pasajeros_cotizacion`;
/*!50001 DROP VIEW IF EXISTS `vista_pasajeros_cotizacion`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vista_pasajeros_cotizacion` AS SELECT 
 1 AS `cotizacion_id`,
 1 AS `folio`,
 1 AS `pasajero_id`,
 1 AS `pasajero_nombre`,
 1 AS `tipo_pasajero`,
 1 AS `edad_al_viajar`,
 1 AS `tipo_documento`,
 1 AS `numero_documento`,
 1 AS `vencimiento_documento`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vista_pasajeros_por_cotizacion`
--

DROP TABLE IF EXISTS `vista_pasajeros_por_cotizacion`;
/*!50001 DROP VIEW IF EXISTS `vista_pasajeros_por_cotizacion`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vista_pasajeros_por_cotizacion` AS SELECT 
 1 AS `cotizacion_id`,
 1 AS `folio`,
 1 AS `pasajero_id`,
 1 AS `pasajero_nombre`,
 1 AS `tipo_pasajero`,
 1 AS `edad`,
 1 AS `nacionalidad`,
 1 AS `fecha_vinculacion`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vista_plantillas_disponibles`
--

DROP TABLE IF EXISTS `vista_plantillas_disponibles`;
/*!50001 DROP VIEW IF EXISTS `vista_plantillas_disponibles`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vista_plantillas_disponibles` AS SELECT 
 1 AS `id`,
 1 AS `nombre_paquete`,
 1 AS `descripcion`,
 1 AS `destino`,
 1 AS `duracion_dias`,
 1 AS `tipo_viaje`,
 1 AS `precio_base`,
 1 AS `categoria`,
 1 AS `activo`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vista_reporte_utilidades`
--

DROP TABLE IF EXISTS `vista_reporte_utilidades`;
/*!50001 DROP VIEW IF EXISTS `vista_reporte_utilidades`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vista_reporte_utilidades` AS SELECT 
 1 AS `id`,
 1 AS `folio`,
 1 AS `cliente_id`,
 1 AS `cliente_nombre`,
 1 AS `destino`,
 1 AS `fecha_salida`,
 1 AS `costo_total`,
 1 AS `utilidad`,
 1 AS `precio_venta_final`,
 1 AS `porcentaje_comision`,
 1 AS `monto_comision`,
 1 AS `porcentaje_utilidad`,
 1 AS `estado`,
 1 AS `estado_pago`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vista_ventas_agentes`
--

DROP TABLE IF EXISTS `vista_ventas_agentes`;
/*!50001 DROP VIEW IF EXISTS `vista_ventas_agentes`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vista_ventas_agentes` AS SELECT 
 1 AS `agente_id`,
 1 AS `agente_nombre`,
 1 AS `anio`,
 1 AS `mes`,
 1 AS `total_cotizaciones`,
 1 AS `total_reservaciones`,
 1 AS `ventas_totales`,
 1 AS `comisiones_totales`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vista_ventas_por_agente`
--

DROP TABLE IF EXISTS `vista_ventas_por_agente`;
/*!50001 DROP VIEW IF EXISTS `vista_ventas_por_agente`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vista_ventas_por_agente` AS SELECT 
 1 AS `usuario_id`,
 1 AS `nombre`,
 1 AS `apellido`,
 1 AS `email`,
 1 AS `total_cotizaciones`,
 1 AS `reservaciones`,
 1 AS `completadas`,
 1 AS `ventas_totales`,
 1 AS `comisiones_totales`,
 1 AS `utilidad_total`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vista_viajes_completados`
--

DROP TABLE IF EXISTS `vista_viajes_completados`;
/*!50001 DROP VIEW IF EXISTS `vista_viajes_completados`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vista_viajes_completados` AS SELECT 
 1 AS `id`,
 1 AS `folio`,
 1 AS `cliente`,
 1 AS `agente`,
 1 AS `destino`,
 1 AS `fecha_salida`,
 1 AS `fecha_regreso`,
 1 AS `num_pasajeros_total`,
 1 AS `precio_venta_total`,
 1 AS `comision_agente`,
 1 AS `dias_desde_regreso`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vista_viajes_en_proceso`
--

DROP TABLE IF EXISTS `vista_viajes_en_proceso`;
/*!50001 DROP VIEW IF EXISTS `vista_viajes_en_proceso`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vista_viajes_en_proceso` AS SELECT 
 1 AS `id`,
 1 AS `folio`,
 1 AS `cliente`,
 1 AS `agente`,
 1 AS `destino`,
 1 AS `fecha_salida`,
 1 AS `fecha_regreso`,
 1 AS `num_pasajeros_total`,
 1 AS `precio_venta_total`,
 1 AS `dias_restantes`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vista_viajes_mes`
--

DROP TABLE IF EXISTS `vista_viajes_mes`;
/*!50001 DROP VIEW IF EXISTS `vista_viajes_mes`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vista_viajes_mes` AS SELECT 
 1 AS `id`,
 1 AS `folio`,
 1 AS `cliente`,
 1 AS `agente`,
 1 AS `destino`,
 1 AS `fecha_salida`,
 1 AS `fecha_regreso`,
 1 AS `num_pasajeros_total`,
 1 AS `precio_venta_total`,
 1 AS `estado`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vista_viajes_proximos`
--

DROP TABLE IF EXISTS `vista_viajes_proximos`;
/*!50001 DROP VIEW IF EXISTS `vista_viajes_proximos`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vista_viajes_proximos` AS SELECT 
 1 AS `id`,
 1 AS `folio`,
 1 AS `cliente`,
 1 AS `agente`,
 1 AS `destino`,
 1 AS `fecha_salida`,
 1 AS `fecha_regreso`,
 1 AS `num_pasajeros_total`,
 1 AS `precio_venta_total`,
 1 AS `dias_para_viaje`,
 1 AS `estado`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `vista_clientes_recurrentes`
--

/*!50001 DROP VIEW IF EXISTS `vista_clientes_recurrentes`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vista_clientes_recurrentes` AS select `c`.`id` AS `id`,`c`.`nombre` AS `nombre`,`c`.`apellido` AS `apellido`,`c`.`email` AS `email`,`c`.`telefono` AS `telefono`,`c`.`ciudad` AS `ciudad`,`c`.`estado` AS `estado_provincia`,`c`.`total_viajes` AS `total_viajes`,`c`.`fecha_ultimo_viaje` AS `fecha_ultimo_viaje`,`c`.`es_recurrente` AS `es_recurrente` from `clientes` `c` where `c`.`total_viajes` > 1 order by `c`.`total_viajes` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vista_comisiones_pendientes`
--

/*!50001 DROP VIEW IF EXISTS `vista_comisiones_pendientes`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vista_comisiones_pendientes` AS select `ca`.`id` AS `id`,`ca`.`cotizacion_id` AS `cotizacion_id`,`c`.`folio` AS `folio`,`ca`.`agente_id` AS `agente_id`,concat(`u`.`nombre`,' ',`u`.`apellido`) AS `agente_nombre`,`ca`.`monto_venta` AS `monto_venta`,`ca`.`porcentaje_comision` AS `porcentaje_comision`,`ca`.`monto_comision` AS `monto_comision`,`ca`.`estado_viaje` AS `estado_viaje`,`ca`.`fecha_pago` AS `fecha_pago`,to_days(curdate()) - to_days(`ca`.`fecha_pago`) AS `dias_pendiente` from ((`comisiones_agentes` `ca` join `cotizaciones` `c` on(`ca`.`cotizacion_id` = `c`.`id`)) join `usuarios` `u` on(`ca`.`agente_id` = `u`.`id`)) where `ca`.`estado_viaje` = 'pendiente' order by `ca`.`fecha_pago` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vista_dashboard_completados`
--

/*!50001 DROP VIEW IF EXISTS `vista_dashboard_completados`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vista_dashboard_completados` AS select `c`.`id` AS `id`,`c`.`folio` AS `folio`,`c`.`cliente_id` AS `cliente_id`,concat(`cl`.`nombre`,' ',`cl`.`apellido`) AS `cliente_nombre`,`c`.`destino` AS `destino`,`c`.`fecha_salida` AS `fecha_salida`,`c`.`fecha_regreso` AS `fecha_regreso`,`c`.`precio_venta_final` AS `precio_venta_final`,`c`.`utilidad` AS `utilidad`,`c`.`monto_comision` AS `monto_comision`,`c`.`estado_pago` AS `estado_pago` from (`cotizaciones` `c` join `clientes` `cl` on(`c`.`cliente_id` = `cl`.`id`)) where `c`.`estado` = 'completada' order by `c`.`fecha_regreso` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vista_dashboard_en_proceso`
--

/*!50001 DROP VIEW IF EXISTS `vista_dashboard_en_proceso`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vista_dashboard_en_proceso` AS select `c`.`id` AS `id`,`c`.`folio` AS `folio`,`c`.`cliente_id` AS `cliente_id`,concat(`cl`.`nombre`,' ',`cl`.`apellido`) AS `cliente_nombre`,`c`.`origen` AS `origen`,`c`.`destino` AS `destino`,`c`.`fecha_salida` AS `fecha_salida`,`c`.`fecha_regreso` AS `fecha_regreso`,`c`.`precio_venta_final` AS `precio_venta_final`,`c`.`estado` AS `estado`,`c`.`estado_pago` AS `estado_pago`,`c`.`fecha_creacion` AS `fecha_creacion` from (`cotizaciones` `c` join `clientes` `cl` on(`c`.`cliente_id` = `cl`.`id`)) where `c`.`estado` = 'reservacion' and `c`.`fecha_salida` >= curdate() order by `c`.`fecha_salida` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vista_dashboard_mes`
--

/*!50001 DROP VIEW IF EXISTS `vista_dashboard_mes`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vista_dashboard_mes` AS select count(0) AS `total_cotizaciones`,sum(case when `cotizaciones`.`estado` = 'cotizacion' then 1 else 0 end) AS `cotizaciones_activas`,sum(case when `cotizaciones`.`estado` = 'reservacion' then 1 else 0 end) AS `reservaciones`,sum(case when `cotizaciones`.`estado` = 'completada' then 1 else 0 end) AS `completadas`,sum(case when `cotizaciones`.`estado` = 'cancelada' then 1 else 0 end) AS `canceladas`,coalesce(sum(case when `cotizaciones`.`estado` in ('reservacion','completada') then `cotizaciones`.`precio_venta_final` else 0 end),0) AS `ventas_totales`,coalesce(sum(case when `cotizaciones`.`estado` in ('reservacion','completada') then `cotizaciones`.`monto_comision` else 0 end),0) AS `comisiones_generadas`,round(sum(case when `cotizaciones`.`estado` = 'reservacion' then 1 else 0 end) * 100.0 / nullif(sum(case when `cotizaciones`.`estado` in ('cotizacion','reservacion') then 1 else 0 end),0),2) AS `tasa_conversion` from `cotizaciones` where year(`cotizaciones`.`fecha_creacion`) = year(curdate()) and month(`cotizaciones`.`fecha_creacion`) = month(curdate()) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vista_dashboard_proximos`
--

/*!50001 DROP VIEW IF EXISTS `vista_dashboard_proximos`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vista_dashboard_proximos` AS select `c`.`id` AS `id`,`c`.`folio` AS `folio`,`c`.`cliente_id` AS `cliente_id`,concat(`cl`.`nombre`,' ',`cl`.`apellido`) AS `cliente_nombre`,`c`.`destino` AS `destino`,`c`.`fecha_salida` AS `fecha_salida`,`c`.`fecha_regreso` AS `fecha_regreso`,`c`.`num_noches` AS `num_noches`,`c`.`num_adultos` + `c`.`num_ninos` + `c`.`num_infantes` AS `num_pasajeros`,`c`.`precio_venta_final` AS `precio_venta_final`,`c`.`estado` AS `estado`,`c`.`estado_pago` AS `estado_pago` from (`cotizaciones` `c` join `clientes` `cl` on(`c`.`cliente_id` = `cl`.`id`)) where `c`.`estado` in ('reservacion','cotizacion') and `c`.`fecha_salida` between curdate() and curdate() + interval 30 day order by `c`.`fecha_salida` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vista_pasajeros_cotizacion`
--

/*!50001 DROP VIEW IF EXISTS `vista_pasajeros_cotizacion`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vista_pasajeros_cotizacion` AS select `cp`.`cotizacion_id` AS `cotizacion_id`,`c`.`folio` AS `folio`,`p`.`id` AS `pasajero_id`,concat(`p`.`nombre`,' ',`p`.`apellido`) AS `pasajero_nombre`,`p`.`tipo_pasajero` AS `tipo_pasajero`,`cp`.`edad_al_viajar` AS `edad_al_viajar`,`p`.`tipo_documento` AS `tipo_documento`,`p`.`numero_documento` AS `numero_documento`,`p`.`fecha_vencimiento` AS `vencimiento_documento` from ((`cotizacion_pasajeros` `cp` join `pasajeros` `p` on(`cp`.`pasajero_id` = `p`.`id`)) join `cotizaciones` `c` on(`cp`.`cotizacion_id` = `c`.`id`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vista_pasajeros_por_cotizacion`
--

/*!50001 DROP VIEW IF EXISTS `vista_pasajeros_por_cotizacion`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vista_pasajeros_por_cotizacion` AS select `cp`.`cotizacion_id` AS `cotizacion_id`,`c`.`folio` AS `folio`,`cp`.`pasajero_id` AS `pasajero_id`,concat(`p`.`nombre`,' ',`p`.`apellido`) AS `pasajero_nombre`,`p`.`tipo_pasajero` AS `tipo_pasajero`,`p`.`edad` AS `edad`,`p`.`nacionalidad` AS `nacionalidad`,`cp`.`fecha_vinculacion` AS `fecha_vinculacion` from ((`cotizacion_pasajeros` `cp` join `cotizaciones` `c` on(`cp`.`cotizacion_id` = `c`.`id`)) join `pasajeros` `p` on(`cp`.`pasajero_id` = `p`.`id`)) order by `cp`.`cotizacion_id`,`p`.`tipo_pasajero`,`p`.`nombre` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vista_plantillas_disponibles`
--

/*!50001 DROP VIEW IF EXISTS `vista_plantillas_disponibles`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vista_plantillas_disponibles` AS select `p`.`id` AS `id`,`p`.`nombre_paquete` AS `nombre_paquete`,`p`.`descripcion` AS `descripcion`,`p`.`destino` AS `destino`,`p`.`duracion_dias` AS `duracion_dias`,`p`.`tipo_viaje` AS `tipo_viaje`,`p`.`precio_base` AS `precio_base`,`p`.`categoria` AS `categoria`,`p`.`activo` AS `activo` from `plantillas_paquetes` `p` where `p`.`activo` = 1 order by `p`.`nombre_paquete` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vista_reporte_utilidades`
--

/*!50001 DROP VIEW IF EXISTS `vista_reporte_utilidades`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vista_reporte_utilidades` AS select `c`.`id` AS `id`,`c`.`folio` AS `folio`,`c`.`cliente_id` AS `cliente_id`,concat(`cl`.`nombre`,' ',`cl`.`apellido`) AS `cliente_nombre`,`c`.`destino` AS `destino`,`c`.`fecha_salida` AS `fecha_salida`,`c`.`costo_total` AS `costo_total`,`c`.`utilidad` AS `utilidad`,`c`.`precio_venta_final` AS `precio_venta_final`,`c`.`porcentaje_comision` AS `porcentaje_comision`,`c`.`monto_comision` AS `monto_comision`,round(`c`.`utilidad` * 100.0 / nullif(`c`.`precio_venta_final`,0),2) AS `porcentaje_utilidad`,`c`.`estado` AS `estado`,`c`.`estado_pago` AS `estado_pago` from (`cotizaciones` `c` join `clientes` `cl` on(`c`.`cliente_id` = `cl`.`id`)) where `c`.`estado` in ('reservacion','completada') order by `c`.`fecha_creacion` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vista_ventas_agentes`
--

/*!50001 DROP VIEW IF EXISTS `vista_ventas_agentes`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vista_ventas_agentes` AS select `u`.`id` AS `agente_id`,concat(`u`.`nombre`,' ',`u`.`apellido`) AS `agente_nombre`,year(`c`.`fecha_salida`) AS `anio`,month(`c`.`fecha_salida`) AS `mes`,count(`c`.`id`) AS `total_cotizaciones`,sum(case when `c`.`estado` = 'reservacion' then 1 else 0 end) AS `total_reservaciones`,sum(case when `c`.`estado` = 'reservacion' then `c`.`precio_venta_final` else 0 end) AS `ventas_totales`,sum(case when `c`.`estado` = 'reservacion' then `c`.`comision_agente` else 0 end) AS `comisiones_totales` from (`usuarios` `u` left join `cotizaciones` `c` on(`u`.`id` = `c`.`agente_id`)) where `u`.`rol` = 'agente' group by `u`.`id`,year(`c`.`fecha_salida`),month(`c`.`fecha_salida`) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vista_ventas_por_agente`
--

/*!50001 DROP VIEW IF EXISTS `vista_ventas_por_agente`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vista_ventas_por_agente` AS select `u`.`id` AS `usuario_id`,`u`.`nombre` AS `nombre`,`u`.`apellido` AS `apellido`,`u`.`email` AS `email`,count(`c`.`id`) AS `total_cotizaciones`,sum(case when `c`.`estado` = 'reservacion' then 1 else 0 end) AS `reservaciones`,sum(case when `c`.`estado` = 'completada' then 1 else 0 end) AS `completadas`,coalesce(sum(case when `c`.`estado` in ('reservacion','completada') then `c`.`precio_venta_final` else 0 end),0) AS `ventas_totales`,coalesce(sum(case when `c`.`estado` in ('reservacion','completada') then `c`.`monto_comision` else 0 end),0) AS `comisiones_totales`,coalesce(sum(case when `c`.`estado` in ('reservacion','completada') then `c`.`utilidad` else 0 end),0) AS `utilidad_total` from (`usuarios` `u` left join `cotizaciones` `c` on(`u`.`id` = `c`.`agente_id`)) where `u`.`rol` = 'agente' and `u`.`activo` = 1 group by `u`.`id`,`u`.`nombre`,`u`.`apellido`,`u`.`email` order by coalesce(sum(case when `c`.`estado` in ('reservacion','completada') then `c`.`precio_venta_final` else 0 end),0) desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vista_viajes_completados`
--

/*!50001 DROP VIEW IF EXISTS `vista_viajes_completados`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vista_viajes_completados` AS select `c`.`id` AS `id`,`c`.`folio` AS `folio`,concat(`cl`.`nombre`,' ',`cl`.`apellido`) AS `cliente`,concat(`u`.`nombre`,' ',`u`.`apellido`) AS `agente`,`c`.`destino` AS `destino`,`c`.`fecha_salida` AS `fecha_salida`,`c`.`fecha_regreso` AS `fecha_regreso`,`c`.`num_pasajeros_total` AS `num_pasajeros_total`,`c`.`precio_venta_final` AS `precio_venta_total`,`c`.`comision_agente` AS `comision_agente`,to_days(curdate()) - to_days(`c`.`fecha_regreso`) AS `dias_desde_regreso` from ((`cotizaciones` `c` left join `clientes` `cl` on(`c`.`cliente_id` = `cl`.`id`)) join `usuarios` `u` on(`c`.`agente_id` = `u`.`id`)) where `c`.`estado` = 'reservacion' and `c`.`fecha_regreso` < curdate() order by `c`.`fecha_regreso` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vista_viajes_en_proceso`
--

/*!50001 DROP VIEW IF EXISTS `vista_viajes_en_proceso`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vista_viajes_en_proceso` AS select `c`.`id` AS `id`,`c`.`folio` AS `folio`,concat(`cl`.`nombre`,' ',`cl`.`apellido`) AS `cliente`,concat(`u`.`nombre`,' ',`u`.`apellido`) AS `agente`,`c`.`destino` AS `destino`,`c`.`fecha_salida` AS `fecha_salida`,`c`.`fecha_regreso` AS `fecha_regreso`,`c`.`num_pasajeros_total` AS `num_pasajeros_total`,`c`.`precio_venta_final` AS `precio_venta_total`,to_days(`c`.`fecha_regreso`) - to_days(curdate()) AS `dias_restantes` from ((`cotizaciones` `c` left join `clientes` `cl` on(`c`.`cliente_id` = `cl`.`id`)) join `usuarios` `u` on(`c`.`agente_id` = `u`.`id`)) where `c`.`estado` = 'reservacion' and `c`.`fecha_salida` <= curdate() and `c`.`fecha_regreso` >= curdate() order by `c`.`fecha_regreso` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vista_viajes_mes`
--

/*!50001 DROP VIEW IF EXISTS `vista_viajes_mes`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vista_viajes_mes` AS select `c`.`id` AS `id`,`c`.`folio` AS `folio`,concat(`cl`.`nombre`,' ',`cl`.`apellido`) AS `cliente`,concat(`u`.`nombre`,' ',`u`.`apellido`) AS `agente`,`c`.`destino` AS `destino`,`c`.`fecha_salida` AS `fecha_salida`,`c`.`fecha_regreso` AS `fecha_regreso`,`c`.`num_pasajeros_total` AS `num_pasajeros_total`,`c`.`precio_venta_final` AS `precio_venta_total`,`c`.`estado` AS `estado` from ((`cotizaciones` `c` left join `clientes` `cl` on(`c`.`cliente_id` = `cl`.`id`)) join `usuarios` `u` on(`c`.`agente_id` = `u`.`id`)) where `c`.`estado` = 'reservacion' and year(`c`.`fecha_salida`) = year(curdate()) and month(`c`.`fecha_salida`) = month(curdate()) order by `c`.`fecha_salida` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vista_viajes_proximos`
--

/*!50001 DROP VIEW IF EXISTS `vista_viajes_proximos`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vista_viajes_proximos` AS select `c`.`id` AS `id`,`c`.`folio` AS `folio`,concat(`cl`.`nombre`,' ',`cl`.`apellido`) AS `cliente`,concat(`u`.`nombre`,' ',`u`.`apellido`) AS `agente`,`c`.`destino` AS `destino`,`c`.`fecha_salida` AS `fecha_salida`,`c`.`fecha_regreso` AS `fecha_regreso`,`c`.`num_pasajeros_total` AS `num_pasajeros_total`,`c`.`precio_venta_final` AS `precio_venta_total`,to_days(`c`.`fecha_salida`) - to_days(curdate()) AS `dias_para_viaje`,`c`.`estado` AS `estado` from ((`cotizaciones` `c` left join `clientes` `cl` on(`c`.`cliente_id` = `cl`.`id`)) join `usuarios` `u` on(`c`.`agente_id` = `u`.`id`)) where `c`.`estado` = 'reservacion' and `c`.`fecha_salida` between curdate() and curdate() + interval 10 day order by `c`.`fecha_salida` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-02  1:58:07
