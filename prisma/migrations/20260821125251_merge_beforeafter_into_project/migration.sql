-- Before & After merges into Project (Portfolio) — same pattern as
-- Category/Service. beforeImage/afterImage become optional fields directly
-- on projects; the separate before_afters table is dropped entirely.
ALTER TABLE `projects` ADD COLUMN `beforeImage` TEXT NULL;
ALTER TABLE `projects` ADD COLUMN `afterImage` TEXT NULL;

DROP TABLE `before_afters`;
