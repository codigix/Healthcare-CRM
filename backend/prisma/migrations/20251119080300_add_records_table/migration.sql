-- CreateTable
CREATE TABLE `records` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `patientName` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `details` LONGTEXT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `records_type_idx` ON `records`(`type`);

-- CreateIndex
CREATE INDEX `records_status_idx` ON `records`(`status`);

-- CreateIndex
CREATE INDEX `records_date_idx` ON `records`(`date`);
