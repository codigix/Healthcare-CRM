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
-- Table structure for table `inventory_alerts`
--

DROP TABLE IF EXISTS `inventory_alerts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_alerts` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `medicineId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `currentStock` int NOT NULL,
  `minLevel` int NOT NULL,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Low Stock',
  `supplier` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_alerts`
--

LOCK TABLES `inventory_alerts` WRITE;
/*!40000 ALTER TABLE `inventory_alerts` DISABLE KEYS */;
INSERT INTO `inventory_alerts` VALUES ('cmi484s3i0000umzwoloq778r','MED001','Ibuprofen 200mg','Medications',12,15,'Low Stock','PharmaTech Inc.','2025-11-18 07:00:16.830','2025-11-18 07:00:16.830'),('cmi484s3i0001umzw5ule7dov','MED002','Amoxicillin 500mg','Medications',8,10,'Low Stock','MedPlus Supplies','2025-11-18 07:00:16.830','2025-11-18 07:00:16.830'),('cmi484s3i0002umzwjtxpi41g','MED003','Surgical Masks (Box)','Medical Supplies',0,10,'Out of Stock','MedPlus Supplies','2025-11-18 07:00:16.830','2025-11-18 07:00:16.830'),('cmi484s3i0003umzwalln2qtr','MED004','Examination Table Paper','Medical Supplies',3,5,'Low Stock','Health Supply Co.','2025-11-18 07:00:16.830','2025-11-18 07:00:16.830'),('cmi484s3i0004umzwcor1bsqu','MED005','Surgical Gloves (Medium)','Medical Supplies',45,50,'Low Stock','MediEquip Solutions','2025-11-18 07:00:16.830','2025-11-18 07:00:16.830'),('cmi484s3i0005umzwt7261reo','MED006','Alcohol Swabs','Medical Supplies',0,20,'Out of Stock','Health Supply Co.','2025-11-18 07:00:16.830','2025-11-18 07:00:16.830'),('cmi484s3i0006umzwtch9v01a','MED007','Paracetamol 500mg','Medications',50,30,'Expiring Soon','Global Pharma Ltd.','2025-11-18 07:00:16.830','2025-11-18 07:00:16.830'),('cmi484s3i0007umzw493vg5gl','MED008','Aspirin 100mg','Medications',35,20,'Expiring Soon','PharmaTech Inc.','2025-11-18 07:00:16.830','2025-11-18 07:00:16.830'),('cmi488nzh0000umo80qlifxnf','MED001','Ibuprofen 200mg','Medications',12,15,'Low Stock','PharmaTech Inc.','2025-11-18 07:03:18.125','2025-11-18 07:03:18.125'),('cmi488nzh0001umo8xo8xkc0t','MED002','Amoxicillin 500mg','Medications',8,10,'Low Stock','MedPlus Supplies','2025-11-18 07:03:18.125','2025-11-18 07:03:18.125'),('cmi488nzh0002umo82q7kq4sj','MED003','Surgical Masks (Box)','Medical Supplies',0,10,'Out of Stock','MedPlus Supplies','2025-11-18 07:03:18.125','2025-11-18 07:03:18.125'),('cmi488nzh0003umo8n7426yqq','MED004','Examination Table Paper','Medical Supplies',3,5,'Low Stock','Health Supply Co.','2025-11-18 07:03:18.125','2025-11-18 07:03:18.125'),('cmi488nzh0004umo8gjgajua6','MED005','Surgical Gloves (Medium)','Medical Supplies',45,50,'Low Stock','MediEquip Solutions','2025-11-18 07:03:18.125','2025-11-18 07:03:18.125'),('cmi488nzh0005umo8umpnbwkp','MED006','Alcohol Swabs','Medical Supplies',0,20,'Out of Stock','Health Supply Co.','2025-11-18 07:03:18.125','2025-11-18 07:03:18.125'),('cmi488nzh0006umo8ps74fslg','MED007','Paracetamol 500mg','Medications',50,30,'Expiring Soon','Global Pharma Ltd.','2025-11-18 07:03:18.125','2025-11-18 07:03:18.125'),('cmi488nzh0007umo8mcbajleh','MED008','Aspirin 100mg','Medications',35,20,'Expiring Soon','PharmaTech Inc.','2025-11-18 07:03:18.125','2025-11-18 07:03:18.125');
/*!40000 ALTER TABLE `inventory_alerts` ENABLE KEYS */;
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
