-- Drop the shared Media library: each content record now owns its uploaded
-- image url directly (no reusable pool), so this table and its FK are unused.
ALTER TABLE `media` DROP FOREIGN KEY `media_uploadedById_fkey`;
DROP TABLE `media`;
