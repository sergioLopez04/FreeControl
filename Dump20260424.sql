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
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accion`
--

LOCK TABLES `accion` WRITE;
/*!40000 ALTER TABLE `accion` DISABLE KEYS */;
INSERT INTO `accion` VALUES (1,'Click Izquierdo','Click principal','raton','MOUSE_LEFT',NULL),(2,'Click Derecho','Menú contextual','raton','MOUSE_RIGHT',NULL),(3,'Doble Click','Abrir archivo/carpeta','raton','MOUSE_DOUBLE',NULL),(4,'Scroll Arriba','Rueda ratón hacia arriba','raton','SCROLL_UP','10'),(5,'Scroll Abajo','Rueda ratón hacia abajo','raton','SCROLL_DOWN','10'),(6,'Tecla Espacio','Play/Pausa o Saltar','teclado','KEY_SPACE',NULL),(7,'Tecla Enter','Confirmar o bajar línea','teclado','KEY_ENTER',NULL),(8,'Tecla Escape','Salir o cancelar','teclado','KEY_ESC',NULL),(9,'Flecha Arriba','Navegar hacia arriba','teclado','KEY_UP',NULL),(10,'Flecha Abajo','Navegar hacia abajo','teclado','KEY_DOWN',NULL),(11,'Flecha Izquierda','Retroceder','teclado','KEY_LEFT',NULL),(12,'Flecha Derecha','Avanzar','teclado','KEY_RIGHT',NULL),(13,'Retroceso','Borrar carácter (Backspace)','teclado','KEY_BACKSPACE',NULL),(14,'Tabulador','Cambiar de campo/foco','teclado','KEY_TAB',NULL),(15,'Subir Volumen','Aumentar audio sistema','multimedia','VOL_UP',NULL),(16,'Bajar Volumen','Disminuir audio sistema','multimedia','VOL_DOWN',NULL),(17,'Silenciar','Mute/Unmute','multimedia','VOL_MUTE',NULL),(18,'Siguiente Pista','Siguiente canción/video','multimedia','MEDIA_NEXT',NULL),(19,'Pista Anterior','Canción/video anterior','multimedia','MEDIA_PREV',NULL),(20,'Captura Pantalla','Print Screen','sistema','SYS_SCREENSHOT',NULL),(21,'Copiar','Simular Ctrl+C / Cmd+C','macro','CMD_COPY',NULL),(22,'Pegar','Simular Ctrl+V / Cmd+V','macro','CMD_PASTE',NULL),(23,'Deshacer','Simular Ctrl+Z / Cmd+Z','macro','CMD_UNDO',NULL),(24,'Cerrar Ventana','Simular Alt+F4 / Cmd+W','macro','CMD_CLOSE',NULL),(25,'Minimizar Todo','Mostrar escritorio','macro','CMD_SHOW_DESKTOP',NULL),(26,'Abrir Google','Abre el buscador en el navegador','sistema','OPEN_GOOGLE',NULL),(27,'Abrir YouTube','Abre YouTube en el navegador','sistema','OPEN_YOUTUBE',NULL),(28,'Nueva Pestaña','Simular Ctrl+T','macro','BROWSER_NEW_TAB',NULL),(29,'Cerrar Pestaña','Simular Ctrl+W','macro','BROWSER_CLOSE_TAB',NULL);
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gesto`
--

LOCK TABLES `gesto` WRITE;
/*!40000 ALTER TABLE `gesto` DISABLE KEYS */;
/*!40000 ALTER TABLE `gesto` ENABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `perfil`
--

LOCK TABLES `perfil` WRITE;
/*!40000 ALTER TABLE `perfil` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `perfil_gesto_accion`
--

LOCK TABLES `perfil_gesto_accion` WRITE;
/*!40000 ALTER TABLE `perfil_gesto_accion` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `perfil_sonido_accion`
--

LOCK TABLES `perfil_sonido_accion` WRITE;
/*!40000 ALTER TABLE `perfil_sonido_accion` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sonido`
--

LOCK TABLES `sonido` WRITE;
/*!40000 ALTER TABLE `sonido` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
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

-- Dump completed on 2026-04-24 17:47:36
