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
-- Table structure for table `appointments`
--

DROP TABLE IF EXISTS `appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointments` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `doctorId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `patientId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` datetime(3) NOT NULL,
  `time` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `notes` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `roomId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tokenNumber` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `appointments_doctorId_fkey` (`doctorId`),
  KEY `appointments_patientId_fkey` (`patientId`),
  CONSTRAINT `appointments_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `doctors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `appointments_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `patients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointments`
--

LOCK TABLES `appointments` WRITE;
/*!40000 ALTER TABLE `appointments` DISABLE KEYS */;
INSERT INTO `appointments` VALUES ('00836098-c51a-11f0-84f2-c8d9d20837fa','cmi4bz2r2000dum3sxol5c810','0f14bb0f-c45f-11f0-b367-c8d9d20837fa','2025-11-19 05:30:00.000','11:00','scheduled','okk\nReason: okk','2025-11-19 13:03:11.000','2025-11-25 10:41:16.263','100','1000'),('1203d227-c9f9-11f0-a4c7-ecb1d7504d91','dcddda79-c46d-11f0-b367-c8d9d20837fa','0f14bb0f-c45f-11f0-b367-c8d9d20837fa','2025-11-25 05:30:00.000','18:50','scheduled','Appointment created by MedixPro AI Assistant for general consultation','2025-11-25 17:50:03.000','2025-11-25 17:50:03.000','cmi4bz36q002cum3ssuhkxfc8','08'),('2400b3cb-c51a-11f0-84f2-c8d9d20837fa','cmi4bz2rb000eum3s4ofr04u1','cmi4bz2sk000jum3sjxjicnli','2025-11-19 05:30:00.000','14:00','scheduled','okk\nReason: okk','2025-11-19 13:04:11.000','2025-11-25 10:41:16.587','101','1001'),('364cbec6-c9e4-11f0-a4c7-ecb1d7504d91','cmi4bz2qs000cum3s0vuzsr7a','ec82d795-c9d3-11f0-a4c7-ecb1d7504d91','2025-11-25 05:30:00.000','14:00','scheduled','okk\nReason: okk','2025-11-25 15:20:44.000','2025-11-25 10:41:16.902','102','1002'),('388bbef7-c9c7-11f0-a4c7-ecb1d7504d91','dcddda79-c46d-11f0-b367-c8d9d20837fa','0f14bb0f-c45f-11f0-b367-c8d9d20837fa','2025-11-25 05:30:00.000','12:53','scheduled','Appointment created by MedixPro AI Assistant for Neurology consultation','2025-11-25 11:53:13.000','2025-11-25 10:41:17.426','103','1003'),('48685bf8-c9ce-11f0-a4c7-ecb1d7504d91','dcddda79-c46d-11f0-b367-c8d9d20837fa','0f14bb0f-c45f-11f0-b367-c8d9d20837fa','2025-11-25 05:30:00.000','13:43','scheduled','Appointment created by MedixPro AI Assistant for general consultation','2025-11-25 12:43:46.000','2025-11-25 10:41:17.948','100','1004'),('49ea75ea-c9e4-11f0-a4c7-ecb1d7504d91','cmi4bz2qs000cum3s0vuzsr7a','71bfbcfd-c9d3-11f0-a4c7-ecb1d7504d91','2025-11-26 05:30:00.000','14:00','scheduled','okk\nReason: okk','2025-11-25 15:21:17.000','2025-11-25 10:41:18.264','101','1005'),('4f4c631b-ca89-11f0-9cd8-ecb1d7504d91','dcddda79-c46d-11f0-b367-c8d9d20837fa','0f14bb0f-c45f-11f0-b367-c8d9d20837fa','2025-11-26 05:30:00.000','12:02','scheduled','Appointment created by MedixPro AI Assistant for general consultation','2025-11-26 11:02:33.000','2025-11-26 11:02:33.000','cmi4bz36q002cum3ssuhkxfc8','98'),('537af9a9-c9cc-11f0-a4c7-ecb1d7504d91','dcddda79-c46d-11f0-b367-c8d9d20837fa','cmi4bz2sk000jum3sjxjicnli','2025-11-25 05:30:00.000','13:29','scheduled','Appointment created by MedixPro AI Assistant for general consultation','2025-11-25 12:29:45.000','2025-11-25 10:41:18.583','102','1006'),('59833de7-c9e8-11f0-a4c7-ecb1d7504d91','dcddda79-c46d-11f0-b367-c8d9d20837fa','0f14bb0f-c45f-11f0-b367-c8d9d20837fa','2025-11-25 05:30:00.000','16:50','scheduled','Appointment created by MedixPro AI Assistant for general consultation','2025-11-25 15:50:21.000','2025-11-25 10:41:18.893','103','1007'),('59fa7509-c9d2-11f0-a4c7-ecb1d7504d91','dcddda79-c46d-11f0-b367-c8d9d20837fa','0f14bb0f-c45f-11f0-b367-c8d9d20837fa','2025-11-25 05:30:00.000','14:12','scheduled','Appointment created by MedixPro AI Assistant for general consultation','2025-11-25 13:12:53.000','2025-11-25 10:41:19.216','100','1008'),('5edc108c-c9cb-11f0-a4c7-ecb1d7504d91','dcddda79-c46d-11f0-b367-c8d9d20837fa','0f14bb0f-c45f-11f0-b367-c8d9d20837fa','2025-11-25 05:30:00.000','13:22','scheduled','Appointment created by MedixPro AI Assistant for general consultation','2025-11-25 12:22:55.000','2025-11-25 10:41:19.532','101','1009'),('7c306445-c9de-11f0-a4c7-ecb1d7504d91','dcddda79-c46d-11f0-b367-c8d9d20837fa','0f14bb0f-c45f-11f0-b367-c8d9d20837fa','2025-11-25 05:30:00.000','15:39','scheduled','Appointment created by MedixPro AI Assistant for general consultation','2025-11-25 14:39:45.000','2025-11-25 17:54:49.000','cmi4bz36q002cum3ssuhkxfc8','Token A1'),('7d057597-ca92-11f0-9cd8-ecb1d7504d91','dcddda79-c46d-11f0-b367-c8d9d20837fa','0f14bb0f-c45f-11f0-b367-c8d9d20837fa','2025-11-26 05:30:00.000','13:08','scheduled','Appointment created by MedixPro AI Assistant for general consultation','2025-11-26 12:08:16.000','2025-11-26 12:08:16.000','cmi4bz36q002cum3ssuhkxfc8','12'),('8af54941-c45e-11f0-b367-c8d9d20837fa','cmi4bz2rb000eum3s4ofr04u1','0f14bb0f-c45f-11f0-b367-c8d9d20837fa','2025-11-18 05:30:00.000','16:00','completed','okk\nReason: okk','2025-11-18 14:41:18.000','2025-11-18 16:32:29.000',NULL,NULL),('c2b87378-c9cf-11f0-a4c7-ecb1d7504d91','dcddda79-c46d-11f0-b367-c8d9d20837fa','cmi4bz2sk000jum3sjxjicnli','2025-11-25 05:30:00.000','13:54','scheduled','Appointment created by MedixPro AI Assistant for general consultation','2025-11-25 12:54:21.000','2025-11-25 17:54:49.000','cmi4bz36q002cum3ssuhkxfc8','Token A2'),('cf46772e-c9cf-11f0-a4c7-ecb1d7504d91','dcddda79-c46d-11f0-b367-c8d9d20837fa','0f14bb0f-c45f-11f0-b367-c8d9d20837fa','2025-11-25 05:30:00.000','13:54','scheduled','Appointment created by MedixPro AI Assistant for general consultation','2025-11-25 12:54:42.000','2025-11-25 17:54:49.000','cmi4bz36q002cum3ssuhkxfc8','Token A3'),('cmi4bz2st000lum3s8einq8c6','cmi4bz2qj000bum3sncdyvl0o','cmi4bz2rl000fum3sk8rmokxm','2025-11-20 04:30:00.000','10:00 AM','scheduled','Regular checkup','2025-11-18 08:47:49.229','2025-11-18 08:47:49.229',NULL,NULL),('cmi4bz2t4000num3s7l74cc39','cmi4bz2r2000dum3sxol5c810','0f14bb0f-c45f-11f0-b367-c8d9d20837fa','2025-11-20 05:30:00.000','12:03','completed','Follow-up consultation','2025-11-18 08:47:49.240','2025-11-19 11:03:16.000',NULL,NULL),('cmi4bz2te000pum3sq6mzbso2','cmi4bz2r2000dum3sxol5c810','cmi4bz2s3000hum3smfzjz2b1','2025-11-21 22:00:00.000','3:30 PM','scheduled','Blood pressure check','2025-11-18 08:47:49.250','2025-11-18 08:47:49.250',NULL,NULL),('cmi4bz2tn000rum3s2rolnwt6','cmi4bz2rb000eum3s4ofr04u1','cmi4bz2sc000ium3sbpbxkle3','2025-11-23 05:30:00.000','11:00 AM','pending','Orthopedic consultation','2025-11-18 08:47:49.259','2025-11-18 08:47:49.259',NULL,NULL),('dba49353-c45d-11f0-b367-c8d9d20837fa','cmi4bz2rb000eum3s4ofr04u1','cmi4bz2sk000jum3sjxjicnli','2025-11-25 05:30:00.000','10:00','scheduled','okk\nReason: okk','2025-11-18 14:36:24.000','2025-11-19 11:02:52.000',NULL,NULL),('ec62c8da-c9e9-11f0-a4c7-ecb1d7504d91','cmi4bz2qj000bum3sncdyvl0o','71bfbcfd-c9d3-11f0-a4c7-ecb1d7504d91','2025-11-25 05:30:00.000','13:00','scheduled','okk\nReason: okk','2025-11-25 16:01:37.000','2025-11-25 16:01:37.000',NULL,NULL),('f8c74d43-c9e3-11f0-a4c7-ecb1d7504d91','dcddda79-c46d-11f0-b367-c8d9d20837fa','0f14bb0f-c45f-11f0-b367-c8d9d20837fa','2025-11-25 05:30:00.000','16:19','scheduled','Appointment created by MedixPro AI Assistant for general consultation','2025-11-25 15:19:01.000','2025-11-25 17:54:49.000','cmi4bz36q002cum3ssuhkxfc8','Token A4'),('fb1bca58-c9f7-11f0-a4c7-ecb1d7504d91','dcddda79-c46d-11f0-b367-c8d9d20837fa','cmi4bz2sk000jum3sjxjicnli','2025-11-25 05:30:00.000','12:00','scheduled','okk\nReason:  okk','2025-11-25 17:42:15.000','2025-11-25 17:54:49.000','cmi4bz36q002cum3ssuhkxfc8','Token A5');
/*!40000 ALTER TABLE `appointments` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-26 14:55:32
