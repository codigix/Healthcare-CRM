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
-- Table structure for table `prescriptions`
--

DROP TABLE IF EXISTS `prescriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prescriptions` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `patientId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `doctorId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `prescriptionDate` datetime(3) NOT NULL,
  `prescriptionType` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Standard',
  `diagnosis` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notesForPharmacist` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Active',
  `medications` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `prescriptions_patientId_fkey` (`patientId`),
  KEY `prescriptions_doctorId_fkey` (`doctorId`),
  CONSTRAINT `prescriptions_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `doctors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `prescriptions_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `patients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prescriptions`
--

LOCK TABLES `prescriptions` WRITE;
/*!40000 ALTER TABLE `prescriptions` DISABLE KEYS */;
INSERT INTO `prescriptions` VALUES ('6e88a010-c46e-11f0-b367-c8d9d20837fa','0f14bb0f-c45f-11f0-b367-c8d9d20837fa','dcddda79-c46d-11f0-b367-c8d9d20837fa','2025-11-18 16:35:02.000','Standard','cancer','okk','Active','[object Object]','2025-11-18 16:35:02.000','2025-11-18 16:35:02.000'),('786567b7-c526-11f0-84f2-c8d9d20837fa','cmi4bz2rv000gum3sgp9tuoyk','cmi4bz2rb000eum3s4ofr04u1','2025-11-19 14:32:26.000','Standard','okk',NULL,'Active','[object Object]','2025-11-19 14:32:26.000','2025-11-19 14:32:26.000'),('8f9e2c5b-c507-11f0-84f2-c8d9d20837fa','0f14bb0f-c45f-11f0-b367-c8d9d20837fa','dcddda79-c46d-11f0-b367-c8d9d20837fa','2025-11-19 10:51:11.000','Standard','okk','okk','Active','[object Object]','2025-11-19 10:51:11.000','2025-11-19 10:51:11.000'),('b95d28c9-c525-11f0-84f2-c8d9d20837fa','cmi4bz2sk000jum3sjxjicnli','dcddda79-c46d-11f0-b367-c8d9d20837fa','2025-11-19 14:27:06.000','Standard','okk','ok','Active','[object Object]','2025-11-19 14:27:06.000','2025-11-19 14:27:06.000'),('cmi4bz2w50011um3s3x1auet6','cmi4bz2rl000fum3sk8rmokxm','cmi4bz2qj000bum3sncdyvl0o','2025-11-15 00:00:00.000','Standard','Hypertension','Take with food','Active','Lisinopril 10mg - 1 tablet daily','2025-11-18 08:47:49.349','2025-11-18 08:47:49.349'),('cmi4bz2we0013um3s1isbgzc6','cmi4bz2rv000gum3sgp9tuoyk','cmi4bz2qs000cum3s0vuzsr7a','2025-11-14 00:00:00.000','Standard','Diabetes Type 2','Monitor blood sugar levels','Active','Metformin 850mg - 2 tablets twice daily','2025-11-18 08:47:49.358','2025-11-18 08:47:49.358'),('cmi4bz2wn0015um3sz2941oot','cmi4bz2s3000hum3smfzjz2b1','cmi4bz2r2000dum3sxol5c810','2025-11-13 00:00:00.000','Standard','Bacterial Infection','Complete full course','Active','Amoxicillin 500mg - 1 capsule three times daily','2025-11-18 08:47:49.367','2025-11-18 08:47:49.367'),('f3ee9d10-c523-11f0-84f2-c8d9d20837fa','0f14bb0f-c45f-11f0-b367-c8d9d20837fa','dcddda79-c46d-11f0-b367-c8d9d20837fa','2025-11-19 14:14:25.000','Standard','okk','okk','Active','[object Object]','2025-11-19 14:14:25.000','2025-11-19 14:14:25.000');
/*!40000 ALTER TABLE `prescriptions` ENABLE KEYS */;
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
