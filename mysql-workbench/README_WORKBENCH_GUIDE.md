# 🐬 Sagar Singh Portfolio - MySQL Workbench Complete Setup & Connection Guide

This directory contains everything you need to connect, create, seed, query, and manage the full relational database for Sagar Singh's Data Analytics & Developer Portfolio.

---

## 📁 Included Files in this Folder

| File                                  | Purpose                                                                                                                                                           |
| :------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`01_create_schema.sql`**            | Complete DDL script: Creates `sagar_portfolio_db` and all 12 normalized relational tables with foreign keys and indexes.                                          |
| **`02_seed_portfolio_data.sql`**      | Full DML seed script: Inserts all actual resume data (Sales Dashboard, PG Rental system, BCA degree, Power BI & Python skills, NCC Sergeant rank, IT Quiz award). |
| **`03_analytics_and_views.sql`**      | Analytical SQL views, KPI reporting views, and stored procedures for recruiters and dashboards.                                                                   |
| **`04_sample_workbench_queries.sql`** | 10 ready-to-run queries for testing, searching, filtering, and inserting records directly in MySQL Workbench.                                                     |
| **`README_WORKBENCH_GUIDE.md`**       | This setup manual.                                                                                                                                                |

---

## 🚀 Step 1: Connect to MySQL Workbench

1. Launch **MySQL Workbench** on your computer.
2. In the **MySQL Connections** home screen, click the **`+`** (New Connection) button.
3. Configure the connection parameters:
   - **Connection Name**: `Sagar Portfolio Local`
   - **Hostname**: `127.0.0.1` (or `localhost`)
   - **Port**: `3306`
   - **Username**: `root`
   - **Password**: Click **Store in Vault...** and type your MySQL root password.
   - **Default Schema**: `sagar_portfolio_db` (optional)
4. Click **Test Connection**. You should see:
   > _"Successfully made the MySQL connection"_
5. Click **OK** to save and open the connection.

---

## ⚡ Step 2: Run the Scripts in MySQL Workbench (One-Click Setup)

Inside your MySQL Workbench query editor:

### 1. Create the Schema & Tables

- Go to `File` > `Open SQL Script...` (or press `Ctrl + O`).
- Choose **`mysql-workbench/01_create_schema.sql`**.
- Click the **⚡ Execute** button (or press `Ctrl + Shift + Enter`).
- _Result_: The `sagar_portfolio_db` database is created along with all 12 tables.

### 2. Seed All Portfolio Data

- Go to `File` > `Open SQL Script...`.
- Choose **`mysql-workbench/02_seed_portfolio_data.sql`**.
- Click **⚡ Execute** (`Ctrl + Shift + Enter`).
- _Result_: All projects, skills, education, achievements, and metrics are seeded.

### 3. Create Analytical Views & Procedures

- Go to `File` > `Open SQL Script...`.
- Choose **`mysql-workbench/03_analytics_and_views.sql`**.
- Click **⚡ Execute** (`Ctrl + Shift + Enter`).
- _Result_: Creates views `v_projects_catalog`, `v_skills_distribution`, `v_education_hierarchy_tree`, and stored procedures.

### 4. Run Sample Queries

- Open **`mysql-workbench/04_sample_workbench_queries.sql`**.
- Select any query block and press `Ctrl + Enter` to see live results!

---

## 📐 Step 3: View the Visual EER Schema Diagram

To view or print the visual entity-relationship diagram in MySQL Workbench:

1. In MySQL Workbench top menu, click **Database** > **Reverse Engineer...** (or `Ctrl + R`).
2. Select your connection and click **Next**.
3. Check **`sagar_portfolio_db`** and click **Next** > **Execute**.
4. Workbench will instantly draw the **EER Diagram** showing all tables, primary keys, and foreign-key arrows!

---

## 🔗 Step 4: Link Your Web Server to MySQL

In the root directory of this project, open your `.env` file and set your MySQL credentials:

```env
# MySQL Database Connection Settings
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_actual_mysql_password_here
MYSQL_DATABASE=sagar_portfolio_db
MYSQL_ENABLE=true
```

> **Smart Failover Feature**: If MySQL is stopped or password is not provided yet, the web server **automatically runs with the in-memory engine** so the website never crashes. Once you provide the password, it seamlessly reads and writes live data to MySQL!

---

## 📊 Database Schema Overview

```
sagar_portfolio_db
 ├── portfolio_profile       (Bio, headline, location, links, availability)
 ├── skills                  (Power BI, MySQL, Python, Excel, Tableau, 3D orbits)
 ├── projects                (Major, Minor, Micro projects, URLs, thumbnails)
 │    ├── project_technologies (Bridge table: React, DAX, Python, MySQL tags)
 │    └── project_case_studies (1-to-1: Business problem, dataset, findings)
 ├── education               (Presidency College BCA, Higher Secondary, Secondary)
 │    └── education_highlights (Degree achievements and coursework)
 ├── achievements            (IT Quiz 2nd Place, NCC Sergeant Certificate, GenAI)
 ├── contact_messages        (Visitor inquiries, replies, status)
 ├── newsletter_subscribers  (Email notification subscriptions)
 ├── site_analytics          (Resume downloads, visitor counters)
 └── admin_accounts          (Admin code '789257' & secure credentials)
```
