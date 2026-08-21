-- Category removed entirely from both Project and Before & After — neither
-- is categorized anymore. ProjectCategory itself is untouched; it still
-- powers the "Our Services" pages via its 1:1 Service relation.
ALTER TABLE `projects` DROP COLUMN `category`;

ALTER TABLE `before_afters` DROP FOREIGN KEY `before_afters_categoryId_fkey`;
ALTER TABLE `before_afters` DROP INDEX `before_afters_categoryId_idx`;
ALTER TABLE `before_afters` DROP COLUMN `categoryId`;
