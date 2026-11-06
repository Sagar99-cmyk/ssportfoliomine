-- ==============================================================================
-- SAGAR SINGH - DATA ANALYTICS & DEVELOPER PORTFOLIO
-- Master Relational Database Schema (DDL)
-- Database: sagar_portfolio_db | Engine: InnoDB | Charset: utf8mb4
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `sagar_portfolio_db`
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE `sagar_portfolio_db`;

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
-- Table 2: technologies (Normalized catalog of technical tools & frameworks)
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
-- Table 4: project_technologies (Junction Table: Many-to-Many Projects <-> Technologies)
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- Table 5: project_case_studies (1-to-1 deep analytical problem, dataset & code)
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
    CONSTRAINT `fk_case_study_project` FOREIGN KEY (`project_id`)
        REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 6: skills
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
-- Table 6b: project_skills (Junction Table: Many-to-Many Projects <-> Skills with Foreign Keys)
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- Table 7: education
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `education` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `degree` VARCHAR(150) NOT NULL,
    `institution` VARCHAR(150) NOT NULL,
    `location` VARCHAR(100),
    `period` VARCHAR(50) NOT NULL,
    `grade_gpa` VARCHAR(50),
    `description` TEXT,
    `hierarchy_level` INT NOT NULL DEFAULT 1,
    `display_order` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_edu_hierarchy` (`hierarchy_level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 8: education_highlights (1-to-Many highlights for each degree)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `education_highlights` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `education_id` VARCHAR(50) NOT NULL,
    `highlight_text` TEXT NOT NULL,
    `display_order` INT DEFAULT 0,
    CONSTRAINT `fk_edu_highlights_edu` FOREIGN KEY (`education_id`)
        REFERENCES `education` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX `idx_edu_hl_edu_id` (`education_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 9: achievements & awards
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
-- Table 10: certifications (Dedicated table for industry certifications)
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
-- Table 11: contact_messages (Inquiries from recruiters, clients & visitors)
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
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `newsletter_subscribers` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `subscribed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `is_active` BOOLEAN DEFAULT TRUE,
    INDEX `idx_sub_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 13: admin_users (Secured admin login with salted password hashing)
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
-- Table 14: site_analytics (Real-time telemetry counters)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `site_analytics` (
    `metric_key` VARCHAR(50) NOT NULL PRIMARY KEY,
    `metric_name` VARCHAR(100) NOT NULL,
    `metric_value` BIGINT NOT NULL DEFAULT 0,
    `last_updated` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;