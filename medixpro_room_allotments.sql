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
-- Table structure for table `room_allotments`
--

DROP TABLE IF EXISTS `room_allotments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_allotments` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `patientId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `patientName` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `patientPhone` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `roomId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `attendingDoctor` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `emergencyContact` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `specialRequirements` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `allotmentDate` datetime(3) NOT NULL,
  `expectedDischargeDate` datetime(3) DEFAULT NULL,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Occupied',
  `paymentMethod` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `insuranceDetails` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `additionalNotes` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `room_allotments_roomId_fkey` (`roomId`),
  CONSTRAINT `room_allotments_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_allotments`
--

LOCK TABLES `room_allotments` WRITE;
/*!40000 ALTER TABLE `room_allotments` DISABLE KEYS */;
INSERT INTO `room_allotments` VALUES ('cmi4bz37z002ium3sh6elp1n6','cmi4bz2rl000fum3sk8rmokxm','John Doe','9876543220','cmi4bz370002dum3sjk8qk1d0','Dr. Rajesh Kumar','Sarah Doe','Requires oxygen support','2025-11-15 00:00:00.000','2025-11-22 00:00:00.000','Occupied','Credit Card','Covered by HealthCare Insurance Co','Post-operative care','2025-11-18 08:47:49.775','2025-11-18 08:47:49.775'),('cmi4bz38a002kum3sw9v5qn4n','cmi4bz2rv000gum3sgp9tuoyk','Maria Garcia','9876543221','cmi4bz37h002fum3so79bg8jl','Dr. Priya Sharma','Michael Garcia','ICU monitoring required','2025-11-12 00:00:00.000','2025-11-25 00:00:00.000','Occupied','Insurance','Covered by Life Insurance Ltd','Critical condition - under observation','2025-11-18 08:47:49.786','2025-11-18 08:47:49.786'),('cmiefkb4i0003uacspaien4c2','patient-1764066360397-0.6118273161335523','Vikram Desai','9876543210','cmi4bz36q002cum3ssuhkxfc8','Dr. Sanika Mote',NULL,NULL,'2025-11-25 10:26:00.398',NULL,'Occupied',NULL,NULL,NULL,'2025-11-25 10:26:00.402','2025-11-25 10:26:00.402'),('cmiefkb4s0005uacspsauva1h','patient-1764066360410-0.2470144991167631','Aditi More','9123456789','cmi4bz36q002cum3ssuhkxfc8','Dr. Sanika Mote',NULL,NULL,'2025-11-25 10:26:00.410',NULL,'Occupied',NULL,NULL,NULL,'2025-11-25 10:26:00.412','2025-11-25 10:26:00.412'),('cmiefkb530007uacskmw519et','patient-1764066360421-0.9869626011734873','Chetana Kale','9988776655','cmi4bz370002dum3sjk8qk1d0','Dr. Rahul Singh',NULL,NULL,'2025-11-25 10:26:00.421',NULL,'Occupied',NULL,NULL,NULL,'2025-11-25 10:26:00.423','2025-11-25 10:26:00.423'),('cmiefkb5h0009uacs2uqf7yep','patient-1764066360435-0.3738452923170279','Suresh Patil','9654321098','cmiefkb3c0000uacs11m2ljo6','Dr. Priya Sharma',NULL,NULL,'2025-11-25 10:26:00.435',NULL,'Occupied',NULL,NULL,NULL,'2025-11-25 10:26:00.437','2025-11-25 10:26:00.437'),('cmiefkb5s000buacstxt59ah3','patient-1764066360446-0.48517321011213443','Anjali Kumar','9876123456','cmi4bz378002eum3s6bqeibkl','Dr. Sanjay Gupta',NULL,NULL,'2025-11-25 10:26:00.446',NULL,'Occupied',NULL,NULL,NULL,'2025-11-25 10:26:00.448','2025-11-25 10:26:00.448');
/*!40000 ALTER TABLE `room_allotments` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-26 14:54:34
