/**
 * One-command local database setup for Windows (MySQL service on this PC, no Docker).
 *   npm run db:setup:local
 * 1. creates the database from .env.local if it does not exist
 * 2. applies every migration in prisma/migrations
 * 3. brings the schema fully in line with prisma/schema.prisma (the migration files alone are incomplete)
 * 4. adds the 16 department demo accounts (password: password123)
 * Safe to run again: existing tables and accounts are kept, never dropped.
 */
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');
const root = path.resolve(__dirname, '..');
require('dotenv').config({ path: path.join(root, '.env.local') });
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
const step = (n, text) => console.log(`\n[${n}/4] ${text}`);

(async () => {
  if (!DB_HOST || !DB_USER || !DB_NAME) throw new Error('backend/.env.local is missing DB_HOST, DB_USER or DB_NAME');
  // Safety: this script only ever sets up a database on this PC.
  if (!['localhost', '127.0.0.1', '::1'].includes(DB_HOST)) throw new Error(`Refusing to run against ${DB_HOST}. Local setup only works on localhost.`);
  if (!/^[A-Za-z0-9_]+$/.test(DB_NAME)) throw new Error('DB_NAME may only contain letters, numbers and underscores');

  step(1, `Creating database "${DB_NAME}" on ${DB_HOST}:${DB_PORT} if needed`);
  const admin = await mysql.createConnection({ host: DB_HOST, port: +DB_PORT || 3306, user: DB_USER, password: DB_PASSWORD, connectTimeout: 8000 });
  const [[v]] = await admin.query('SELECT VERSION() v');
  await admin.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await admin.end();
  console.log(`      MySQL ${v.v} is reachable; database ready.`);

  const DATABASE_URL = `mysql://${encodeURIComponent(DB_USER)}:${encodeURIComponent(DB_PASSWORD || '')}@${DB_HOST}:${DB_PORT || 3306}/${DB_NAME}`;
  const run = (args) => spawnSync('npx', ['prisma', ...args], { cwd: root, env: { ...process.env, DATABASE_URL }, shell: true, encoding: 'utf8' });

  step(2, 'Applying migrations (creating the schema)');
  const mig = run(['migrate', 'deploy']);
  process.stdout.write((mig.stdout || '').split('\n').filter((l) => !/Update available|npm i|major update|pris\.ly|┌|└|│|^\s*$/.test(l)).join('\n') + '\n');
  if (mig.status !== 0) { console.error(mig.stderr || ''); throw new Error('prisma migrate deploy failed'); }

  step(3, 'Syncing the schema with prisma/schema.prisma');
  // Some tables are created by the server itself at startup and are not in schema.prisma; the diff would
  // want to drop them. They do not count as "different" and must never be dropped by this script.
  const inSync = () => {
    const d = run(['migrate', 'diff', '--from-url', DATABASE_URL, '--to-schema-datamodel', 'prisma/schema.prisma', '--script']);
    if (d.status !== 0) return { status: 1, stdout: d.stdout, stderr: d.stderr };
    const stmts = (d.stdout || '').split('\n').filter((l) => l.trim() && !l.trim().startsWith('--')).join(' ').split(';').map((s) => s.trim()).filter(Boolean);
    const real = stmts.filter((s) => !/^DROP TABLE/i.test(s));
    return { status: real.length === 0 ? 0 : 1, stdout: real.slice(0, 20).join(';\n'), stderr: '' };
  };
  if (inSync().status === 0) console.log('      Already in sync.');
  else {
    let push = run(['db', 'push', '--skip-generate']);
    if (push.status !== 0 && /accept-data-loss/.test((push.stdout || '') + (push.stderr || ''))) {
      // Prisma warns about changes that could lose data. That is only acceptable while the database is still empty.
      const probe = await mysql.createConnection({ host: DB_HOST, port: +DB_PORT || 3306, user: DB_USER, password: DB_PASSWORD, database: DB_NAME });
      // Tables that migrations fill themselves (default branch/building, structure derived from rooms) are not user data.
      const [tables] = await probe.query("SELECT TABLE_NAME t FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME NOT IN ('_prisma_migrations','branches','buildings','floors','wards','beds','department_heads')");
      let rows = 0;
      for (const { t } of tables) { const [[c]] = await probe.query(`SELECT COUNT(*) n FROM \`${t}\``); rows += Number(c.n); }
      await probe.end();
      if (rows > 0) { console.error((push.stdout || '') + (push.stderr || '')); throw new Error(`The database already has ${rows} rows, so schema changes that could lose data were NOT applied. Review them, then run prisma db push yourself.`); }
      console.log('      Database is empty, so the schema changes are safe; applying.');
      push = run(['db', 'push', '--skip-generate', '--accept-data-loss']);
    }
    if (push.status !== 0) { console.error((push.stdout || '') + (push.stderr || '')); throw new Error('prisma db push failed'); }
    const after = inSync();
    if (after.status === 0) console.log('      Schema created and in sync.');
    else console.log('      WARNING: still different from schema.prisma:\n' + (after.stdout || after.stderr || '').split('\n').slice(0, 30).join('\n'));
  }

  step(4, 'Adding the 16 department demo accounts');
  const users = require('./demo-users.json');
  const hash = await bcrypt.hash('password123', 10);
  const db = await mysql.createConnection({ host: DB_HOST, port: +DB_PORT || 3306, user: DB_USER, password: DB_PASSWORD, database: DB_NAME });
  for (const u of users) {
    await db.query(
      `INSERT INTO users (id, name, email, password, role, department, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW(3), NOW(3))
       ON DUPLICATE KEY UPDATE name = VALUES(name), role = VALUES(role), department = VALUES(department), updatedAt = NOW(3)`,
      [crypto.randomUUID(), u.name, u.email, hash, u.role, u.department]);
  }
  const [[t]] = await db.query('SELECT COUNT(*) n FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE()');
  const [[n]] = await db.query('SELECT COUNT(*) n FROM users');
  await db.end();
  console.log(`      ${n.n} user accounts; ${t.n} tables in "${DB_NAME}".`);
  console.log('\nDone. Start the app with:  npm run dev   (from the project root)');
})().catch((e) => { console.error('\nSETUP FAILED:', e.message); process.exit(1); });
