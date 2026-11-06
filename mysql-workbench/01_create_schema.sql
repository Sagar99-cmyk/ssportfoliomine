-- ==============================================================================
-- SAGAR SINGH - DATA ANALYTICS & DEVELOPER PORTFOLIO
-- MySQL Workbench Master Schema Definition (DDL)
-- Database: sagar_portfolio_db | Engine: InnoDB | Charset: utf8mb4
-- ==============================================================================

-- 1. Create Database if not exists
CREATE DATABASE IF NOT EXISTS `newport`
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE `newport`;

-- Disable foreign key checks during schema creation
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------------------------
-- Table 0: schema_migrations (Tracks applied database migrations)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `schema_migrations` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `version` VARCHAR(50) NOT NULL UNIQUE,
    `name` VARCHAR(255) NOT NULL,
    `applied_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_mig_version` (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 1: portfolio_profile
-- Stores primary bio, contact info, availability, social URLs, and hero metrics
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `portfolio_profile` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY DEFAULT 'profile-main',
    `full_name` VARCHAR(100) NOT NULL,
    `first_name` VARCHAR(50) NOT NULL,
    `last_name` VARCHAR(50) NOT NULL,
    `headline` VARCHAR(255) NOT NULL,
    `intro` TEXT,
    `bio` TEXT,
    `about_details` JSON DEFAULT NULL,
    `location` VARCHAR(150),
    `email` VARCHAR(150) NOT NULL,
    `phone` VARCHAR(50),
    `avatar_url` LONGTEXT,
    `resume_url` LONGTEXT,
    `github_url` TEXT,
    `linkedin_url` TEXT,
    `kaggle_url` TEXT,
    `is_available` BOOLEAN DEFAULT TRUE,
    `availability_status` VARCHAR(100) DEFAULT 'Available for Data Analyst & Entry-Level Tech Roles',
    `years_experience` VARCHAR(20) DEFAULT 'Fresher',
    `dashboards_delivered` INT DEFAULT 6,
    `rows_processed` VARCHAR(50) DEFAULT '150K+',
    `forecast_accuracy` VARCHAR(20) DEFAULT '98.5%',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 2: technologies (Normalized master catalog of analytical tools)
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- Table 3: projects
-- Projects categorized into Major, Minor, and Micro/Mini Projects
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- Table 4: project_technologies (Many-to-Many Junction Table)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `project_technologies` (
    `project_id` VARCHAR(50) NOT NULL,
    `technology_id` VARCHAR(50) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`project_id`, `technology_id`),
    CONSTRAINT `fk_wb_pt_project` FOREIGN KEY (`project_id`)
        REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_wb_pt_technology` FOREIGN KEY (`technology_id`)
        REFERENCES `technologies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX `idx_wb_pt_tech_id` (`technology_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 5: project_case_studies
-- In-depth analytics case studies (business problem, dataset info, findings)
-- ------------------------------------------------------------------------------
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
    CONSTRAINT `fk_wb_case_study_project` FOREIGN KEY (`project_id`)
        REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 6: skills
-- Orbiting skills in 3D Galaxy view with proficiency levels
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `skills` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `category` VARCHAR(50) NOT NULL,
    `proficiency_level` ENUM('Beginner', 'Intermediate', 'Advanced', 'Expert') NOT NULL DEFAULT 'Intermediate',
    `icon_url` LONGTEXT DEFAULT NULL,
    `description` TEXT,
    `tools_used` JSON DEFAULT NULL,
    `projects_count` INT DEFAULT 0,
    `featured` BOOLEAN DEFAULT TRUE,
    `display_order` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_skill_category` (`category`),
    INDEX `idx_skill_featured` (`featured`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 7: education
-- Education hierarchy from BCA undergraduate down to secondary schooling
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `education` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `degree` VARCHAR(150) NOT NULL,
    `institution` VARCHAR(150) NOT NULL,
    `location` VARCHAR(100),
    `period` VARCHAR(50) NOT NULL,
    `grade_gpa` VARCHAR(50),
    `description` TEXT,
    `hierarchy_level` INT NOT NULL DEFAULT 1 COMMENT '1=Undergraduate, 2=Higher Secondary, 3=Secondary',
    `display_order` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_edu_hierarchy` (`hierarchy_level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 8: education_highlights
-- Bullet points for projects, courses, and honors within each degree
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `education_highlights` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `education_id` VARCHAR(50) NOT NULL,
    `highlight_text` TEXT NOT NULL,
    `display_order` INT DEFAULT 0,
    CONSTRAINT `fk_wb_edu_highlights_edu` FOREIGN KEY (`education_id`)
        REFERENCES `education` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX `idx_wb_edu_hl_edu_id` (`education_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 9: achievements
-- Verified awards, competitions, NCC sergeant rank, and honors
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `achievements` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `title` VARCHAR(200) NOT NULL,
    `issuer` VARCHAR(150) NOT NULL,
    `issue_date` VARCHAR(50) NOT NULL,
    `credential_url` LONGTEXT DEFAULT NULL,
    `credential_id` VARCHAR(100) DEFAULT NULL,
    `badge_url` LONGTEXT DEFAULT NULL,
    `category` VARCHAR(50) DEFAULT 'Award',
    `skills_tags` JSON DEFAULT NULL,
    `display_order` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_ach_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 10: certifications
-- Dedicated table for industry certifications
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `certifications` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `title` VARCHAR(200) NOT NULL,
    `issuer` VARCHAR(150) NOT NULL,
    `issue_date` VARCHAR(50) NOT NULL,
    `expiry_date` VARCHAR(50) DEFAULT NULL,
    `credential_url` LONGTEXT DEFAULT NULL,
    `credential_id` VARCHAR(100) DEFAULT NULL,
    `badge_url` LONGTEXT DEFAULT NULL,
    `skills_covered` JSON DEFAULT NULL,
    `display_order` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_cert_issuer` (`issuer`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 11: contact_messages
-- Messages sent by visitors, recruiters, and clients with reply support
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `contact_messages` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `subject` VARCHAR(200) NOT NULL,
    `company` VARCHAR(150) DEFAULT NULL,
    `message` TEXT NOT NULL,
    `is_read` BOOLEAN DEFAULT FALSE,
    `replied` BOOLEAN DEFAULT FALSE,
    `reply_text` TEXT DEFAULT NULL,
    `replied_at` DATETIME DEFAULT NULL,
    `client_ip` VARCHAR(50) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_msg_unread` (`is_read`),
    INDEX `idx_msg_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 12: newsletter_subscribers
-- Email subscribers for updates and project releases
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `newsletter_subscribers` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `subscribed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `is_active` BOOLEAN DEFAULT TRUE,
    INDEX `idx_sub_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 13: admin_users
-- Protected admin authentication with secure PBKDF2 hashed passwords
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admin_users` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY DEFAULT 'admin-master',
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `password_salt` VARCHAR(64) NOT NULL,
    `role` VARCHAR(50) DEFAULT 'SuperAdmin',
    `last_login` DATETIME DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_admin_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 14: site_analytics
-- Real-time analytics counters (resume downloads, page visits)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `site_analytics` (
    `metric_key` VARCHAR(50) NOT NULL PRIMARY KEY,
    `metric_name` VARCHAR(100) NOT NULL,
    `metric_value` BIGINT NOT NULL DEFAULT 0,
    `last_updated` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Analytical Views
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW `v_projects_catalog` AS
SELECT 
    p.id,
    p.title,
    p.project_type,
    p.category,
    p.difficulty,
    p.short_description,
    p.featured,
    GROUP_CONCAT(t.name ORDER BY t.name SEPARATOR ', ') AS technologies_list,
    p.github_url,
    p.live_demo_url,
    p.created_at
FROM `projects` p
LEFT JOIN `project_technologies` pt ON p.id = pt.project_id
LEFT JOIN `technologies` t ON pt.technology_id = t.id
GROUP BY p.id;

CREATE OR REPLACE VIEW `v_education_hierarchy` AS
SELECT 
    e.hierarchy_level,
    e.degree,
    e.institution,
    e.period,
    e.grade_gpa,
    COUNT(eh.id) AS highlights_count
FROM `education` e
LEFT JOIN `education_highlights` eh ON e.id = eh.education_id
GROUP BY e.id
ORDER BY e.hierarchy_level ASC, e.display_order ASC;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Confirmation output
SELECT '✅ Sagar Portfolio MySQL Schema Successfully Created & Synchronized!' AS `Status`;
