import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { runMigrations } from './migrator';
import { checkDatabaseConnection, closePool, getPool } from './connection';

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

async function main() {
  const command = process.argv[2] || 'migrate';

  console.log(`\n==============================================`);
  console.log(`🐬 Sagar Singh Portfolio - MySQL Migration Tool`);
  console.log(`==============================================`);

  const health = await checkDatabaseConnection();
  if (!health.connected) {
    console.error(`❌ Database connection failed: ${health.error}`);
    process.exit(1);
  }
  console.log(`✅ Connected to MySQL: ${health.database} (${health.version})`);

  if (command === 'migrate' || command === 'up') {
    console.log(`\nRunning automated schema migrations...`);
    const result = await runMigrations();
    console.log(`\n🎉 ${result.message}`);
    if (result.appliedMigrations.length > 0) {
      console.log('Applied migration files:');
      result.appliedMigrations.forEach(m => console.log(`  - ${m}`));
    }
  } else if (command === 'seed') {
    console.log(`\nSeeding database with portfolio records...`);
    const pool = getPool();
    const conn = await pool.getConnection();
    const seedsDir = path.resolve(process.cwd(), 'database', 'seeds');
    if (fs.existsSync(seedsDir)) {
      const seedFiles = fs.readdirSync(seedsDir).filter(f => f.endsWith('.sql')).sort();
      for (const seedFile of seedFiles) {
        console.log(`🌱 Seeding from: ${seedFile}...`);
        const seedSql = fs.readFileSync(path.join(seedsDir, seedFile), 'utf-8');
        const statements = splitSqlStatements(seedSql);
        for (const statement of statements) {
          await conn.query(statement);
        }
        console.log(`✅ Completed: ${seedFile}`);
      }
    }
    conn.release();
    console.log(`\n🎉 Database seeding finished!`);
  } else if (command === 'status') {
    const { getDatabaseAnalytics } = await import('./services/adminService');
    const stats = await getDatabaseAnalytics();
    console.log(`\n📊 Current Database Record Counts:`);
    console.table(stats);
  } else {
    console.log(`Unknown command: ${command}. Use 'migrate', 'seed', or 'status'.`);
  }

  await closePool();
  process.exit(0);
}

main().catch(async (err) => {
  console.error('Fatal error during database migration:', err);
  await closePool();
  process.exit(1);
});
