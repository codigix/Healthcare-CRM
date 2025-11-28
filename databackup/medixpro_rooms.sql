-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: medixpro
-- ------------------------------------------------------
-- Server version	8.0.43

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
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `roomNumber` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `roomType` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `department` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `floor` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `capacity` int NOT NULL,
  `pricePerDay` decimal(65,30) NOT NULL,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Available',
  `description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `television` tinyint(1) NOT NULL DEFAULT '0',
  `attachedBathroom` tinyint(1) NOT NULL DEFAULT '0',
  `airConditioning` tinyint(1) NOT NULL DEFAULT '0',
  `wheelchairAccessible` tinyint(1) NOT NULL DEFAULT '0',
  `wifi` tinyint(1) NOT NULL DEFAULT '0',
  `oxygenSupply` tinyint(1) NOT NULL DEFAULT '0',
  `telephone` tinyint(1) NOT NULL DEFAULT '0',
  `nursecallButton` tinyint(1) NOT NULL DEFAULT '0',
  `additionalNotes` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `rooms_roomNumber_key` (`roomNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES ('7523dae0-c9e7-11f0-a4c7-ecb1d7504d91','105','Private','Cardiology','First',4,2500.000000000000000000000000000000,'Available','ok',1,0,0,1,0,1,0,0,'ok','2025-11-25 15:43:58.000','2025-11-25 15:43:58.000'),('cmi4bz36q002cum3ssuhkxfc8','101','Standard','Cardiology','1',2,2000.000000000000000000000000000000,'Available','Standard room with basic amenities',1,1,1,0,1,1,1,1,'Recently renovated','2025-11-18 08:47:49.731','2025-11-18 08:47:49.731'),('cmi4bz370002dum3sjk8qk1d0','102','Deluxe','Cardiology','1',1,3500.000000000000000000000000000000,'Occupied','Premium room with all amenities',1,1,1,1,1,1,1,1,'Best room in the ward','2025-11-18 08:47:49.740','2025-11-18 08:47:49.740'),('cmi4bz378002eum3s6bqeibkl','201','Semi-Private','Neurology','2',4,1500.000000000000000000000000000000,'Available','Semi-private room for 4 patients',1,0,1,0,1,1,0,1,'Shared bathroom available','2025-11-18 08:47:49.749','2025-11-18 08:47:49.749'),('cmi4bz37h002fum3so79bg8jl','202','ICU','Neurology','2',1,5000.000000000000000000000000000000,'Occupied','Intensive Care Unit room',0,1,1,1,1,1,0,1,'24x7 monitoring available','2025-11-18 08:47:49.757','2025-11-18 08:47:49.757'),('cmi4bz37q002gum3sv62mh223','301','General Ward','Pediatrics','3',6,1000.000000000000000000000000000000,'Available','General ward room',1,0,1,0,0,1,0,1,'Basic facilities','2025-11-18 08:47:49.767','2025-11-18 08:47:49.767'),('cmiefkb3c0000uacs11m2ljo6','103','ICU','ICU','2',1,2000.000000000000000000000000000000,'Available','Intensive Care Unit with advanced monitoring',0,0,0,0,0,0,0,0,NULL,'2025-11-25 10:26:00.359','2025-11-25 10:26:00.359'),('cmiefkb3u0001uacso82knlqn','104','Standard','General','1',3,500.000000000000000000000000000000,'Available','Standard room with basic amenities',0,0,0,0,0,0,0,0,NULL,'2025-11-25 10:26:00.378','2025-11-25 10:26:00.378');
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-26 14:55:30
