-- MySQL dump 10.13  Distrib 8.0.23, for Linux (x86_64)
--
-- Host: localhost    Database: CollisionCenter
-- ------------------------------------------------------
-- Server version	8.0.23-0ubuntu0.20.10.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Car`
--

DROP TABLE IF EXISTS `Car`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Car` (
  `Vin` char(17) NOT NULL,
  `MainColor` varchar(80) NOT NULL,
  `AccentColor` varchar(80) DEFAULT NULL,
  `Make` varchar(80) NOT NULL,
  `Model` varchar(80) NOT NULL,
  `OwnerID` char(13) NOT NULL,
  PRIMARY KEY (`Vin`),
  KEY `OwnerID` (`OwnerID`),
  CONSTRAINT `Car_ibfk_1` FOREIGN KEY (`OwnerID`) REFERENCES `Customer` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Car`
--

LOCK TABLES `Car` WRITE;
/*!40000 ALTER TABLE `Car` DISABLE KEYS */;
INSERT INTO `Car` VALUES ('FFFFFFFFFFFFFFFFF','Blue',NULL,'Ford','Mustang','C-317-7a6-e86'),('TTTTTTTTTTTTTTTTT','Black','Blue','Chevy','Camero','C-317-7a6-e86'),('UUUUUUUUUUUUUUUUU','Red','Black','Toyota','Car','C-607-80f-488');
/*!40000 ALTER TABLE `Car` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Customer`
--

DROP TABLE IF EXISTS `Customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Customer` (
  `id` char(13) NOT NULL,
  `Fname` varchar(80) NOT NULL,
  `Lname` varchar(80) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Customer`
--

LOCK TABLES `Customer` WRITE;
/*!40000 ALTER TABLE `Customer` DISABLE KEYS */;
INSERT INTO `Customer` VALUES ('C-317-7a6-e86','Zeke','Chism'),('C-607-80f-488','Sam','Johnson');
/*!40000 ALTER TABLE `Customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Employee`
--

DROP TABLE IF EXISTS `Employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Employee` (
  `id` char(13) NOT NULL,
  `Fname` varchar(80) NOT NULL,
  `Lname` varchar(80) NOT NULL,
  `TaskID` char(13) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Employee` (`TaskID`),
  CONSTRAINT `Employee_ibfk_1` FOREIGN KEY (`TaskID`) REFERENCES `Task` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Employee`
--

LOCK TABLES `Employee` WRITE;
/*!40000 ALTER TABLE `Employee` DISABLE KEYS */;
INSERT INTO `Employee` VALUES ('E-20b-7e2-e18','Corey','Mudd','T-0f0-790-6ca'),('E-f9b-c7b-0ca','Jacob','Douglas','T-79a-f62-b95');
/*!40000 ALTER TABLE `Employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Job`
--

DROP TABLE IF EXISTS `Job`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Job` (
  `id` char(13) NOT NULL,
  `DateTimeStarted` datetime DEFAULT CURRENT_TIMESTAMP,
  `DateTimeEnded` datetime DEFAULT NULL,
  `Cost` decimal(15,2) DEFAULT NULL,
  `CarVin` char(17) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `CarVin` (`CarVin`),
  CONSTRAINT `Job_ibfk_1` FOREIGN KEY (`CarVin`) REFERENCES `Car` (`Vin`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Job`
--

LOCK TABLES `Job` WRITE;
/*!40000 ALTER TABLE `Job` DISABLE KEYS */;
INSERT INTO `Job` VALUES ('J-1d4-160-1da','2021-05-09 16:03:33',NULL,50.00,'FFFFFFFFFFFFFFFFF'),('J-42a-086-ef0','2021-05-09 16:06:34','2021-05-09 16:12:43',50.00,'UUUUUUUUUUUUUUUUU'),('J-996-906-cb4','2021-05-09 16:04:11',NULL,100.00,'TTTTTTTTTTTTTTTTT');
/*!40000 ALTER TABLE `Job` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Task`
--

DROP TABLE IF EXISTS `Task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Task` (
  `id` char(13) NOT NULL,
  `PriorityLevel` int NOT NULL,
  `Cost` decimal(15,2) NOT NULL,
  `Task_Name` varchar(80) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Task`
--

LOCK TABLES `Task` WRITE;
/*!40000 ALTER TABLE `Task` DISABLE KEYS */;
INSERT INTO `Task` VALUES ('T-0f0-790-6ca',9,100.00,'Body Work'),('T-5e8-4cd-4a8',1,10.00,'Clean Car'),('T-79a-f62-b95',5,50.00,'Paint Car');
/*!40000 ALTER TABLE `Task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Works_On`
--

DROP TABLE IF EXISTS `Works_On`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Works_On` (
  `EmplyID` char(13) DEFAULT NULL,
  `JobID` char(13) NOT NULL,
  `DateTimeStarted` datetime DEFAULT CURRENT_TIMESTAMP,
  `DateTimeEnded` datetime DEFAULT NULL,
  `TaskID` char(13) NOT NULL,
  KEY `JobID` (`JobID`),
  KEY `TaskID` (`TaskID`),
  KEY `EmplyID` (`EmplyID`),
  CONSTRAINT `Works_On_ibfk_3` FOREIGN KEY (`JobID`) REFERENCES `Job` (`id`) ON DELETE CASCADE,
  CONSTRAINT `Works_On_ibfk_4` FOREIGN KEY (`TaskID`) REFERENCES `Task` (`id`),
  CONSTRAINT `Works_On_ibfk_5` FOREIGN KEY (`EmplyID`) REFERENCES `Employee` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Works_On`
--

LOCK TABLES `Works_On` WRITE;
/*!40000 ALTER TABLE `Works_On` DISABLE KEYS */;
INSERT INTO `Works_On` VALUES ('E-f9b-c7b-0ca','J-1d4-160-1da','2021-05-09 16:03:33',NULL,'T-79a-f62-b95'),('E-20b-7e2-e18','J-996-906-cb4','2021-05-09 16:04:12',NULL,'T-0f0-790-6ca'),('E-f9b-c7b-0ca','J-42a-086-ef0','2021-05-09 16:06:34','2021-05-09 16:12:43','T-79a-f62-b95');
/*!40000 ALTER TABLE `Works_On` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-05-09 16:15:01
