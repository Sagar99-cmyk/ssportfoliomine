import { Profile, Skill, Project, Education, Achievement } from '../types';

export const DEFAULT_PROFILE: Profile = {
  id: 'profile-main',
  name: 'Sagar Singh',
  designation: 'BCA Graduate | Data Analyst & BI Specialist',
  tagline: 'Dedicated BCA graduate specializing in Data Analytics, Power BI, Advanced Excel, MySQL, and Python.',
  intro: 'Dedicated BCA graduate specializing in Data Analytics, Power BI, Advanced Excel, MySQL, and Python. Experienced in transforming raw transactional datasets into interactive sales dashboards, automated KPI reports, and actionable business intelligence.',
  aboutBio: 'Focused and dedicated BCA graduate from Presidency College, Bengaluru (2026) specializing in Data Analytics, Business Intelligence, and Database Systems. Hands-on experience developing end-to-end Sales Performance & Customer Analytics Dashboards in Power BI, Advanced Excel financial models, relational data queries in MySQL, and automated data cleaning in Python (Pandas/NumPy). Equipped with strong analytical thinking, prompt engineering, and proven leadership honed through NCC Sergeant training.',
  avatarUrl: '/profile2.png',
  resumeUrl: '/assets/Sagar_Singh_Resume.pdf',
  location: 'Bengaluru, Karnataka, India',
  email: 'sirroshan999@gmail.com',
  phone: '+91 7892570634',
  linkedinUrl: 'https://linkedin.com/in/sagarsingh2005',
  githubUrl: 'https://github.com/Sagar99-cmyk',
  kaggleUrl: 'https://kaggle.com',
  isAvailable: true,
  availabilityStatus: 'Available for Data Analyst & Entry-Level Tech Roles',
  stats: {
    yearsExperience: 1,
    dashboardsDelivered: 6,
    rowsProcessed: '150K+',
    forecastAccuracy: '98.5%',
  },
  aboutDetails: {
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
  }
};

export const DEFAULT_SKILLS: Skill[] = [
  {
    id: 'skill-powerbi',
    name: 'Power BI',
    category: 'Business Intelligence',
    proficiencyLevel: 'Advanced',
    description: 'Building dynamic interactive dashboards, DAX calculated measures, KPI scorecards, drill-through reports, and dimensional star schema data modeling.',
    toolsUsed: ['Power BI Desktop', 'DAX Formulas', 'Power Query', 'Data Modeling', 'KPI Cards'],
    projectsCount: 4,
    featured: true
  },
  {
    id: 'skill-excel',
    name: 'Advanced Excel',
    category: 'Spreadsheets',
    proficiencyLevel: 'Advanced',
    description: 'Data cleaning, pivot table analysis, dynamic array formulas (XLOOKUP, INDEX/MATCH), conditional formatting, and executive financial reports.',
    toolsUsed: ['Microsoft Excel', 'Pivot Tables', 'XLOOKUP', 'Power Query', 'Charts & Slicers'],
    projectsCount: 5,
    featured: true
  },
  {
    id: 'skill-mysql',
    name: 'MySQL',
    category: 'Databases',
    proficiencyLevel: 'Advanced',
    description: 'Writing optimized SQL queries, aggregate analysis, multi-table joins, subqueries, group by rollups, and database schema normalization.',
    toolsUsed: ['MySQL', 'MySQL Workbench', 'SQL Joins', 'Window Functions', 'Aggregations'],
    projectsCount: 5,
    featured: true
  },
  {
    id: 'skill-python',
    name: 'Python (Pandas & NumPy)',
    category: 'Programming',
    proficiencyLevel: 'Intermediate',
    description: 'Exploratory Data Analysis (EDA), automated data cleaning, handling missing values, statistical summarization, and data visualizations.',
    toolsUsed: ['Python 3', 'Pandas', 'NumPy', 'Matplotlib', 'Jupyter Notebook'],
    projectsCount: 4,
    featured: true
  },
  {
    id: 'skill-tableau',
    name: 'Tableau',
    category: 'Business Intelligence',
    proficiencyLevel: 'Intermediate',
    description: 'Building executive dashboards, interactive visual stories, geographic maps, and trend line predictive forecasts.',
    toolsUsed: ['Tableau Desktop', 'Visual Analytics', 'Calculated Fields', 'Story Points'],
    projectsCount: 2,
    featured: false
  },
  {
    id: 'skill-supabase',
    name: 'Supabase & Cloud DB',
    category: 'Databases',
    proficiencyLevel: 'Intermediate',
    description: 'PostgreSQL cloud database administration, Row-Level Security (RLS) policies, and real-time state synchronization.',
    toolsUsed: ['Supabase', 'PostgreSQL', 'RLS Policies', 'Cloud Storage'],
    projectsCount: 2,
    featured: false
  },
  {
    id: 'skill-git',
    name: 'Git & GitHub',
    category: 'Developer Tools',
    proficiencyLevel: 'Intermediate',
    description: 'Version control workflows, repository synchronization, feature branching, merge conflict resolution, and CI/CD deployment.',
    toolsUsed: ['Git CLI', 'GitHub', 'Markdown', 'Release Tags'],
    projectsCount: 6,
    featured: false
  },
  {
    id: 'skill-react',
    name: 'React & Web BI',
    category: 'Programming',
    proficiencyLevel: 'Intermediate',
    description: 'Developing modern responsive analytical web frontends, integrating REST endpoints, client-side caching, and interactive chart visualizations.',
    toolsUsed: ['React', 'JavaScript', 'TailwindCSS', 'REST APIs'],
    projectsCount: 4,
    featured: true
  }
];

export const DEFAULT_EDUCATION: Education[] = [
  {
    id: 'edu-bca',
    degree: 'Bachelor of Computer Applications (BCA)',
    institution: 'Presidency College (Bengaluru City University)',
    location: 'Bengaluru, Karnataka, India',
    period: '2023 – 2026',
    gradeGpa: 'Undergraduate Degree · In Progress',
    description: 'Comprehensive undergraduate studies in Computer Applications with specialization in Database Management Systems (RDBMS), Data Analytics & Power BI, Data Structures & Algorithms, Python Programming, and Enterprise Web Development.',
    level: 'Level 1 · Highest / Undergraduate Degree',
    order: 1,
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
    gradeGpa: 'Percentage: 71% · First Division with Distinction',
    description: 'Completed Class 12 under the National Examinations Board (NEB) with major coursework in Computer Science, Higher Mathematics, Physics, Chemistry, and English.',
    level: 'Level 2 · Higher Secondary Education (+2 / Class 12)',
    order: 2,
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
    gradeGpa: 'Percentage: 78% · Distinction Honours',
    description: 'Graduated Class 10 under the National Examinations Board (NEB) with distinguished academic excellence across Mathematics, Computer Applications, and Science.',
    level: 'Level 3 · Secondary School Education (Class 10)',
    order: 3,
    highlights: [
      'Achieved Distinction honors across Computer Applications, Mathematics, and Science.',
      'Selected as student technology club representative and science fair contributor.'
    ]
  }
];

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-quiz',
    title: '2nd Place: Inter-College IT Quiz Competition',
    issuer: 'BMSIT, Seshadripuram & Partner Tech Institutions',
    issueDate: '2025',
    credentialUrl: 'https://linkedin.com/in/sagarsingh2005',
    credentialId: 'IT-QUIZ-2025-2ND',
    category: 'Competition & Academic Honor',
    skills: ['Data Analytics', 'Computer Architecture', 'Relational Databases', 'Algorithmic Problem Solving', 'IT Fundamentals'],
    badgeUrl: '',
    description: 'Awarded 2nd Place among 60+ collegiate teams in a rigorous inter-college technology competition testing proficiency in database queries, data structures, and computer science innovations.'
  },
  {
    id: 'ach-ncc',
    title: 'Sergeant Rank & "B" Certificate in NCC',
    issuer: 'National Cadet Corps (NCC)',
    issueDate: '2025',
    credentialUrl: 'https://linkedin.com/in/sagarsingh2005',
    credentialId: 'NCC-SGT-CERT-B-2025',
    category: 'Defense, Leadership & Discipline',
    skills: ['Contingent Leadership', 'Crisis Discipline', 'Logistics Management', 'Team Operations', 'Command & Control'],
    badgeUrl: '',
    description: 'Promoted to Sergeant rank after demonstrating high-stakes team command, obstacle training resilience, drill execution, and national camp participation under NCC authority.'
  },
  {
    id: 'ach-pbi',
    title: 'Power BI & Business Intelligence Specialization',
    issuer: 'Microsoft Power BI & Industry Analytics Program',
    issueDate: '2025',
    credentialUrl: 'https://linkedin.com/in/sagarsingh2005',
    credentialId: 'PBI-DAX-SPEC-2025',
    category: 'Professional Certification',
    skills: ['Power BI Desktop', 'DAX Calculations', 'Power Query ETL', 'Data Modeling', 'Interactive Dashboards'],
    badgeUrl: '',
    description: 'Practical industry certification covering star schema dimensional modeling, dynamic DAX measures (YoY sales, margin %, cohort analysis), automated ETL workflows, and executive reporting.'
  },
  {
    id: 'ach-excel',
    title: 'Advanced Excel & Business Analytics Masterclass',
    issuer: 'Analytics & Business Intelligence Academy',
    issueDate: '2025',
    credentialUrl: 'https://linkedin.com/in/sagarsingh2005',
    credentialId: 'EXCEL-ADV-2025-BI',
    category: 'Professional Certification',
    skills: ['Advanced Excel', 'Pivot Tables & Slicers', 'XLOOKUP & INDEX/MATCH', 'Data Validation', 'Automated KPI Reports'],
    badgeUrl: '',
    description: 'Hands-on credential validating mastery of multi-criteria lookup formulas, dynamic array functions, financial modeling, pivot tables, and automated monthly management KPI templates.'
  }
];

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'proj-sales-bi',
    title: 'Sales Performance & Customer Analytics Dashboard (Flagship)',
    projectType: 'Major Project',
    category: 'Business Intelligence & Analytics',
    difficulty: 'Advanced',
    shortDescription: 'Executive-grade Power BI Sales Performance & Customer Analytics Dashboard analyzing $2.4M in transactional revenue across 50,000+ records with DAX KPI metrics, YoY trends, regional sales distribution, and customer cohort profitability.',
    thumbnailUrl: '/projects/sales-dashboard.png',
    githubUrl: 'https://github.com/Sagar99-cmyk',
    liveDemoUrl: 'https://github.com/Sagar99-cmyk',
    linkedinUrl: 'https://linkedin.com/in/sagarsingh2005',
    featured: true,
    dateCreated: '2026-03-01',
    technologies: ['Power BI', 'DAX', 'Power Query', 'Advanced Excel', 'MySQL', 'Python'],
    skills: ['Data Analytics', 'Star Schema', 'DAX Calculations', 'ETL Cleaning', 'Executive Dashboards'],
    caseStudy: {
      overview: 'End-to-end analytical pipeline designed for retail and e-commerce leadership to track revenue performance, gross margins, return rates, and customer acquisition costs across 4 geographical regions.',
      businessProblem: 'Leadership lacked a single unified reporting view; sales reports were scattered across multiple spreadsheets with currency conversion discrepancies and inconsistent customer deduplication.',
      datasetInfo: '50,000+ transactional records covering 3 financial years (2023-2025) across retail order IDs, product catalogs, customer demographic profiles, and store territories.',
      dataCleaningPrep: 'Standardized date formats, removed 420 duplicate orders, handled missing postal codes using MySQL window functions, and normalized foreign exchange rates via Power Query.',
      methodology: 'Constructed a dimensional Star Schema with 1 Fact table (Fact_Sales) and 4 Dimension tables (Dim_Customer, Dim_Product, Dim_Date, Dim_Region). Authored 25+ DAX calculated measures.',
      keyFindings: [
        '$2.42M total gross sales delivered with an overall profit margin of 23.4%.',
        'Top 15% of repeat enterprise clients generated 58% of cumulative net revenue.',
        'Southern region demonstrated the fastest YoY growth rate (+34.2%) fueled by consumer electronics.'
      ],
      recommendations: [
        'Shift marketing allocation toward high-retention regional channels identified in the cohort matrix.',
        'Implement automated inventory restocking triggers for top 5 turnover SKU categories.'
      ],
      limitations: 'Offline point-of-sale data synced on a 12-hour batch schedule rather than streaming webhooks.'
    }
  },
  {
    id: 'proj-1',
    title: 'PG Rental Management System (Final Year Project)',
    projectType: 'Major Project',
    category: 'Web Development & Cloud',
    difficulty: 'Advanced',
    shortDescription: 'Web-based PG Rental Management System with role-based access (Admin, Owner, Tenant) and real-time Supabase cloud database handling vacancy tracking, bed allocations, booking requests, and rent logs.',
    thumbnailUrl: '/projects/pg-rental.png',
    githubUrl: 'https://github.com/Sagar99-cmyk',
    liveDemoUrl: 'https://github.com/Sagar99-cmyk',
    linkedinUrl: 'https://linkedin.com/in/sagarsingh2005',
    featured: true,
    dateCreated: '2026-02-10',
    technologies: ['React', 'JavaScript', 'Supabase', 'PostgreSQL', 'HTML5', 'CSS3'],
    skills: ['Cloud Database', 'Role-Based Auth', 'State Management', 'Full-Stack Web'],
    caseStudy: {
      overview: 'College final-year capstone project addressing the operational chaos of student hostel and PG room bookings in collegiate hubs around Bengaluru.',
      businessProblem: 'Hostel owners managed bed assignments, utility maintenance, and cash receipts via manual registers, resulting in overbooked rooms and delayed payment records.',
      datasetInfo: 'Relational PostgreSQL database schema hosted on Supabase containing tables for properties, rooms, beds, tenants, payments, and maintenance grievances.',
      dataCleaningPrep: 'Implemented PostgreSQL constraints, unique keys for room numbers, and automated trigger functions for vacancy status updates.',
      methodology: 'Built three distinct role-based interfaces with instant cloud synchronization, payment status verification, and automated receipt generation.',
      keyFindings: [
        'Reduced room booking confirmation latency from 2 days to under 30 seconds.',
        'Provided PG managers with 100% real-time vacancy tracking across multiple floor wings.'
      ],
      recommendations: [
        'Incorporate integrated SMS/WhatsApp automated payment reminders for rent renewals.'
      ],
      limitations: 'Currently optimized for single-institution hostel clusters; multi-tenant enterprise billing is on the future roadmap.'
    }
  },
  {
    id: 'proj-2',
    title: 'DeepSeek AI Clone (API Integration)',
    projectType: 'Minor Project',
    category: 'Generative AI & APIs',
    difficulty: 'Intermediate',
    shortDescription: 'DeepSeek-inspired conversational AI with reasoning-based responses, modular API switching architecture, message search, and multi-format document export.',
    thumbnailUrl: '/projects/ai-reasoning.png',
    githubUrl: 'https://github.com/Sagar99-cmyk',
    liveDemoUrl: 'https://github.com/Sagar99-cmyk',
    linkedinUrl: 'https://linkedin.com/in/sagarsingh2005',
    featured: true,
    dateCreated: '2025-08-20',
    technologies: ['React', 'JavaScript', 'DeepSeek API', 'TailwindCSS'],
    skills: ['AI API Integration', 'Prompt Engineering', 'Streaming UI', 'Document Export'],
    caseStudy: {
      overview: 'Interactive web application integrating modern reasoning-focused language model APIs to provide step-by-step analytical reasoning and synthesis.',
      businessProblem: 'Standard chat interfaces frequently provide black-box outputs without showing the underlying reasoning trajectory.',
      datasetInfo: 'Prompt payloads, multi-turn conversational trees, and streaming token responses parsed on client-side state.',
      dataCleaningPrep: 'Sanitized markdown responses, parsed code blocks, and formatted LaTeX mathematics.',
      methodology: 'Modular architecture allowing hot-swapping between DeepSeek, Gemini, and local LLM endpoints with conversational export.',
      keyFindings: [
        'Step-by-step thinking traces significantly improved user confidence in complex SQL queries.',
        'Export module enabled seamless saving of generated case studies to PDF and Word format.'
      ],
      recommendations: ['Add semantic search across past chat threads using vector embeddings.'],
      limitations: 'Requires valid external API credentials for live cloud reasoning.'
    }
  },
  {
    id: 'proj-3',
    title: 'Weather Forecast App (API Integration)',
    projectType: 'Minor Project',
    category: 'Web Development',
    difficulty: 'Beginner',
    shortDescription: 'Responsive Weather Forecast Web Application using JavaScript with OpenWeather API integration for real-time weather retrieval across multiple cities.',
    thumbnailUrl: '/projects/weather-app.png',
    githubUrl: 'https://github.com/Sagar99-cmyk',
    liveDemoUrl: 'https://github.com/Sagar99-cmyk',
    linkedinUrl: 'https://linkedin.com/in/sagarsingh2005',
    featured: true,
    dateCreated: '2025-10-15',
    technologies: ['JavaScript', 'HTML5', 'CSS3', 'OpenWeather API'],
    skills: ['REST APIs', 'Async/Await', 'DOM Manipulation', 'Weather Metrics'],
    caseStudy: {
      overview: 'Practical weather intelligence portal delivering current atmospheric metrics, 5-day predictive forecasts, humidity gauges, and wind speed tracking.',
      businessProblem: 'Need for a clean, ad-free weather query dashboard with low payload weight and immediate city lookup.',
      datasetInfo: 'OpenWeather JSON payload streams containing temperature, atmospheric pressure, wind direction, and weather condition codes.',
      dataCleaningPrep: 'Converted kelvin temperatures to celsius/fahrenheit, parsed epoch timestamps into localized time strings.',
      methodology: 'Pure asynchronous JavaScript with dynamic DOM updates and responsive mobile-first CSS layout.',
      keyFindings: [
        'Instant sub-200ms lookup speed for over 200,000 global cities.',
        'Clean iconography matched dynamically to weather condition IDs.'
      ],
      recommendations: ['Add GPS geolocation detection on mobile devices.'],
      limitations: 'OpenWeather free tier rate limits to 60 calls per minute.'
    }
  },
  {
    id: 'proj-4',
    title: 'Data Analytics Portfolio Suite',
    projectType: 'Major Project',
    category: 'Full-Stack & Business Intelligence',
    difficulty: 'Advanced',
    shortDescription: 'Interactive 3D Data Analytics & Developer portfolio built with React 19, Three.js celestial solar system, MySQL relational database, Express API, and Sarvam AI multilingual voice bot.',
    thumbnailUrl: '/projects/portfolio-suite.png',
    githubUrl: 'https://github.com/Sagar99-cmyk',
    liveDemoUrl: 'https://github.com/Sagar99-cmyk',
    linkedinUrl: 'https://linkedin.com/in/sagarsingh2005',
    featured: true,
    dateCreated: '2026-04-01',
    technologies: ['React', 'MySQL', 'JavaScript', 'TailwindCSS'],
    skills: ['Portfolio Design', '3D Three.js', 'MySQL CMS', 'Full-Stack Architecture'],
    caseStudy: {
      overview: 'Modern high-performance developer portfolio showcasing analytics capstones, academic milestones, and an authenticated content management dashboard.',
      businessProblem: 'Standard static portfolios fail to demonstrate real-time database management, analytics acumen, or dynamic CRUD capabilities.',
      datasetInfo: 'Relational MySQL database managing portfolio metrics, skills, projects, achievements, and incoming employer inquiries.',
      dataCleaningPrep: 'Database schema normalization with PBKDF2 credential hashing, foreign keys, and automated seed fallbacks.',
      methodology: 'React 19 single-page application with Three.js WebGL visual effects, Express REST backend, and resilient offline fallbacks.',
      keyFindings: [
        'Instant zero-flash rendering with resilient built-in defaults.',
        'Integrated administrative CMS allowing live edits to skills, projects, and bio without redeploying code.'
      ],
      recommendations: ['Enable automatic PDF export of user-customized resumes.'],
      limitations: 'Requires WebGL-compatible hardware acceleration for 3D celestial animations.'
    }
  }
];

