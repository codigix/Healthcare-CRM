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
-- Table structure for table `prescription_templates`
--

DROP TABLE IF EXISTS `prescription_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prescription_templates` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `medications` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdBy` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastUsed` datetime(3) DEFAULT NULL,
  `usageCount` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prescription_templates`
--

LOCK TABLES `prescription_templates` WRITE;
/*!40000 ALTER TABLE `prescription_templates` DISABLE KEYS */;
INSERT INTO `prescription_templates` VALUES ('cmi4bz38i002lum3sknr11j3c','Hypertension Management','Cardiovascular','Lisinopril 10mg - 1 tablet daily, Amlodipine 5mg - 1 tablet daily','cmi4bz2qj000bum3sncdyvl0o',NULL,0,'2025-11-18 08:47:49.795','2025-11-18 08:47:49.795'),('cmi4bz38r002mum3sqsguovd7','Diabetes Control','Endocrinology','Metformin 850mg - 2 tablets twice daily, Glipizide 5mg - 1 tablet daily','cmi4bz2qs000cum3s0vuzsr7a',NULL,0,'2025-11-18 08:47:49.803','2025-11-18 08:47:49.803'),('cmi4bz391002num3s6s2z9lyr','Infection Treatment','Infectious Diseases','Amoxicillin 500mg - 1 capsule three times daily, Azithromycin 250mg - 1 tablet daily','cmi4bz2r2000dum3sxol5c810',NULL,0,'2025-11-18 08:47:49.813','2025-11-18 08:47:49.813'),('f6f0d530-c528-11f0-84f2-c8d9d20837fa','Pain manage','pain','[]','cmi4bz2nq0001um3s54e5rgfk',NULL,0,'2025-11-19 14:50:18.000','2025-11-19 14:50:35.000');
/*!40000 ALTER TABLE `prescription_templates` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-26 14:54:35
