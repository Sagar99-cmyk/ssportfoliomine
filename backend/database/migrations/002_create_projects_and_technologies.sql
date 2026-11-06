-- ==============================================================================
-- Migration: 002_create_projects_and_technologies.sql
-- Description: Creates normalized technologies, projects, project_technologies (junction), and case studies
-- ==============================================================================

CREATE TABLE IF NOT EXISTS `technologies` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL UNIQUE,
    `category` VARCHAR(50) NOT NULL DEFAULT 'Other',
    `icon_slug` VARCHAR(50) DEFAULT NULL,
    `description` VARCHAR(255) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_tech_name` (`name`),
    INDEX `idx_tech_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `projects` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `title` VARCHAR(200) NOT NULL,
    `project_type` VARCHAR(50) NOT NULL DEFAULT 'Major Project',
    `category` VARCHAR(100) NOT NULL,
    `difficulty` ENUM('Beginner', 'Intermediate', 'Advanced') NOT NULL DEFAULT 'Intermediate',
    `short_description` TEXT NOT NULL,
    `thumbnail_url` LONGTEXT DEFAULT NULL,
    `github_url` TEXT DEFAULT NULL,
    `live_demo_url` TEXT DEFAULT NULL,
    `linkedin_url` TEXT DEFAULT NULL,
    `featured` BOOLEAN DEFAULT TRUE,
    `display_order` INT DEFAULT 0,
    `date_created` DATE DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_proj_type` (`project_type`),
    INDEX `idx_proj_featured` (`featured`),
    INDEX `idx_proj_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `project_technologies` (
    `project_id` VARCHAR(50) NOT NULL,
    `technology_id` VARCHAR(50) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`project_id`, `technology_id`),
    CONSTRAINT `fk_pt_project` FOREIGN KEY (`project_id`)
        REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_pt_technology` FOREIGN KEY (`technology_id`)
        REFERENCES `technologies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX `idx_pt_tech_id` (`technology_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `project_case_studies` (
    `project_id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `overview` TEXT,
    `business_problem` TEXT,
    `dataset_info` TEXT,
    `data_cleaning_prep` TEXT,
    `methodology` TEXT,
    `code_snippets` JSON DEFAULT NULL,
    `key_findings` JSON DEFAULT NULL,
    `recommendations` JSON DEFAULT NULL,
    `limitations` TEXT,
    `dashboard_features` JSON DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_case_study_project` FOREIGN KEY (`project_id`)
        REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

