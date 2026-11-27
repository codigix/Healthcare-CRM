-- Hospital structure: Hospital profile -> Branch -> Building -> Floor -> Ward -> Room -> Bed.
-- Additive only: the existing `rooms` table gets one nullable column (wardId); nothing is dropped.

CREATE TABLE `hospital_profile` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `registrationNo` VARCHAR(100) NULL,
    `type` VARCHAR(100) NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(50) NULL,
    `website` VARCHAR(191) NULL,
    `address` VARCHAR(500) NULL,
    `city` VARCHAR(100) NULL,
    `state` VARCHAR(100) NULL,
    `pincode` VARCHAR(20) NULL,
    `gstNumber` VARCHAR(50) NULL,
    `establishedYear` INTEGER NULL,
    `totalBedCapacity` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `branches` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(50) NOT NULL,
    `address` VARCHAR(500) NULL,
    `city` VARCHAR(100) NULL,
    `phone` VARCHAR(50) NULL,
    `email` VARCHAR(191) NULL,
    `managerName` VARCHAR(191) NULL,
    `status` VARCHAR(30) NOT NULL DEFAULT 'Active',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    UNIQUE INDEX `branches_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `buildings` (
    `id` VARCHAR(36) NOT NULL,
    `branchId` VARCHAR(36) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(50) NOT NULL,
    `totalFloors` INTEGER NOT NULL DEFAULT 1,
    `description` VARCHAR(500) NULL,
    `status` VARCHAR(30) NOT NULL DEFAULT 'Active',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    UNIQUE INDEX `buildings_branchId_code_key`(`branchId`, `code`),
    INDEX `buildings_branchId_idx`(`branchId`),
    PRIMARY KEY (`id`),
    CONSTRAINT `buildings_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branches`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `floors` (
    `id` VARCHAR(36) NOT NULL,
    `buildingId` VARCHAR(36) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `floorNumber` INTEGER NOT NULL,
    `description` VARCHAR(500) NULL,
    `status` VARCHAR(30) NOT NULL DEFAULT 'Active',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    UNIQUE INDEX `floors_buildingId_floorNumber_key`(`buildingId`, `floorNumber`),
    INDEX `floors_buildingId_idx`(`buildingId`),
    PRIMARY KEY (`id`),
    CONSTRAINT `floors_buildingId_fkey` FOREIGN KEY (`buildingId`) REFERENCES `buildings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `wards` (
    `id` VARCHAR(36) NOT NULL,
    `floorId` VARCHAR(36) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(50) NOT NULL,
    `wardType` VARCHAR(50) NOT NULL DEFAULT 'General',
    `department` VARCHAR(191) NULL,
    `nurseInCharge` VARCHAR(191) NULL,
    `status` VARCHAR(30) NOT NULL DEFAULT 'Active',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    UNIQUE INDEX `wards_code_key`(`code`),
    INDEX `wards_floorId_idx`(`floorId`),
    PRIMARY KEY (`id`),
    CONSTRAINT `wards_floorId_fkey` FOREIGN KEY (`floorId`) REFERENCES `floors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `rooms` ADD COLUMN `wardId` VARCHAR(36) NULL;
CREATE INDEX `rooms_wardId_idx` ON `rooms`(`wardId`);
ALTER TABLE `rooms` ADD CONSTRAINT `rooms_wardId_fkey` FOREIGN KEY (`wardId`) REFERENCES `wards`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE `beds` (
    `id` VARCHAR(36) NOT NULL,
    `roomId` VARCHAR(191) NOT NULL,
    `bedNumber` VARCHAR(50) NOT NULL,
    `bedType` VARCHAR(50) NOT NULL DEFAULT 'Standard',
    `status` VARCHAR(30) NOT NULL DEFAULT 'Available',
    `notes` VARCHAR(500) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    UNIQUE INDEX `beds_roomId_bedNumber_key`(`roomId`, `bedNumber`),
    INDEX `beds_roomId_idx`(`roomId`),
    INDEX `beds_status_idx`(`status`),
    PRIMARY KEY (`id`),
    CONSTRAINT `beds_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `rooms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Backfill the structure from the rooms that already exist, so Rooms and Beds
-- are linked from day one (no sample data: everything comes from `rooms`).
-- ---------------------------------------------------------------------------
INSERT INTO `branches` (`id`, `name`, `code`, `status`) VALUES (UUID(), 'Main Branch', 'MAIN', 'Active');

INSERT INTO `buildings` (`id`, `branchId`, `name`, `code`, `totalFloors`, `status`)
SELECT UUID(), b.id, 'Main Building', 'MB',
       GREATEST(1, (SELECT COUNT(DISTINCT `floor`) FROM `rooms`)), 'Active'
FROM `branches` b WHERE b.code = 'MAIN';

INSERT INTO `floors` (`id`, `buildingId`, `name`, `floorNumber`, `status`)
SELECT UUID(), bl.id, CONCAT('Floor ', f.fl), f.fl, 'Active'
FROM (SELECT DISTINCT CAST(`floor` AS SIGNED) AS fl FROM `rooms` WHERE `floor` REGEXP '^[0-9]+$') f
CROSS JOIN `buildings` bl WHERE bl.code = 'MB';

INSERT INTO `wards` (`id`, `floorId`, `name`, `code`, `wardType`, `department`, `status`)
SELECT UUID(), fl.id, CONCAT(d.department, ' Ward - Floor ', d.fl),
       UPPER(CONCAT(LEFT(REPLACE(d.department, ' ', ''), 4), '-F', d.fl)), 'General', d.department, 'Active'
FROM (SELECT DISTINCT `department`, CAST(`floor` AS SIGNED) AS fl FROM `rooms` WHERE `floor` REGEXP '^[0-9]+$') d
JOIN `floors` fl ON fl.floorNumber = d.fl;

UPDATE `rooms` r
JOIN `floors` fl ON fl.floorNumber = CAST(r.`floor` AS SIGNED)
JOIN `wards` w ON w.floorId = fl.id AND w.department = r.department
SET r.wardId = w.id
WHERE r.`floor` REGEXP '^[0-9]+$';

-- One bed per unit of room capacity; the first N beds are Occupied where N = active allotments in that room.
INSERT INTO `beds` (`id`, `roomId`, `bedNumber`, `bedType`, `status`)
WITH RECURSIVE seq AS (SELECT 1 AS n UNION ALL SELECT n + 1 FROM seq WHERE n < 50)
SELECT UUID(), r.id, CONCAT(r.roomNumber, '-B', seq.n),
       CASE WHEN r.roomType = 'ICU' THEN 'ICU' ELSE 'Standard' END,
       CASE WHEN seq.n <= COALESCE(a.active, 0) THEN 'Occupied'
            WHEN r.status IN ('Maintenance', 'Out of Service') THEN 'Maintenance'
            ELSE 'Available' END
FROM `rooms` r
JOIN seq ON seq.n <= GREATEST(r.capacity, 1)
LEFT JOIN (
    SELECT roomId, COUNT(*) AS active FROM `room_allotments`
    WHERE `status` NOT IN ('Discharged', 'Released') GROUP BY roomId
) a ON a.roomId = r.id;
