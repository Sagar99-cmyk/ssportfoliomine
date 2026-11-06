import mysql from 'mysql2/promise';
import type {
  Profile,
  Skill,
  Project,
  Education,
  Achievement,
  ContactMessage,
} from './types';

export interface MySQLConfig {
  host: string;
  port: number;
  user: string;
  password?: string;
  database: string;
  enabled: boolean;
}

export interface MySQLStatusResponse {
  connected: boolean;
  enabled: boolean;
  host: string;
  port: number;
  database: string;
  user: string;
  version?: string;
  tableCounts: {
    portfolio_profile: number;
    skills: number;
    projects: number;
    education: number;
    achievements: number;
    contact_messages: number;
    newsletter_subscribers: number;
  };
  lastChecked: string;
  message: string;
  error?: string;
}

class MySQLManager {
  private pool: mysql.Pool | null = null;
  private isConnected: boolean = false;
  private lastError: string | null = null;
  private serverVersion: string = '';

  public getConfig(): MySQLConfig {
    return {
      host: process.env.MYSQL_HOST || 'localhost',
      port: Number(process.env.MYSQL_PORT) || 3306,
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD ?? '',
      database: process.env.MYSQL_DATABASE || 'sagar_portfolio_db',
      enabled: process.env.MYSQL_ENABLED !== 'false' && process.env.MYSQL_ENABLE !== 'false',
    };
  }

  private createPool(config: MySQLConfig): mysql.Pool {
    return mysql.createPool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 4000,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
    });
  }

  /**
   * Initialize or test connection to MySQL.
   * If database does not exist, attempts to create it first using a root connection.
   */
  public async initialize(): Promise<boolean> {
    const config = this.getConfig();

    if (!config.enabled) {
      console.log('ℹ️  MySQL integration is disabled (MYSQL_ENABLED=false). Using in-memory store.');
      this.isConnected = false;
      this.lastError = 'MySQL disabled in configuration';
      return false;
    }

    try {
      // Step 1: Attempt direct connection to database
      this.pool = this.createPool(config);
      const conn = await this.pool.getConnection();

      const [versionResult]: any = await conn.query('SELECT VERSION() AS ver');
      this.serverVersion = versionResult?.[0]?.ver || 'MySQL 8.x';
      conn.release();

      this.isConnected = true;
      this.lastError = null;
      console.log(`✅ [MySQL] Successfully connected to '${config.database}' on ${config.host}:${config.port} (${this.serverVersion})`);

      // Ensure all tables exist
      await this.ensureTablesExist();

      return true;
    } catch (err: any) {
      this.isConnected = false;
      this.lastError = err.message || String(err);

      // If error is ER_BAD_DB_ERROR, attempt to create database automatically
      if (err.code === 'ER_BAD_DB_ERROR') {
        try {
          console.log(`⚠️ [MySQL] Database '${config.database}' does not exist. Attempting creation...`);
          const adminPool = mysql.createPool({
            host: config.host,
            port: config.port,
            user: config.user,
            password: config.password,
            connectTimeout: 4000,
          });
          const adminConn = await adminPool.getConnection();
          await adminConn.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
          adminConn.release();
          await adminPool.end();

          console.log(`✅ [MySQL] Created database '${config.database}'. Re-establishing pool...`);
          this.pool = this.createPool(config);
          this.isConnected = true;
          this.lastError = null;
          await this.ensureTablesExist();
          return true;
        } catch (dbCreateErr: any) {
          this.lastError = `Failed creating database: ${dbCreateErr.message}`;
          console.warn(`⚠️ [MySQL] Auto-create database failed: ${dbCreateErr.message}`);
        }
      }

      console.warn(`⚠️ [MySQL] Connection could not be established (${this.lastError}).`);
      console.warn(`👉 The portfolio is continuing seamlessly in high-performance IN-MEMORY MODE.`);
      return false;
    }
  }

  /**
   * Verify and create essential tables if they do not exist yet.
   */
  public async ensureTablesExist(): Promise<void> {
    if (!this.isConnected || !this.pool) return;

    try {
      // 1. portfolio_profile
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS \`portfolio_profile\` (
          \`id\` VARCHAR(50) NOT NULL PRIMARY KEY DEFAULT 'profile-main',
          \`full_name\` VARCHAR(100) NOT NULL,
          \`first_name\` VARCHAR(50) NOT NULL,
          \`last_name\` VARCHAR(50) NOT NULL,
          \`headline\` VARCHAR(255) NOT NULL,
          \`intro\` TEXT,
          \`bio\` TEXT,
          \`location\` VARCHAR(150),
          \`email\` VARCHAR(150) NOT NULL,
          \`phone\` VARCHAR(50),
          \`avatar_url\` VARCHAR(255),
          \`resume_url\` VARCHAR(255),
          \`github_url\` VARCHAR(255),
          \`linkedin_url\` VARCHAR(255),
          \`kaggle_url\` VARCHAR(255),
          \`is_available\` BOOLEAN DEFAULT TRUE,
          \`availability_status\` VARCHAR(100) DEFAULT 'Available for Data Analyst & Entry-Level Tech Roles',
          \`years_experience\` VARCHAR(20) DEFAULT 'Fresher',
          \`dashboards_delivered\` INT DEFAULT 6,
          \`rows_processed\` VARCHAR(50) DEFAULT '150K+',
          \`forecast_accuracy\` VARCHAR(20) DEFAULT '98.5%',
          \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      // 2. skills
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS \`skills\` (
          \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
          \`name\` VARCHAR(100) NOT NULL,
          \`category\` VARCHAR(50) NOT NULL,
          \`proficiency_level\` VARCHAR(30) NOT NULL DEFAULT 'Intermediate',
          \`description\` TEXT,
          \`tools_used\` JSON DEFAULT NULL,
          \`projects_count\` INT DEFAULT 0,
          \`featured\` BOOLEAN DEFAULT TRUE,
          \`display_order\` INT DEFAULT 0,
          \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      // 3. projects
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS \`projects\` (
          \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
          \`title\` VARCHAR(200) NOT NULL,
          \`project_type\` VARCHAR(50) NOT NULL DEFAULT 'Major Project',
          \`category\` VARCHAR(100) NOT NULL,
          \`difficulty\` VARCHAR(30) NOT NULL DEFAULT 'Intermediate',
          \`short_description\` TEXT NOT NULL,
          \`thumbnail_url\` VARCHAR(255) DEFAULT NULL,
          \`github_url\` VARCHAR(255) DEFAULT NULL,
          \`live_demo_url\` VARCHAR(255) DEFAULT NULL,
          \`linkedin_url\` VARCHAR(255) DEFAULT NULL,
          \`featured\` BOOLEAN DEFAULT TRUE,
          \`technologies\` JSON DEFAULT NULL,
          \`date_created\` DATE DEFAULT NULL,
          \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      // 4. project_case_studies
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS \`project_case_studies\` (
          \`project_id\` VARCHAR(50) NOT NULL PRIMARY KEY,
          \`overview\` TEXT,
          \`business_problem\` TEXT,
          \`dataset_info\` TEXT,
          \`data_cleaning_prep\` TEXT,
          \`methodology\` TEXT,
          \`code_snippets\` JSON DEFAULT NULL,
          \`key_findings\` JSON DEFAULT NULL,
          \`recommendations\` JSON DEFAULT NULL,
          \`limitations\` TEXT,
          \`dashboard_features\` JSON DEFAULT NULL,
          \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          CONSTRAINT \`fk_case_study_project\` FOREIGN KEY (\`project_id\`)
            REFERENCES \`projects\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      // 5. education
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS \`education\` (
          \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
          \`degree\` VARCHAR(150) NOT NULL,
          \`institution\` VARCHAR(150) NOT NULL,
          \`location\` VARCHAR(100),
          \`period\` VARCHAR(50) NOT NULL,
          \`grade_gpa\` VARCHAR(50),
          \`description\` TEXT,
          \`highlights\` JSON DEFAULT NULL,
          \`hierarchy_level\` INT DEFAULT 1,
          \`display_order\` INT DEFAULT 0,
          \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      // 6. achievements
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS \`achievements\` (
          \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
          \`title\` VARCHAR(200) NOT NULL,
          \`issuer\` VARCHAR(150) NOT NULL,
          \`issue_date\` VARCHAR(50) NOT NULL,
          \`credential_url\` VARCHAR(255) DEFAULT NULL,
          \`credential_id\` VARCHAR(100) DEFAULT NULL,
          \`badge_url\` VARCHAR(255) DEFAULT NULL,
          \`skills\` JSON DEFAULT NULL,
          \`display_order\` INT DEFAULT 0,
          \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      // 7. contact_messages
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS \`contact_messages\` (
          \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
          \`name\` VARCHAR(100) NOT NULL,
          \`email\` VARCHAR(150) NOT NULL,
          \`subject\` VARCHAR(200) NOT NULL,
          \`company\` VARCHAR(150) DEFAULT NULL,
          \`message\` TEXT NOT NULL,
          \`is_read\` BOOLEAN DEFAULT FALSE,
          \`replied\` BOOLEAN DEFAULT FALSE,
          \`reply_text\` TEXT DEFAULT NULL,
          \`replied_at\` DATETIME DEFAULT NULL,
          \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      // 8. newsletter_subscribers
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS \`newsletter_subscribers\` (
          \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
          \`email\` VARCHAR(150) NOT NULL UNIQUE,
          \`date\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          \`is_active\` BOOLEAN DEFAULT TRUE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      // 9. site_analytics
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS \`site_analytics\` (
          \`metric_key\` VARCHAR(50) NOT NULL PRIMARY KEY,
          \`metric_name\` VARCHAR(100) NOT NULL,
          \`metric_value\` BIGINT NOT NULL DEFAULT 0,
          \`last_updated\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      console.log('✅ [MySQL] Verified relational table structures.');
    } catch (err: any) {
      console.warn('⚠️ [MySQL] Warning during ensureTablesExist:', err.message);
    }
  }

  /**
   * Diagnostic health check and table record counts.
   */
  public async getStatus(): Promise<MySQLStatusResponse> {
    const config = this.getConfig();

    const counts = {
      portfolio_profile: 0,
      skills: 0,
      projects: 0,
      education: 0,
      achievements: 0,
      contact_messages: 0,
      newsletter_subscribers: 0,
    };

    if (!this.isConnected || !this.pool) {
      return {
        connected: false,
        enabled: config.enabled,
        host: config.host,
        port: config.port,
        database: config.database,
        user: config.user,
        tableCounts: counts,
        lastChecked: new Date().toISOString(),
        message: this.lastError
          ? `MySQL Offline: ${this.lastError}`
          : 'MySQL disconnected or credentials pending in .env',
        error: this.lastError || 'Disconnected',
      };
    }

    try {
      const getCount = async (tableName: string): Promise<number> => {
        try {
          const [res]: any = await this.pool!.query(`SELECT COUNT(*) AS total FROM \`${tableName}\``);
          return Number(res?.[0]?.total || 0);
        } catch {
          return 0;
        }
      };

      counts.portfolio_profile = await getCount('portfolio_profile');
      counts.skills = await getCount('skills');
      counts.projects = await getCount('projects');
      counts.education = await getCount('education');
      counts.achievements = await getCount('achievements');
      counts.contact_messages = await getCount('contact_messages');
      counts.newsletter_subscribers = await getCount('newsletter_subscribers');

      return {
        connected: true,
        enabled: true,
        host: config.host,
        port: config.port,
        database: config.database,
        user: config.user,
        version: this.serverVersion,
        tableCounts: counts,
        lastChecked: new Date().toISOString(),
        message: `Connected to MySQL database '${config.database}' (${this.serverVersion})`,
      };
    } catch (err: any) {
      return {
        connected: false,
        enabled: true,
        host: config.host,
        port: config.port,
        database: config.database,
        user: config.user,
        tableCounts: counts,
        lastChecked: new Date().toISOString(),
        message: `Query failed: ${err.message}`,
        error: err.message,
      };
    }
  }

  /**
   * Test user-supplied credentials dynamically without restarting.
   */
  public async testCustomCredentials(custom: Partial<MySQLConfig>): Promise<{ success: boolean; message: string; version?: string }> {
    const current = this.getConfig();
    const config: MySQLConfig = {
      host: custom.host || current.host,
      port: Number(custom.port) || current.port,
      user: custom.user || current.user,
      password: custom.password !== undefined ? custom.password : current.password,
      database: custom.database || current.database,
      enabled: true,
    };

    let testPool: mysql.Pool | null = null;
    try {
      testPool = this.createPool(config);
      const conn = await testPool.getConnection();
      const [verRes]: any = await conn.query('SELECT VERSION() AS ver');
      conn.release();
      await testPool.end();

      return {
        success: true,
        message: `Successfully connected to MySQL at ${config.host}:${config.port} / ${config.database}`,
        version: verRes?.[0]?.ver || 'MySQL 8.x',
      };
    } catch (err: any) {
      if (testPool) {
        try { await testPool.end(); } catch { /* ignore */ }
      }
      return {
        success: false,
        message: err.message || 'Connection failed',
      };
    }
  }

  /**
   * Sync complete portfolio state from server memory into MySQL tables.
   */
  public async syncAllToMySQL(data: {
    profile: Profile;
    skills: Skill[];
    projects: Project[];
    education: Education[];
    achievements: Achievement[];
    messages: ContactMessage[];
    subscribers: { id: string; email: string; date: string }[];
  }): Promise<{ success: boolean; rowsSynced: number; message: string }> {
    if (!this.isConnected || !this.pool) {
      return { success: false, rowsSynced: 0, message: 'MySQL is not connected.' };
    }

    let rowsSynced = 0;
    const conn = await this.pool.getConnection();

    try {
      await conn.beginTransaction();

      // 1. Sync Profile
      const p = data.profile;
      const [nameFirst, ...rest] = (p.name || 'Sagar Singh').split(' ');
      const nameLast = rest.join(' ') || 'Singh';

      await conn.query(`
        INSERT INTO \`portfolio_profile\` (
          id, full_name, first_name, last_name, headline, intro, bio,
          location, email, phone, avatar_url, resume_url, github_url, linkedin_url, kaggle_url,
          is_available, availability_status, years_experience, dashboards_delivered, rows_processed, forecast_accuracy
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          full_name = VALUES(full_name),
          first_name = VALUES(first_name),
          last_name = VALUES(last_name),
          headline = VALUES(headline),
          intro = VALUES(intro),
          bio = VALUES(bio),
          location = VALUES(location),
          email = VALUES(email),
          phone = VALUES(phone),
          avatar_url = VALUES(avatar_url),
          resume_url = VALUES(resume_url),
          github_url = VALUES(github_url),
          linkedin_url = VALUES(linkedin_url),
          kaggle_url = VALUES(kaggle_url),
          is_available = VALUES(is_available),
          availability_status = VALUES(availability_status),
          years_experience = VALUES(years_experience),
          dashboards_delivered = VALUES(dashboards_delivered),
          rows_processed = VALUES(rows_processed),
          forecast_accuracy = VALUES(forecast_accuracy)
      `, [
        p.id || 'profile-main',
        p.name,
        nameFirst,
        nameLast,
        p.designation,
        p.intro,
        p.aboutBio,
        p.location,
        p.email,
        p.phone,
        p.avatarUrl,
        p.resumeUrl,
        p.githubUrl,
        p.linkedinUrl,
        p.kaggleUrl || '',
        p.isAvailable ? 1 : 0,
        p.availabilityStatus,
        String(p.stats?.yearsExperience ?? '1'),
        p.stats?.dashboardsDelivered ?? 6,
        p.stats?.rowsProcessed ?? '150K+',
        p.stats?.forecastAccuracy ?? '98.5%',
      ]);
      rowsSynced += 1;

      // 2. Sync Skills
      for (let i = 0; i < data.skills.length; i++) {
        const s = data.skills[i];
        await conn.query(`
          INSERT INTO \`skills\` (id, name, category, proficiency_level, description, tools_used, projects_count, featured, display_order)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            category = VALUES(category),
            proficiency_level = VALUES(proficiency_level),
            description = VALUES(description),
            tools_used = VALUES(tools_used),
            projects_count = VALUES(projects_count),
            featured = VALUES(featured),
            display_order = VALUES(display_order)
        `, [
          s.id,
          s.name,
          s.category,
          s.proficiencyLevel,
          s.description,
          JSON.stringify(s.toolsUsed || []),
          s.projectsCount || 0,
          s.featured ? 1 : 0,
          i + 1,
        ]);
        rowsSynced += 1;
      }

      // 3. Sync Projects & Case Studies
      for (let i = 0; i < data.projects.length; i++) {
        const proj = data.projects[i];
        await conn.query(`
          INSERT INTO \`projects\` (id, title, project_type, category, difficulty, short_description, thumbnail_url, github_url, live_demo_url, linkedin_url, featured, technologies, date_created)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            project_type = VALUES(project_type),
            category = VALUES(category),
            difficulty = VALUES(difficulty),
            short_description = VALUES(short_description),
            thumbnail_url = VALUES(thumbnail_url),
            github_url = VALUES(github_url),
            live_demo_url = VALUES(live_demo_url),
            linkedin_url = VALUES(linkedin_url),
            featured = VALUES(featured),
            technologies = VALUES(technologies),
            date_created = VALUES(date_created)
        `, [
          proj.id,
          proj.title,
          proj.projectType || 'Major Project',
          proj.category,
          proj.difficulty,
          proj.shortDescription,
          proj.thumbnailUrl || null,
          proj.githubUrl || null,
          proj.liveDemoUrl || null,
          proj.linkedinUrl || null,
          proj.featured ? 1 : 0,
          JSON.stringify(proj.technologies || []),
          proj.dateCreated || new Date().toISOString().split('T')[0],
        ]);
        rowsSynced += 1;

        if (proj.caseStudy) {
          const cs = proj.caseStudy;
          await conn.query(`
            INSERT INTO \`project_case_studies\` (
              project_id, overview, business_problem, dataset_info, data_cleaning_prep,
              methodology, code_snippets, key_findings, recommendations, limitations, dashboard_features
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
              overview = VALUES(overview),
              business_problem = VALUES(business_problem),
              dataset_info = VALUES(dataset_info),
              data_cleaning_prep = VALUES(data_cleaning_prep),
              methodology = VALUES(methodology),
              code_snippets = VALUES(code_snippets),
              key_findings = VALUES(key_findings),
              recommendations = VALUES(recommendations),
              limitations = VALUES(limitations),
              dashboard_features = VALUES(dashboard_features)
          `, [
            proj.id,
            cs.overview || null,
            cs.businessProblem || null,
            cs.datasetInfo || null,
            cs.dataCleaningPrep || null,
            cs.methodology || null,
            cs.codeSnippets ? JSON.stringify(cs.codeSnippets) : null,
            cs.keyFindings ? JSON.stringify(cs.keyFindings) : null,
            cs.recommendations ? JSON.stringify(cs.recommendations) : null,
            cs.limitations || null,
            cs.dashboardFeatures ? JSON.stringify(cs.dashboardFeatures) : null,
          ]);
          rowsSynced += 1;
        }
      }

      // 4. Sync Education
      for (let i = 0; i < data.education.length; i++) {
        const edu = data.education[i];
        await conn.query(`
          INSERT INTO \`education\` (id, degree, institution, location, period, grade_gpa, description, highlights, hierarchy_level, display_order)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            degree = VALUES(degree),
            institution = VALUES(institution),
            location = VALUES(location),
            period = VALUES(period),
            grade_gpa = VALUES(grade_gpa),
            description = VALUES(description),
            highlights = VALUES(highlights),
            hierarchy_level = VALUES(hierarchy_level),
            display_order = VALUES(display_order)
        `, [
          edu.id,
          edu.degree,
          edu.institution,
          edu.location,
          edu.period,
          edu.gradeGpa || '',
          edu.description || '',
          JSON.stringify(edu.highlights || []),
          i + 1,
          i + 1,
        ]);
        rowsSynced += 1;
      }

      // 5. Sync Achievements
      for (let i = 0; i < data.achievements.length; i++) {
        const ach = data.achievements[i];
        await conn.query(`
          INSERT INTO \`achievements\` (id, title, issuer, issue_date, credential_url, credential_id, badge_url, skills, display_order)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            issuer = VALUES(issuer),
            issue_date = VALUES(issue_date),
            credential_url = VALUES(credential_url),
            credential_id = VALUES(credential_id),
            badge_url = VALUES(badge_url),
            skills = VALUES(skills),
            display_order = VALUES(display_order)
        `, [
          ach.id,
          ach.title,
          ach.issuer,
          ach.issueDate,
          ach.credentialUrl || null,
          ach.credentialId || null,
          ach.badgeUrl || null,
          JSON.stringify(ach.skills || []),
          i + 1,
        ]);
        rowsSynced += 1;
      }

      // 6. Sync Messages
      for (const msg of data.messages) {
        await conn.query(`
          INSERT INTO \`contact_messages\` (id, name, email, subject, company, message, is_read, replied, reply_text, replied_at, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            email = VALUES(email),
            subject = VALUES(subject),
            company = VALUES(company),
            message = VALUES(message),
            is_read = VALUES(is_read),
            replied = VALUES(replied),
            reply_text = VALUES(reply_text),
            replied_at = VALUES(replied_at)
        `, [
          msg.id,
          msg.name,
          msg.email,
          msg.subject,
          msg.company || null,
          msg.message,
          msg.read ? 1 : 0,
          (msg as any).replied ? 1 : 0,
          (msg as any).replyText || null,
          (msg as any).repliedAt ? new Date((msg as any).repliedAt) : null,
          msg.createdAt ? new Date(msg.createdAt) : new Date(),
        ]);
        rowsSynced += 1;
      }

      // 7. Sync Subscribers
      for (const sub of data.subscribers) {
        await conn.query(`
          INSERT INTO \`newsletter_subscribers\` (id, email, is_active)
          VALUES (?, ?, 1)
          ON DUPLICATE KEY UPDATE
            email = VALUES(email)
        `, [sub.id, sub.email]);
        rowsSynced += 1;
      }

      await conn.commit();
      return {
        success: true,
        rowsSynced,
        message: `Successfully synchronized ${rowsSynced} records into MySQL database.`,
      };
    } catch (err: any) {
      await conn.rollback();
      return {
        success: false,
        rowsSynced: 0,
        message: `Sync failed: ${err.message}`,
      };
    } finally {
      conn.release();
    }
  }

  /**
   * Load data from MySQL if populated.
   */
  public async loadAllFromMySQL(): Promise<{
    profile?: Profile;
    skills?: Skill[];
    projects?: Project[];
    education?: Education[];
    achievements?: Achievement[];
    messages?: ContactMessage[];
    subscribers?: { id: string; email: string; date: string }[];
  } | null> {
    if (!this.isConnected || !this.pool) return null;

    try {
      // 1. Profile
      const [profiles]: any = await this.pool.query('SELECT * FROM `portfolio_profile` LIMIT 1');
      let loadedProfile: Profile | undefined = undefined;
      if (profiles && profiles.length > 0) {
        const row = profiles[0];
        loadedProfile = {
          id: row.id,
          name: row.full_name,
          designation: row.headline,
          tagline: row.intro,
          intro: row.intro,
          aboutBio: row.bio,
          avatarUrl: row.avatar_url,
          resumeUrl: row.resume_url,
          location: row.location,
          email: row.email,
          phone: row.phone,
          linkedinUrl: row.linkedin_url,
          githubUrl: row.github_url,
          kaggleUrl: row.kaggle_url || '',
          availabilityStatus: row.availability_status,
          isAvailable: Boolean(row.is_available),
          stats: {
            yearsExperience: Number(row.years_experience) || 1,
            dashboardsDelivered: Number(row.dashboards_delivered) || 6,
            rowsProcessed: row.rows_processed || '150K+',
            forecastAccuracy: row.forecast_accuracy || '98.5%',
          },
        };
      }

      // 2. Skills
      const [skillsRows]: any = await this.pool.query('SELECT * FROM `skills` ORDER BY display_order ASC, name ASC');
      const loadedSkills: Skill[] = skillsRows.map((row: any) => ({
        id: row.id,
        name: row.name,
        category: row.category,
        proficiencyLevel: row.proficiency_level,
        description: row.description,
        toolsUsed: typeof row.tools_used === 'string' ? JSON.parse(row.tools_used) : (row.tools_used || []),
        projectsCount: Number(row.projects_count) || 0,
        featured: Boolean(row.featured),
      }));

      // 3. Projects + Case Studies
      const [projRows]: any = await this.pool.query('SELECT * FROM `projects` ORDER BY date_created DESC');
      const [caseRows]: any = await this.pool.query('SELECT * FROM `project_case_studies`');
      const caseMap = new Map<string, any>();
      caseRows.forEach((cs: any) => {
        caseMap.set(cs.project_id, {
          overview: cs.overview || '',
          businessProblem: cs.business_problem || '',
          datasetInfo: cs.dataset_info || '',
          dataCleaningPrep: cs.data_cleaning_prep || '',
          methodology: cs.methodology || '',
          codeSnippets: typeof cs.code_snippets === 'string' ? JSON.parse(cs.code_snippets) : cs.code_snippets || [],
          keyFindings: typeof cs.key_findings === 'string' ? JSON.parse(cs.key_findings) : cs.key_findings || [],
          recommendations: typeof cs.recommendations === 'string' ? JSON.parse(cs.recommendations) : cs.recommendations || [],
          limitations: cs.limitations || '',
          dashboardFeatures: typeof cs.dashboard_features === 'string' ? JSON.parse(cs.dashboard_features) : cs.dashboard_features || [],
        });
      });

      const loadedProjects: Project[] = projRows.map((row: any) => ({
        id: row.id,
        title: row.title,
        projectType: row.project_type,
        category: row.category,
        difficulty: row.difficulty,
        shortDescription: row.short_description,
        thumbnailUrl: row.thumbnail_url || '',
        githubUrl: row.github_url || '',
        liveDemoUrl: row.live_demo_url || '',
        linkedinUrl: row.linkedin_url || '',
        featured: Boolean(row.featured),
        technologies: typeof row.technologies === 'string' ? JSON.parse(row.technologies) : (row.technologies || []),
        dateCreated: row.date_created ? new Date(row.date_created).toISOString().split('T')[0] : '',
        caseStudy: caseMap.get(row.id) || {
          overview: row.short_description,
          businessProblem: '',
          datasetInfo: '',
          dataCleaningPrep: '',
          methodology: '',
          keyFindings: [],
          recommendations: [],
          limitations: '',
        },
      }));

      // 4. Education
      const [eduRows]: any = await this.pool.query('SELECT * FROM `education` ORDER BY display_order ASC');
      const loadedEducation: Education[] = eduRows.map((row: any) => ({
        id: row.id,
        degree: row.degree,
        institution: row.institution,
        location: row.location,
        period: row.period,
        gradeGpa: row.grade_gpa,
        description: row.description,
        highlights: typeof row.highlights === 'string' ? JSON.parse(row.highlights) : (row.highlights || []),
        level: row.hierarchy_level === 1 ? 'Undergraduate' : row.hierarchy_level === 2 ? 'Higher Secondary' : 'Secondary',
      }));

      // 5. Achievements
      const [achRows]: any = await this.pool.query('SELECT * FROM `achievements` ORDER BY display_order ASC');
      const loadedAchievements: Achievement[] = achRows.map((row: any) => ({
        id: row.id,
        title: row.title,
        issuer: row.issuer,
        issueDate: row.issue_date,
        credentialUrl: row.credential_url || '',
        credentialId: row.credential_id || '',
        badgeUrl: row.badge_url || '',
        skills: typeof row.skills === 'string' ? JSON.parse(row.skills) : (row.skills || []),
      }));

      // 6. Messages
      const [msgRows]: any = await this.pool.query('SELECT * FROM `contact_messages` ORDER BY created_at DESC');
      const loadedMessages: ContactMessage[] = msgRows.map((row: any) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        subject: row.subject,
        company: row.company || '',
        message: row.message,
        read: Boolean(row.is_read),
        replied: Boolean(row.replied),
        replyText: row.reply_text || '',
        repliedAt: row.replied_at ? new Date(row.replied_at).toISOString() : undefined,
        createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
      }));

      // 7. Subscribers
      const [subRows]: any = await this.pool.query('SELECT * FROM `newsletter_subscribers` ORDER BY date DESC');
      const loadedSubscribers = subRows.map((row: any) => ({
        id: row.id,
        email: row.email,
        date: row.date ? new Date(row.date).toISOString().split('T')[0] : '',
      }));

      return {
        profile: loadedProfile,
        skills: loadedSkills.length > 0 ? loadedSkills : undefined,
        projects: loadedProjects.length > 0 ? loadedProjects : undefined,
        education: loadedEducation.length > 0 ? loadedEducation : undefined,
        achievements: loadedAchievements.length > 0 ? loadedAchievements : undefined,
        messages: loadedMessages,
        subscribers: loadedSubscribers,
      };
    } catch (err: any) {
      console.warn('⚠️ [MySQL] loadAllFromMySQL error:', err.message);
      return null;
    }
  }

  // Individual Sync Helpers for real-time CRUD

  public async saveSkill(skill: Skill): Promise<void> {
    if (!this.isConnected || !this.pool) return;
    try {
      await this.pool.query(`
        INSERT INTO \`skills\` (id, name, category, proficiency_level, description, tools_used, projects_count, featured)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          category = VALUES(category),
          proficiency_level = VALUES(proficiency_level),
          description = VALUES(description),
          tools_used = VALUES(tools_used),
          projects_count = VALUES(projects_count),
          featured = VALUES(featured)
      `, [
        skill.id,
        skill.name,
        skill.category,
        skill.proficiencyLevel,
        skill.description,
        JSON.stringify(skill.toolsUsed || []),
        skill.projectsCount || 0,
        skill.featured ? 1 : 0,
      ]);
    } catch (err: any) {
      console.warn('⚠️ [MySQL] saveSkill error:', err.message);
    }
  }

  public async deleteSkill(id: string): Promise<void> {
    if (!this.isConnected || !this.pool) return;
    try {
      await this.pool.query('DELETE FROM `skills` WHERE id = ?', [id]);
    } catch (err: any) {
      console.warn('⚠️ [MySQL] deleteSkill error:', err.message);
    }
  }

  public async saveProject(project: Project): Promise<void> {
    if (!this.isConnected || !this.pool) return;
    try {
      await this.pool.query(`
        INSERT INTO \`projects\` (id, title, project_type, category, difficulty, short_description, thumbnail_url, github_url, live_demo_url, linkedin_url, featured, technologies, date_created)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          title = VALUES(title),
          project_type = VALUES(project_type),
          category = VALUES(category),
          difficulty = VALUES(difficulty),
          short_description = VALUES(short_description),
          thumbnail_url = VALUES(thumbnail_url),
          github_url = VALUES(github_url),
          live_demo_url = VALUES(live_demo_url),
          linkedin_url = VALUES(linkedin_url),
          featured = VALUES(featured),
          technologies = VALUES(technologies),
          date_created = VALUES(date_created)
      `, [
        project.id,
        project.title,
        project.projectType || 'Major Project',
        project.category,
        project.difficulty,
        project.shortDescription,
        project.thumbnailUrl || null,
        project.githubUrl || null,
        project.liveDemoUrl || null,
        project.linkedinUrl || null,
        project.featured ? 1 : 0,
        JSON.stringify(project.technologies || []),
        project.dateCreated || new Date().toISOString().split('T')[0],
      ]);

      if (project.caseStudy) {
        const cs = project.caseStudy;
        await this.pool.query(`
          INSERT INTO \`project_case_studies\` (
            project_id, overview, business_problem, dataset_info, data_cleaning_prep,
            methodology, code_snippets, key_findings, recommendations, limitations, dashboard_features
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            overview = VALUES(overview),
            business_problem = VALUES(business_problem),
            dataset_info = VALUES(dataset_info),
            data_cleaning_prep = VALUES(data_cleaning_prep),
            methodology = VALUES(methodology),
            code_snippets = VALUES(code_snippets),
            key_findings = VALUES(key_findings),
            recommendations = VALUES(recommendations),
            limitations = VALUES(limitations),
            dashboard_features = VALUES(dashboard_features)
        `, [
          project.id,
          cs.overview || null,
          cs.businessProblem || null,
          cs.datasetInfo || null,
          cs.dataCleaningPrep || null,
          cs.methodology || null,
          cs.codeSnippets ? JSON.stringify(cs.codeSnippets) : null,
          cs.keyFindings ? JSON.stringify(cs.keyFindings) : null,
          cs.recommendations ? JSON.stringify(cs.recommendations) : null,
          cs.limitations || null,
          cs.dashboardFeatures ? JSON.stringify(cs.dashboardFeatures) : null,
        ]);
      }
    } catch (err: any) {
      console.warn('⚠️ [MySQL] saveProject error:', err.message);
    }
  }

  public async deleteProject(id: string): Promise<void> {
    if (!this.isConnected || !this.pool) return;
    try {
      await this.pool.query('DELETE FROM `projects` WHERE id = ?', [id]);
    } catch (err: any) {
      console.warn('⚠️ [MySQL] deleteProject error:', err.message);
    }
  }

  public async saveEducation(edu: Education): Promise<void> {
    if (!this.isConnected || !this.pool) return;
    try {
      await this.pool.query(`
        INSERT INTO \`education\` (id, degree, institution, location, period, grade_gpa, description, highlights)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          degree = VALUES(degree),
          institution = VALUES(institution),
          location = VALUES(location),
          period = VALUES(period),
          grade_gpa = VALUES(grade_gpa),
          description = VALUES(description),
          highlights = VALUES(highlights)
      `, [
        edu.id,
        edu.degree,
        edu.institution,
        edu.location,
        edu.period,
        edu.gradeGpa || '',
        edu.description || '',
        JSON.stringify(edu.highlights || []),
      ]);
    } catch (err: any) {
      console.warn('⚠️ [MySQL] saveEducation error:', err.message);
    }
  }

  public async deleteEducation(id: string): Promise<void> {
    if (!this.isConnected || !this.pool) return;
    try {
      await this.pool.query('DELETE FROM `education` WHERE id = ?', [id]);
    } catch (err: any) {
      console.warn('⚠️ [MySQL] deleteEducation error:', err.message);
    }
  }

  public async saveAchievement(ach: Achievement): Promise<void> {
    if (!this.isConnected || !this.pool) return;
    try {
      await this.pool.query(`
        INSERT INTO \`achievements\` (id, title, issuer, issue_date, credential_url, credential_id, badge_url, skills)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          title = VALUES(title),
          issuer = VALUES(issuer),
          issue_date = VALUES(issue_date),
          credential_url = VALUES(credential_url),
          credential_id = VALUES(credential_id),
          badge_url = VALUES(badge_url),
          skills = VALUES(skills)
      `, [
        ach.id,
        ach.title,
        ach.issuer,
        ach.issueDate,
        ach.credentialUrl || null,
        ach.credentialId || null,
        ach.badgeUrl || null,
        JSON.stringify(ach.skills || []),
      ]);
    } catch (err: any) {
      console.warn('⚠️ [MySQL] saveAchievement error:', err.message);
    }
  }

  public async deleteAchievement(id: string): Promise<void> {
    if (!this.isConnected || !this.pool) return;
    try {
      await this.pool.query('DELETE FROM `achievements` WHERE id = ?', [id]);
    } catch (err: any) {
      console.warn('⚠️ [MySQL] deleteAchievement error:', err.message);
    }
  }

  public async saveMessage(msg: ContactMessage): Promise<void> {
    if (!this.isConnected || !this.pool) return;
    try {
      await this.pool.query(`
        INSERT INTO \`contact_messages\` (id, name, email, subject, company, message, is_read, replied, reply_text, replied_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          is_read = VALUES(is_read),
          replied = VALUES(replied),
          reply_text = VALUES(reply_text),
          replied_at = VALUES(replied_at)
      `, [
        msg.id,
        msg.name,
        msg.email,
        msg.subject,
        msg.company || null,
        msg.message,
        msg.read ? 1 : 0,
        (msg as any).replied ? 1 : 0,
        (msg as any).replyText || null,
        (msg as any).repliedAt ? new Date((msg as any).repliedAt) : null,
      ]);
    } catch (err: any) {
      console.warn('⚠️ [MySQL] saveMessage error:', err.message);
    }
  }

  public async deleteMessage(id: string): Promise<void> {
    if (!this.isConnected || !this.pool) return;
    try {
      await this.pool.query('DELETE FROM \`contact_messages\` WHERE id = ?', [id]);
    } catch (err: any) {
      console.warn('⚠️ [MySQL] deleteMessage error:', err.message);
    }
  }

  public async saveSubscriber(id: string, email: string): Promise<void> {
    if (!this.isConnected || !this.pool) return;
    try {
      await this.pool.query(`
        INSERT INTO \`newsletter_subscribers\` (id, email, is_active)
        VALUES (?, ?, 1)
        ON DUPLICATE KEY UPDATE is_active = 1
      `, [id, email]);
    } catch (err: any) {
      console.warn('⚠️ [MySQL] saveSubscriber error:', err.message);
    }
  }

  public async deleteSubscriber(id: string): Promise<void> {
    if (!this.isConnected || !this.pool) return;
    try {
      await this.pool.query('DELETE FROM `newsletter_subscribers` WHERE id = ?', [id]);
    } catch (err: any) {
      console.warn('⚠️ [MySQL] deleteSubscriber error:', err.message);
    }
  }
}

export const mysqlManager = new MySQLManager();
