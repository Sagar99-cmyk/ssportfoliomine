export const FALLBACK_PROFILE = {
  id: 'profile-main',
  full_name: 'Sagar Singh',
  first_name: 'Sagar',
  last_name: 'Singh',
  headline: 'BCA Graduate | Data Analyst & BI Specialist',
  intro: 'Dedicated BCA graduate specializing in Data Analytics, Power BI, Advanced Excel, MySQL, and Python. Experienced in transforming raw transactional datasets into interactive sales dashboards, automated KPI reports, and actionable business intelligence.',
  bio: 'Focused and dedicated BCA graduate from Presidency College, Bengaluru (2026) specializing in Data Analytics, Business Intelligence, and Database Systems. Hands-on experience developing end-to-end Sales Performance & Customer Analytics Dashboards in Power BI, Advanced Excel financial models, relational data queries in MySQL, and automated data cleaning in Python (Pandas/NumPy). Equipped with strong analytical thinking, prompt engineering, and proven leadership honed through NCC Sergeant training.',
  about_details: {
    philosophy: 'My professional approach bridges analytical business intelligence with robust technical implementations. I have built end-to-end solutions including an interactive Sales Performance & Customer Analytics Dashboard ($2.4M analyzed across 50,000+ records in Power BI, Advanced Excel, and MySQL) and a collegiate PG Rental Management System using Supabase cloud database. Equipped with strong analytical acumen, Python data manipulation, and disciplined leadership from NCC Sergeant training, I am eager to contribute to forward-thinking analytics and tech teams.',
    highlights: [
      'Data Analytics & BI (Power BI, DAX & Excel)',
      'SQL & Relational Databases (MySQL, PostgreSQL)',
      'Python Data Cleaning & EDA (Pandas, NumPy)',
      'Disciplined Team Leadership (NCC Sergeant)'
    ],
    pillars: [
      {
        title: '1. Business Intelligence & Dashboards',
        desc: 'Transforming complex datasets into actionable executive visual reports. Designing star schemas, DAX measures, KPI cards, and dynamic slicers in Power BI and Excel.',
        icon: 'chart'
      },
      {
        title: '2. SQL & Relational Databases',
        desc: 'Writing optimized SQL queries in MySQL and PostgreSQL. Proficient in multi-table joins, aggregations, window functions, and maintaining relational integrity.',
        icon: 'db'
      },
      {
        title: '3. Python Data Wrangling & Web Systems',
        desc: 'Conducting exploratory data analysis (EDA) with Pandas and NumPy. Developing modern responsive web interfaces and connecting REST APIs with client-side caching.',
        icon: 'code'
      }
    ]
  },
  location: 'Bengaluru, Karnataka, India',
  email: 'sirroshan999@gmail.com',
  phone: '+91 7892570634',
  avatar_url: '/profile2.png',
  resume_url: '/assets/Sagar_Singh_Resume.pdf',
  github_url: 'https://github.com/Sagar99-cmyk',
  linkedin_url: 'https://linkedin.com/in/sagarsingh2005',
  kaggle_url: 'https://kaggle.com',
  is_available: true,
  availability_status: 'Available for Data Analyst & Entry-Level Tech Roles',
  years_experience: 'Fresher',
  dashboards_delivered: 6,
  rows_processed: '150K+',
  forecast_accuracy: '98.5%'
};

export const FALLBACK_SKILLS = [
  {
    id: 'skill-powerbi',
    name: 'Power BI',
    category: 'Data Analytics',
    proficiency_level: 'Advanced',
    description: 'Building dynamic interactive dashboards, DAX calculated measures, KPI scorecards, drill-through reports, and data modeling.',
    tools_used: ['Power BI Desktop', 'DAX Formulas', 'Power Query', 'Data Modeling', 'KPI Cards'],
    projects_count: 4,
    featured: true,
    display_order: 1
  },
  {
    id: 'skill-excel',
    name: 'Advanced Excel',
    category: 'Data Analytics',
    proficiency_level: 'Advanced',
    description: 'Data cleaning, pivot table analysis, dynamic array formulas (XLOOKUP, INDEX/MATCH), conditional formatting, and executive financial reports.',
    tools_used: ['Microsoft Excel', 'Pivot Tables', 'XLOOKUP', 'Power Query', 'Charts & Slicers'],
    projects_count: 5,
    featured: true,
    display_order: 2
  },
  {
    id: 'skill-mysql',
    name: 'MySQL',
    category: 'Databases',
    proficiency_level: 'Advanced',
    description: 'Writing optimized SQL queries, aggregate analysis, multi-table joins, subqueries, group by rollups, and database schema normalization.',
    tools_used: ['MySQL', 'MySQL Workbench', 'SQL Joins', 'Window Functions', 'Aggregations'],
    projects_count: 5,
    featured: true,
    display_order: 3
  },
  {
    id: 'skill-python',
    name: 'Python (Pandas & NumPy)',
    category: 'Data Analytics',
    proficiency_level: 'Intermediate',
    description: 'Exploratory Data Analysis (EDA), automated data cleaning, handling missing values, statistical summarization, and data visualizations.',
    tools_used: ['Python 3', 'Pandas', 'NumPy', 'Matplotlib', 'Jupyter Notebook'],
    projects_count: 4,
    featured: true,
    display_order: 4
  },
  {
    id: 'skill-tableau',
    name: 'Tableau',
    category: 'Data Analytics',
    proficiency_level: 'Intermediate',
    description: 'Developing visual narratives, geographical maps, scatter plots, calculated fields, and interactive customer retention heatmaps.',
    tools_used: ['Tableau Public', 'Visual Analytics', 'Data Blending', 'Calculated Fields'],
    projects_count: 3,
    featured: true,
    display_order: 5
  },
  {
    id: 'skill-etl',
    name: 'Data Cleaning & ETL',
    category: 'Data Analytics',
    proficiency_level: 'Advanced',
    description: 'Detecting nulls, outlier trimming, date formatting, deduplication, and schema validation across disparate transactional data sources.',
    tools_used: ['Power Query', 'Pandas', 'Regex', 'Data Validation'],
    projects_count: 5,
    featured: true,
    display_order: 6
  },
  {
    id: 'skill-web',
    name: 'Web Development (React & JS)',
    category: 'Programming',
    proficiency_level: 'Advanced',
    description: 'Modern responsive web interfaces, semantic HTML5, CSS3 animations/flexbox/grid, and modern JavaScript ES6+.',
    tools_used: ['React', 'JavaScript', 'HTML5', 'CSS3', 'TailwindCSS'],
    projects_count: 6,
    featured: true,
    display_order: 7
  },
  {
    id: 'skill-supabase',
    name: 'Supabase & Cloud Data',
    category: 'Databases',
    proficiency_level: 'Intermediate',
    description: 'Cloud PostgreSQL, Row Level Security (RLS) policies, realtime listeners, and cloud database administration.',
    tools_used: ['Supabase', 'PostgreSQL', 'SQL DDL', 'Cloud DB'],
    projects_count: 3,
    featured: true,
    display_order: 8
  }
];

export const FALLBACK_PROJECTS = [
  {
    id: 'proj-sales-bi',
    title: 'Sales Performance & Customer Analytics Dashboard (Flagship)',
    project_type: 'Major Project',
    category: 'Business Intelligence & Analytics',
    difficulty: 'Advanced',
    short_description: 'Executive-grade Power BI Sales Performance & Customer Analytics Dashboard analyzing $2.4M in transactional revenue across 50,000+ records with DAX KPI metrics, YoY trends, regional sales distribution, and customer cohort profitability.',
    thumbnail_url: '/projects/sales-dashboard.png',
    github_url: 'https://github.com/Sagar99-cmyk',
    live_demo_url: 'https://github.com/Sagar99-cmyk',
    linkedin_url: 'https://linkedin.com/in/sagarsingh2005',
    featured: true,
    display_order: 1,
    date_created: '2026-03-01',
    technologies: ['Power BI', 'DAX', 'Power Query', 'Advanced Excel', 'MySQL', 'Python']
  },
  {
    id: 'proj-1',
    title: 'PG Rental Management System (Final Year Project)',
    project_type: 'Major Project',
    category: 'Web Development & Cloud',
    difficulty: 'Advanced',
    short_description: 'Web-based PG Rental Management System with role-based access (Admin, Owner, Tenant) and real-time Supabase cloud database handling vacancy tracking, bed allocations, booking requests, and rent logs.',
    thumbnail_url: '/projects/pg-rental.png',
    github_url: 'https://github.com/Sagar99-cmyk',
    live_demo_url: 'https://github.com/Sagar99-cmyk',
    linkedin_url: 'https://linkedin.com/in/sagarsingh2005',
    featured: true,
    display_order: 2,
    date_created: '2026-02-10',
    technologies: ['React', 'JavaScript', 'Supabase', 'PostgreSQL', 'HTML5', 'CSS3']
  },
  {
    id: 'proj-2',
    title: 'DeepSeek AI Clone (API Integration)',
    project_type: 'Minor Project',
    category: 'Generative AI & APIs',
    difficulty: 'Intermediate',
    short_description: 'DeepSeek-inspired conversational AI with reasoning-based responses, modular API switching architecture, message search, and multi-format document export.',
    thumbnail_url: '/projects/ai-reasoning.png',
    github_url: 'https://github.com/Sagar99-cmyk',
    live_demo_url: 'https://github.com/Sagar99-cmyk',
    linkedin_url: 'https://linkedin.com/in/sagarsingh2005',
    featured: true,
    display_order: 3,
    date_created: '2025-08-20',
    technologies: ['React', 'JavaScript', 'DeepSeek API', 'TailwindCSS']
  },
  {
    id: 'proj-3',
    title: 'Weather Forecast App (API Integration)',
    project_type: 'Minor Project',
    category: 'Web Development',
    difficulty: 'Beginner',
    short_description: 'Responsive Weather Forecast Web Application using JavaScript with OpenWeather API integration for real-time weather retrieval across multiple cities.',
    thumbnail_url: '/projects/weather-app.png',
    github_url: 'https://github.com/Sagar99-cmyk',
    live_demo_url: 'https://github.com/Sagar99-cmyk',
    linkedin_url: 'https://linkedin.com/in/sagarsingh2005',
    featured: true,
    display_order: 4,
    date_created: '2025-10-15',
    technologies: ['JavaScript', 'HTML5', 'CSS3', 'OpenWeather API']
  },
  {
    id: 'proj-4',
    title: 'Data Analytics Portfolio Suite',
    project_type: 'Major Project',
    category: 'Full-Stack & Business Intelligence',
    difficulty: 'Advanced',
    short_description: 'Interactive 3D Data Analytics & Developer portfolio built with React 19, Three.js celestial solar system, MySQL relational database, Express API, and Sarvam AI multilingual voice bot.',
    thumbnail_url: '/projects/portfolio-suite.png',
    github_url: 'https://github.com/Sagar99-cmyk',
    live_demo_url: 'https://github.com/Sagar99-cmyk',
    linkedin_url: 'https://linkedin.com/in/sagarsingh2005',
    featured: true,
    display_order: 5,
    date_created: '2026-04-01',
    technologies: ['React', 'MySQL', 'JavaScript', 'TailwindCSS']
  }
];

export const FALLBACK_EDUCATION = [
  {
    id: 'edu-bca',
    degree: 'Bachelor of Computer Applications (BCA)',
    institution: 'Presidency College (Bengaluru City University)',
    location: 'Bengaluru, Karnataka, India',
    period: '2023 – 2026',
    grade_gpa: 'Undergraduate Degree · In Progress',
    description: 'Comprehensive undergraduate studies in Computer Applications with specialization in Database Management Systems (RDBMS), Data Analytics & Power BI, Data Structures & Algorithms, Python Programming, and Enterprise Web Development.',
    hierarchy_level: 1,
    display_order: 1,
    highlights: [
      'Major Coursework: Relational Database Management Systems (RDBMS), Advanced SQL, Data Structures in C/C++, Web Programming, and Software Engineering.',
      'Capstone Project: Developed the PG Rental Management System — a full-stack platform with real-time Supabase cloud database and multi-role access (Admin, Owner, Tenant).',
      'Analytics Flagship: Architected the executive Sales Performance & Customer Analytics Dashboard analyzing $2.4M in transactional revenue.',
      'Academic Activities: Active participant in inter-college coding symposiums, tech quizzes, and data analytics bootcamps.'
    ]
  },
  {
    id: 'edu-12',
    degree: 'Higher Secondary Education (NEB – Class 12)',
    institution: 'Shree Sunlight Public School (National Examinations Board)',
    location: 'Nepal',
    period: '2020 – 2022',
    grade_gpa: 'Percentage: 71% · First Division with Distinction',
    description: 'Completed Class 12 under the National Examinations Board (NEB) with major coursework in Computer Science, Higher Mathematics, Physics, Chemistry, and English.',
    hierarchy_level: 2,
    display_order: 2,
    highlights: [
      'Specialized stream in Computer Science and Higher Mathematics.',
      'Strong foundation in C programming syntax, memory pointers, logic gates, and database normalization fundamentals.',
      'Graduated with First Division honors under NEB national accreditation.'
    ]
  },
  {
    id: 'edu-10',
    degree: 'Secondary Education (NEB – Class 10)',
    institution: 'Shree Sunlight Public School (National Examinations Board)',
    location: 'Nepal',
    period: '2018 – 2020',
    grade_gpa: 'Percentage: 78% · Distinction Honours',
    description: 'Graduated Class 10 under the National Examinations Board (NEB) with distinguished academic excellence across Mathematics, Computer Applications, and Science.',
    hierarchy_level: 3,
    display_order: 3,
    highlights: [
      'Achieved Distinction honors across Computer Applications, Mathematics, and Science.',
      'Selected as student technology club representative and science fair contributor.'
    ]
  }
];

export const FALLBACK_ACHIEVEMENTS = [
  {
    id: 'ach-quiz',
    title: '2nd Place: Inter-College IT Quiz Competition',
    issuer: 'BMSIT, Seshadripuram & Partner Tech Institutions',
    issue_date: '2025',
    credential_url: 'https://linkedin.com/in/sagarsingh2005',
    credential_id: 'IT-QUIZ-2025-2ND',
    category: 'Competition & Academic Honor',
    skills_tags: ['Data Analytics', 'Computer Architecture', 'Relational Databases', 'Algorithmic Problem Solving', 'IT Fundamentals'],
    description: 'Awarded 2nd Place among 60+ collegiate teams in a rigorous inter-college technology competition testing proficiency in database queries, data structures, and computer science innovations.',
    display_order: 1
  },
  {
    id: 'ach-ncc',
    title: 'Sergeant Rank & "B" Certificate in NCC',
    issuer: 'National Cadet Corps (NCC)',
    issue_date: '2025',
    credential_url: 'https://linkedin.com/in/sagarsingh2005',
    credential_id: 'NCC-SGT-CERT-B-2025',
    category: 'Defense, Leadership & Discipline',
    skills_tags: ['Contingent Leadership', 'Crisis Discipline', 'Logistics Management', 'Team Operations', 'Command & Control'],
    description: 'Promoted to Sergeant rank after demonstrating high-stakes team command, obstacle training resilience, drill execution, and national camp participation under NCC authority.',
    display_order: 2
  },
  {
    id: 'ach-pbi',
    title: 'Power BI & Business Intelligence Specialization',
    issuer: 'Microsoft Power BI & Industry Analytics Program',
    issue_date: '2025',
    credential_url: 'https://linkedin.com/in/sagarsingh2005',
    credential_id: 'PBI-DAX-SPEC-2025',
    category: 'Professional Certification',
    skills_tags: ['Power BI Desktop', 'DAX Calculations', 'Power Query ETL', 'Data Modeling', 'Interactive Dashboards'],
    description: 'Practical industry certification covering star schema dimensional modeling, dynamic DAX measures (YoY sales, margin %, cohort analysis), automated ETL workflows, and executive reporting.',
    display_order: 3
  },
  {
    id: 'ach-excel',
    title: 'Advanced Excel & Business Analytics Masterclass',
    issuer: 'Analytics & Business Intelligence Academy',
    issue_date: '2025',
    credential_url: 'https://linkedin.com/in/sagarsingh2005',
    credential_id: 'EXCEL-ADV-2025-BI',
    category: 'Professional Certification',
    skills_tags: ['Advanced Excel', 'Pivot Tables & Slicers', 'XLOOKUP & INDEX/MATCH', 'Data Validation', 'Automated KPI Reports'],
    description: 'Hands-on credential validating mastery of multi-criteria lookup formulas, dynamic array functions, financial modeling, pivot tables, and automated monthly management KPI templates.',
    display_order: 4
  }
];

export const FALLBACK_TECHNOLOGIES = [
  { id: 'tech-powerbi', name: 'Power BI', category: 'Analytics', icon_slug: 'powerbi', description: 'Business Intelligence and interactive data reporting' },
  { id: 'tech-excel', name: 'Advanced Excel', category: 'Analytics', icon_slug: 'excel', description: 'Pivot tables, XLOOKUP, dynamic arrays, financial modeling' },
  { id: 'tech-mysql', name: 'MySQL', category: 'Databases', icon_slug: 'mysql', description: 'Relational database management, joins, stored procedures' },
  { id: 'tech-python', name: 'Python', category: 'Programming', icon_slug: 'python', description: 'Data analysis, automation, Pandas, NumPy' },
  { id: 'tech-pandas', name: 'Pandas', category: 'Analytics', icon_slug: 'pandas', description: 'DataFrame transformations, exploratory data analysis' },
  { id: 'tech-numpy', name: 'NumPy', category: 'Analytics', icon_slug: 'numpy', description: 'Numerical computing and array vectorization' },
  { id: 'tech-tableau', name: 'Tableau', category: 'Analytics', icon_slug: 'tableau', description: 'Visual analytics, heatmaps, geographical mapping' },
  { id: 'tech-dax', name: 'DAX', category: 'Analytics', icon_slug: 'dax', description: 'Data Analysis Expressions for Power BI measures' },
  { id: 'tech-powerquery', name: 'Power Query', category: 'Analytics', icon_slug: 'powerquery', description: 'ETL data transformation and cleaning engine' },
  { id: 'tech-react', name: 'React', category: 'Frontend', icon_slug: 'react', description: 'Component-based modern web user interfaces' },
  { id: 'tech-javascript', name: 'JavaScript', category: 'Programming', icon_slug: 'javascript', description: 'Modern ES6+ frontend and backend scripting' },
  { id: 'tech-supabase', name: 'Supabase', category: 'Cloud Database', icon_slug: 'supabase', description: 'Cloud PostgreSQL and serverless authentication' },
  { id: 'tech-postgresql', name: 'PostgreSQL', category: 'Databases', icon_slug: 'postgresql', description: 'Object-relational database management system' },
  { id: 'tech-html5', name: 'HTML5', category: 'Frontend', icon_slug: 'html5', description: 'Semantic web structure and modern layouts' },
  { id: 'tech-css3', name: 'CSS3', category: 'Frontend', icon_slug: 'css3', description: 'Responsive styling, Flexbox, CSS Grid, animations' },
  { id: 'tech-tailwindcss', name: 'TailwindCSS', category: 'Frontend', icon_slug: 'tailwind', description: 'Utility-first modern responsive styling' }
];

export const FALLBACK_METRICS = {
  yearsExperience: 'Fresher',
  dashboardsDelivered: 6,
  rowsProcessed: '150K+',
  forecastAccuracy: '98.5%',
  totalProjects: 5,
  totalSkills: 8,
  totalAchievements: 2,
  databaseStatus: 'Resilient Cloud Mode'
};

export const MASTER_ADMIN_CREDENTIALS = {
  email: 'sirroshan999@gmail.com',
  password_hash: 'c7e8e8a8b3bcc23d58dadd453a2671282b172293c4ecb8df610cfa89ae7b6fd977f351b7149f9fc47e56327c26e51a6e52183db2dc45f9b815e4673b34d07c12',
  password_salt: 'f6097e5dec979a3e00e465b11ec34b1c',
  role: 'SuperAdmin'
};

