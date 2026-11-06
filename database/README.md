# 🐬 Sagar Singh Portfolio - MySQL Database Architecture & Integration Guide

Welcome to the official database architecture and migration documentation for **Sagar Singh's Data Analytics Portfolio & Admin Suite**.

This project utilizes **MySQL 8.0+** as the permanent, single source of truth for all portfolio data, replacing temporary in-memory arrays and client-side mocks with an enterprise-grade, relational schema.

---

## 📑 Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Folder Structure](#2-folder-structure)
3. [Relational Entity-Relationship Diagram (ERD)](#3-relational-entity-relationship-diagram-erd)
4. [Table Schema & Data Dictionary](#4-table-schema--data-dictionary)
5. [Automated Migration & Seeding System](#5-automated-migration--seeding-system)
6. [Connection Pooling & Environment Setup](#6-connection-pooling--environment-setup)
7. [Security & Cryptographic Authentication](#7-security--cryptographic-authentication)
8. [Backend REST API Reference](#8-backend-rest-api-reference)
9. [Backup, Restore & Maintenance Procedures](#9-backup-restore--maintenance-procedures)
10. [Cloud Deployment Best Practices](#10-cloud-deployment-best-practices)

---

## 1. Architecture Overview

- **Engine:** MySQL 8.0 InnoDB (ACID compliant, foreign keys with cascading updates/deletes).
- **Charset / Collation:** `utf8mb4` / `utf8mb4_unicode_ci` (Full emoji and international character support).
- **Communication Layer:** Node.js Express server using `mysql2/promise` with high-throughput connection pooling.
- **Data Normalization:** 3NF normalized relational schema with Many-to-Many junction tables (`project_technologies`) and 1-to-Many sub-collections (`education_highlights`, `project_case_studies`).
- **Security:** Zero plaintext passwords. Salted PBKDF2 password hashing with 100,000 iterations and HMAC-SHA256 signed stateless authorization tokens.

---

## 2. Folder Structure

```
database/
├── README.md                               # Complete database architectural & migration manual
├── schema/
│   └── schema.sql                          # Master idempotent schema definition (DDL)
├── migrations/
│   ├── 001_create_initial_schema.sql       # Profile, skills, education, achievements, messages, users
│   ├── 002_create_projects_and_technologies.sql # Normalized projects, technologies, and junction tables
│   └── 003_create_indexes_and_views.sql    # Performance indexes, composite foreign keys, analytical views
└── seeds/
    └── 001_seed_portfolio_data.sql         # Production seed records (Sagar Singh profile, 5 flagship projects, 18 technologies)
```

---

## 3. Relational Entity-Relationship Diagram (ERD)

```mermaid
erDiagram
    PORTFOLIO_PROFILE ||--o{ PROJECTS : showcases
    PORTFOLIO_PROFILE ||--o{ SKILLS : features
    PORTFOLIO_PROFILE ||--o{ EDUCATION : possesses
    PORTFOLIO_PROFILE ||--o{ ACHIEVEMENTS : earns
    
    PROJECTS ||--|{ PROJECT_TECHNOLOGIES : utilizes
    TECHNOLOGIES ||--|{ PROJECT_TECHNOLOGIES : tagged_in
    PROJECTS ||--o| PROJECT_CASE_STUDIES : details
    
    EDUCATION ||--o{ EDUCATION_HIGHLIGHTS : contains
    ACHIEVEMENTS ||--o{ CERTIFICATIONS : verifies
    
    ADMIN_USERS ||--o{ SITE_ANALYTICS : monitors
    CONTACT_MESSAGES }o--|| PORTFOLIO_PROFILE : receives
    NEWSLETTER_SUBSCRIBERS }o--|| PORTFOLIO_PROFILE : subscribes

    PORTFOLIO_PROFILE {
        int id PK
        varchar full_name
        varchar title
        varchar hero_tagline
        varchar email
        varchar phone
        varchar location
        varchar primary_avatar_url
        varchar resume_url
        datetime updated_at
    }

    PROJECTS {
        varchar id PK
        varchar title
        varchar subtitle
        text description
        varchar category
        varchar image_url
        varchar live_url
        varchar github_url
        boolean featured
        int sort_order
        datetime created_at
    }

    TECHNOLOGIES {
        int id PK
        varchar name UK
        varchar slug UK
        varchar category
        varchar proficiency
    }

    PROJECT_TECHNOLOGIES {
        varchar project_id PK,FK
        int technology_id PK,FK
        int sort_order
    }

    PROJECT_CASE_STUDIES {
        int id PK
        varchar project_id FK,UK
        text business_problem
        text dataset_description
        text data_cleaning_steps
        text modeling_approach
        json dax_or_sql_code
        text key_takeaways
    }

    SKILLS {
        varchar id PK
        varchar name
        varchar category
        int proficiency
        varchar color
        varchar icon_slug
        int sort_order
    }

    EDUCATION {
        varchar id PK
        varchar degree
        varchar institution
        varchar period
        varchar grade_or_percentage
        varchar degree_level
        int sort_order
    }

    EDUCATION_HIGHLIGHTS {
        int id PK
        varchar education_id FK
        varchar highlight_text
        int sort_order
    }

    ACHIEVEMENTS {
        varchar id PK
        varchar title
        varchar issuer
        varchar year
        varchar category
        varchar badge_color
    }

    CONTACT_MESSAGES {
        varchar id PK
        varchar sender_name
        varchar sender_email
        varchar subject
        text message
        boolean is_read
        text admin_reply
        datetime created_at
    }

    ADMIN_USERS {
        int id PK
        varchar email UK
        varchar username UK
        varchar password_hash
        varchar password_salt
        varchar role
        datetime last_login_at
    }
```

---

## 4. Table Schema & Data Dictionary

| Table Name | Purpose | Primary Key | Key Relationships |
| :--- | :--- | :--- | :--- |
| `schema_migrations` | Tracks applied migration versions | `id` (INT AUTO_INCREMENT) | Standalone tracker |
| `portfolio_profile` | Core professional identity, bio, contact details, resume links | `id` (INT) | 1 row singleton pattern |
| `technologies` | Master catalog of analytical & technical tools (Power BI, Python, DAX, etc.) | `id` (INT AUTO_INCREMENT) | Junction with `projects` |
| `projects` | Data analytics case studies and interactive dashboards | `id` (VARCHAR(64)) | Parent to junction & case studies |
| `project_technologies` | **Many-to-Many junction table** connecting projects to technologies | `(project_id, technology_id)` | FKs to `projects.id` & `technologies.id` |
| `project_case_studies` | Extended technical deep dives: problem statements, DAX/SQL snippets | `id` (INT AUTO_INCREMENT) | 1-to-1 FK to `projects.id` |
| `skills` | Orbiting planets and analytical skills matrix | `id` (VARCHAR(64)) | Displayed in 3D Galaxy view |
| `education` | Academic hierarchy (BCA, NEB +2, Class 10) | `id` (VARCHAR(64)) | Parent to `education_highlights` |
| `education_highlights` | Sub-bullets for academic achievements | `id` (INT AUTO_INCREMENT) | FK to `education.id` |
| `achievements` | Honors, IT quiz wins, NCC Sergeant certifications | `id` (VARCHAR(64)) | Standalone catalog |
| `certifications` | Verified credentials (Microsoft GenAI, Internshala, Accenture) | `id` (VARCHAR(64)) | Standalone catalog |
| `contact_messages` | Inquiries submitted through portfolio contact modal | `id` (VARCHAR(64)) | Stores responses & read states |
| `newsletter_subscribers`| Email subscribers tracking | `id` (VARCHAR(64)) | Unique email constraint |
| `admin_users` | Protected administrator login accounts | `id` (INT AUTO_INCREMENT) | Salted PBKDF2 authentication |
| `site_analytics` | Resume download counters and daily traffic metrics | `id` (INT AUTO_INCREMENT) | Time-series metrics |

---

## 5. Automated Migration & Seeding System

Migrations run automatically during backend startup, or can be run manually using dedicated NPM scripts:

### Available Commands

```bash
# 1. Inspect live database tables, health status, and record counts
npm run db:status

# 2. Run all pending schema migrations idempotently
npm run db:migrate

# 3. Seed initial production records (projects, skills, profile, admin credentials)
npm run db:seed
```

### How Migrations Work
- The migration runner checks `schema_migrations` in MySQL.
- Any unapplied script in `database/migrations/` is executed in alphabetical order inside transaction blocks.
- On success, the file name and SHA-256 hash are recorded with timestamps.
- Semicolons inside string literals (e.g. SQL/DAX code snippets) are parsed with a specialized quote-aware tokenizer to prevent syntax corruption.

---

## 6. Connection Pooling & Environment Setup

Configure your environment variables in `.env` (kept strictly out of version control):

```env
# Server Port & Base URL
PORT=3000
APP_URL=http://localhost:3000

# MySQL Relational Database Configuration
MYSQL_ENABLED=true
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=sagar123
MYSQL_DATABASE=sagar_portfolio_db

# Admin JWT Secret for Cryptographic Bearer Tokens
JWT_SECRET=sagar_portfolio_super_secure_jwt_secret_key_2026
```

### Connection Pool Configuration (`src/database/connection.ts`)
- **Connection Limit:** 10 concurrent pooled connections.
- **Keep-Alive:** Active TCP keep-alive probe sent every 10,000ms.
- **Connection Timeout:** 5,000ms fail-fast timeout with clean error propagation.
- **Prepared Statements:** 100% of queries use `?` parameterization to eliminate SQL injection risks.

---

## 7. Security & Cryptographic Authentication

1. **Password Storage:** Uses Node.js native `crypto.pbkdf2Sync` with SHA-512, 100,000 iterations, and a 16-byte cryptographically random salt per user.
2. **Authorization Tokens:** Stateless HMAC-SHA256 tokens (`crypto.createHmac`) with a 24-hour expiration window.
3. **Protected Endpoints:** Every mutating REST route (`POST`, `PUT`, `DELETE`) is guarded by the `requireAdminAuth` Express middleware.
4. **Default Administrator Account:**
   - **Email:** `sirroshan999@gmail.com`
   - **Default Passcode:** `789257`
   - Initialized automatically via seed with secure PBKDF2 hash.

---

## 8. Backend REST API Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/profile` | Retrieve verified public portfolio profile | No |
| `PUT` | `/api/profile` | Update profile information, title, avatar, links | **Yes** |
| `GET` | `/api/projects` | List all projects with joined technologies array | No |
| `GET` | `/api/projects/:id` | Get single project with deep case study | No |
| `POST` | `/api/projects` | Insert new project, auto-syncing technologies | **Yes** |
| `PUT` | `/api/projects/:id` | Update project and associated tech junction records | **Yes** |
| `DELETE` | `/api/projects/:id` | Delete project (cascades to junction & case studies)| **Yes** |
| `GET` | `/api/technologies`| List master technology catalog | No |
| `POST` | `/api/technologies`| Add new technology to master table | **Yes** |
| `GET` | `/api/skills` | List all orbiting skills and proficiency levels | No |
| `POST` | `/api/skills` | Create new skill entry | **Yes** |
| `PUT` | `/api/skills/:id` | Update skill parameters | **Yes** |
| `DELETE` | `/api/skills/:id` | Remove skill entry | **Yes** |
| `GET` | `/api/education` | Get education hierarchy with highlights | No |
| `GET` | `/api/achievements`| Get honors, quiz awards, certifications | No |
| `POST` | `/api/messages` | Submit contact form inquiry | No |
| `GET` | `/api/messages` | List received contact inquiries | **Yes** |
| `PUT` | `/api/messages/:id/read` | Mark message as read | **Yes** |
| `POST` | `/api/messages/:id/reply` | Save administrative reply | **Yes** |
| `POST` | `/api/admin/login` | Authenticate with email & password | No |
| `GET` | `/api/admin/verify` | Verify active Bearer token | **Yes** |
| `GET` | `/api/database/status` | Real-time connection and table row count telemetry | No |

---

## 9. Backup, Restore & Maintenance Procedures

### Taking a Database Backup (mysqldump)

```bash
# Export full database schema and data to a timestamped SQL file
mysqldump -u root -p sagar_portfolio_db > backup_sagar_portfolio_$(date +%Y%m%d).sql
```

### Restoring from Backup

```bash
# Create database if missing
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS sagar_portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Restore dump
mysql -u root -p sagar_portfolio_db < backup_sagar_portfolio_20261104.sql
```

---

## 10. Cloud Deployment Best Practices

When deploying to production hosting platforms:

1. **AWS RDS / Google Cloud SQL:**
   - Configure private VPC or whitelist production application IPs.
   - Set `MYSQL_SSL=true` in `.env` to enforce TLS in transit.
2. **PlanetScale / Railway / Neon:**
   - Set the connection string using `MYSQL_URL=mysql://user:pass@host:port/dbname?ssl={"rejectUnauthorized":true}`.
3. **Database Migration Pipeline:**
   - Add `npm run db:migrate` to the build or container entrypoint before starting Express (`server.ts`).
4. **Environment Protection:**
   - Ensure `JWT_SECRET` is set to a 64+ character random secret in production.
   - Do NOT commit `.env` or database credentials to GitHub or public version control.

