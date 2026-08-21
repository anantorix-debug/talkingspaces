-- Project gallery simplified to a single cover image — the ProjectImage
-- table (multiple photos with alt text/caption) is dropped entirely.
ALTER TABLE `projects` ADD COLUMN `imageUrl` TEXT NULL;

ALTER TABLE `project_images` DROP FOREIGN KEY `project_images_projectId_fkey`;
DROP TABLE `project_images`;
