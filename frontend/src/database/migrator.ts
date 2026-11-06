import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import { getDatabaseConfig, getPool } from './connection';

/**
 * Split multi-statement SQL script cleanly into runnable query strings,
 * properly ignoring semicolons inside single quotes, double quotes, or backticks.
 */
function splitSqlStatements(sqlText: string): string[] {
  const statements: string[] = [];
  let current = '';
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inBacktick = false;

  for (let i = 0; i < sqlText.length; i++) {
    const char = sqlText[i];
    const prevChar = i > 0 ? sqlText[i - 1] : '';

    if (char === "'" && !inDoubleQuote && !inBacktick && prevChar !== '\\') {
      inSingleQuote = !inSingleQuote;
    } else if (char === '"' && !inSingleQuote && !inBacktick && prevChar !== '\\') {
      inDoubleQuote = !inDoubleQuote;
    } else if (char === '`' && !inSingleQuote && !inDoubleQuote) {
      inBacktick = !inBacktick;
    }

    if (char === ';' && !inSingleQuote && !inDoubleQuote && !inBacktick) {
      const trimmed = current.trim();
      if (trimmed.length > 0) {
        statements.push(trimmed);
      }
      current = '';
    } else {
      current += char;
    }
  }

  const lastTrimmed = current.trim();
  if (lastTrimmed.length > 0) {
    statements.push(lastTrimmed);
  }

  return statements.filter(s => {
    const lines = s
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0 && !l.startsWith('--'));
    return lines.length > 0;
  });
}

/**
 * Executes automatic schema migrations and seeds.
 * Safe, idempotent, and non-destructive.
 */
export async function runMigrations(): Promise<{
  success: boolean;
  appliedMigrations: string[];
  message: string;
}> {
  const config = getDatabaseConfig();
  if (!config.enabled) {
    return {
      success: false,
      appliedMigrations: [],
      message: 'Database migrations skipped: MySQL is disabled (MYSQL_ENABLED=false)',
    };
  }

  // Step 1: Ensure database exists
  try {
    const rootConn = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      ssl: config.ssl,
      connectTimeout: 4000,
    });
    await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await rootConn.end();
  } catch (err: any) {
    console.warn(`[Migrator] Notice creating database: ${err.message}`);
  }

  const pool = getPool();
  const conn = await pool.getConnection();

  const appliedMigrations: string[] = [];

  try {
    // Step 2: Ensure schema_migrations table exists
    await conn.query(`
      CREATE TABLE IF NOT EXISTS \`schema_migrations\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`version\` VARCHAR(50) NOT NULL UNIQUE,
        \`name\` VARCHAR(255) NOT NULL,
        \`applied_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX \`idx_mig_version\` (\`version\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Step 3: Fetch previously applied migrations
    const [rows]: any = await conn.query('SELECT `version` FROM `schema_migrations`');
    const appliedVersions = new Set<string>((rows as any[]).map(r => r.version));

    // Step 4: Read migration files from database/migrations/
    const migrationsDir = path.resolve(process.cwd(), 'database', 'migrations');
    if (fs.existsSync(migrationsDir)) {
      const files = fs.readdirSync(migrationsDir)
        .filter(f => f.endsWith('.sql'))
        .sort();

      for (const file of files) {
        const version = file.split('_')[0];
        if (!appliedVersions.has(version)) {
          console.log(`⏳ [Migrator] Executing migration: ${file}...`);
          const sqlContent = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
          const statements = splitSqlStatements(sqlContent);

          for (const statement of statements) {
            await conn.query(statement);
          }

          await conn.query(
            'INSERT INTO `schema_migrations` (`version`, `name`) VALUES (?, ?)',
            [version, file]
          );

          appliedMigrations.push(file);
          console.log(`✅ [Migrator] Successfully applied: ${file}`);
        }
      }
    }

    // Step 5: Check if database is empty and run seeds if needed
    const [projectCountRes]: any = await conn.query('SELECT COUNT(*) AS total FROM `projects`');
    const projectCount = Number(projectCountRes?.[0]?.total || 0);

    if (projectCount === 0) {
      const seedsDir = path.resolve(process.cwd(), 'database', 'seeds');
      if (fs.existsSync(seedsDir)) {
        const seedFiles = fs.readdirSync(seedsDir)
          .filter(f => f.endsWith('.sql'))
          .sort();

        for (const seedFile of seedFiles) {
          console.log(`🌱 [Migrator] Database projects empty. Seeding data from: ${seedFile}...`);
          const seedSql = fs.readFileSync(path.join(seedsDir, seedFile), 'utf-8');
          const statements = splitSqlStatements(seedSql);

          for (const statement of statements) {
            await conn.query(statement);
          }
          console.log(`✅ [Migrator] Seeded initial portfolio records from: ${seedFile}`);
        }
      }
    }

    return {
      success: true,
      appliedMigrations,
      message: appliedMigrations.length > 0
        ? `Applied ${appliedMigrations.length} migration(s) successfully.`
        : 'All database migrations are up to date.',
    };
  } catch (err: any) {
    console.error('❌ [Migrator] Migration failed:', err.message);
    throw err;
  } finally {
    conn.release();
  }
}
