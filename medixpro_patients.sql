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
-- Table structure for table `patients`
--

DROP TABLE IF EXISTS `patients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patients` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `dob` datetime(3) NOT NULL,
  `gender` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `history` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `specialization` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `doctorId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `patients_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patients`
--

LOCK TABLES `patients` WRITE;
/*!40000 ALTER TABLE `patients` DISABLE KEYS */;
INSERT INTO `patients` VALUES ('0af40740-c9cc-11f0-a4c7-ecb1d7504d91','chetana  kale','kale@gmail.com','1234567890','1985-06-14 18:30:00.000','Female','pune','Hypertension','2025-11-25 12:27:44.000','2025-11-25 11:51:12.801',NULL,'cmi4bz2qj000bum3sncdyvl0o'),('0f14bb0f-c45f-11f0-b367-c8d9d20837fa','sanika shankar mote','sale@gmail.co','08080659069','1990-03-21 18:30:00.000','Male','pune','Diabetes Type 2','2025-11-18 14:45:00.000','2025-11-26 12:08:15.000',NULL,'dcddda79-c46d-11f0-b367-c8d9d20837fa'),('71bfbcfd-c9d3-11f0-a4c7-ecb1d7504d91','abhijit   khedekar','abhi@gmail.com','123456789','1975-12-09 18:30:00.000','Female','pune','Asthma','2025-11-25 13:20:43.000','2025-11-25 11:51:12.840',NULL,'cmi4bz2qs000cum3s0vuzsr7a'),('cmi4bz2rl000fum3sk8rmokxm','John Doe','john.doe@email.com','9876543220','1995-09-04 18:30:00.000','Male','123 Main Street, Pune','Arthritis','2025-11-18 08:47:49.185','2025-11-25 11:51:12.845',NULL,'cmi4bz2r2000dum3sxol5c810'),('cmi4bz2rv000gum3sgp9tuoyk','Maria Garcia','maria.garcia@email.com','9876543221','1980-04-17 18:30:00.000','Female','456 Oak Avenue, Mumbai','Migraine','2025-11-18 08:47:49.195','2025-11-25 11:51:12.849',NULL,'cmi4bz2rb000eum3s4ofr04u1'),('cmi4bz2s3000hum3smfzjz2b1','Ravi Singh','ravi.singh@email.com','9876543222','1988-08-24 18:30:00.000','Male','789 Pine Road, Delhi','GERD','2025-11-18 08:47:49.203','2025-11-25 11:51:12.854',NULL,'dcddda79-c46d-11f0-b367-c8d9d20837fa'),('cmi4bz2sc000ium3sbpbxkle3','Ananya Kapoor','ananya.kapoor@email.com','9876543223','1992-02-11 18:30:00.000','Female','321 Maple Drive, Bangalore','Anemia','2025-11-18 08:47:49.212','2025-11-25 11:51:12.859',NULL,'cmi4bz2qj000bum3sncdyvl0o'),('cmi4bz2sk000jum3sjxjicnli','Vikram Desai','vikram.desai@email.com','9876543224','1978-10-29 18:30:00.000','Male','654 Cedar Lane, Hyderabad','High Cholesterol','2025-11-18 08:47:49.220','2025-11-25 11:51:12.866',NULL,'cmi4bz2qs000cum3s0vuzsr7a'),('ec82d795-c9d3-11f0-a4c7-ecb1d7504d91','sejal  kale','sejal@gmail.com','123456789','1998-05-07 18:30:00.000','Female','pune','None','2025-11-25 13:24:09.000','2025-11-25 11:51:12.872',NULL,'cmi4bz2r2000dum3sxol5c810');
/*!40000 ALTER TABLE `patients` ENABLE KEYS */;
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
