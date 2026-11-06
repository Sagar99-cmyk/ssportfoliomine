-- ==============================================================================
-- Migration: 003_create_indexes_and_views.sql
-- Description: Creates optimized relational views for projects, technologies, and executive KPIs
-- ==============================================================================

-- 1. View: v_projects_catalog
-- Aggregates project details with its joined technologies list and case study
CREATE OR REPLACE VIEW `v_projects_catalog` AS
SELECT 
    p.id,
    p.title,
    p.project_type,
    p.category,
    p.difficulty,
    p.short_description,
    p.thumbnail_url,
    p.github_url,
    p.live_demo_url,
    p.linkedin_url,
    p.featured,
    p.display_order,
    p.date_created,
    COALESCE(
        (SELECT JSON_ARRAYAGG(t.name) 
         FROM project_technologies pt 
         JOIN technologies t ON pt.technology_id = t.id 
         WHERE pt.project_id = p.id), 
        JSON_ARRAY()
    ) AS technologies,
    cs.overview AS case_overview,
    cs.business_problem,
    cs.dataset_info,
    cs.data_cleaning_prep,
    cs.methodology,
    cs.code_snippets,
    cs.key_findings,
    cs.recommendations,
    cs.limitations,
    cs.dashboard_features
FROM projects p
LEFT JOIN project_case_studies cs ON p.id = cs.project_id
ORDER BY p.featured DESC, p.display_order ASC, p.date_created DESC;

-- 2. View: v_education_hierarchy
-- Aggregates education degrees with all highlights
CREATE OR REPLACE VIEW `v_education_hierarchy` AS
SELECT 
    e.id,
    e.degree,
    e.institution,
    e.location,
    e.period,
    e.grade_gpa,
    e.description,
    e.hierarchy_level,
    e.display_order,
    CASE 
        WHEN e.hierarchy_level = 1 THEN 'Undergraduate'
        WHEN e.hierarchy_level = 2 THEN 'Higher Secondary'
        ELSE 'Secondary'
    END AS level_name,
    COALESCE(
        (SELECT JSON_ARRAYAGG(eh.highlight_text)
         FROM education_highlights eh
         WHERE eh.education_id = e.id
         ORDER BY eh.display_order ASC),
        JSON_ARRAY()
    ) AS highlights
FROM education e
ORDER BY e.hierarchy_level ASC, e.display_order ASC;

-- 3. View: v_portfolio_kpi_summary
CREATE OR REPLACE VIEW `v_portfolio_kpi_summary` AS
SELECT 
    (SELECT COUNT(*) FROM projects) AS total_projects,
    (SELECT COUNT(*) FROM projects WHERE featured = 1) AS featured_projects,
    (SELECT COUNT(*) FROM skills) AS total_skills,
    (SELECT COUNT(*) FROM technologies) AS total_technologies,
    (SELECT COUNT(*) FROM education) AS total_degrees,
    (SELECT COUNT(*) FROM achievements) AS total_achievements,
    (SELECT COUNT(*) FROM certifications) AS total_certifications,
    (SELECT COUNT(*) FROM contact_messages) AS total_messages,
    (SELECT COUNT(*) FROM contact_messages WHERE is_read = 0) AS unread_messages,
    (SELECT COUNT(*) FROM newsletter_subscribers WHERE is_active = 1) AS active_subscribers;

