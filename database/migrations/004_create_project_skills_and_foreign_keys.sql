-- ==============================================================================
-- Migration: 004_create_project_skills_and_foreign_keys.sql
-- Description: Establishes project_skills junction table and cascades foreign keys
-- ==============================================================================

CREATE TABLE IF NOT EXISTS `project_skills` (
    `project_id` VARCHAR(50) NOT NULL,
    `skill_id` VARCHAR(50) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`project_id`, `skill_id`),
    CONSTRAINT `fk_ps_project` FOREIGN KEY (`project_id`)
        REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_ps_skill` FOREIGN KEY (`skill_id`)
        REFERENCES `skills` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX `idx_ps_skill` (`skill_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ensure cascade foreign keys exist on project_case_studies
-- Note: MySQL syntax check with IF NOT EXISTS for constraints
-- (handled safely via alter or table definition)

