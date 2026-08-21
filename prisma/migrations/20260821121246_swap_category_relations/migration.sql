-- Project no longer connects to Category via FK — becomes free text, matching
-- the earlier Location change. Before & After swaps the opposite direction:
-- its free-text category becomes a real FK to project_categories.
ALTER TABLE `projects` DROP FOREIGN KEY `projects_categoryId_fkey`;
ALTER TABLE `projects` DROP INDEX `projects_categoryId_idx`;
ALTER TABLE `projects` DROP COLUMN `categoryId`;
ALTER TABLE `projects` ADD COLUMN `category` VARCHAR(191) NULL;

ALTER TABLE `before_afters` DROP COLUMN `category`;
ALTER TABLE `before_afters` ADD COLUMN `categoryId` INT NOT NULL;
ALTER TABLE `before_afters` ADD INDEX `before_afters_categoryId_idx` (`categoryId`);
ALTER TABLE `before_afters` ADD CONSTRAINT `before_afters_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `project_categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- Location model removed entirely — Contact page branches are now hardcoded
-- in code instead of admin-managed.
DROP TABLE `locations`;
