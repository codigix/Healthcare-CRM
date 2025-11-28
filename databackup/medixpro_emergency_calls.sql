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
-- Table structure for table `emergency_calls`
--

DROP TABLE IF EXISTS `emergency_calls`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emergency_calls` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `patientName` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `emergencyType` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `priority` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Medium',
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Pending',
  `ambulanceId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `callTime` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `notes` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `emergency_calls_ambulanceId_fkey` (`ambulanceId`),
  CONSTRAINT `emergency_calls_ambulanceId_fkey` FOREIGN KEY (`ambulanceId`) REFERENCES `ambulances` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emergency_calls`
--

LOCK TABLES `emergency_calls` WRITE;
/*!40000 ALTER TABLE `emergency_calls` DISABLE KEYS */;
INSERT INTO `emergency_calls` VALUES ('afc3ab15-c465-11f0-b367-c8d9d20837fa','Test','1234567890','Test','Test','High','Dispatched',NULL,'2025-11-18 15:32:26.804',NULL,'2025-11-18 15:32:26.000','2025-11-26 10:54:29.000'),('b8c958dc-c46e-11f0-b367-c8d9d20837fa','sanika mote','880659069','pune','Traffic Accident','High','Dispatched',NULL,'2025-11-18 16:37:07.412','okk','2025-11-18 16:37:07.000','2025-11-26 10:54:19.000'),('cmi4bz31l001jum3s6kxzf8x7','Ram Kumar','9876543260','Sector 5, Pune','Cardiac Arrest','High','Arrived',NULL,'2025-11-18 08:47:49.545','Patient is unconscious','2025-11-18 08:47:49.545','2025-11-26 10:54:40.000'),('cmi4bz32c001lum3so0828x9r','Priya Singh','9876543261','Market Street','Traffic Accident','High','Dispatched','cmi4bz2zu001gum3sddg7pfzi','2025-11-18 08:47:49.573','Multi-vehicle collision','2025-11-18 08:47:49.573','2025-11-18 08:47:49.573'),('cmi4bz32z001num3scwk79njr','Arjun Reddy','9876543262','Downtown Hospital','Severe Allergy','Medium','Completed','cmi4bz30b001hum3sy5d0pige','2025-11-18 08:47:49.595','Treated and discharged','2025-11-18 08:47:49.595','2025-11-18 08:47:49.595');
/*!40000 ALTER TABLE `emergency_calls` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-26 14:55:33
