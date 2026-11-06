-- ==============================================================================
-- SAGAR SINGH - DATA ANALYTICS & DEVELOPER PORTFOLIO
-- Analytical Views, Stored Procedures & Triggers
-- Demonstrates Data Engineering, Star Schemas & Advanced SQL for Recruiters
-- ==============================================================================

USE `newport`;

-- ------------------------------------------------------------------------------
-- VIEW 1: v_executive_portfolio_summary
-- Executive one-row dashboard snapshot for Admin & Analytics reporting
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW `v_executive_portfolio_summary` AS
SELECT 
    p.full_name,
    p.headline,
    p.email,
    p.availability_status,
    (SELECT COUNT(*) FROM `projects`) AS `total_projects`,
    (SELECT COUNT(*) FROM `projects` WHERE `project_type` = 'Major Project') AS `major_projects_count`,
    (SELECT COUNT(*) FROM `skills`) AS `total_skills_count`,
    (SELECT COUNT(*) FROM `skills` WHERE `category` = 'Data Analytics') AS `analytics_skills_count`,
    (SELECT COUNT(*) FROM `achievements`) AS `verified_credentials_count`,
    (SELECT COUNT(*) FROM `contact_messages` WHERE `is_read` = FALSE) AS `unread_messages_count`,
    (SELECT `metric_value` FROM `site_analytics` WHERE `metric_key` = 'resume_downloads') AS `resume_downloads`,
    (SELECT `metric_value` FROM `site_analytics` WHERE `metric_key` = 'page_visits') AS `page_visits`
FROM `portfolio_profile` p
WHERE p.id = 'profile-main';

-- ------------------------------------------------------------------------------
-- VIEW 2: v_projects_catalog
-- Aggregated project view joining technologies as a comma-separated list
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW `v_projects_catalog` AS
SELECT 
    pr.id AS `project_id`,
    pr.title,
    pr.project_type,
    pr.category,
    pr.difficulty,
    pr.short_description,
    pr.thumbnail_url,
    pr.github_url,
    pr.live_demo_url,
    pr.linkedin_url,
    pr.featured,
    GROUP_CONCAT(pt.technology_name ORDER BY pt.technology_name SEPARATOR ', ') AS `technologies_list`,
    COUNT(pt.technology_name) AS `tech_stack_count`,
    cs.business_problem IS NOT NULL AS `has_case_study`,
    pr.date_created
FROM `projects` pr
LEFT JOIN `project_technologies` pt ON pr.id = pt.project_id
LEFT JOIN `project_case_studies` cs ON pr.id = cs.project_id
GROUP BY pr.id, pr.title, pr.project_type, pr.category, pr.difficulty,
         pr.short_description, pr.thumbnail_url, pr.github_url, pr.live_demo_url,
         pr.linkedin_url, pr.featured, pr.date_created, cs.business_problem
ORDER BY pr.featured DESC, pr.display_order ASC;

-- ------------------------------------------------------------------------------
-- VIEW 3: v_skills_distribution
-- Categorical breakdown of skill proficiencies and tool orbit frequencies
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW `v_skills_distribution` AS
SELECT 
    category,
    COUNT(*) AS total_skills,
    SUM(CASE WHEN proficiency_level = 'Expert' THEN 1 ELSE 0 END) AS expert_count,
    SUM(CASE WHEN proficiency_level = 'Advanced' THEN 1 ELSE 0 END) AS advanced_count,
    SUM(CASE WHEN proficiency_level = 'Intermediate' THEN 1 ELSE 0 END) AS intermediate_count,
    ROUND(AVG(years_of_experience), 1) AS avg_years_experience
FROM `skills`
GROUP BY category
ORDER BY total_skills DESC;

-- ------------------------------------------------------------------------------
-- VIEW 4: v_education_hierarchy_tree
-- Structured representation of academic credentials ordered chronologically
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW `v_education_hierarchy_tree` AS
SELECT 
    e.hierarchy_level AS `level`,
    e.degree,
    e.institution,
    e.location,
    e.period,
    e.grade_gpa,
    e.description,
    GROUP_CONCAT(eh.highlight_text SEPARATOR ' | ') AS `highlights_combined`
FROM `education` e
LEFT JOIN `education_highlights` eh ON e.id = eh.education_id
GROUP BY e.id, e.hierarchy_level, e.degree, e.institution, e.location, e.period, e.grade_gpa, e.description
ORDER BY e.hierarchy_level ASC;

-- ------------------------------------------------------------------------------
-- STORED PROCEDURE 1: sp_record_contact_inquiry
-- Safely inserts visitor message and updates activity counter
-- ------------------------------------------------------------------------------
DELIMITER //
DROP PROCEDURE IF EXISTS `sp_record_contact_inquiry` //
CREATE PROCEDURE `sp_record_contact_inquiry`(
    IN p_id VARCHAR(50),
    IN p_name VARCHAR(100),
    IN p_email VARCHAR(150),
    IN p_subject VARCHAR(200),
    IN p_message TEXT,
    IN p_client_ip VARCHAR(50)
)
BEGIN
    -- Insert message
    INSERT INTO `contact_messages` (`id`, `name`, `email`, `subject`, `message`, `client_ip`)
    VALUES (p_id, p_name, p_email, p_subject, p_message, p_client_ip);

    -- Increment inquiry counter
    INSERT INTO `site_analytics` (`metric_key`, `metric_name`, `metric_value`)
    VALUES ('contact_messages_count', 'Total Messages Received', 1)
    ON DUPLICATE KEY UPDATE `metric_value` = `metric_value` + 1;
END //
DELIMITER ;

-- ------------------------------------------------------------------------------
-- STORED PROCEDURE 2: sp_track_resume_download
-- Increments resume download counter and returns updated total
-- ------------------------------------------------------------------------------
DELIMITER //
DROP PROCEDURE IF EXISTS `sp_track_resume_download` //
CREATE PROCEDURE `sp_track_resume_download`(
    OUT p_current_downloads BIGINT
)
BEGIN
    UPDATE `site_analytics`
    SET `metric_value` = `metric_value` + 1
    WHERE `metric_key` = 'resume_downloads';

    SELECT `metric_value` INTO p_current_downloads
    FROM `site_analytics`
    WHERE `metric_key` = 'resume_downloads';
END //
DELIMITER ;

-- Verify Views
SELECT * FROM `v_executive_portfolio_summary`;

