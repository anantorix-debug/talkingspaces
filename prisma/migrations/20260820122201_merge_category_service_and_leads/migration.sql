-- AlterTable: Category becomes the parent — add explicit ordering
ALTER TABLE `project_categories` ADD COLUMN `sortOrder` INTEGER NOT NULL DEFAULT 0;

-- AlterTable: Service becomes a 1:1 child of Category
ALTER TABLE `services` ADD COLUMN `categoryId` INTEGER NULL;

-- Data migration: old services.slug matched the category slug 1:1, use it to link
UPDATE `services` s
JOIN `project_categories` c ON c.`slug` = s.`slug`
SET s.`categoryId` = c.`id`;

ALTER TABLE `services` MODIFY COLUMN `categoryId` INTEGER NOT NULL;

DROP INDEX `services_slug_key` ON `services`;

ALTER TABLE `services`
  DROP COLUMN `title`,
  DROP COLUMN `slug`,
  DROP COLUMN `status`,
  DROP COLUMN `sortOrder`;

ALTER TABLE `services` ADD UNIQUE INDEX `services_categoryId_key`(`categoryId`);

ALTER TABLE `services` ADD CONSTRAINT `services_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `project_categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- DropTable: SEO management and Settings are now static/hardcoded, not admin-managed
DROP TABLE `seo_metadata`;
DROP TABLE `site_settings`;

-- DropTable: Enquiry + ConsultationRequest merge into a single Lead inbox
DROP TABLE `enquiries`;
DROP TABLE `consultation_requests`;

-- CreateTable
CREATE TABLE `leads` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('ENQUIRY', 'CONSULTATION') NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `message` TEXT NULL,
    `projectType` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,
    `budget` VARCHAR(191) NULL,
    `source` VARCHAR(191) NULL,
    `status` ENUM('NEW', 'CONTACTED', 'QUALIFIED', 'WON', 'LOST', 'ARCHIVED') NOT NULL DEFAULT 'NEW',
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `leads_type_status_idx`(`type`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
