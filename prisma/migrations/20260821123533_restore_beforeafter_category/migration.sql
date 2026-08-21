-- Correction: only Project's category should have been removed — Before &
-- After keeps its real Category relation. Re-add what the previous migration
-- dropped from before_afters (projects.category stays removed).
ALTER TABLE `before_afters` ADD COLUMN `categoryId` INT NOT NULL;
ALTER TABLE `before_afters` ADD INDEX `before_afters_categoryId_idx` (`categoryId`);
ALTER TABLE `before_afters` ADD CONSTRAINT `before_afters_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `project_categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
