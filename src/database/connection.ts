import mysql from 'mysql2/promise';

export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password?: string;
  database: string;
  ssl?: any;
  enabled: boolean;
}

let pool: mysql.Pool | null = null;

export function getDatabaseConfig(): DatabaseConfig {
  return {
    host: process.env.MYSQL_HOST || 'localhost',
    port: Number(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD ?? '',
    database: process.env.MYSQL_DATABASE || 'newport',
    ssl: process.env.MYSQL_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    enabled: process.env.MYSQL_ENABLED !== 'false' && process.env.MYSQL_ENABLE !== 'false',
  };
}

export function getPool(): mysql.Pool {
  if (!pool) {
    const config = getDatabaseConfig();
    
    // Support Cloud Database Connection URL if provided (e.g. Railway, PlanetScale, Supabase)
    if (process.env.MYSQL_URL) {
      pool = mysql.createPool({
        uri: process.env.MYSQL_URL,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 5000,
        enableKeepAlive: true,
        keepAliveInitialDelay: 10000,
      });
    } else {
      pool = mysql.createPool({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        database: config.database,
        ssl: config.ssl,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 5000,
        enableKeepAlive: true,
        keepAliveInitialDelay: 10000,
      });
    }
  }
  return pool;
}

/**
 * Execute parameterized query with automatic connection management.
 */
export async function query<T = any>(sql: string, params: any[] = []): Promise<T> {
  const p = getPool();
  const [rows] = await p.execute(sql, params);
  return rows as T;
}

/**
 * Execute a unit of work inside a managed database transaction.
 */
export async function withTransaction<T>(
  callback: (conn: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const p = getPool();
  const conn = await p.getConnection();
  try {
    await conn.beginTransaction();
    const result = await callback(conn);
    await conn.commit();
    return result;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

/**
 * Health check to verify database connectivity.
 */
export async function checkDatabaseConnection(): Promise<{
  connected: boolean;
  version?: string;
  database: string;
  error?: string;
}> {
  const config = getDatabaseConfig();
  if (!config.enabled) {
    return {
      connected: false,
      database: config.database,
      error: 'MySQL is disabled in environment configuration (MYSQL_ENABLED=false)',
    };
  }

  try {
    const p = getPool();
    const [rows]: any = await p.query('SELECT VERSION() AS ver, DATABASE() AS db');
    return {
      connected: true,
      version: rows?.[0]?.ver || 'MySQL 8.x',
      database: rows?.[0]?.db || config.database,
    };
  } catch (err: any) {
    return {
      connected: false,
      database: config.database,
      error: err.message || 'Database connection refused',
    };
  }
}

/**
 * Gracefully close pool during server shutdown.
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

