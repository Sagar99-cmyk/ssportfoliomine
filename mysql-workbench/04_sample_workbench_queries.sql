-- ==============================================================================
-- SAGAR SINGH - DATA ANALYTICS & DEVELOPER PORTFOLIO
-- Ready-to-Run MySQL Workbench Queries & Testing Suite
-- Run these queries directly in MySQL Workbench by pressing Ctrl + Enter!
-- ==============================================================================

USE `newport`;

-- ------------------------------------------------------------------------------
-- QUERY 1: Database Health Check & Row Counts for All Tables
-- ------------------------------------------------------------------------------
SELECT 
    table_name AS `Table`,
    table_rows AS `Approximate Records`,
    ROUND(((data_length + index_length) / 1024), 2) AS `Size in KB`,
    table_comment AS `Comment`
FROM information_schema.TABLES
WHERE table_schema = 'newport'
ORDER BY table_name ASC;

-- ------------------------------------------------------------------------------
-- QUERY 2: Display Projects Catalog with Tech Stack (Major, Minor, Micro)
-- ------------------------------------------------------------------------------
SELECT 
    project_id,
    title,
    project_type,
    category,
    difficulty,
    technologies_list,
    featured,
    date_created
FROM v_projects_catalog;

-- ------------------------------------------------------------------------------
-- QUERY 3: Inspect Flagship Project Case Study ($2.4M Sales Analytics Dashboard)
-- ------------------------------------------------------------------------------
SELECT 
    p.title,
    p.project_type,
    cs.overview,
    cs.business_problem,
    cs.dataset_info,
    cs.key_findings,
    cs.recommendations
FROM projects p
JOIN project_case_studies cs ON p.id = cs.project_id
WHERE p.id = 'proj-sales-bi';

-- ------------------------------------------------------------------------------
-- QUERY 4: Analytical Skills Grouped by Category & Average Orbit Speed
-- ------------------------------------------------------------------------------
SELECT 
    category,
    COUNT(*) AS total_skills,
    GROUP_CONCAT(name ORDER BY display_order SEPARATOR ', ') AS skills_in_category,
    ROUND(AVG(orbit_speed), 2) AS avg_solar_orbit_speed
FROM skills
GROUP BY category
ORDER BY total_skills DESC;

-- ------------------------------------------------------------------------------
-- QUERY 5: Academic Hierarchy with Honors & Competition Awards
-- ------------------------------------------------------------------------------
SELECT 
    'Education' AS `Record_Type`,
    hierarchy_level AS `Rank_Or_Level`,
    degree AS `Title`,
    institution AS `Organization`,
    period AS `Timeline`,
    grade_gpa AS `Grade`
FROM education
UNION ALL
SELECT 
    'Achievement / Honor' AS `Record_Type`,
    display_order AS `Rank_Or_Level`,
    title AS `Title`,
    issuer AS `Organization`,
    issue_date AS `Timeline`,
    category AS `Grade`
FROM achievements
ORDER BY `Record_Type` ASC, `Rank_Or_Level` ASC;

-- ------------------------------------------------------------------------------
-- QUERY 6: Recruiter Messages Inbox (Unread & Pending Replies)
-- ------------------------------------------------------------------------------
SELECT 
    id,
    name,
    email,
    subject,
    message,
    is_read,
    replied,
    created_at
FROM contact_messages
ORDER BY created_at DESC;

-- ------------------------------------------------------------------------------
-- QUERY 7: Overall Website KPI Analytics
-- ------------------------------------------------------------------------------
SELECT 
    metric_name,
    metric_value,
    last_updated
FROM site_analytics;

-- ------------------------------------------------------------------------------
-- QUERY 8: Insert a New Project from MySQL Workbench
-- Example of adding a project directly via SQL:
-- ------------------------------------------------------------------------------
/*
INSERT INTO projects (
    id, title, project_type, category, difficulty, short_description,
    thumbnail_url, github_url, live_demo_url, linkedin_url, featured, date_created
) VALUES (
    'proj-customer-churn',
    'Telecom Customer Churn Predictor',
    'Minor Project',
    'Machine Learning & Python',
    'Intermediate',
    'Customer retention classification model utilizing Python, Scikit-Learn, and Seaborn to predict churn with 88.5% precision.',
    '/projects/sales-dashboard.png',
    'https://github.com/Sagar99-cmyk',
    'https://github.com/Sagar99-cmyk',
    'https://linkedin.com/in/sagarsingh2005',
    TRUE,
    CURDATE()
);

INSERT INTO project_technologies (project_id, technology_name) VALUES
('proj-customer-churn', 'Python'),
('proj-customer-churn', 'Pandas'),
('proj-customer-churn', 'Scikit-Learn'),
('proj-customer-churn', 'Seaborn');
*/

-- ------------------------------------------------------------------------------
-- QUERY 9: Update or Mark a Contact Message as Replied
-- ------------------------------------------------------------------------------
/*
UPDATE contact_messages
SET 
    replied = TRUE,
    reply_text = 'Thank you for reaching out! I would be delighted to discuss the Data Analyst opportunity with your team.',
    replied_at = NOW(),
    is_read = TRUE
WHERE id = 'msg-1';
*/

-- ------------------------------------------------------------------------------
-- QUERY 10: Verify Admin Code
-- ------------------------------------------------------------------------------
SELECT 
    id,
    email,
    admin_code,
    role,
    last_login
FROM admin_accounts;

