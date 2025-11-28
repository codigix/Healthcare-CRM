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
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suppliers` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rating` int NOT NULL DEFAULT '0',
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Active',
  `description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contactPerson` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `suppliers_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
INSERT INTO `suppliers` VALUES ('cmi484s3v0008umzwn538cs1h','MedPlus Supplies','Medical Supplies','Sarah Johnson','contact@medplus.com','(555) 123-4567','Chicago, IL',5,'Active','Leading provider of high-quality medical supplies and equipment for healthcare facilities.','Sarah Johnson','2025-11-18 07:00:16.843','2025-11-18 07:00:16.843'),('cmi484s3v0009umzwae3l4fzw','PharmaTech Inc.','Medications','Michael Chen','sales@pharmatech.com','(543) 987-5643','Boston, MA',4,'Active','Specialized pharmaceutical supplier with a wide range of medications and healthcare products.','Michael Chen','2025-11-18 07:00:16.843','2025-11-18 07:00:16.843'),('cmi484s3v000aumzw3huprjt4','MediEquip Solutions','Equipment','David Rodriguez','info@mediequip.com','(555) 456-7890','San Diego, CA',4,'Active','Premium medical equipment provider specializing in diagnostic and treatment devices.','David Rodriguez','2025-11-18 07:00:16.843','2025-11-18 07:00:16.843'),('cmi484s3v000bumzwyvtmgeyv','Health Supply Co.','Medical Supplies','Emma Wilson','order@healthsupply.com','(555) 789-0123','New York, NY',3,'Active','Comprehensive medical supplies vendor for clinics and hospitals.','Emma Wilson','2025-11-18 07:00:16.843','2025-11-18 07:00:16.843'),('cmi484s3v000cumzwvkjo1h8b','Global Pharma Ltd.','Medications','James Wilson','sales@globalpharma.com','(553) 789-0123','New York, NY',5,'Active','International pharmaceutical supplier with extensive inventory of medications and treatments.','James Wilson','2025-11-18 07:00:16.843','2025-11-18 07:00:16.843'),('cmi484s3v000dumzwf98cvus2','Office Depot Medical','Office Supplies','Lisa Anderson','medical@officedepot.com','(555) 234-5678','Atlanta, GA',4,'Active','Office supplies and medical products for healthcare facilities.','Lisa Anderson','2025-11-18 07:00:16.843','2025-11-18 07:00:16.843'),('cmi484s3v000eumzw0xryv9x2','Lab Supplies Direct','Laboratory','Robert Brown','order@labsupplies.com','(555) 345-6789','Los Angeles, CA',3,'Active','Laboratory equipment and supplies vendor.','Robert Brown','2025-11-18 07:00:16.843','2025-11-18 07:00:16.843');
/*!40000 ALTER TABLE `suppliers` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-26 14:54:41
