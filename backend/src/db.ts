import mysql from "mysql2/promise";
import { AsyncLocalStorage } from "async_hooks";
import type { Request, Response, NextFunction } from "express";

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'medixpro',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_POOL_SIZE || '10'),
  queueLimit: 0,
  // Fail fast (instead of hanging a request) when MySQL is unreachable.
  connectTimeout: 10_000,
  // Keep idle pooled sockets alive so firewalls/NAT don't silently drop them,
  // which otherwise surfaces as "PROTOCOL_CONNECTION_LOST" on the next query.
  enableKeepAlive: true,
  keepAliveInitialDelay: 10_000,
  // Recycle idle connections instead of holding them open forever.
  maxIdle: 10,
  idleTimeout: 60_000,
});

/** Cheap liveness probe used by /api/health. */
export const pingDatabase = async (): Promise<boolean> => {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch {
    return false;
  }
};

/**
 * Connection safety net.
 *
 * Many route handlers call `pool.getConnection()` and only release it on the
 * success path. Whenever a query throws (or a handler returns early) the
 * connection stayed checked out forever; after ~10 such requests the pool was
 * empty and EVERY endpoint hung. Connections acquired while serving a request
 * are now tracked and handed back automatically when the response ends.
 * Releasing is idempotent, so handlers that already release are unaffected.
 */
const requestConnections = new AsyncLocalStorage<Set<() => void>>();

export const releaseConnectionsAfterRequest = (req: Request, res: Response, next: NextFunction) => {
  const releasers = new Set<() => void>();
  const releaseAll = () => releasers.forEach((release) => release());
  res.on('finish', releaseAll);
  res.on('close', releaseAll);
  requestConnections.run(releasers, next);
};

const acquire = pool.getConnection.bind(pool);
pool.getConnection = async () => {
  const connection = await acquire();
  let released = false;
  const originalRelease = connection.release.bind(connection);
  const safeRelease = () => {
    if (released) return;
    released = true;
    originalRelease();
  };
  connection.release = safeRelease;
  requestConnections.getStore()?.add(safeRelease);
  return connection;
};

// Test database connection
pool.getConnection()
  .then(connection => {
    console.log(`✓connected successfully to database ${process.env.DB_NAME} `);
    connection.release();
  })
  .catch(err => {
    console.error('✗ Database connection failed:', err.message);
  });

export default pool;
