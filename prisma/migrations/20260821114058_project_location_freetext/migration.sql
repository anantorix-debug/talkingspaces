-- Project.location becomes a free-text field instead of a dropdown tied to
-- the Location table (the Location model itself is untouched — it still
-- powers the Contact page branch cards independently).
ALTER TABLE `projects` DROP FOREIGN KEY `projects_locationId_fkey`;
ALTER TABLE `projects` DROP COLUMN `locationId`;
ALTER TABLE `projects` ADD COLUMN `location` VARCHAR(191) NULL;
