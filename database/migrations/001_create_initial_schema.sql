-- ==============================================================================
-- Migration: 001_create_initial_schema.sql
-- Description: Creates core profile, skills, education, achievements, messages, and admin tables
-- ==============================================================================

CREATE TABLE IF NOT EXISTS `schema_migrations` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `version` VARCHAR(50) NOT NULL UNIQUE,
    `name` VARCHAR(255) NOT NULL,
    `applied_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_mig_version` (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `portfolio_profile` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY DEFAULT 'profile-main',
    `full_name` VARCHAR(100) NOT NULL,
    `first_name` VARCHAR(50) NOT NULL,
    `last_name` VARCHAR(50) NOT NULL,
    `headline` VARCHAR(255) NOT NULL,
    `intro` TEXT,
    `bio` TEXT,
    `location` VARCHAR(150),
    `email` VARCHAR(150) NOT NULL,
    `phone` VARCHAR(50),
    `avatar_url` VARCHAR(255),
    `resume_url` VARCHAR(255),
    `github_url` VARCHAR(255),
    `linkedin_url` VARCHAR(255),
    `kaggle_url` VARCHAR(255),
    `is_available` BOOLEAN DEFAULT TRUE,
    `availability_status` VARCHAR(100) DEFAULT 'Available for Data Analyst & Entry-Level Tech Roles',
    `years_experience` VARCHAR(20) DEFAULT 'Fresher',
    `dashboards_delivered` INT DEFAULT 6,
    `rows_processed` VARCHAR(50) DEFAULT '150K+',
    `forecast_accuracy` VARCHAR(20) DEFAULT '98.5%',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `skills` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `category` VARCHAR(50) NOT NULL,
    `proficiency_level` ENUM('Beginner', 'Intermediate', 'Advanced', 'Expert') NOT NULL DEFAULT 'Intermediate',
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

CREATE TABLE IF NOT EXISTS `education_highlights` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `education_id` VARCHAR(50) NOT NULL,
    `highlight_text` TEXT NOT NULL,
    `display_order` INT DEFAULT 0,
    CONSTRAINT `fk_edu_highlights_edu` FOREIGN KEY (`education_id`)
        REFERENCES `education` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX `idx_edu_hl_edu_id` (`education_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `achievements` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `title` VARCHAR(200) NOT NULL,
    `issuer` VARCHAR(150) NOT NULL,
    `issue_date` VARCHAR(50) NOT NULL,
    `credential_url` VARCHAR(255) DEFAULT NULL,
    `credential_id` VARCHAR(100) DEFAULT NULL,
    `badge_url` VARCHAR(255) DEFAULT NULL,
    `category` VARCHAR(50) DEFAULT 'Award',
    `skills_tags` JSON DEFAULT NULL,
    `display_order` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_ach_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `certifications` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `title` VARCHAR(200) NOT NULL,
    `issuer` VARCHAR(150) NOT NULL,
    `issue_date` VARCHAR(50) NOT NULL,
    `expiry_date` VARCHAR(50) DEFAULT NULL,
    `credential_url` VARCHAR(255) DEFAULT NULL,
    `credential_id` VARCHAR(100) DEFAULT NULL,
    `badge_url` VARCHAR(255) DEFAULT NULL,
    `skills_covered` JSON DEFAULT NULL,
    `display_order` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_cert_issuer` (`issuer`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

CREATE TABLE IF NOT EXISTS `newsletter_subscribers` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `subscribed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `is_active` BOOLEAN DEFAULT TRUE,
    INDEX `idx_sub_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

CREATE TABLE IF NOT EXISTS `site_analytics` (
    `metric_key` VARCHAR(50) NOT NULL PRIMARY KEY,
    `metric_name` VARCHAR(100) NOT NULL,
    `metric_value` BIGINT NOT NULL DEFAULT 0,
    `last_updated` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

