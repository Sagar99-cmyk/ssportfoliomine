-- ==============================================================================
-- SAGAR SINGH - PORTFOLIO DATABASE SESSION & WORKBENCH PLAYGROUND
-- Database: sagar_portfolio_db
-- ==============================================================================

USE `sagar_portfolio_db`;

-- 1. Check Database Health & Engine Version
SELECT 
    DATABASE() AS active_database,
    VERSION() AS mysql_version,
    CURRENT_TIMESTAMP() AS server_time;

-- 2. Inspect Profile Details
SELECT 
    full_name,
    headline,
    email,
    phone,
    location,
    availability_status,
    years_experience,
    dashboards_delivered,
    rows_processed,
    forecast_accuracy,
    updated_at
FROM `portfolio_profile`;

-- 3. Projects Catalog with Joined Technologies (Many-to-Many via v_projects_catalog)
SELECT 
    id,
    title,
    project_type,
    category,
    difficulty,
    technologies_list,
    featured
FROM `v_projects_catalog`
ORDER BY featured DESC, id ASC;

-- 4. Deep Case Study Details (Flagship Sales Performance Dashboard)
SELECT 
    p.title,
    cs.overview,
    cs.business_problem,
    cs.dataset_info,
    cs.methodology,
    cs.key_findings
FROM `projects` p
JOIN `project_case_studies` cs ON p.id = cs.project_id
WHERE p.id = 'proj-sales-bi';

-- 5. Orbiting Skills & Proficiencies (3D Celestial View)
SELECT 
    name,
    category,
    proficiency_level,
    projects_count,
    featured,
    display_order
FROM `skills`
ORDER BY display_order ASC;

-- 6. Education Hierarchy with Highlights Count
SELECT 
    hierarchy_level,
    degree,
    institution,
    period,
    grade_gpa,
    highlights_count
FROM `v_education_hierarchy`;

-- 7. Verified Honors, Awards & Certifications
SELECT 
    'Award / Competition' AS record_type,
    title,
    issuer,
    issue_date,
    category
FROM `achievements`
UNION ALL
SELECT 
    'Certification' AS record_type,
    title,
    issuer,
    issue_date,
    'Certification' AS category
FROM `certifications`
ORDER BY issue_date DESC;

-- 8. Contact Form Inquiries (Live Recruiter Messages)
SELECT 
    id,
    name,
    email,
    subject,
    is_read,
    replied,
    created_at
FROM `contact_messages`
ORDER BY created_at DESC;

-- 9. Newsletter Subscribers
SELECT 
    id,
    email,
    subscribed_at,
    is_active
FROM `newsletter_subscribers`
ORDER BY subscribed_at DESC;

-- 10. Site Analytics Telemetry (Resume Downloads, Visits, AI Chats)
SELECT 
    metric_name,
    metric_value,
    last_updated
FROM `site_analytics`;

-- 11. Schema Migrations Log (Idempotent Execution History)
SELECT 
    id,
    version,
    name,
    applied_at
FROM `schema_migrations`
ORDER BY id ASC;

