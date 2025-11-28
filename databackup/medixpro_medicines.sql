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
-- Table structure for table `medicines`
--

DROP TABLE IF EXISTS `medicines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicines` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `genericName` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `medicineType` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `medicineForm` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `manufacturer` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `supplier` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `manufacturingDate` datetime(3) DEFAULT NULL,
  `expiryDate` datetime(3) DEFAULT NULL,
  `batchNumber` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dosage` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sideEffects` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `precautions` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `initialQuantity` int NOT NULL DEFAULT '0',
  `reorderLevel` int NOT NULL DEFAULT '0',
  `maximumLevel` int NOT NULL DEFAULT '0',
  `purchasePrice` decimal(65,30) NOT NULL,
  `sellingPrice` decimal(65,30) NOT NULL,
  `taxRate` decimal(65,30) NOT NULL DEFAULT '0.000000000000000000000000000000',
  `roomTemperature` tinyint(1) NOT NULL DEFAULT '0',
  `frozen` tinyint(1) NOT NULL DEFAULT '0',
  `refrigerated` tinyint(1) NOT NULL DEFAULT '0',
  `protectFromLight` tinyint(1) NOT NULL DEFAULT '0',
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Active',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `medicines_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicines`
--

LOCK TABLES `medicines` WRITE;
/*!40000 ALTER TABLE `medicines` DISABLE KEYS */;
INSERT INTO `medicines` VALUES ('cmi4bz2tw000sum3suue993be','Aspirin 500mg','Acetylsalicylic Acid','Analgesics','OTC','Pain reliever and fever reducer','tablet','PharmaCo Ltd','MediSupply Inc','2024-01-15 00:00:00.000','2026-01-15 00:00:00.000','ASPI-2024-001','500mg','Stomach upset, heartburn','Avoid if allergic to aspirin',500,100,1000,2.500000000000000000000000000000,4.990000000000000000000000000000,5.000000000000000000000000000000,1,0,0,0,'Active','2025-11-18 08:47:49.268','2025-11-18 08:47:49.268'),('cmi4bz2u6000tum3saa13ihub','Amoxicillin 500mg','Amoxicillin','Antibiotics','Prescription','Antibiotic for bacterial infections','capsule','PharmaCare Global','MediSupply Inc','2024-03-20 00:00:00.000','2026-03-20 00:00:00.000','AMOX-2024-002','500mg','Allergic reaction, diarrhea','Avoid if penicillin allergy',300,75,800,3.750000000000000000000000000000,7.500000000000000000000000000000,5.000000000000000000000000000000,0,0,1,0,'Active','2025-11-18 08:47:49.278','2025-11-18 08:47:49.278'),('cmi4bz2ul000uum3sd4o4ra2z','Metformin 850mg','Metformin Hydrochloride','Antidiabetics','Prescription','Diabetes medication','tablet','DiabetesCare Ltd','MediSupply Inc','2024-02-10 00:00:00.000','2026-02-10 00:00:00.000','METF-2024-003','850mg','Nausea, metallic taste','Monitor kidney function',400,100,1200,1.800000000000000000000000000000,3.990000000000000000000000000000,5.000000000000000000000000000000,1,0,0,0,'Active','2025-11-18 08:47:49.293','2025-11-18 08:47:49.293'),('cmi4bz2uu000vum3snbub0ze3','Lisinopril 10mg','Lisinopril','Antihypertensives','Prescription','Blood pressure medication','tablet','CardioHealth Inc','MediSupply Inc','2024-04-05 00:00:00.000','2026-04-05 00:00:00.000','LISI-2024-004','10mg','Dizziness, dry cough','Monitor blood pressure regularly',250,50,600,2.100000000000000000000000000000,4.500000000000000000000000000000,5.000000000000000000000000000000,1,0,0,0,'Active','2025-11-18 08:47:49.303','2025-11-18 08:47:49.303'),('cmi4bz2v4000wum3s93uq0g00','Cetirizine 10mg','Cetirizine Hydrochloride','Antihistamines','OTC','Allergy relief','tablet','AllergyRelief Ltd','MediSupply Inc','2024-05-12 00:00:00.000','2026-05-12 00:00:00.000','CETI-2024-005','10mg','Drowsiness, dry mouth','Avoid driving if drowsy',600,150,1500,1.500000000000000000000000000000,3.990000000000000000000000000000,5.000000000000000000000000000000,1,0,0,0,'Active','2025-11-18 08:47:49.312','2025-11-18 08:47:49.312'),('cmi4bz2vc000xum3sm7f5zw8g','Atorvastatin 20mg','Atorvastatin Calcium','Statins','Prescription','Cholesterol medication','tablet','CholesterolControl Inc','MediSupply Inc','2024-06-01 00:00:00.000','2026-06-01 00:00:00.000','ATOR-2024-006','20mg','Muscle pain, liver issues','Regular liver function tests',350,80,900,4.200000000000000000000000000000,8.990000000000000000000000000000,5.000000000000000000000000000000,1,0,0,0,'Active','2025-11-18 08:47:49.321','2025-11-18 08:47:49.321'),('cmi4bz2vm000yum3scngrqb0u','Ibuprofen 400mg','Ibuprofen','NSAIDs','OTC','Pain and inflammation relief','tablet','PainRelief Ltd','MediSupply Inc','2024-07-08 00:00:00.000','2026-07-08 00:00:00.000','IBUP-2024-007','400mg','Stomach upset, heartburn','Take with food',800,200,2000,1.200000000000000000000000000000,2.990000000000000000000000000000,5.000000000000000000000000000000,1,0,0,0,'Active','2025-11-18 08:47:49.330','2025-11-18 08:47:49.330'),('cmi4bz2vv000zum3sp0pe8e2p','Alprazolam 1mg','Alprazolam','Anxiolytics','Controlled','Anti-anxiety medication','tablet','AnxietyControl Ltd','MediSupply Inc','2024-08-15 00:00:00.000','2026-08-15 00:00:00.000','ALPR-2024-008','1mg','Drowsiness, dependence risk','Use with caution, not for long term',150,30,400,5.500000000000000000000000000000,11.990000000000000000000000000000,5.000000000000000000000000000000,1,0,0,0,'Active','2025-11-18 08:47:49.339','2025-11-18 08:47:49.339'),('d3f22ffc-c472-11f0-b367-c8d9d20837fa','lpra1mg','lprazolam ','Antihistamines','OTC','okk','tablet','sanika mote','abhi','2025-11-17 00:00:00.000','2025-11-26 00:00:00.000','BTH-2024-003','100mg','okk','okk',1,1,1,1000.000000000000000000000000000000,1500.000000000000000000000000000000,4.000000000000000000000000000000,1,1,0,0,'Active','2025-11-18 17:06:30.000','2025-11-19 11:12:36.000');
/*!40000 ALTER TABLE `medicines` ENABLE KEYS */;
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
