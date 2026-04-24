CREATE DATABASE  IF NOT EXISTS `freecontrol_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `freecontrol_db`;
-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: freecontrol_db
-- ------------------------------------------------------
-- Server version	8.0.39

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
-- Table structure for table `accion`
--

DROP TABLE IF EXISTS `accion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accion` (
  `id_accion` int NOT NULL AUTO_INCREMENT,
  `nombre_accion` varchar(100) NOT NULL,
  `descripcion` text,
  `tipo_accion` enum('teclado','raton','multimedia','sistema','macro') NOT NULL,
  `comando` varchar(255) NOT NULL,
  `parametros` json DEFAULT NULL,
  PRIMARY KEY (`id_accion`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accion`
--

LOCK TABLES `accion` WRITE;
/*!40000 ALTER TABLE `accion` DISABLE KEYS */;
INSERT INTO `accion` VALUES (26,'Click Izquierdo','Click principal','raton','MOUSE_LEFT',NULL),(27,'Click Derecho','Menú contextual','raton','MOUSE_RIGHT',NULL),(28,'Doble Click','Abrir archivo/carpeta','raton','MOUSE_DOUBLE',NULL),(29,'Scroll Arriba','Rueda ratón hacia arriba','raton','SCROLL_UP','10'),(30,'Scroll Abajo','Rueda ratón hacia abajo','raton','SCROLL_DOWN','10'),(31,'Tecla Espacio','Play/Pausa o Saltar','teclado','KEY_SPACE',NULL),(32,'Tecla Enter','Confirmar o bajar línea','teclado','KEY_ENTER',NULL),(33,'Tecla Escape','Salir o cancelar','teclado','KEY_ESC',NULL),(34,'Flecha Arriba','Navegar hacia arriba','teclado','KEY_UP',NULL),(35,'Flecha Abajo','Navegar hacia abajo','teclado','KEY_DOWN',NULL),(36,'Flecha Izquierda','Retroceder','teclado','KEY_LEFT',NULL),(37,'Flecha Derecha','Avanzar','teclado','KEY_RIGHT',NULL),(38,'Retroceso','Borrar carácter (Backspace)','teclado','KEY_BACKSPACE',NULL),(39,'Tabulador','Cambiar de campo/foco','teclado','KEY_TAB',NULL),(40,'Subir Volumen','Aumentar audio sistema','multimedia','VOL_UP',NULL),(41,'Bajar Volumen','Disminuir audio sistema','multimedia','VOL_DOWN',NULL),(42,'Silenciar','Mute/Unmute','multimedia','VOL_MUTE',NULL),(43,'Siguiente Pista','Siguiente canción/video','multimedia','MEDIA_NEXT',NULL),(44,'Pista Anterior','Canción/video anterior','multimedia','MEDIA_PREV',NULL),(45,'Captura Pantalla','Print Screen','sistema','SYS_SCREENSHOT',NULL),(46,'Copiar','Simular Ctrl+C / Cmd+C','macro','CMD_COPY',NULL),(47,'Pegar','Simular Ctrl+V / Cmd+V','macro','CMD_PASTE',NULL),(48,'Deshacer','Simular Ctrl+Z / Cmd+Z','macro','CMD_UNDO',NULL),(49,'Cerrar Ventana','Simular Alt+F4 / Cmd+W','macro','CMD_CLOSE',NULL),(50,'Minimizar Todo','Mostrar escritorio','macro','CMD_SHOW_DESKTOP',NULL),(51,'Abrir Google','Abre el buscador en el navegador','sistema','OPEN_GOOGLE',NULL),(52,'Abrir YouTube','Abre YouTube en el navegador','sistema','OPEN_YOUTUBE',NULL),(53,'Nueva Pestaña','Simular Ctrl+T','macro','BROWSER_NEW_TAB',NULL),(54,'Cerrar Pestaña','Simular Ctrl+W','macro','BROWSER_CLOSE_TAB',NULL);
/*!40000 ALTER TABLE `accion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gesto`
--

DROP TABLE IF EXISTS `gesto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gesto` (
  `id_gesto` int NOT NULL AUTO_INCREMENT,
  `nombre_gesto` varchar(50) NOT NULL,
  `descripcion` text,
  `imagen_referencia` varchar(255) DEFAULT NULL,
  `requiere_calibracion` tinyint(1) DEFAULT '0',
  `id_usuario` int DEFAULT NULL,
  PRIMARY KEY (`id_gesto`),
  UNIQUE KEY `nombre_gesto` (`nombre_gesto`),
  KEY `fk_gesto_usuario` (`id_usuario`),
  CONSTRAINT `fk_gesto_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gesto`
--

LOCK TABLES `gesto` WRITE;
/*!40000 ALTER TABLE `gesto` DISABLE KEYS */;
INSERT INTO `gesto` VALUES (1,'mano','[{\"x\":0.5078558325767517,\"y\":0.6833738684654236,\"z\":3.326704813844117e-7},{\"x\":0.4509666860103607,\"y\":0.6829608678817749,\"z\":-0.021422572433948517},{\"x\":0.3988739252090454,\"y\":0.6596552729606628,\"z\":-0.03469878435134888},{\"x\":0.3566415011882782,\"y\":0.6353388428688049,\"z\":-0.046674471348524094},{\"x\":0.32156795263290405,\"y\":0.6155714988708496,\"z\":-0.058523718267679214},{\"x\":0.4163380563259125,\"y\":0.5482091307640076,\"z\":-0.02335529960691929},{\"x\":0.38197121024131775,\"y\":0.48315665125846863,\"z\":-0.03970220312476158},{\"x\":0.36219853162765503,\"y\":0.4440867006778717,\"z\":-0.052057214081287384},{\"x\":0.3472318649291992,\"y\":0.40956538915634155,\"z\":-0.06119702756404877},{\"x\":0.44606325030326843,\"y\":0.5255565047264099,\"z\":-0.026588555425405502},{\"x\":0.4176982045173645,\"y\":0.45122814178466797,\"z\":-0.04038859158754349},{\"x\":0.39992284774780273,\"y\":0.4046536684036255,\"z\":-0.05241847038269043},{\"x\":0.38531097769737244,\"y\":0.36574381589889526,\"z\":-0.06163053587079048},{\"x\":0.47895586490631104,\"y\":0.5194971561431885,\"z\":-0.03272993490099907},{\"x\":0.4667642116546631,\"y\":0.4444224238395691,\"z\":-0.04970903694629669},{\"x\":0.4583025276660919,\"y\":0.39661163091659546,\"z\":-0.06202792003750801},{\"x\":0.4490208923816681,\"y\":0.35399580001831055,\"z\":-0.07073422521352768},{\"x\":0.5136246681213379,\"y\":0.527175784111023,\"z\":-0.040460843592882156},{\"x\":0.5243066549301147,\"y\":0.4689483642578125,\"z\":-0.05758444964885712},{\"x\":0.5310390591621399,\"y\":0.42848658561706543,\"z\":-0.06571274995803833},{\"x\":0.5347806215286255,\"y\":0.3916971683502197,\"z\":-0.07073422521352768}]',NULL,1,1),(2,'2','[{\"x\":0.7957103848457336,\"y\":0.8718938827514648,\"z\":0.0000018389728211332113},{\"x\":0.7205638885498047,\"y\":0.8475826382637024,\"z\":-0.07544111460447311},{\"x\":0.6683638095855713,\"y\":0.764206051826477,\"z\":-0.12098605930805206},{\"x\":0.7289894223213196,\"y\":0.7125049829483032,\"z\":-0.16178187727928162},{\"x\":0.8031701445579529,\"y\":0.6765698790550232,\"z\":-0.20039775967597961},{\"x\":0.6658142805099487,\"y\":0.5048145651817322,\"z\":-0.10300164669752121},{\"x\":0.6299540996551514,\"y\":0.3221355080604553,\"z\":-0.16209328174591064},{\"x\":0.6146782636642456,\"y\":0.19958698749542236,\"z\":-0.19572646915912628},{\"x\":0.6059614419937134,\"y\":0.08592045307159424,\"z\":-0.217992901802063},{\"x\":0.7532219886779785,\"y\":0.4748798906803131,\"z\":-0.1042473241686821},{\"x\":0.7874755859375,\"y\":0.2734350562095642,\"z\":-0.16505177319049835},{\"x\":0.8278301358222961,\"y\":0.14331945776939392,\"z\":-0.1961936056613922},{\"x\":0.8571882843971252,\"y\":0.023894667625427246,\"z\":-0.21145310997962952},{\"x\":0.8267497420310974,\"y\":0.5095251202583313,\"z\":-0.11140994727611542},{\"x\":0.8706188797950745,\"y\":0.44741302728652954,\"z\":-0.19230088591575623},{\"x\":0.8672133684158325,\"y\":0.585105836391449,\"z\":-0.20211055874824524},{\"x\":0.8570801615715027,\"y\":0.6880373954772949,\"z\":-0.1862282156944275},{\"x\":0.8824694752693176,\"y\":0.5786124467849731,\"z\":-0.12410023808479309},{\"x\":0.9088627099990845,\"y\":0.5933513641357422,\"z\":-0.19307941198349},{\"x\":0.8929175734519958,\"y\":0.6857377290725708,\"z\":-0.19837354123592377},{\"x\":0.8722693920135498,\"y\":0.7556936740875244,\"z\":-0.1862282156944275}]',NULL,1,1),(3,'jeje','[{\"x\":0.5498611927032471,\"y\":0.7699198722839355,\"z\":4.927439434254666e-8},{\"x\":0.4561828076839447,\"y\":0.7818021774291992,\"z\":-0.0478515699505806},{\"x\":0.3572348654270172,\"y\":0.73600172996521,\"z\":-0.0836668536067009},{\"x\":0.31677448749542236,\"y\":0.6700302958488464,\"z\":-0.1197756975889206},{\"x\":0.35770654678344727,\"y\":0.6094202995300293,\"z\":-0.15236175060272217},{\"x\":0.3218224346637726,\"y\":0.5112027525901794,\"z\":-0.058750275522470474},{\"x\":0.24812549352645874,\"y\":0.370719313621521,\"z\":-0.10208823531866074},{\"x\":0.20315536856651306,\"y\":0.2870769798755646,\"z\":-0.12425262480974197},{\"x\":0.1692351996898651,\"y\":0.21395087242126465,\"z\":-0.14201347529888153},{\"x\":0.38413286209106445,\"y\":0.4796503782272339,\"z\":-0.06238318234682083},{\"x\":0.34298276901245117,\"y\":0.40886467695236206,\"z\":-0.150893896818161},{\"x\":0.3622758388519287,\"y\":0.5338340401649475,\"z\":-0.17261792719364166},{\"x\":0.382964551448822,\"y\":0.6215218901634216,\"z\":-0.1670401394367218},{\"x\":0.45263898372650146,\"y\":0.4614901542663574,\"z\":-0.07074986398220062},{\"x\":0.4245362877845764,\"y\":0.3608630895614624,\"z\":-0.15008658170700073},{\"x\":0.4244343936443329,\"y\":0.4653942584991455,\"z\":-0.15045355260372162},{\"x\":0.4263690710067749,\"y\":0.5513001084327698,\"z\":-0.13005056977272034},{\"x\":0.522081732749939,\"y\":0.46404945850372314,\"z\":-0.08278614282608032},{\"x\":0.5318312644958496,\"y\":0.35520780086517334,\"z\":-0.14516933262348175},{\"x\":0.5383421778678894,\"y\":0.2819784879684448,\"z\":-0.16498516499996185},{\"x\":0.5422113537788391,\"y\":0.20001220703125,\"z\":-0.16557228565216064}]',NULL,1,1);
/*!40000 ALTER TABLE `gesto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historial`
--

DROP TABLE IF EXISTS `historial`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial` (
  `id_historial` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_perfil` int DEFAULT NULL,
  `fecha_hora` datetime DEFAULT CURRENT_TIMESTAMP,
  `id_gesto` int DEFAULT NULL,
  `id_sonido` int DEFAULT NULL,
  `id_accion` int NOT NULL,
  `resultado` enum('EXITO','FALLO_DETECCION','FALLO_EJECUCION') DEFAULT 'EXITO',
  `tiempo_respuesta_ms` int DEFAULT NULL,
  PRIMARY KEY (`id_historial`),
  KEY `id_perfil` (`id_perfil`),
  KEY `id_sonido` (`id_sonido`),
  KEY `id_accion` (`id_accion`),
  KEY `idx_usuario_fecha` (`id_usuario`,`fecha_hora`),
  KEY `idx_gesto` (`id_gesto`),
  CONSTRAINT `historial_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE,
  CONSTRAINT `historial_ibfk_2` FOREIGN KEY (`id_perfil`) REFERENCES `perfil` (`id_perfil`) ON DELETE SET NULL,
  CONSTRAINT `historial_ibfk_3` FOREIGN KEY (`id_gesto`) REFERENCES `gesto` (`id_gesto`) ON DELETE SET NULL,
  CONSTRAINT `historial_ibfk_4` FOREIGN KEY (`id_sonido`) REFERENCES `sonido` (`id_sonido`) ON DELETE SET NULL,
  CONSTRAINT `historial_ibfk_5` FOREIGN KEY (`id_accion`) REFERENCES `accion` (`id_accion`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial`
--

LOCK TABLES `historial` WRITE;
/*!40000 ALTER TABLE `historial` DISABLE KEYS */;
/*!40000 ALTER TABLE `historial` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `perfil`
--

DROP TABLE IF EXISTS `perfil`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `perfil` (
  `id_perfil` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `nombre_perfil` varchar(50) NOT NULL,
  `es_activo` tinyint(1) DEFAULT '0',
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_perfil`),
  UNIQUE KEY `unique_perfil_usuario` (`id_usuario`,`nombre_perfil`),
  CONSTRAINT `perfil_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `perfil`
--

LOCK TABLES `perfil` WRITE;
/*!40000 ALTER TABLE `perfil` DISABLE KEYS */;
INSERT INTO `perfil` VALUES (1,3,'aaaaaa',0,'2026-04-13 19:00:26'),(2,4,'jejeje',0,'2026-04-15 12:54:43'),(3,1,'dede',0,'2026-04-15 18:25:43'),(4,1,'aaaaa',0,'2026-04-15 18:47:06'),(5,2,'a',0,'2026-04-15 19:14:55'),(6,1,'popojoboi',0,'2026-04-22 19:03:58'),(7,2,'nknk',0,'2026-04-22 19:28:59'),(8,2,'bj',0,'2026-04-22 19:36:46'),(9,1,'asca',0,'2026-04-23 20:05:57');
/*!40000 ALTER TABLE `perfil` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `perfil_gesto_accion`
--

DROP TABLE IF EXISTS `perfil_gesto_accion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `perfil_gesto_accion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_perfil` int NOT NULL,
  `id_gesto` int NOT NULL,
  `id_accion` int NOT NULL,
  `activo` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_gesto_perfil` (`id_perfil`,`id_gesto`),
  KEY `id_gesto` (`id_gesto`),
  KEY `id_accion` (`id_accion`),
  CONSTRAINT `perfil_gesto_accion_ibfk_1` FOREIGN KEY (`id_perfil`) REFERENCES `perfil` (`id_perfil`) ON DELETE CASCADE,
  CONSTRAINT `perfil_gesto_accion_ibfk_2` FOREIGN KEY (`id_gesto`) REFERENCES `gesto` (`id_gesto`) ON DELETE CASCADE,
  CONSTRAINT `perfil_gesto_accion_ibfk_3` FOREIGN KEY (`id_accion`) REFERENCES `accion` (`id_accion`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `perfil_gesto_accion`
--

LOCK TABLES `perfil_gesto_accion` WRITE;
/*!40000 ALTER TABLE `perfil_gesto_accion` DISABLE KEYS */;
INSERT INTO `perfil_gesto_accion` VALUES (1,2,1,50,1);
/*!40000 ALTER TABLE `perfil_gesto_accion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `perfil_sonido_accion`
--

DROP TABLE IF EXISTS `perfil_sonido_accion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `perfil_sonido_accion` (
  `id_psa` int NOT NULL AUTO_INCREMENT,
  `id_perfil` int DEFAULT NULL,
  `id_sonido` int DEFAULT NULL,
  `id_accion` int DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id_psa`),
  KEY `fk_psa_sonido` (`id_sonido`),
  KEY `fk_psa_perfil` (`id_perfil`),
  KEY `fk_psa_accion` (`id_accion`),
  CONSTRAINT `fk_psa_accion` FOREIGN KEY (`id_accion`) REFERENCES `accion` (`id_accion`) ON DELETE CASCADE,
  CONSTRAINT `fk_psa_perfil` FOREIGN KEY (`id_perfil`) REFERENCES `perfil` (`id_perfil`) ON DELETE CASCADE,
  CONSTRAINT `fk_psa_sonido` FOREIGN KEY (`id_sonido`) REFERENCES `sonido` (`id_sonido`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `perfil_sonido_accion`
--

LOCK TABLES `perfil_sonido_accion` WRITE;
/*!40000 ALTER TABLE `perfil_sonido_accion` DISABLE KEYS */;
INSERT INTO `perfil_sonido_accion` VALUES (3,1,7,51,1),(4,1,10,52,1),(5,1,16,51,1),(6,1,19,53,1),(7,1,22,54,1),(28,4,17,42,1),(29,4,1,46,1);
/*!40000 ALTER TABLE `perfil_sonido_accion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol`
--

DROP TABLE IF EXISTS `rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol` (
  `id_rol` int NOT NULL AUTO_INCREMENT,
  `nombre_rol` varchar(50) NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id_rol`),
  UNIQUE KEY `nombre_rol` (`nombre_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol`
--

LOCK TABLES `rol` WRITE;
/*!40000 ALTER TABLE `rol` DISABLE KEYS */;
INSERT INTO `rol` VALUES (1,'admin','Administrador del sistema'),(2,'usuario','Usuario normal'),(3,'invitado','Usuario limitado');
/*!40000 ALTER TABLE `rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sonido`
--

DROP TABLE IF EXISTS `sonido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sonido` (
  `id_sonido` int NOT NULL AUTO_INCREMENT,
  `nombre_sonido` varchar(100) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `id_usuario` int DEFAULT NULL,
  PRIMARY KEY (`id_sonido`),
  KEY `fk_sonido_usuario` (`id_usuario`),
  CONSTRAINT `fk_sonido_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sonido`
--

LOCK TABLES `sonido` WRITE;
/*!40000 ALTER TABLE `sonido` DISABLE KEYS */;
INSERT INTO `sonido` VALUES (1,'Comando Voz','cerar',1),(2,'Comando Voz','dónde va a quedar como en el tabiátrio dónde va a quedar como en el tabiátrio',1),(3,'Comando Voz','serar',1),(4,'Comando Voz','terar',2),(5,'Comando Voz','hola',2),(6,'Comando Voz','me aburo',2),(7,'Comando Voz','de drar',2),(8,'Comando Voz','de rara',2),(9,'Comando Voz','ferar',2),(10,'Comando Voz','clos clos',2),(11,'Comando Voz','qué día más soleado hace',1),(12,'Comando Voz','meduole la pierna izquierda',2),(13,'Comando Voz','me duele la pierna de leche',2),(14,'Comando Voz','avió',2),(15,'Comando Voz','me he comprado un nuevo ordenador',2),(16,'Comando Voz','vímeda es la gente',2),(17,'Comando Voz','[música]',1),(18,'Comando Voz','si tu madre para mi asilo vale',1),(19,'Comando Voz','para amnegar el alma personal y para amnegar el alma',1);
/*!40000 ALTER TABLE `sonido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre_usuario` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contrasena_hash` varchar(255) DEFAULT NULL,
  `id_rol` int NOT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `fecha_registro` datetime DEFAULT CURRENT_TIMESTAMP,
  `ultimo_acceso` datetime DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `nombre_usuario` (`nombre_usuario`),
  UNIQUE KEY `email` (`email`),
  KEY `id_rol` (`id_rol`),
  CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'sergio','sergio@gmail.com','$2b$10$AiOfXvPUvuq5lXA2cjE9b.y6EK9GOOnQZXCnmlNteqAlOJ5twvJqq',1,1,'2026-04-15 18:25:25',NULL),(2,'ana','ana@gmail.com','$2b$10$9cbD8EvJFiNkoXQSJsH9NOUZFfi1OanDthr6KoGHQ1nk8/zdcAIky',1,1,'2026-04-15 19:14:41',NULL);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-24 12:25:23
