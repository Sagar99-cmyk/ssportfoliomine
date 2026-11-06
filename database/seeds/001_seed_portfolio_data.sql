-- ==============================================================================
-- Seed: 001_seed_portfolio_data.sql
-- Description: Seeds complete portfolio data for Sagar Singh
-- ==============================================================================

USE `sagar_portfolio_db`;

-- 1. Profile
INSERT INTO `portfolio_profile` (
    `id`, `full_name`, `first_name`, `last_name`, `headline`, `intro`, `bio`, `about_details`,
    `location`, `email`, `phone`, `avatar_url`, `resume_url`, `github_url`, `linkedin_url`, `kaggle_url`,
    `is_available`, `availability_status`, `years_experience`, `dashboards_delivered`, `rows_processed`, `forecast_accuracy`
) VALUES (
    'profile-main',
    'Sagar Singh',
    'Sagar',
    'Singh',
    'BCA Graduate | Data Analyst & BI Specialist',
    'Dedicated BCA graduate specializing in Data Analytics, Power BI, Advanced Excel, MySQL, and Python. Experienced in transforming raw transactional datasets into interactive sales dashboards, automated KPI reports, and actionable business intelligence.',
    'Focused and dedicated BCA graduate from Presidency College, Bengaluru (2026) specializing in Data Analytics, Business Intelligence, and Database Systems. Hands-on experience developing end-to-end Sales Performance & Customer Analytics Dashboards in Power BI, Advanced Excel financial models, relational data queries in MySQL, and automated data cleaning in Python (Pandas/NumPy). Equipped with strong analytical thinking, prompt engineering, and proven leadership honed through NCC Sergeant training.',
    '{"philosophy":"My professional approach bridges analytical business intelligence with robust technical implementations. I have built end-to-end solutions including an interactive Sales Performance & Customer Analytics Dashboard ($2.4M analyzed across 50,000+ records in Power BI, Advanced Excel, and MySQL) and a collegiate PG Rental Management System using Supabase cloud database. Equipped with strong analytical acumen, Python data manipulation, and disciplined leadership from NCC Sergeant training, I am eager to contribute to forward-thinking analytics and tech teams.","highlights":["Data Analytics & BI (Power BI, DAX & Excel)","SQL & Relational Databases (MySQL, PostgreSQL)","Python Data Cleaning & EDA (Pandas, NumPy)","Disciplined Team Leadership (NCC Sergeant)"],"pillars":[{"title":"1. Business Intelligence & Dashboards","desc":"Transforming complex datasets into actionable executive visual reports. Designing star schemas, DAX measures, KPI cards, and dynamic slicers in Power BI and Excel.","icon":"chart"},{"title":"2. SQL & Relational Databases","desc":"Writing optimized SQL queries in MySQL and PostgreSQL. Proficient in multi-table joins, aggregations, window functions, and maintaining relational integrity.","icon":"db"},{"title":"3. Python Data Wrangling & Web Systems","desc":"Conducting exploratory data analysis (EDA) with Pandas and NumPy. Developing modern responsive web interfaces and connecting REST APIs with client-side caching.","icon":"code"}]}',
    'Bengaluru, Karnataka, India',
    'sirroshan999@gmail.com',
    '+91 7892570634',
    '/profile2.png',
    '/assets/Sagar_Singh_Resume.pdf',
    'https://github.com/Sagar99-cmyk',
    'https://linkedin.com/in/sagarsingh2005',
    'https://kaggle.com',
    1,
    'Available for Data Analyst & Entry-Level Tech Roles',
    'Fresher',
    6,
    '150K+',
    '98.5%'
) ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), about_details = VALUES(about_details);

-- 2. Technologies Catalog
INSERT INTO `technologies` (`id`, `name`, `category`, `icon_slug`, `description`) VALUES
('tech-powerbi', 'Power BI', 'Analytics', 'powerbi', 'Business Intelligence and interactive data reporting'),
('tech-excel', 'Advanced Excel', 'Analytics', 'excel', 'Pivot tables, XLOOKUP, dynamic arrays, financial modeling'),
('tech-mysql', 'MySQL', 'Databases', 'mysql', 'Relational database management, joins, stored procedures'),
('tech-python', 'Python', 'Programming', 'python', 'Data analysis, automation, Pandas, NumPy'),
('tech-pandas', 'Pandas', 'Analytics', 'pandas', 'DataFrame transformations, exploratory data analysis'),
('tech-numpy', 'NumPy', 'Analytics', 'numpy', 'Numerical computing and array vectorization'),
('tech-tableau', 'Tableau', 'Analytics', 'tableau', 'Visual analytics, heatmaps, geographical mapping'),
('tech-dax', 'DAX', 'Analytics', 'dax', 'Data Analysis Expressions for Power BI measures'),
('tech-powerquery', 'Power Query', 'Analytics', 'powerquery', 'ETL data transformation and cleaning engine'),
('tech-react', 'React', 'Frontend', 'react', 'Component-based modern web user interfaces'),
('tech-javascript', 'JavaScript', 'Programming', 'javascript', 'Modern ES6+ frontend and backend scripting'),
('tech-supabase', 'Supabase', 'Cloud Database', 'supabase', 'Cloud PostgreSQL and serverless authentication'),
('tech-postgresql', 'PostgreSQL', 'Databases', 'postgresql', 'Object-relational database management system'),
('tech-html5', 'HTML5', 'Frontend', 'html5', 'Semantic web structure and modern layouts'),
('tech-css3', 'CSS3', 'Frontend', 'css3', 'Responsive styling, Flexbox, CSS Grid, animations'),
('tech-tailwindcss', 'TailwindCSS', 'Frontend', 'tailwind', 'Utility-first modern responsive styling'),
('tech-openweather', 'OpenWeather API', 'API', 'api', 'Real-time global meteorological weather data API'),
('tech-deepseek', 'DeepSeek API', 'AI', 'ai', 'Reasoning-based conversational LLM API')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- 3. Projects
INSERT INTO `projects` (`id`, `title`, `project_type`, `category`, `difficulty`, `short_description`, `thumbnail_url`, `github_url`, `live_demo_url`, `linkedin_url`, `featured`, `display_order`, `date_created`) VALUES
(
    'proj-sales-bi',
    'Sales Performance & Customer Analytics Dashboard (Flagship)',
    'Major Project',
    'Business Intelligence & Analytics',
    'Advanced',
    'Executive-grade Power BI Sales Performance & Customer Analytics Dashboard analyzing $2.4M in transactional revenue across 50,000+ records with DAX KPI metrics, YoY trends, regional sales distribution, and customer cohort profitability.',
    '/projects/sales-dashboard.png',
    'https://github.com/Sagar99-cmyk',
    'https://github.com/Sagar99-cmyk',
    'https://linkedin.com/in/sagarsingh2005',
    1,
    1,
    '2026-03-01'
),
(
    'proj-1',
    'PG Rental Management System (Final Year Project)',
    'Major Project',
    'Web Development & Cloud',
    'Advanced',
    'Web-based PG Rental Management System with role-based access (Admin, Owner, Tenant) and real-time Supabase cloud database handling vacancy tracking, bed allocations, booking requests, and rent logs.',
    '/projects/pg-rental.png',
    'https://github.com/Sagar99-cmyk',
    'https://github.com/Sagar99-cmyk',
    'https://linkedin.com/in/sagarsingh2005',
    1,
    2,
    '2026-02-10'
),
(
    'proj-2',
    'DeepSeek AI Clone (API Integration)',
    'Minor Project',
    'Generative AI & APIs',
    'Intermediate',
    'DeepSeek-inspired conversational AI with reasoning-based responses, modular API switching architecture, message search, and multi-format document export.',
    '/projects/ai-reasoning.png',
    'https://github.com/Sagar99-cmyk',
    'https://github.com/Sagar99-cmyk',
    'https://linkedin.com/in/sagarsingh2005',
    1,
    3,
    '2025-08-20'
),
(
    'proj-3',
    'Weather Forecast App (API Integration)',
    'Minor Project',
    'Web Development',
    'Beginner',
    'Responsive Weather Forecast Web Application using JavaScript with OpenWeather API integration for real-time weather retrieval across multiple cities.',
    '/projects/weather-app.png',
    'https://github.com/Sagar99-cmyk',
    'https://github.com/Sagar99-cmyk',
    'https://linkedin.com/in/sagarsingh2005',
    1,
    4,
    '2025-10-15'
),
(
    'proj-4',
    'Data Analytics Portfolio Suite',
    'Major Project',
    'Full-Stack & Business Intelligence',
    'Advanced',
    'Interactive 3D Data Analytics & Developer portfolio built with React 19, Three.js celestial solar system, MySQL relational database, Express API, and Sarvam AI multilingual voice bot.',
    '/projects/portfolio-suite.png',
    'https://github.com/Sagar99-cmyk',
    'https://github.com/Sagar99-cmyk',
    'https://linkedin.com/in/sagarsingh2005',
    1,
    5,
    '2026-04-01'
)
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- 4. Project Technologies (Junction Table)
INSERT INTO `project_technologies` (`project_id`, `technology_id`) VALUES
('proj-sales-bi', 'tech-powerbi'),
('proj-sales-bi', 'tech-dax'),
('proj-sales-bi', 'tech-powerquery'),
('proj-sales-bi', 'tech-excel'),
('proj-sales-bi', 'tech-mysql'),
('proj-sales-bi', 'tech-python'),
('proj-1', 'tech-react'),
('proj-1', 'tech-javascript'),
('proj-1', 'tech-supabase'),
('proj-1', 'tech-postgresql'),
('proj-1', 'tech-html5'),
('proj-1', 'tech-css3'),
('proj-2', 'tech-react'),
('proj-2', 'tech-javascript'),
('proj-2', 'tech-deepseek'),
('proj-2', 'tech-tailwindcss'),
('proj-3', 'tech-javascript'),
('proj-3', 'tech-html5'),
('proj-3', 'tech-css3'),
('proj-3', 'tech-openweather'),
('proj-4', 'tech-react'),
('proj-4', 'tech-mysql'),
('proj-4', 'tech-javascript'),
('proj-4', 'tech-tailwindcss')
ON DUPLICATE KEY UPDATE project_id = VALUES(project_id);

-- 5. Project Case Studies
INSERT INTO `project_case_studies` (
    `project_id`, `overview`, `business_problem`, `dataset_info`, `data_cleaning_prep`,
    `methodology`, `code_snippets`, `key_findings`, `recommendations`, `limitations`, `dashboard_features`
) VALUES
(
    'proj-sales-bi',
    'Designed and deployed an end-to-end Sales Performance & Customer Analytics Dashboard in Power BI analyzing $2,418,650 in revenue across 50,000+ transactional records spanning North America, Europe, Asia-Pacific, and LATAM.',
    'Executive leadership lacked centralized visibility into regional profit margins, product return rates, and customer retention dynamics. Disparate CSV reports caused 3-day reporting delays.',
    'Cleaned and consolidated transactional order history with 50,000+ rows, 4 geographic regions, 3 product categories (Technology, Furniture, Office Supplies), and 1,200 unique customer accounts.',
    'Used Power Query and Pandas to remove duplicates, standardize date formats, resolve missing shipping zip codes, and calculate unit profit metrics.',
    'Built a star schema with Fact_Sales connected to Dim_Customer, Dim_Product, Dim_Date, and Dim_Region. Authored advanced DAX measures for YoY Sales %, Gross Margin, and Rolling 3-Month Averages.',
    JSON_ARRAY(
        JSON_OBJECT(
            'language', 'dax',
            'title', 'DAX Measure: Year-over-Year Sales Growth %',
            'code', 'YoY Sales Growth % = \nVAR CurrentYearSales = [Total Sales]\nVAR PriorYearSales = CALCULATE([Total Sales], SAMEPERIODLASTYEAR(\'Dim_Date\'[Date]))\nRETURN DIVIDE(CurrentYearSales - PriorYearSales, PriorYearSales, 0)'
        ),
        JSON_OBJECT(
            'language', 'sql',
            'title', 'MySQL Analytical Query: Top Regional Revenue & Customer Retention',
            'code', 'SELECT \n    r.region_name,\n    COUNT(DISTINCT s.customer_id) AS active_customers,\n    ROUND(SUM(s.sales_amount), 2) AS total_revenue,\n    ROUND(SUM(s.gross_profit), 2) AS total_profit,\n    ROUND((SUM(s.gross_profit) / SUM(s.sales_amount)) * 100, 2) AS profit_margin_pct\nFROM fact_sales s\nJOIN dim_region r ON s.region_id = r.region_id\nGROUP BY r.region_name\nORDER BY total_revenue DESC;'
        )
    ),
    JSON_ARRAY(
        'Total revenue reached $2,418,650 with a net 24.8% profit margin across all 4 zones.',
        'Technology drove 43% of overall sales volume, while Office Supplies yielded highest margin (32.1%).',
        'Top 10% of VIP customers contributed 58% of cumulative business profit.',
        'South Region outperformed other zones in YoY growth (+18.4%).'
    ),
    JSON_ARRAY(
        'Re-engage dormant customer cohorts using personalized loyalty discounts.',
        'Prioritize high-margin accessories alongside core electronic product bundles.',
        'Automate daily data refresh pipelines using MySQL scheduled events and Power BI Service gateway.'
    ),
    'Historical shipping delay data was self-reported by carriers without real-time GPS telemetry.',
    JSON_ARRAY(
        'Executive KPI Overview (Revenue, YoY Growth %, Profit Margin, AOV)',
        'Regional Sales Matrix & Interactive Geospatial Map',
        'Product Category Performance & Profitability Waterfall',
        'Customer Lifetime Value (CLV) & Cohort Retention Heatmap'
    )
),
(
    'proj-1',
    'Developed a comprehensive web-based PG Rental Management System as a Final Year Project (Dec 2025 – Feb 2026). Features role-based access for Admins, Owners, and Tenants with live Supabase cloud storage.',
    'Collegiate PG accommodations struggle with room vacancy visibility, physical paper registers, delayed tenant rent payments, and cumbersome dispute management.',
    'Supabase PostgreSQL database schemas managing Users, Roles, Rooms, Bed Allocations, Booking Requests, and Rent Payment records.',
    'Implemented validation rules for room capacities, normalized payment timestamps, and secured user credentials using Supabase Auth.',
    'Engineered full-stack architecture with role-based routing (Admin, Owner, Tenant). Implemented room availability tracking, tenant management, booking requests, and rent status monitoring.',
    JSON_ARRAY(
        JSON_OBJECT(
            'language', 'sql',
            'title', 'Supabase Cloud Database Schema & Policy',
            'code', 'CREATE TABLE pg_rooms (\n    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n    room_number VARCHAR(20) NOT NULL UNIQUE,\n    capacity INT NOT NULL,\n    occupied_count INT DEFAULT 0,\n    monthly_rent NUMERIC(10,2) NOT NULL,\n    status VARCHAR(20) DEFAULT \'available\'\n);\n\nCREATE POLICY "Public read for available rooms" \nON pg_rooms FOR SELECT USING (status = \'available\');'
        )
    ),
    JSON_ARRAY(
        'Streamlined room allocation and tenant tracking with sub-second cloud sync.',
        'Eliminated double-booking incidents through real-time Supabase status listeners.',
        'Clean UI/UX design with responsive dashboards across mobile and desktop.'
    ),
    JSON_ARRAY(
        'Integrate automated WhatsApp rent payment reminders for tenants.',
        'Add tenant KYC ID verification document upload.'
    ),
    'Requires active internet connectivity for live cloud synchronization.',
    JSON_ARRAY(
        'Room Availability & Bed Occupancy Matrix',
        'Role-Based Portals (Admin, Owner, Tenant)',
        'Booking Request & Approval Workflow',
        'Rent Status & Payment Logging'
    )
)
ON DUPLICATE KEY UPDATE overview = VALUES(overview);

-- 6. Skills
INSERT INTO `skills` (`id`, `name`, `category`, `proficiency_level`, `description`, `tools_used`, `projects_count`, `featured`, `display_order`) VALUES
('skill-powerbi', 'Power BI', 'Data Analytics', 'Advanced', 'Building dynamic interactive dashboards, DAX calculated measures, KPI scorecards, drill-through reports, and data modeling.', JSON_ARRAY('Power BI Desktop', 'DAX Formulas', 'Power Query', 'Data Modeling', 'KPI Cards'), 4, 1, 1),
('skill-excel', 'Advanced Excel', 'Data Analytics', 'Advanced', 'Data cleaning, pivot table analysis, dynamic array formulas (XLOOKUP, INDEX/MATCH), conditional formatting, and executive financial reports.', JSON_ARRAY('Microsoft Excel', 'Pivot Tables', 'XLOOKUP', 'Power Query', 'Charts & Slicers'), 5, 1, 2),
('skill-mysql', 'MySQL', 'Databases', 'Advanced', 'Writing optimized SQL queries, aggregate analysis, multi-table joins, subqueries, group by rollups, and database schema normalization.', JSON_ARRAY('MySQL', 'MySQL Workbench', 'SQL Joins', 'Window Functions', 'Aggregations'), 5, 1, 3),
('skill-python', 'Python (Pandas & NumPy)', 'Data Analytics', 'Intermediate', 'Exploratory Data Analysis (EDA), automated data cleaning, handling missing values, statistical summarization, and data visualizations.', JSON_ARRAY('Python 3', 'Pandas', 'NumPy', 'Matplotlib', 'Jupyter Notebook'), 4, 1, 4),
('skill-tableau', 'Tableau', 'Data Analytics', 'Intermediate', 'Developing visual narratives, geographical maps, scatter plots, calculated fields, and interactive customer retention heatmaps.', JSON_ARRAY('Tableau Public', 'Visual Analytics', 'Data Blending', 'Calculated Fields'), 3, 1, 5),
('skill-etl', 'Data Cleaning & ETL', 'Data Analytics', 'Advanced', 'Detecting nulls, outlier trimming, date formatting, deduplication, and schema validation across disparate transactional data sources.', JSON_ARRAY('Power Query', 'Pandas', 'Regex', 'Data Validation'), 5, 1, 6),
('skill-web', 'Web Development (React & JS)', 'Programming', 'Advanced', 'Modern responsive web interfaces, semantic HTML5, CSS3 animations/flexbox/grid, and modern JavaScript ES6+.', JSON_ARRAY('React', 'JavaScript', 'HTML5', 'CSS3', 'TailwindCSS'), 6, 1, 7),
('skill-supabase', 'Supabase & Cloud Data', 'Databases', 'Intermediate', 'Cloud PostgreSQL, Row Level Security (RLS) policies, realtime listeners, and cloud database administration.', JSON_ARRAY('Supabase', 'PostgreSQL', 'SQL DDL', 'Cloud DB'), 3, 1, 8)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- 7. Education
INSERT INTO `education` (`id`, `degree`, `institution`, `location`, `period`, `grade_gpa`, `description`, `hierarchy_level`, `display_order`) VALUES
('edu-bca', 'Bachelor of Computer Applications (BCA)', 'Presidency College', 'Bengaluru, Karnataka', '2023 – 2026', 'Undergraduate Degree', 'Undergraduate studies focusing on Database Management Systems, Data Structures, Software Engineering, Python Programming, and Web Development.', 1, 1),
('edu-12', 'Higher Secondary Education (NEB – Class 12)', 'Shree Sunlight Public School', 'Nepal', '2020 – 2022', 'Percentage: 71%', 'Completed Class 12 under National Examinations Board (NEB) with major coursework in Computer Science, Mathematics, Physics, and English.', 2, 2),
('edu-10', 'Secondary Education (NEB – Class 10)', 'Shree Sunlight Public School', 'Nepal', '2018 – 2020', 'Percentage: 78%', 'Graduated Class 10 with strong academic performance in Mathematics, Computer Applications, and Science.', 3, 3)
ON DUPLICATE KEY UPDATE degree = VALUES(degree);

-- 8. Education Highlights
INSERT INTO `education_highlights` (`education_id`, `highlight_text`, `display_order`) VALUES
('edu-bca', 'Major Coursework: Relational Database Management Systems (RDBMS), SQL, Data Structures in C/C++, Web Programming', 1),
('edu-bca', 'Developed PG Rental Management System (Full-Stack web project with Supabase cloud database integration)', 2),
('edu-bca', 'Active participant in college coding symposiums, tech quizzes, and academic data workshops', 3),
('edu-12', 'Specialized stream in Computer Science and Higher Mathematics', 1),
('edu-12', 'Foundation in C programming, database fundamentals, and boolean algebra', 2),
('edu-10', 'Distinction performance in Computer Science, Mathematics, and Science', 1)
ON DUPLICATE KEY UPDATE highlight_text = VALUES(highlight_text);

-- 9. Achievements
INSERT INTO `achievements` (`id`, `title`, `issuer`, `issue_date`, `credential_url`, `credential_id`, `category`, `skills_tags`, `display_order`) VALUES
('ach-quiz', '2nd Place: Inter-College IT Quiz Competition', 'BMSIT, Shesadripuram & Reputed Institutions', '2025', 'https://linkedin.com/in/sagarsingh2005', 'IT-QUIZ-2025-2ND', 'Competition', JSON_ARRAY('Computer Fundamentals', 'Data Analytics', 'IT General Knowledge', 'Quick Problem Solving'), 1),
('ach-ncc', 'Sergeant Rank & "B" Certificate in NCC', 'National Cadet Corps (NCC)', '2025', 'https://linkedin.com/in/sagarsingh2005', 'NCC-SGT-CERT-B-2025', 'Defense & Leadership', JSON_ARRAY('Leadership', 'Team Management', 'Crisis Discipline', 'Field Operations'), 2)
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- 10. Certifications
INSERT INTO `certifications` (`id`, `title`, `issuer`, `issue_date`, `credential_url`, `credential_id`, `skills_covered`, `display_order`) VALUES
('cert-genai', 'Generative AI: Prompt & Integration', 'Microsoft - (LinkedIn Learning)', '2025', 'https://linkedin.com/in/sagarsingh2005', 'MSFT-GENAI-2025', JSON_ARRAY('Prompt Engineering', 'Generative AI Concepts', 'LLM Workflow Integration'), 1),
('cert-web', 'Web Development Certification', 'Internshala Trainings', '2024', 'https://linkedin.com/in/sagarsingh2005', 'IS-WEBDEV-2024', JSON_ARRAY('HTML5', 'CSS3', 'JavaScript', 'Responsive Web Design'), 2),
('cert-ai-basics', 'AI Basics Certification', 'Accenture via FutureLearn', '2024', 'https://linkedin.com/in/sagarsingh2005', 'ACCN-AI-2024', JSON_ARRAY('Artificial Intelligence Fundamentals', 'Data Patterns', 'Ethical AI'), 3)
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- 11. Admin Master Account (Salted Hash for passcode: 789257)
INSERT INTO `admin_users` (`id`, `email`, `password_hash`, `password_salt`, `role`) VALUES (
    'admin-master',
    'sirroshan999@gmail.com',
    'c7e8e8a8b3bcc23d58dadd453a2671282b172293c4ecb8df610cfa89ae7b6fd977f351b7149f9fc47e56327c26e51a6e52183db2dc45f9b815e4673b34d07c12',
    'f6097e5dec979a3e00e465b11ec34b1c',
    'SuperAdmin'
) ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash);

-- 12. Site Analytics
INSERT INTO `site_analytics` (`metric_key`, `metric_name`, `metric_value`) VALUES
('resume_downloads', 'Total Resume Downloads', 142),
('page_visits', 'Total Portfolio Visits', 1850),
('ai_conversations', 'Total AI Conversations Handled', 94)
ON DUPLICATE KEY UPDATE metric_value = VALUES(metric_value);

